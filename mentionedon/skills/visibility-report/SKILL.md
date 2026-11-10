---
name: visibility-report
description: Use when a MentionedOn customer asks how their business shows up in AI answers or who AI recommends instead of them, for example "how does my business show up in ChatGPT?", "what's my MentionedOn score?", "did my AI visibility change?", "who does AI recommend instead of us?", or "which sites does AI cite for my category?". Reads saved checks from the connected MentionedOn account.
---

# Visibility report and share of voice

Reads saved, dated checks. No tool here runs a new scan or costs anything per call.

## Flow

1. Call `list_monitored_businesses`. If there are several businesses, ask which one; if none, give the setup link it returns and stop.
2. Call `get_visibility_report` with that `businessId`. Report the latest check's date, score, mention and citation rates, the answer excerpts per assistant, competitors named and sources cited. Name any provider gaps.
3. Report a score change only when the tool marks the checks comparable. Otherwise say the checks are not comparable and why.
4. For "who does AI recommend instead of us?", call `get_share_of_voice` with the same `businessId`: how often answers name this business versus each other business, its rank over saved checks, and the kinds of sites cited (own site, directories, community, press, competitors).
5. Offer next steps that match the evidence: `website-fixes` for missing or wrong business facts, `drafted-articles` for unanswered buyer questions, `improvement-results` to check a page already published.

## Rules

- Always give the check date. Results are dated, not live, and other people may see different answers.
- Do not promise rankings, mentions, citations, traffic or revenue.
- Never imply a new scan ran. If the user wants fresh results, new checks happen on MentionedOn's own schedule.
- Not connected? These tools need a MentionedOn account. In Claude Code run `/mcp`, pick `mentionedon` and sign in. Local is $99/month for one business, with a 7-day trial for first-time subscribers (https://mentioned-on.com/developers/mcp). Without an account, offer the public `ai-discovery-audit` or `ai-mention-report` skills.
