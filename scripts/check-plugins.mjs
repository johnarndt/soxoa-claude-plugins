#!/usr/bin/env node
// Checks every plugin in this repo against the live MCP servers it wraps.
//
//   node scripts/check-plugins.mjs            full check (network)
//   node scripts/check-plugins.mjs --offline  manifests and structure only
//
// Network use is limited to MCP discovery (`initialize`, `tools/list`), public
// server cards, and GET requests for linked URLs. It never sends `tools/call`.
// No dependencies; Node 18+.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const offline = process.argv.includes('--offline');
const failures = [];
const warnings = [];
const fail = (msg) => failures.push(msg);
const rel = (p) => path.relative(root, p);

// Words that look like tool names: a known verb (or a product prefix) followed by snake_case.
// Argument names and enum values such as `confirm_credit_use` or `review_now` do not match.
const TOOL_PATTERN = /\b(?:postedly|get|list|run|create|attach|export|preflight|inspect|draft|verify|score|prepare|prioritize|add|set|request|estimate|build|analyze|summarize|interpret|compare|mark|watch|push|delete|save|upload|fetch|search|evaluate)_[a-z0-9_]*[a-z0-9]\b/g;

// URLs that are not pages to visit: reserved example domains and placeholders.
const SKIP_URL = [
  /^https?:\/\/([a-z0-9-]+\.)*example(\.com|\.org|\.net)?([/:?#]|$)/i,
  /^https?:\/\/[^/]*\.example([/:?#]|$)/i,
  /^https?:\/\/(localhost|127\.0\.0\.1)/i,
  /[<>{}]|\.\.\.|YOUR_/,
];
// API addresses that skills mention but that are not pages (they answer POST only).
const NOT_A_PAGE = new Set([
  'https://postedly.com/api/document-handoffs/',
]);

const readJson = (p) => {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch (e) { fail(`${rel(p)}: invalid JSON (${e.message})`); return null; }
};
const walk = (dir, out = []) => {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
};

// ---------- manifests ----------
const marketplacePath = path.join(root, '.claude-plugin', 'marketplace.json');
const marketplace = readJson(marketplacePath);
const plugins = [];
if (marketplace) {
  for (const key of ['name', 'owner', 'plugins']) if (!marketplace[key]) fail(`marketplace.json: missing ${key}`);
  const seen = new Set();
  for (const entry of marketplace.plugins ?? []) {
    if (seen.has(entry.name)) fail(`marketplace.json: duplicate plugin ${entry.name}`);
    seen.add(entry.name);
    const dir = path.resolve(root, entry.source ?? '');
    const manifestPath = path.join(dir, '.claude-plugin', 'plugin.json');
    if (!fs.existsSync(manifestPath)) { fail(`marketplace.json: ${entry.name} has no ${rel(manifestPath)}`); continue; }
    const manifest = readJson(manifestPath);
    if (!manifest) continue;
    if (manifest.name !== entry.name) fail(`${rel(manifestPath)}: name ${manifest.name} does not match marketplace entry ${entry.name}`);
    if (!/^\d+\.\d+\.\d+$/.test(manifest.version ?? '')) fail(`${rel(manifestPath)}: missing or invalid version`);
    if (marketplace.metadata?.version && manifest.version !== marketplace.metadata.version) {
      fail(`${rel(manifestPath)}: version ${manifest.version} differs from marketplace ${marketplace.metadata.version}`);
    }
    const mcpPath = path.join(dir, '.mcp.json');
    const mcp = fs.existsSync(mcpPath) ? readJson(mcpPath) : null;
    const servers = Object.entries(mcp?.mcpServers ?? {}).map(([name, s]) => ({ name, ...s }));
    for (const s of servers) {
      if (s.type !== 'http') fail(`${rel(mcpPath)}: ${s.name} is not an http server`);
      if (!/^https:\/\//.test(s.url ?? '')) fail(`${rel(mcpPath)}: ${s.name} has no https url`);
    }
    const skillFiles = walk(path.join(dir, 'skills')).filter((p) => p.endsWith('.md'));
    const skillMains = skillFiles.filter((p) => path.basename(p) === 'SKILL.md');
    for (const p of skillMains) {
      const text = fs.readFileSync(p, 'utf8');
      const fm = text.match(/^---\n([\s\S]*?)\n---/);
      const name = fm?.[1].match(/^name:\s*(.+)$/m)?.[1].trim();
      const desc = fm?.[1].match(/^description:\s*(.+)$/m)?.[1].trim();
      if (!name || !desc) fail(`${rel(p)}: frontmatter needs name and description`);
      else if (name !== path.basename(path.dirname(p))) fail(`${rel(p)}: name ${name} does not match its folder`);
    }
    plugins.push({ name: entry.name, dir, manifest, manifestPath, servers, skillFiles, skillMains });
  }
  const dirs = fs.readdirSync(root, { withFileTypes: true })
    .filter((e) => e.isDirectory() && fs.existsSync(path.join(root, e.name, '.claude-plugin', 'plugin.json')))
    .map((e) => e.name);
  for (const d of dirs) if (!seen.has(d)) fail(`marketplace.json does not list plugin folder ${d}`);
}

// ---------- MCP discovery ----------
async function rpc(url, body, sessionId) {
  const headers = { 'content-type': 'application/json', accept: 'application/json, text/event-stream', 'mcp-protocol-version': '2025-06-18' };
  if (sessionId) headers['mcp-session-id'] = sessionId;
  const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body), signal: AbortSignal.timeout(20000) });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch {
    for (const m of text.matchAll(/^data: (.*)$/gm)) { try { const j = JSON.parse(m[1]); if (j.id === body.id) json = j; } catch {} }
  }
  return { status: res.status, auth: res.headers.get('www-authenticate'), sessionId: res.headers.get('mcp-session-id'), json };
}

async function liveTools(server) {
  const init = await rpc(server.url, { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'soxoa-plugin-check', version: '1.0.0' } } });
  if (init.status === 401) {
    if (!init.auth) return { error: `initialize returned 401 without WWW-Authenticate` };
    const cardUrl = `${new URL(server.url).origin}/.well-known/mcp/server-card.json`;
    const res = await fetch(cardUrl, { signal: AbortSignal.timeout(20000) });
    if (res.status !== 200) return { error: `401 before sign-in and server card ${cardUrl} returned ${res.status}` };
    const card = await res.json();
    const tools = (card.tools ?? []).map((t) => (typeof t === 'string' ? t : t.name));
    return { status: '401 + WWW-Authenticate', source: 'server card', tools };
  }
  if (init.status !== 200 || !init.json?.result) return { error: `initialize returned ${init.status}` };
  await fetch(server.url, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream', 'mcp-protocol-version': '2025-06-18', ...(init.sessionId ? { 'mcp-session-id': init.sessionId } : {}) }, body: JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) }).catch(() => {});
  const list = await rpc(server.url, { jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} }, init.sessionId);
  const tools = list.json?.result?.tools?.map((t) => t.name);
  if (!tools) return { error: `tools/list returned ${list.status}` };
  // Argument names and enum/const values from the live input schemas, so that a skill quoting
  // a value such as `search_ai_capture` is not mistaken for a tool name.
  const schemaWords = new Set();
  const visit = (node) => {
    if (Array.isArray(node)) return node.forEach(visit);
    if (!node || typeof node !== 'object') return;
    for (const k of Object.keys(node.properties ?? {})) schemaWords.add(k);
    for (const v of [...(node.enum ?? []), node.const]) if (typeof v === 'string') schemaWords.add(v);
    Object.values(node).forEach(visit);
  };
  list.json.result.tools.forEach((t) => visit(t.inputSchema));
  return { status: '200', source: 'tools/list', tools, schemaWords, version: init.json.result.serverInfo?.version };
}

