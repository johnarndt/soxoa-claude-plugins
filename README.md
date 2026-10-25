# Soxoa product plugins for Claude

Seven Claude plugins, one folder each. Six connect Claude to one product's remote MCP server and add skills that teach Claude how to use it well. The seventh, Soxoa Ops, is skills only.

| Plugin | Product | MCP server | Auth |
| --- | --- | --- | --- |
| [`mentionedon`](mentionedon/) | MentionedOn, AI-discovery evidence | `https://mentioned-on.com/mcp` | None |
| [`intakra`](intakra/) | Intakra, buying-signal review | `https://intakra.com/mcp` | None |
| [`soxoa`](soxoa/) | Soxoa, automation planning | `https://soxoa.com/mcp` | None |
| [`postedly`](postedly/) | Postedly, fax and physical mail | `https://postedly.com/mcp/send` | OAuth |
| [`portravo`](portravo/) | Portravo, construction takeoffs | `https://portravo.com/mcp` | OAuth |
| [`ocolta`](ocolta/) | Ocolta, document-review summaries | `https://app.ocolta.com/mcp` | OAuth |
| [`soxoa-ops`](soxoa-ops/) | Soxoa Ops, fifteen operating skills | None (skills only) | None |

## Install in Claude Code

```
/plugin marketplace add johnarndt/soxoa-claude-plugins
/plugin install mentionedon@soxoa-plugins
```

Swap `mentionedon` for any plugin name above. Each plugin's own README lists its tools, skills, what data it sends, and its privacy, terms and support links.

Published by Soxoa LLC. MIT licensed.
