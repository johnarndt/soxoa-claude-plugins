---
name: manage-account-list
description: Use when the user wants to change or grow the list of companies Intakra tracks, for example "add stripe.com and ramp.com to my Intakra list", "which companies am I tracking?", "which accounts did Intakra suggest?", or "find more companies like our best customers". Lists, adds and requests accounts. Needs a connected Intakra workspace.
---

# Manage the tracked account list

## Flow

1. **See the list.** `list_accounts`, with `domains` to check specific companies. Follow `next_offset` for more pages.
2. **Add accounts.** Only after the user asks to add companies. Show the exact domains (up to 200) and ask "Add these N domains to your Intakra list?" On a clear yes, call `add_accounts` with `domains`. Report which were added and which were skipped as already tracked. Checks of new accounts start in Intakra's normal background pass, so there are no findings yet; say so.
3. **Suggestions.** `list_suggestions` (default `state: "pending"`) shows companies Intakra suggested, each with its reason. Suggestions do not count toward the plan until approved in Intakra; approval happens on the website.
4. **Ask Intakra to find accounts.** Only when the user asks. Confirm the request first (description, industry, country, region, size range, or up to 5 lookalike customer domains). Then call `request_accounts`. It runs in the background; results arrive later through `list_suggestions`. A few requests a day at most.

## Rules

- Never call `add_accounts` or `request_accounts` without the user's yes to the exact domains or criteria in this conversation.
- The plan's account limit applies. If the tool reports a limit, say so; do not retry around it.
- Do not claim an added account already has findings or leads.
- Not connected? Tell the user to run `/mcp` in Claude Code and sign in to `intakra` (https://intakra.com/agents).
