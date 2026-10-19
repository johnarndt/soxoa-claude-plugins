![MentionedOn](assets/icon.png)

# MentionedOn for Claude

MentionedOn helps local service businesses and brands see how ready they are to be understood, mentioned, and cited by AI assistants such as ChatGPT, Claude, Gemini, Perplexity, Grok, and Copilot. This plugin connects Claude to MentionedOn's three public, read-only tools and adds four skills. Together they help you collect evidence about your site, score it, get a ranked fix list, record real AI answers on a fixed schedule, and turn those answers into mention and citation rates. The tools grade only the evidence you supply. They do not visit your site, run AI scans, or promise rankings or mentions.

## What it connects to

| Item | Detail |
|---|---|
| Remote MCP server | `https://mentioned-on.com/mcp` |
| Transport | Streamable HTTP (stateless JSON-RPC over POST) |
| Authentication | None. No account, API key, or sign-in. |
| Data sent | Only the arguments of each tool call: a business name, an optional page URL used as a label, signal or finding statuses with short evidence notes, a goal and effort level, and for answer summaries the prompts, assistant labels, timestamps, mention flags, citation URLs, list positions, and sentiment labels you recorded. |
| Data stored | MentionedOn states that these tool handlers do not write tool inputs to its application database. See the privacy policy below. |

The plugin contacts nothing else. It contains no scripts, hooks, or local servers, and the MCP server does not fetch the URLs you send it, call any AI provider, or contact anyone. If you ask Claude to read pages of your website during an audit, Claude uses browsing tools you already have enabled in your own Claude session; those requests go from your Claude client to that website, not through this plugin or MentionedOn. Do not include customer personal data in evidence notes or prompts.

## Tools

| Tool | What it does | Access |
|---|---|---|
| `analyze_discovery_readiness` | Scores up to ten caller-supplied discovery signals (identity, service and location, page copy, contact details, structured data, corroborating profiles, crawlability, buyer FAQ, first-party evidence, machine-readable summary) into a 0 to 100 readiness score with evidence coverage, top priorities, and what still needs checking. | Read-only |
| `build_visibility_action_plan` | Ranks caller-supplied findings into a phased plan (now, next, later) with effort, action, and a verification step for each, using a fixed rubric, a goal, and an effort budget. | Read-only |
| `summarize_scan_evidence` | Calculates mention rate, business citation rate, cited hosts, sentiment counts, and a per-assistant breakdown from up to 50 dated answer captures you supply. | Read-only |

## Skills

| Skill | When it triggers |
|---|---|
| `ai-discovery-audit` | "Is my site ready for AI search?", "AI visibility audit", "why doesn't ChatGPT recommend us". Collects evidence for the ten signals from pages you name or paste, confirms it with you, then scores it. |
| `visibility-action-plan` | "What should I fix first?", "turn this audit into a plan". Ranks your findings into a phased plan and breaks each action into concrete tasks. |
| `ai-answer-capture` | "Does ChatGPT mention my business?", "set up AI visibility tracking", "what prompts should I test". Builds a fixed prompt set, a capture log that matches the tool's format, and a monthly re-check routine. |
| `ai-mention-report` | "What's our mention rate?", "summarize these AI answers", "compare this month to last month". Turns your captures into rates and a per-assistant table with dates and limits. |

## Setup

**Claude directory:** install MentionedOn from the plugin directory. The connector needs no sign-in.

**Claude Code marketplace:**

```
/plugin marketplace add johnarndt/soxoa-claude-plugins
/plugin install mentionedon@soxoa-plugins
```

**Connector only (no skills):** in Claude, open Customize > Connectors and add `https://mentioned-on.com/mcp`. In Claude Code:

```
claude mcp add --transport http mentionedon https://mentioned-on.com/mcp
```

## Example prompts

- "Check whether my roofing company's site at riveraroofing.example is ready for AI assistants. We serve Fresno and Clovis."
- "Here are my audit findings. I have about two hours a week. What should I fix first?"
- "Set me up to check monthly whether ChatGPT, Claude, Gemini, and Perplexity recommend my dental practice in Boise."
- "Here is my capture log from this month. What are my mention and citation rates by assistant?"
- "Compare my September and October AI answer captures."

## Limits and boundaries

- The tools score and summarize only what you or Claude supply in the call. They do not crawl or fetch websites, run live AI scans, call model providers, or persist data.
- A readiness score is not a prediction. Results do not establish current inclusion in any AI product and do not guarantee mentions, citations, rankings, traffic, or revenue.
- Answer captures describe what one assistant said at one time in one context. Other people may see different answers.
- Nothing is changed on your website and no one is contacted. Every recommended change is for you to review and apply.
- Review important evidence at its original source before you publish or act on a recommendation.

## Privacy, terms, support

- Developer docs: https://mentioned-on.com/developers/mcp
- Privacy policy: https://mentioned-on.com/privacy
- Terms of service: https://mentioned-on.com/terms
- Support: https://mentioned-on.com/support or hello@mentioned-on.com

## License

MIT. See [LICENSE](LICENSE). Copyright (c) 2026 Soxoa LLC.
