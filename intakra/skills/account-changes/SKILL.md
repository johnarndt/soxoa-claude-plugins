---
name: account-changes
description: Use when the user asks what changed at the companies they track in Intakra, for example "anything happening on my list?", "what changed at these companies this week?", "new findings since Monday?", or "any news on acme.com and globex.com?". Reads findings Intakra recorded since a date. Needs a connected Intakra workspace.
---

# What changed on my account list

## Flow

1. Call `get_account_changes`. Pass `since` (YYYY-MM-DD, not in the future) only when the user gives a period; the default is seven days ago. Pass `domains` when the user names companies.
2. Group the findings by account. For each, give what happened, the event date, the date Intakra recorded it and the source link.
3. If the result is truncated, say so and offer a narrower `since` or fewer `domains`.
4. For one account in depth, call `get_account` with its domain.

## Rules

- A finding can describe an older event recorded recently; always show both dates.
- No findings is not proof of no activity. Say "no saved findings in this period".
- Do not call a finding a buying signal, need or intent unless the tool returns it as an open lead, and even then it is a reason to look.
- Not connected? Tell the user to run `/mcp` in Claude Code and sign in to `intakra` (https://intakra.com/agents).
