![MentionedOn](assets/icon.png)

# MentionedOn for Claude

MentionedOn helps local service businesses and brands see how ready they are to be understood, mentioned, and cited by AI assistants such as ChatGPT, Claude, Gemini, Perplexity, Grok, and Copilot. This plugin's core skills use MentionedOn's three public, read-only tools, which need no sign-in. Together they help you collect evidence about your site, score it, get a ranked fix list, record real AI answers on a fixed schedule, and turn those answers into mention and citation rates. The tools grade only the evidence you supply. They do not visit your site, run AI scans, or promise rankings or mentions.

## What it connects to

| Item | Detail |
|---|---|
| Remote MCP server | `https://mentioned-on.com/mcp` |
| Transport | Streamable HTTP (stateless JSON-RPC over POST) |
| Authentication | None for the three public tools below. Account tools on the same endpoint need separate OAuth sign-in (see below). |
| Data sent | For the public tools, only the arguments of each tool call: a business name, an optional page URL used as a label, signal or finding statuses with short evidence notes, a goal and effort level, and for answer summaries the prompts, assistant labels, timestamps, mention flags, citation URLs, list positions, and sentiment labels you recorded. |
| Data stored | MentionedOn states that these tool handlers do not write tool inputs to its application database. See the privacy policy below. |

**Account tools on the same endpoint.** The server also advertises account features for MentionedOn customers: read tools such as `list_monitored_businesses`, `get_visibility_report`, and `get_website_fixes`, and tools that fetch your website or save records, such as `inspect_business_website`, `draft_website_fixes`, and `verify_website_fixes`. They work only after you separately sign in to your own MentionedOn account with OAuth, and only on businesses that account owns. Some also require a paid or trial monitoring slot. Installing this plugin does not sign you in or grant that access. The skills in this bundle use only the public evidence tools.

The plugin contacts nothing else. It contains no scripts, hooks, or local servers, and the public tools do not fetch the URLs you send them, call any AI provider, or contact anyone. If you ask Claude to read pages of your website during an audit, Claude uses browsing tools you already have enabled in your own Claude session; those requests go from your Claude client to that website, not through this plugin or MentionedOn. Do not include customer personal data in evidence notes or prompts.

## Tools

Public tools used by the core skills (no sign-in):

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

**Claude directory:** once the listing is approved, install MentionedOn from the plugin directory. The public tools need no sign-in.

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

### Test prompts with expected outcomes (no sign-in, synthetic data)

1. "Score AI readiness for Example Plumbing. Business identity present: name and phone on every page. Structured data missing: no schema markup. Buyer FAQ partial: four questions, no pricing."
   Expected: one `analyze_discovery_readiness` call with three signals; a 0 to 100 score, evidence coverage, top priorities, and a list of signals still unknown. The site is not fetched.
2. "Turn those findings into a lean plan to improve discovery clarity."
   Expected: one `build_visibility_action_plan` call with `goal` `improve_discovery_clarity` and `effortBudget` `lean`; phased actions with a verification step each. Present findings create no actions.
3. "On 2026-10-18 ChatGPT app named Example Plumbing at position 2 for 'best plumber in Sacramento' and cited https://example.com/; Perplexity web did not name it. What's my mention rate?"
   Expected: one `summarize_scan_evidence` call with two completed captures; a mention rate reflecting 1 of 2 completed captures, a business citation rate, and a per-assistant table, dated and limited to those two observations.
4. "Inspect my website and save the fixes."
   Expected without sign-in: Claude explains that website inspection is an account feature that needs separate MentionedOn sign-in, an owned business, and explicit authorization, and is outside this plugin's read-only workflows. It does not claim anything was fetched or saved.

## Limits and boundaries

- The public tools score and summarize only what you or Claude supply in the call. They do not crawl or fetch websites, run live AI scans, call model providers, or persist data. Account tools are separate, need your sign-in, and are described above.
- A readiness score is not a prediction. Results do not establish current inclusion in any AI product and do not guarantee mentions, citations, rankings, traffic, or revenue.
- Answer captures describe what one assistant said at one time in one context. Other people may see different answers.
- Nothing is changed on your website and no one is contacted. Every recommended change is for you to review and apply. The skills in this bundle do not call those account tools.
- Review important evidence at its original source before you publish or act on a recommendation.

## Privacy, terms, support

- Developer docs: https://mentioned-on.com/developers/mcp
- Privacy policy: https://mentioned-on.com/privacy
- Terms of service: https://mentioned-on.com/terms
- Support: https://mentioned-on.com/support or hello@mentioned-on.com

## License

MIT. See [LICENSE](LICENSE). Copyright (c) 2026 Soxoa LLC.
