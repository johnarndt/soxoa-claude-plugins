---
name: workflow-backlog-triage
description: "Use when a user has a list of recurring tasks or processes and wants to know which to automate first, which need a human in the loop, and which need more discovery. Triggers include 'which of these should we automate first', 'rank our automation ideas', 'prioritize this backlog of manual processes', 'automate or keep manual', 'sort these workflows into automate, assist, or discovery', or a pasted list of 1 to 12 workflows with hours and complexity. Uses the Soxoa prioritize_automation_workflows tool."
---

# Workflow backlog triage

Rank 1 to 12 recurring workflows the user describes and sort each into **automate**, **assist** (automation with a person in the loop), or **discovery** (not ready, learn more first), using the Soxoa MCP tool `prioritize_automation_workflows`.

The tool is public, read-only, deterministic, and needs no account. It scores only the ratings the user supplies. It does not look at the user's systems or verify any claim.

## When not to use this skill

- Only one workflow and the user wants its dollar value: use `automation-roi-estimate`.
- The user cannot yet describe hours or ratings for the workflows: run `process-discovery-interview` first.
- The user wants a written recommendation for a decision maker: use `automation-business-case`, which runs this triage as a step.
- More than 12 workflows: ask the user to pick the 12 to rank first, or split into batches they choose. Each workflow's score depends only on its own inputs, so scores from separate batches can be compared, but `recommendedFirstWorkflow` is per batch. Say the batches were ranked separately.

## Inputs and exact argument mapping

One object per workflow inside `workflows` (array, 1 to 12 items). All seven fields are required for every workflow.

| Ask the user | Field | Allowed values |
|---|---|---|
| Short name of the workflow | `name` | string, 1 to 120 characters |
| Total team hours per week spent on it | `weeklyHours` | number, 0.25 to 500 |
| How predictable are inputs and steps? | `predictability` | `low`, `medium`, `high` |
| How much human judgment does it take? | `judgmentRequired` | `low`, `medium`, `high` |
| How costly is a mistake? | `errorCost` | `low`, `medium`, `high` |
| How sensitive is the data? | `dataSensitivity` | `low`, `medium`, `high` |
| How many systems, apps, or inboxes does it touch? | `systemsCount` | integer, 1 to 20 |

Note `weeklyHours` here is the team total for the workflow, unlike the ROI tool, which takes hours per person. If the user gives per-person hours and a headcount, show the multiplication and confirm it.

The rating rubric that helps users pick low, medium, or high is in `references/rating-rubric.md`. Share it when the user is unsure.

## Workflow

1. Collect the list. Keep the user's workflow names (shorten to 120 characters only if needed, and tell them). Ask the user to keep names generic: no customer names, account numbers, or secrets.
2. Build a table of the seven fields per workflow and mark each gap.
3. Ask for every gap in one message, grouped by workflow. Offer the rubric for the four ratings.
4. If the user asks you to suggest ratings from their descriptions, you may propose them, labelled "suggested", with a one-line reason each, and get an explicit yes or corrections before calling. Never call the tool with ratings the user has not confirmed. Never invent hours or system counts.
5. Call `prioritize_automation_workflows` once with all confirmed workflows.
6. On a validation error (MCP error -32602 naming a path such as `workflows.2.predictability`), tell the user which workflow and field failed (the index is zero-based, so `workflows.2` is the third item), get a fix, and call again.
7. On a network or server error, retry once with the same arguments (the tool is idempotent). If it fails again, follow "If the Soxoa tools are not connected".
8. Present results with the template below.

## Reading the output

- `rankedWorkflows`: already sorted, best candidate first. Each item has:
  - `name`: the name you sent.
  - `score`: higher is a better automation candidate. Each workflow's score comes from its own ratings (the same inputs always give the same score). Use it to compare workflows, not as a percentage or probability of success.
  - `recommendation`: `automate`, `assist`, or `discovery`.
  - `humanReviewRequired`: `true` means keep a human checkpoint even if the work is automated.
  - `rationale`: the factors the score used. Quote them.
- `recommendedFirstWorkflow`: the server's suggested starting point.
- `guardrails`: cautions that must be passed to the user unchanged in meaning.

Do not reorder the ranking, change a recommendation, or invent a score. If you disagree based on something the user told you that the tool cannot see (for example a system being replaced next quarter), say so separately as your own note.

## Answer template

```
Workflow triage (discovery aid, not a feasibility promise)

| Rank | Workflow | Score | Recommendation | Human review |
|---|---|---|---|---|
| 1 | <name> | <score> | <recommendation> | <yes/no> |
...

Start with: <recommendedFirstWorkflow>
Why: <its rationale items>

What each recommendation means:
- automate: good candidate for end-to-end automation with monitoring.
- assist: automate the prep or drafting, a person approves or finishes.
- discovery: not ready; map exceptions, data, and decision rules first.

Guardrails from the tool:
- <each guardrails string>

Inputs used: <table or list of the ratings the user confirmed>
```

Then offer, without running anything yet: an ROI estimate for the first workflow (`automation-roi-estimate`), or a pilot plan (`pilot-scoping-checklist`).

## Guardrails

- Scores and recommendations are a discovery aid, not a promise of savings or feasibility.
- Never present a workflow as safe to fully automate when `humanReviewRequired` is `true`.
- Do not fully automate regulated, safety-critical, financial, medical, or legal judgment, whatever the score.
- The tool saw only the ratings. It did not check data access, security, or exceptions. Say so.
- Do not re-run with altered ratings to get a different answer. Re-run only when the user changes their own inputs.

## If the Soxoa tools are not connected

Tell the user the tool is not available and how to connect it:

- Claude apps: Customize > Connectors, add a custom connector with URL `https://soxoa.com/mcp`, no authentication.
- Claude Code: `claude mcp add --transport http soxoa https://soxoa.com/mcp`

Without it you can still build and confirm the input table, and you may give qualitative observations (for example "high judgment and high error cost usually means keep a person in the loop"), clearly labelled as your own reading. Do not produce scores, a ranking presented as the tool's, or a `recommendedFirstWorkflow`.

## Worked example

User: "AP keys invoices from emailed PDFs, 10 hours a week, 2 systems. Refund approvals, 4 hours, 3 systems. Weekly sales report, 3 hours, 2 systems. Which first?" After the user confirms ratings (invoices high/low/medium/medium, refunds medium/high/high/high, report high/low/low/low for predictability/judgment/error cost/sensitivity), call:

```json
{ "workflows": [
  { "name": "Invoice data entry from emailed PDFs", "weeklyHours": 10, "predictability": "high", "judgmentRequired": "low", "errorCost": "medium", "dataSensitivity": "medium", "systemsCount": 2 },
  { "name": "Customer refund approvals", "weeklyHours": 4, "predictability": "medium", "judgmentRequired": "high", "errorCost": "high", "dataSensitivity": "high", "systemsCount": 3 },
  { "name": "Weekly sales report", "weeklyHours": 3, "predictability": "high", "judgmentRequired": "low", "errorCost": "low", "dataSensitivity": "low", "systemsCount": 2 }
] }
```

Live result: invoices 77 automate, sales report 64 assist, refunds 10 discovery with `humanReviewRequired: true`; `recommendedFirstWorkflow` is invoice data entry. Present the ranked table, the reason to start with invoices (from its `rationale`), why refunds need discovery and a human checkpoint, and all four `guardrails`.

The full output and presentation are in `references/examples.md`.
