---
name: review-takeoff
description: Use when the user wants to see or understand an existing Portravo takeoff, for example "summarize my takeoff for the Riverside workshop", "what quantities did Portravo pull by trade", "which lines are low confidence", "what still needs review before I price this", "show the electrical counts", "how many sheets did it read", or "is this project ready to price". Reads the project's takeoff lines, confidence, review status, assembly mapping and plan files, then summarizes what an estimator should check first and links to the project in Portravo.
---

# Review and summarize a Portravo takeoff

This skill reads one project's takeoff with `get_takeoff` and turns it into a short, accurate summary: quantities grouped by trade, the lines an estimator should look at first, and what is still pending before pricing. It is read-only and uses no credits.

Quantities from Portravo are extracted from plans and need estimator review. Present them as "extracted" or "for review", never as final or bid-ready.

## When not to use this skill

- No project exists yet: use `start-plan-takeoff`.
- The user wants the Excel workbook: use `export-reviewed-estimate` (it checks readiness the same way).
- The user wants an overview of all projects: use `project-status`.
- The user wants to change a quantity, confirm a line, map an assembly, or set prices. None of that is possible through the connection. Point them to the project's `reviewUrl`.

## If the Portravo tools are not available

Say the Portravo connection is not active and explain how to add it:

- Claude apps: Customize > Connectors, add Portravo (or install this plugin), then sign in.
- Claude Code: `claude mcp add --transport http portravo https://portravo.com/mcp`, then `/mcp` to authenticate.

If the user pastes takeoff lines or an exported sheet, you can summarize that text using the same rules below, and say the summary is based on what they pasted, not on a live read.

## Inputs to gather

| Need | Tool argument | Rules |
| --- | --- | --- |
| Which project | `get_takeoff.project_id` | Required. 1 to 128 characters, letters, digits, `_` and `-` only. |

If the user names a project instead of giving an id, call `list_projects` (from `offset` 0, then `nextOffset` while it is not null) and match on `name` or `address`. If more than one matches, list them with status and last update and ask. If none match, say so; do not guess.

Optional focus the user may give: a trade ("just electrical"), a confidence cutoff ("anything under 70%"), or a sheet/page. Apply it to the summary; it is not a tool argument.

## Workflow

1. Resolve the project id (above).
2. Call `get_takeoff` with `{ "project_id": "<id>" }`.
3. Check `project.status` first:
   - `draft`: no takeoff yet. If `files` is empty, no plan is attached. Offer `start-plan-takeoff`.
   - `extracting`: the takeoff is running. Say so and offer to check again later.
   - `failed`: the last run failed and its credit was refunded. Point to `reviewUrl`; a new run needs the user's fresh yes.
   - `review`, `priced`, `final`: summarize the lines.
4. Group `lines` by `trade`, then summarize using `references/reading-takeoff-lines.md` for field meanings and the triage order.
5. Present with the template below and end with `reviewUrl`.

## Reading the output

Top level fields from `get_takeoff`:

- `project`: `id`, `name`, `address`, `status`, `metroCode`, `chargedAt` (when a credit was used, or null), `updatedAt`.
- `lines`: each has `id`, `page`, `trade`, `category`, `description`, `qty`, `unit`, `confidence`, `status`, `assemblyId`, `notes`.
- `files`: each plan file has `id`, `filename`, `sizeBytes`, `contentType`, `pageCount`.
- `metro`: the pricing market (`code`, `name`, `state`, `costIndex`, `hasDirectPrices`) or null.
- `reviewRequired`: true when at least one line is still `pending`. False only means no line is pending. It does not prove assemblies are mapped or prices are set.
- `reviewUrl`: the project page in Portravo.

Line `status` values: `pending` (not yet reviewed), `confirmed`, `edited` (the estimator changed it), `rejected` (excluded by the estimator). `confidence` is a number from 0 to 1; show it as a percent.

## Output template

```
<project name> (<status>, <metro name or "no market set">)
Plan: <filename> (<pageCount> pages)   Lines: <total> (<pending> pending, <confirmed+edited> reviewed, <rejected> rejected)

By trade
- <trade>: <n> lines. Biggest items: <description> <qty> <unit> (<confidence>%), ...

Check first
1. <description>: <qty> <unit>, <confidence>% confidence, p.<page>. Why: <low confidence / note says assumed / no assembly mapped>.
2. ...

Before pricing
- <pending count> lines still pending review
- <count> lines with no assembly mapped
Open in Portravo to review, map and price: <reviewUrl>
These are extracted quantities for estimator review, not a bid.
```

Keep it short. For a large takeoff, show at most 5 items per trade and at most 10 "Check first" items, and say how many more there are.

## Guardrails

- Report numbers exactly as returned. Do not round `qty` differently, convert units, or total across different units.
- Do not add scope the takeoff does not contain. If something looks missing, say "not in the takeoff" and suggest checking the plans or the `scope-gap-checklist` skill.
- Never say a project is ready to bid or export just because `reviewRequired` is false. Export readiness is decided by `export_reviewed_estimate`.
- Do not show costs or prices; `get_takeoff` returns none. Pricing happens in Portravo.
- Only the connected account's projects are readable. A `not_found` means no such project in this account.

## Worked example

User: "What still needs review on the Riverside workshop takeoff?"

1. `list_projects` with `{}` returns a project `{ "id": "prj_7k2m9q", "name": "Riverside workshop", "status": "review", ... }`.
2. `get_takeoff` with `{ "project_id": "prj_7k2m9q" }` returns 18 lines; 11 `pending`, 6 `confirmed`, 1 `edited`; `reviewRequired: true`. Among the pending lines:
   - `drywall` "Gypsum board, interior walls" 2032 sf, confidence 0.4, notes "254 lf x 8 ft, ceiling height assumed", `assemblyId` null
   - `roofing` "Asphalt shingles" 1450 sf, confidence 0.65, notes "plan area, pitch and overhang not applied"
   - `electrical` "Duplex receptacle, 15A" 24 ea, confidence 0.92
3. Reply:

```
Riverside workshop (review, Sacramento, CA)
Plan: workshop.pdf (4 pages)   Lines: 18 (11 pending, 7 reviewed, 0 rejected)

Check first
1. Gypsum board, interior walls: 2032 sf, 40% confidence. The note says the ceiling height was assumed (254 lf x 8 ft), and no assembly is mapped.
2. Asphalt shingles: 1450 sf, 65%. Plan area only; pitch and overhang were not applied.
3. Duplex receptacle, 15A: 24 ea, 92%. Likely from the schedule; a quick count check is enough.

Before pricing
- 11 lines still pending review
- 1 line with no assembly mapped
Open in Portravo to review, map and price: https://portravo.com/projects/prj_7k2m9q
These are extracted quantities for estimator review, not a bid.
```
