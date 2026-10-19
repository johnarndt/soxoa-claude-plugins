---
name: project-status
description: Use when the user wants an overview of their Portravo account or projects, for example "show my Portravo projects", "which estimates are still in review", "what did I work on this week", "which projects are priced and ready to download", "find the Oak Lane project", "which takeoffs failed", or "which Portravo account am I connected as". Lists every project in the connected account across pages and groups them by status with next steps and links.
---

# Portravo project status across the account

This skill answers "where do my estimates stand?" using `get_profile` and `list_projects`. It is read-only and uses no credits.

## When not to use this skill

- The user wants detail on one project's quantities: use `review-takeoff`.
- The user wants to start a new project: use `start-plan-takeoff`.
- The user wants a workbook: use `export-reviewed-estimate`.

## If the Portravo tools are not available

Tell the user the Portravo connection is not active and how to add it:

- Claude apps: Customize > Connectors, add Portravo (or install this plugin), then sign in.
- Claude Code: `claude mcp add --transport http portravo https://portravo.com/mcp`, then `/mcp` to authenticate.

Without the connection you cannot see their projects. Do not list or guess project names. They can also see every project at https://portravo.com after signing in.

## Inputs

No required inputs. Optional filters the user may give, applied after fetching:

- Status ("only the ones in review")
- Name or address text ("Oak Lane")
- Time ("updated this week"), compared against `updatedAt`

`list_projects` takes one optional argument, `offset` (integer, 0 to 999999). It returns 50 projects per page and a `nextOffset` for the next page, or `null` when there are no more.

## Workflow

1. If the user asked which account is connected, or the answer depends on it, call `get_profile` (no arguments). It returns `id`, and usually `name` and `email`. Show name and email only.
2. Call `list_projects` with `{}` (same as `offset: 0`).
3. While `nextOffset` is not null, call `list_projects` with `{ "offset": <nextOffset> }`. Stop when it is null. If the user only wants a recent snapshot and the account has many pages, you may stop after the first page and say how you limited it.
4. Apply the user's filters. Group by `status`.
5. Present with the template below. Offer the next useful step for the group they care about.

Paging details, name lookup, and filter mappings are in `references/paging-and-filters.md`.

If a call fails with `invalid_token`, ask the user to reconnect Portravo and sign in again, then retry. For other errors see `../start-plan-takeoff/references/errors.md`.

## Reading the output

Each item in `projects` has `id`, `name`, `address` (or null), `status`, `metroCode` (or null), and `updatedAt` (ISO time). The project page is `https://portravo.com/projects/<id>`, the same form as the `reviewUrl` other tools return.

What each `status` means and the next step to offer:

| status | Meaning | Next step to offer |
| --- | --- | --- |
| `draft` | Created; no takeoff has run yet. May or may not have a plan attached. | Attach a plan and run the takeoff (`start-plan-takeoff`). |
| `extracting` | The AI takeoff is running. | Check back later. |
| `failed` | The last takeoff run failed; its credit reservation was refunded. | Open the project in Portravo; a new run needs the user's yes. |
| `review` | Takeoff done; lines need estimator review, mapping and pricing. | Summarize what needs review (`review-takeoff`). |
| `priced` | Estimate priced in Portravo. | Try the Excel export (`export-reviewed-estimate`). |
| `final` | Estimate marked final. | Try the Excel export. |

`priced` and `final` usually mean the export will work, but `export_reviewed_estimate` makes the final check (every line reviewed and assemblies mapped).

## Output template

```
Portravo account: <name> (<email>)    [only if get_profile was called]
<total> projects

In review (<n>)
- <name>, <address or metro>: updated <date>. <project link>
...
Priced or final (<n>)
- ...
Draft (<n>)
- ...
Running (<n>) / Failed (<n>)
- ...

Next: <one suggestion tied to what they asked>
```

Show dates in plain form (for example "Oct 17"). Order each group by `updatedAt`, newest first. If a group has more than 10 projects, show the 10 newest and the count of the rest. Leave out empty groups.

## Guardrails

- Show only what the tools returned. Do not infer budgets, bid dates, or clients.
- Do not call `get_takeoff` on every project to enrich the list unless the user asks for detail on specific ones; that is slow and unnecessary.
- The connection sees only the signed-in account's projects. If a project the user expects is missing, say it is not in this account and suggest checking that they signed in with the right Portravo login.

## Worked example

User: "Which of my Portravo estimates are still in review?"

1. `list_projects` with `{}` returns:
   ```json
   { "projects": [
     { "id": "prj_egt4e8mosuhwbnuw", "name": "Riverside workshop", "address": null, "status": "review", "metroCode": "sacramento-ca", "updatedAt": "2026-10-17T18:02:11.000Z" },
     { "id": "prj_q81wz0kd2m5a7c3e", "name": "Oak Lane duplex", "address": "88 Oak Ln, Phoenix, AZ", "status": "priced", "metroCode": "phoenix-az", "updatedAt": "2026-10-15T21:40:00.000Z" },
     { "id": "prj_h3n6v9b2x4t7p0ra", "name": "Garage addition", "address": null, "status": "draft", "metroCode": null, "updatedAt": "2026-10-12T16:10:00.000Z" }
   ], "nextOffset": null }
   ```
2. Reply:

```
1 project is in review:
- Riverside workshop (Sacramento): updated Oct 17. https://portravo.com/projects/prj_egt4e8mosuhwbnuw

Also: Oak Lane duplex is priced, and Garage addition is still a draft.
Want me to summarize what needs review on Riverside workshop?
```
