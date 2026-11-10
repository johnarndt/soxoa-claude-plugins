# Soxoa product plugins for Claude

Eight Claude plugins, one folder each. Seven connect Claude to one of Soxoa LLC's live remote MCP servers and add skills that teach Claude how to use it well. The eighth, Soxoa Ops, is skills only. Every tool name in every skill is checked against the live server by `scripts/check-plugins.mjs`.

| Plugin | Product | MCP server | Sign-in | Skills |
| --- | --- | --- | --- | --- |
| [`mentionedon`](mentionedon/) | MentionedOn: how AI assistants mention a local business | `https://mentioned-on.com/mcp` | None for 3 public tools; OAuth for 10 business tools (MentionedOn account, Local $99/month after a 7-day trial) | 8 |
| [`intakra`](intakra/) | Intakra: dated leads on a B2B team's tracked accounts | `https://intakra.com/mcp` | None for 2 public tools; OAuth for 13 workspace tools (Intakra plan or trial) | 11 |
| [`soxoa`](soxoa/) | Soxoa: automation planning | `https://soxoa.com/mcp` | None | 6 |
| [`postedly`](postedly/) | Postedly: fax, physical mail and paper checks | `https://postedly.com/mcp/send` | OAuth when connecting; you approve and pay per send | 9 |
| [`portravo`](portravo/) | Portravo: construction takeoffs and estimates | `https://portravo.com/mcp` | OAuth for project tools; preflight and markets work before sign-in | 5 |
| [`ocolta`](ocolta/) | Ocolta: document-review summaries | `https://app.ocolta.com/mcp` | OAuth, bound to one existing purchase | 4 |
| [`regsentry`](regsentry/) | RegSentry: website tracker and consent evidence | `https://regsentry.com/mcp` | None (6 public tools; account tools need your own API key, added separately) | 4 |
| [`soxoa-ops`](soxoa-ops/) | Soxoa Ops: fifteen operating skills | None (skills only) | None | 15 |

## Which address each plugin uses

Where a product offers an address that works without an account, the plugin uses it: anyone gets the public tools right away, and customers sign in from `/mcp` in Claude Code the first time an account tool is used (MentionedOn, Intakra, Portravo, Ocolta). Intakra also runs `https://intakra.com/api/mcp`, which demands sign-in when added; the plugin does not use it, because people without an Intakra account would get no tools at all. Postedly has no anonymous address, so its plugin signs in when it connects. RegSentry's account tools need an API key header, which a plugin cannot hold, so its plugin uses the public tools and its README shows how to add the key yourself. Each plugin's README explains its choice.

## Install in Claude Code

```
/plugin marketplace add johnarndt/soxoa-claude-plugins
/plugin install mentionedon@soxoa-plugins
```

Swap `mentionedon` for any plugin name above. For a plugin with sign-in, run `/mcp`, pick the server and authenticate. Each plugin's README lists its tools, skills, what data it sends, and its privacy, terms and support links.

## Checking the plugins against the live servers

```
node scripts/check-plugins.mjs
```

The script needs Node 18 or newer and no dependencies. It parses every manifest and `.mcp.json`, confirms each server answers `initialize` (200, or 401 with a `WWW-Authenticate` challenge), fails if a skill names a tool the live server does not list (Postedly's list comes from its public server card), reports live tools that no skill mentions, and fails on any linked URL that does not return 200. It sends only `initialize` and `tools/list`, never `tools/call`.

Published by Soxoa LLC. MIT licensed.
