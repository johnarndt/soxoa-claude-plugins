![MentionedOn](assets/icon.png)

# MentionedOn for Claude

MentionedOn shows a local business how AI assistants such as ChatGPT, Claude, Gemini, Perplexity, Grok and Copilot talk about it: whether they name it, which competitors they name instead, which sites they cite, and what to fix. This plugin connects Claude to MentionedOn's MCP server and adds skills for two audiences:

- **MentionedOn customers (sign-in):** read your saved visibility checks, share of voice, before/after results for pages you published, drafted articles and AI-referred visits, and prepare, save and verify website fixes for your business facts. Claude reads saved, dated checks; no tool runs a new or paid AI scan.
- **Anyone (no account):** score discovery evidence you collect, get a ranked fix list, and turn AI answers you captured into mention and citation rates. These public tools grade only what you supply.

## What it connects to

| Item | Detail |
|---|---|
| Remote MCP server | `https://mentioned-on.com/mcp` (the only address MentionedOn runs; Streamable HTTP, stateless) |
| Authentication | None to connect, and none for the three public tools. The ten business tools need a MentionedOn account: the first time one is used, sign in with OAuth (in Claude Code: run `/mcp`, pick `mentionedon`, sign in in the browser) and approve `brands:read` and, for website fixes, `website:write`. Revoke the connection from your MentionedOn account at any time. |
| Price | Connecting and calls are free; there are no per-call charges. Business tools need a MentionedOn plan: Local is $99/month for one business, starting with a 7-day trial for first-time subscribers ($0 today, then $99/month, card required). The website-fix tools that save changes need a paid or trial monitoring slot. |
| Data sent | Tool arguments only: business ids, saved revision numbers, business facts you confirm, a schema.org business type, a page URL on your own domain, and your confirmations. For the public tools: a business name, an optional page URL used as a label, signal or finding statuses with short notes, a goal and effort level, and the AI answer captures you recorded. |
| Data returned | Saved checks with dates, scores, answer excerpts, competitors and cited sources; share-of-voice ranks; before/after evidence; drafted article Markdown; AI-referred visit counts; saved website facts, schema and copy with install status. |
| Data stored | Public tool inputs are not saved. Website-fix tools save versioned facts, drafts and checks in your account, and only after you confirm. |

The plugin contains no scripts, hooks or local servers and contacts nothing else. Only `inspect_business_website` and `verify_website_fixes` fetch pages, and only from your business's own site after you confirm you own it or may check it. No tool publishes to a website, changes billing or contacts anyone.

## Tools

| Tool | What it does | Access |
|---|---|---|
| `list_monitored_businesses` | Businesses in the account with their ids and monitoring status. Start here. | Account, read-only |
| `get_visibility_report` | Latest saved check and up to 30 earlier ones: score, mention and citation rates, answer excerpts, competitors, cited sources, provider gaps. | Account, read-only |
| `get_share_of_voice` | How often answers name you versus other businesses, rank over time, and the kinds of sites cited. | Account, read-only |
| `get_improvement_results` | Before/after evidence for a page you published: assistant answers, AI Overview follow-up, AI-referred visits. | Account, read-only |
| `list_articles` | Up to 20 recent drafted buyer-question articles and this month's usage. | Account, read-only |
| `get_ai_referrals` | Last 30 days of visits from AI assistants, by assistant and landing page. | Account, read-only |
| `get_website_fixes` | Saved facts, schema and copy, install status and the current revision. | Account, read-only |
| `inspect_business_website` | Fetches a few public pages of your saved website and saves candidate facts. Asks you to confirm ownership first. | Account + plan or trial, saves |
| `draft_website_fixes` | Generates and saves schema, website copy and a profile description from facts you confirmed. | Account + plan or trial, saves |
| `verify_website_fixes` | Fetches one page on your site and checks it for the saved schema and text. | Account + plan or trial, saves |
| `analyze_discovery_readiness` | Scores discovery signals you supply into a 0 to 100 readiness score with priorities and gaps. | Public, read-only |
| `build_visibility_action_plan` | Ranks findings you supply into a phased plan with a check for each action. | Public, read-only |
| `summarize_scan_evidence` | Mention rate, citation rate and per-assistant breakdown from answer captures you supply. | Public, read-only |

## Skills

| Skill | When it triggers |
|---|---|
| `visibility-report` | "How does my business show up in ChatGPT?", "who does AI recommend instead of us?" |
| `improvement-results` | "Did my new page work?", "are people arriving from ChatGPT?" |
| `drafted-articles` | "Show me my MentionedOn articles", "give me the draft about emergency plumbing" |
| `website-fixes` | "Fix my business info for AI", "generate schema for my site", "verify my fixes are live" |
| `ai-discovery-audit` | "Is my site ready for AI search?" without an account: collects evidence for ten signals, then scores it |
| `visibility-action-plan` | "What should I fix first?": ranks your findings into a phased plan |
| `ai-answer-capture` | "Does ChatGPT mention my business?" without an account: a fixed prompt set, capture log and re-check routine |
| `ai-mention-report` | "What's our mention rate?" from answers you captured yourself |

## Setup

**Claude directory:** once the listing is approved, install MentionedOn from the plugin directory. The public tools need no sign-in; sign in to MentionedOn when Claude asks to use a business tool.

**Claude Code marketplace:**

```
/plugin marketplace add johnarndt/soxoa-claude-plugins
/plugin install mentionedon@soxoa-plugins
```

For the business tools, run `/mcp`, pick `mentionedon` and sign in.

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
   Expected without sign-in: Claude explains that website fixes need a MentionedOn account and a paid or trial monitoring slot, and asks you to sign in; it does not claim anything was fetched or saved. Expected with an account: `list_monitored_businesses`, `get_website_fixes`, then Claude asks you to confirm you own the site before calling `inspect_business_website` with the exact revision, and asks again before `draft_website_fixes` saves anything.
5. "How does my business show up in AI answers?" (connected account)
   Expected: `list_monitored_businesses`, then `get_visibility_report`; results with the check date, and a score change only if the checks are comparable. No new scan is run.

## Limits and boundaries

- Business tools read saved, dated checks. They do not run a new or paid AI scan, so results are not live.
- Website-fix tools ask before every save, keep the exact revision, never assume the owner confirmed a fact, and never publish to your site. You install the fixes yourself. Up to 20 website checks a day.
- A change after publishing a page does not prove the page caused it, and referral counts are a floor.
- The public tools score and summarize only what you supply. They do not fetch websites, call model providers or store data.
- Nothing guarantees mentions, citations, rankings, traffic or revenue. Answers describe what one assistant said at one time; other people may see different answers.

## Privacy, terms, support

- Developer docs: https://mentioned-on.com/developers/mcp
- Privacy policy: https://mentioned-on.com/privacy
- Terms of service: https://mentioned-on.com/terms
- Support: https://mentioned-on.com/support or hello@mentioned-on.com

## License

MIT. See [LICENSE](LICENSE). Copyright (c) 2026 Soxoa LLC.
