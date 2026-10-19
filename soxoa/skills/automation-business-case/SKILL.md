---
name: automation-business-case
description: "Use when a user needs a written case for or against an automation project to show an owner, manager, partner, or board. Triggers include 'write a business case for automating this', 'help me justify an automation budget', 'make a one-page memo for my boss', 'should we spend 15k automating this, put it in writing', 'compare our options and recommend one', or 'show best case and worst case'. Combines the Soxoa prioritize_automation_workflows and estimate_automation_roi tools into a memo with explicit assumptions and, only when the user supplies alternate values, a sensitivity table."
---

# Automation business case memo

Produce a short decision memo that answers: which workflow should we automate first, what is it plausibly worth, what has to be true for that to hold, and what is the next small step. It chains both Soxoa tools and states every assumption in plain view.

## When not to use this skill

- The user wants a quick number, not a document: use `automation-roi-estimate`.
- The user wants a ranking only: use `workflow-backlog-triage`.
- The user has not gathered inputs: run `process-discovery-interview` first, then come back.
- The user wants a financial model with tax, depreciation, discount rates, or cash flow. The tools do not compute these; say so and do not fake them.

## Inputs

1. **Candidate workflows** (1 to 12) with all seven triage fields per workflow: `name`, `weeklyHours`, `predictability`, `judgmentRequired`, `errorCost`, `dataSensitivity`, `systemsCount`. Enum values are `low`, `medium`, `high`; limits are in the `workflow-backlog-triage` skill. If the user already picked one workflow and does not want a comparison, skip triage.
2. **ROI inputs for the chosen workflow:** `people` (1 to 500), `weeklyHoursPerPerson` (0.5 to 60), `loadedHourlyCost` (10 to 500, user's currency). Optional, user-supplied only: `automatableShare` (0.05 to 0.95), `workingWeeks` (1 to 52), `implementationCost` (0 to 10,000,000).
3. **Audience and decision:** who reads the memo and what they are deciding (approve a pilot, pick a workflow, set a budget).
4. **Alternate assumptions (optional):** for a sensitivity table, the user's own low and high values for any optional ROI input, for example "share could be as low as 40%" or "the quote might be 18k". Ask once whether they have any. If they have none, there is no sensitivity table.

Ask for every missing required value in one message. Never invent hours, ratings, wages, costs, shares, or scenarios.

## Workflow

1. **Collect and confirm inputs.** Show a compact table of what you will send. Mark optional fields the user left blank as "server default" (share 60%, weeks 48) or "not given" (cost).
2. **Triage (if more than one candidate).** Call `prioritize_automation_workflows` with the confirmed `workflows` array. Keep `rankedWorkflows`, `recommendedFirstWorkflow`, and `guardrails`.
3. **Choose the workflow to value.** Default to `recommendedFirstWorkflow`. If the user prefers another, use theirs and note in the memo that it differs from the tool's suggestion and why (in the user's words). If the chosen workflow has `humanReviewRequired: true` or recommendation `discovery`, say plainly that the case is for a discovery or assist pilot, not full automation.
4. **Base case.** Call `estimate_automation_roi` with the user's required inputs and only the optional inputs they supplied.
5. **Sensitivity (only with user-supplied alternates).** For each alternate scenario the user gave, call `estimate_automation_roi` again, changing only the fields they supplied alternates for and keeping everything else identical to the base case. Label each scenario with the user's own description. Do not add scenarios they did not provide. Do not vary a required input unless the user gave the alternate value.
6. **Errors.** MCP error -32602 means a value is out of range or not an allowed enum; name the field, ask for a fix, call again. On a network error retry once (both tools are idempotent and deterministic, so identical inputs give identical outputs), then follow the fallback section.
7. **Write the memo** with the template in `references/memo-template.md`. Keep it to about one page.

## Reading the outputs

- Triage: `rankedWorkflows[].name`, `score`, `recommendation` (`automate`, `assist`, `discovery`), `humanReviewRequired`, `rationale[]`; plus `recommendedFirstWorkflow` and `guardrails[]`.
- ROI: `status` (`illustrative_estimate`), `weeklyHoursReclaimed`, `annualHoursReclaimed`, `annualCapacityValue`, `estimatedPaybackMonths` (`null` when no cost was sent), `assumptions[]`, `recommendedNextStep`.

Copy numbers exactly as returned. Quote `assumptions` and `guardrails` in the memo. Use the server's `recommendedNextStep` as the basis of the memo's next step.

## Memo rules

- Title it as an illustrative planning memo.
- Put an "Assumptions" section before any numbers, listing every input with its source: "you supplied", "server default", or "not given".
- Describe `annualCapacityValue` as capacity (time back), not cash savings, unless the user says they will reduce paid hours or redeploy the time to billable work, and even then say it is their plan, not a tool result.
- If there is no implementation cost, write "Payback not calculated (no cost supplied)". Do not estimate a cost.
- Include a "What would change this" section naming the inputs that most affect the result, based on the sensitivity runs if any, otherwise stated qualitatively without new numbers.
- If tooling categories come up, stay vendor-neutral (for example "a workflow automation platform", "the accounting system's built-in rules", "a short script"). Do not name or recommend specific vendors.
- No hype. Plain sentences.

## Guardrails

- Results are illustrative. Never present them as guaranteed savings, a quote, a forecast, or financial, legal, or other professional advice, and never as a substitute for process discovery.
- The tools did not inspect the user's systems, data, or staff. The memo must not imply they did.
- Do not fully automate regulated, safety-critical, financial, medical, or legal judgment, whatever the scores say.
- Do not run extra scenarios to make the case look better or worse. Only the user's alternates.
- Keep the memo free of credentials and sensitive personal data.

## If the Soxoa tools are not connected

Say the tools are not available and how to connect:

- Claude apps: Customize > Connectors, add a custom connector with URL `https://soxoa.com/mcp`, no authentication.
- Claude Code: `claude mcp add --transport http soxoa https://soxoa.com/mcp`

You can still draft the memo skeleton with the confirmed inputs and assumptions, leaving result fields as "pending tool run". Do not fill scores, rankings, or ROI figures as if a tool produced them.

## Worked example

User: "Write a one-pager for my business partner on automating invoice entry. 4 people, 6 hours a week each, $45 loaded, quote is $12,000. Also show what happens if only 40% is automatable and the quote comes in at $18,000."

Calls (triage skipped: one workflow chosen by the user):

```json
{ "people": 4, "weeklyHoursPerPerson": 6, "loadedHourlyCost": 45, "implementationCost": 12000 }
```

```json
{ "people": 4, "weeklyHoursPerPerson": 6, "loadedHourlyCost": 45, "automatableShare": 0.4, "implementationCost": 18000 }
```

Live results: base case 14.4 h/week, 691 h/year, $31,104 capacity value, payback 4.6 months (share 60% and 48 weeks are server defaults). User's cautious case: 9.6 h/week, 461 h/year, $20,736, payback 10.4 months. The memo presents both in a two-row sensitivity table labelled "Base (server default share)" and "Your cautious case", and does not add a third scenario. The full memo is in `references/example-memo.md`.
