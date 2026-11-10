---
name: improvement-results
description: Use when a MentionedOn customer asks whether a change worked or whether AI sends them visitors, for example "did my new page work?", "did publishing that FAQ change what ChatGPT says?", "are we in Google AI Overviews now?", "are people arriving from ChatGPT?", or "how much traffic do we get from AI assistants?". Reads saved before/after evidence and AI-referred visits from the connected account.
---

# Did it work, and are assistants sending visitors?

## Flow

1. Call `list_monitored_businesses` and confirm the business.
2. For "did my page work?", call `get_improvement_results` with `businessId`. Report the question being improved, the page published for it and its date, then the before and after evidence: saved assistant answers in equal windows either side of publication (same settings only), any Google AI Overview follow-up, and AI-referred visits to that page.
3. For "are people arriving from AI?", call `get_ai_referrals` with `businessId`. Report the last 30 days of visits by assistant and landing page. If no tracking is installed, give the install snippet only if the tool returns one.

## Rules

- A change after publication does not prove the page caused it. Say so every time you report one.
- Referral counts are a floor: some assistants send no referrer.
- Do not compare windows the tool did not mark as same-settings.
- Not connected? In Claude Code run `/mcp`, pick `mentionedon` and sign in (https://mentioned-on.com/developers/mcp).
