---
name: lead-contact-and-updates
description: Use when the user asks about open leads in Intakra or one lead in particular, for example "which accounts have an open buying signal?", "which leads are closing soon?", "who should I reach about this lead, and why?", "who owns this at acme.com?", or "what changed on that lead?". Needs a connected Intakra workspace.
---

# Open leads, who to reach, and what changed

## Flow

1. Call `list_opportunities`. Use `filter: "closing_soon"` when the user asks what is closing soon (usually winds down within 30 days); otherwise the default open leads. Show each lead with its id, dated proof and links, what it usually means for what the user sells, and the rough time frame.
2. For "who should I reach?", call `get_best_contact` with the lead's `opportunity_id`. Show name, role, LinkedIn, and a verified work email only if returned (never for EU, EEA or UK companies). If nobody is named, give the LinkedIn search for the title that the tool returns.
3. For "what changed on this lead?", call `get_project_updates` with the `opportunity_id`. Show whether it is watched and each dated before/after change with its source.

## Rules

- Who and why only. Intakra never writes or sends messages; do not present outreach as sent or as Intakra's.
- Do not guess a contact, email or phone number the tool did not return.
- Marking, watching or pushing a lead to a CRM is not available on this OAuth connection. Point the user to the Intakra website for those, and do not claim they were done.
- Not connected? Tell the user to run `/mcp` in Claude Code and sign in to `intakra` (https://intakra.com/agents).
