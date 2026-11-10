---
name: daily-brief
description: Use when the user asks what to look at today in their Intakra workspace, for example "who is worth a call today?", "what's in my Intakra note?", "any leads today?", or "what should I work on this morning?". Reads today's saved leads and, on request, who to reach. Needs a connected Intakra workspace.
---

# Today's leads from Intakra

Reads the leads in today's Intakra note. Each lead is a dated, linked reason to look at one account on the user's list. Saved records only: no new research.

## Flow

1. Call `get_daily_brief` (no arguments). If no note went out yet today it returns what the next one would hold. An empty result on a quiet day is normal; say so plainly, do not pad it.
2. For each lead, show the account, what was found with its date and source link, what it usually means for what the user sells (keep the tool's "usually" or "often" wording), who to reach and why, and the rough time frame.
3. If the user asks who to contact for a lead, call `get_best_contact` with that lead's `opportunity_id` (`eop_...` or `rh_...`). Show the name, role, LinkedIn and work email only as returned. When nobody is named, give the LinkedIn search the tool returns.
4. If the user asks what changed on a lead, call `get_project_updates` with its `opportunity_id`.

## Rules

- A lead is a reason to look, not confirmed need, budget or purchase intent. Never upgrade it to fact.
- Keep the event date separate from the date Intakra recorded it.
- Intakra never writes or sends messages, and neither does this skill. If the user wants an email drafted, that is their own writing step outside Intakra; do not present a draft as something Intakra produced or sent.
- If a tool says the workspace is not connected, tell the user to connect: in Claude Code run `/mcp`, pick `intakra` and sign in; in Claude apps sign in when asked. Connection steps and plans: https://intakra.com/agents. Do not guess at leads.