// ---------- links ----------
function collectUrls() {
  const urls = new Map();
  const add = (u, where) => {
    u = u.replace(/[).,;:'"`*]+$/, '');
    if (SKIP_URL.some((r) => r.test(u)) || NOT_A_PAGE.has(u)) return;
    if (!urls.has(u)) urls.set(u, new Set());
    urls.get(u).add(where);
  };
  const files = [marketplacePath, path.join(root, 'README.md')];
  for (const p of plugins) files.push(p.manifestPath, path.join(p.dir, 'README.md'), ...p.skillFiles);
  for (const f of files) {
    if (!fs.existsSync(f)) continue;
    const text = fs.readFileSync(f, 'utf8');
    for (const m of text.matchAll(/https?:\/\/[^\s<>()\]"'`|]+/g)) add(m[0], rel(f));
  }
  return urls;
}

async function checkUrl(u) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(u, { redirect: 'follow', headers: { 'user-agent': 'soxoa-plugin-check/1.0' }, signal: AbortSignal.timeout(20000) });
      await res.body?.cancel();
      return res.status;
    } catch (e) { if (attempt) return `error ${e.cause?.code ?? e.message}`; }
  }
}

async function pool(items, n, fn) {
  const out = []; let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k]); } }));
  return out;
}

// ---------- run ----------
console.log(`Marketplace ${marketplace?.name} ${marketplace?.metadata?.version ?? ''}: ${plugins.length} plugins`);
const mcpUrls = new Set();
for (const p of plugins) {
  const mentioned = new Map();
  for (const f of p.skillFiles) {
    const text = fs.readFileSync(f, 'utf8');
    for (const m of text.matchAll(TOOL_PATTERN)) {
      if (!mentioned.has(m[0])) mentioned.set(m[0], new Set());
      mentioned.get(m[0]).add(rel(f));
    }
  }
  const header = `\n${p.name} ${p.manifest.version}  skills: ${p.skillMains.length}`;
  if (!p.servers.length) { console.log(`${header}  (skills only, no MCP server)`); continue; }
  console.log(header);
  if (offline) { for (const s of p.servers) console.log(`  ${s.name}: ${s.url} (offline: not contacted)`); continue; }
  const live = new Set();
  const schemaWords = new Set();
  for (const s of p.servers) {
    mcpUrls.add(s.url);
    let r;
    try { r = await liveTools(s); } catch (e) { r = { error: e.cause?.code ?? e.message }; }
    if (r.error) { fail(`${p.name}: ${s.url} ${r.error}`); console.log(`  ${s.name}: ${s.url}  FAIL ${r.error}`); continue; }
    r.tools.forEach((t) => live.add(t));
    r.schemaWords?.forEach((w) => schemaWords.add(w));
    console.log(`  ${s.name}: ${s.url}  initialize ${r.status}; ${r.tools.length} tools from ${r.source}${r.version ? ` (server ${r.version})` : ''}`);
  }
  if (!live.size) continue;
  const unknown = [...mentioned.keys()].filter((t) => !live.has(t) && !schemaWords.has(t));
  for (const t of unknown) fail(`${p.name}: skills name ${t}, which the live server does not list (${[...mentioned.get(t)].join(', ')})`);
  const uncovered = [...live].filter((t) => !mentioned.has(t));
  console.log(`  tools named in skills: ${[...live].length - uncovered.length}/${live.size} live tools${unknown.length ? `; ${unknown.length} unknown: ${unknown.join(', ')}` : ''}`);
  console.log(`  live tools no skill mentions: ${uncovered.length}${uncovered.length ? ` (${uncovered.join(', ')})` : ''}`);
}

if (!offline) {
  const urls = collectUrls();
  for (const u of mcpUrls) urls.delete(u);
  const list = [...urls.keys()].sort();
  const statuses = await pool(list, 6, checkUrl);
  const bad = list.filter((u, i) => statuses[i] !== 200);
  console.log(`\nLinks: ${list.length} checked, ${list.length - bad.length} returned 200`);
  for (const u of bad) {
    const s = statuses[list.indexOf(u)];
    console.log(`  ${s}  ${u}  (in ${[...urls.get(u)].join(', ')})`);
    fail(`link ${u} returned ${s}`);
  }
}

for (const w of warnings) console.log(`warning: ${w}`);
if (failures.length) {
  console.log(`\nFAIL: ${failures.length} problem(s)`);
  for (const f of failures) console.log(`  - ${f}`);
  process.exit(1);
}
console.log('\nPASS');
