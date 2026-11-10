---
name: drafted-articles
description: Use when a MentionedOn customer wants the articles MentionedOn drafted for their business, for example "show me my MentionedOn articles", "what article did MentionedOn write for the pricing question?", "give me the draft about emergency plumbing", or "how many articles do I have left this month?". Reads drafted buyer-question articles from the connected account.
---

# Read drafted articles

## Flow

1. Call `list_monitored_businesses` and confirm the business.
2. Call `list_articles` with `businessId`. List up to 20 recent drafts: title or topic, the buyer questions each targets, the buyer it was written for, and this month's usage.
3. When the user picks one, show its Markdown. The tool returns the first 4,000 characters; say so if the draft is longer and point to MentionedOn for the full text.
4. Help the user review the draft for accuracy against their real business before they publish it themselves.

## Rules

- Read-only. New drafts are made in MentionedOn and count against the plan's monthly allowance; this skill cannot create one.
- Never publish, upload or post an article. The user publishes on their own site.
- Do not add facts, prices, licenses or claims the business has not confirmed.
- Not connected? In Claude Code run `/mcp`, pick `mentionedon` and sign in (https://mentioned-on.com/developers/mcp).
