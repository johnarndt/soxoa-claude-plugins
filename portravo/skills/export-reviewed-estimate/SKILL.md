---
name: export-reviewed-estimate
description: Use when the user wants the Excel file for a Portravo estimate, for example "download my estimate as Excel", "export the Oak Lane estimate to XLSX", "get me the spreadsheet for the priced bid", "send me the workbook", or "can I export this yet". Checks the project, returns a short-lived XLSX download link only for a reviewed, priced or final estimate, and otherwise explains what to finish in Portravo with the project link.
---

# Export a reviewed Portravo estimate to Excel

This skill gets a download link for a Portravo estimate workbook (XLSX) with `export_reviewed_estimate`. Portravo only exports estimates where every takeoff line has been reviewed and the estimate is priced or final. If that is not true yet, the job is to tell the user exactly what to finish and where.

The tool is read-only and uses no credits.

## When not to use this skill

- The user wants a summary in the chat, not a file: use `review-takeoff`.
- The user wants a takeoff exported before review "just to see it". Portravo does not export unreviewed estimates. Offer a `review-takeoff` summary instead.
- The user wants Claude to build their own spreadsheet from the takeoff. That is a different task; do not label it a Portravo estimate.

## If the Portravo tools are not available

Tell the user the Portravo connection is not active and how to add it:

- Claude apps: Customize > Connectors, add Portravo (or install this plugin), then sign in.
- Claude Code: `claude mcp add --transport http portravo https://portravo.com/mcp`, then `/mcp` to authenticate.

They can also download the workbook from the project page in Portravo after signing in. Do not produce a link or file yourself.

## Inputs

| Need | Tool argument | Rules |
| --- | --- | --- |
| Which project | `export_reviewed_estimate.project_id` | Required. 1 to 128 characters, letters, digits, `_` and `-` only. |

If the user names the project, find its id with `list_projects` (page with `nextOffset` until null) and match on `name` or `address`. Ask if more than one matches.

## Workflow

1. Resolve the project id.
2. Optional pre-check: if you do not already know the project's state, call `get_takeoff` with `{ "project_id": "<id>" }`. If `project.status` is `draft`, `extracting`, or `failed`, or `reviewRequired` is true, skip the export call and go to "When review is incomplete".
3. Call `export_reviewed_estimate` with `{ "project_id": "<id>" }`.
4. On success, present the link with the template below.
5. On `review_required`, go to "When review is incomplete".
6. On `not_found`, say the project is not in this account and offer `list_projects`. On `invalid_token`, ask the user to reconnect. Other codes: see `../start-plan-takeoff/references/errors.md`.

Common export problems (expired links, priced but still refused, ambiguous names) are covered in `references/troubleshooting.md`.

## Reading the output

On success the tool returns:

- `downloadUrl`: the XLSX link. It expires quickly (Portravo states five minutes). Disconnecting Portravo also invalidates it.
- `filename`: for example `Oak Lane duplex.xlsx`.
- `mimeType`: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`.
- `expiresAt`: ISO time the link stops working.
- `reviewUrl`: the project page in Portravo.

The workbook contains the estimate and the reviewed takeoff as Portravo produced them. Do not describe numbers inside the file; you have not opened it.

## Output template (success)

```
Your estimate workbook is ready: <filename>
Download: <downloadUrl>
The link expires at <expiresAt as local time> (about 5 minutes). If it expires, ask me again for a fresh link.
Project in Portravo: <reviewUrl>
```

Present the link right away. If the user comes back later, call `export_reviewed_estimate` again for a new link instead of reusing the old one.

## When review is incomplete

`review_required` means at least one of these is still open in Portravo: lines not reviewed, assemblies not mapped, or the estimate not priced or final.

1. If you have not already, call `get_takeoff` to count what is open: pending lines (`status: "pending"`) and unmapped lines (`assemblyId` null, not rejected).
2. Reply:

```
<project name> can't be exported yet. Portravo exports only after every line is reviewed and the estimate is priced.
Still open:
- <n> lines pending review
- <n> lines with no assembly mapped
- Estimate status: <status> (needs to be priced or final)
Finish these in Portravo: <reviewUrl from get_takeoff>
Then ask me again and I'll get the download link.
```

The error's own `reviewUrl` may be the general projects page. Prefer the project-specific `reviewUrl` from `get_takeoff`.

## Guardrails

- Never work around the review requirement (for example by building a spreadsheet from `get_takeoff` lines and calling it the estimate).
- Never say the workbook is a final bid or guarantee its numbers. The estimator who reviewed and priced it owns them.
- Do not paste or store the `downloadUrl` anywhere other than your reply to the user.
- Only the signed-in account's projects can be exported.

## Worked example

User: "Download the Excel estimate for Oak Lane duplex."

1. `list_projects` with `{}` finds `{ "id": "prj_q81wz0kd2m5a7c3e", "name": "Oak Lane duplex", "status": "priced" }`.
2. `export_reviewed_estimate` with `{ "project_id": "prj_q81wz0kd2m5a7c3e" }` returns:
   ```json
   { "downloadUrl": "https://portravo.com/...", "filename": "Oak Lane duplex.xlsx", "mimeType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "expiresAt": "2026-10-18T17:05:00.000Z", "reviewUrl": "https://portravo.com/projects/prj_q81wz0kd2m5a7c3e" }
   ```
3. Reply with the success template, showing the link and that it expires in about five minutes.

Second case: the user asks for "Riverside workshop" (status `review`). `get_takeoff` shows 11 pending lines and 1 unmapped. Skip the export call and use the "can't be exported yet" reply with its project link.
