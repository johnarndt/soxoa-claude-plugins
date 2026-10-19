---
name: pilot-scoping-checklist
description: "Use when a user has picked (or is about to pick) the first workflow to automate and wants to plan a small, safe pilot. Triggers include 'scope a pilot for this', 'what do we need before we build it', 'plan our first automation', 'how do we test this without breaking things', 'what should we measure', 'checklist before automating invoices', or a follow-up after a triage or ROI result such as 'ok, how do we start'. Produces a vendor-neutral pilot checklist with baseline, scope, human checkpoints, success criteria, and rollback, using the Soxoa planning tools only to confirm the workflow's posture and baseline value."
---

# Pilot scoping checklist

Turn one chosen workflow into a concrete, reversible pilot plan the user can hand to whoever will build it, in house or outside. The plan covers what to measure first, what is in and out of scope, where a person stays in the loop, what success looks like, and how to undo it.

The Soxoa tools are optional here. Use them only to confirm the workflow's posture (`automate`, `assist`, `discovery`, and whether human review is required) and an illustrative baseline value, and only with the user's go-ahead.

## When not to use this skill

- The user has not chosen a workflow and has several candidates: run `workflow-backlog-triage` first.
- The user wants a build specification, code, or a tool recommendation by brand. This skill stays vendor-neutral and stops at the plan.
- The workflow's triage result is `discovery`. A build pilot is premature. Offer a discovery pilot instead (map the process, collect examples, measure exceptions), which this skill can also plan; say clearly that it is discovery, not automation.
- The user wants legal, security, or compliance sign-off. The checklist lists those reviews as steps; it does not perform them.

## Inputs

From the user (ask for anything missing, never invent):

- Workflow name and a short description of the steps today.
- Owner: who is accountable for the pilot and who does the work today.
- Systems touched (names as the user calls them) and how data moves between them.
- Volume per week and, if known, exception rate and time per item. If unknown, measuring them becomes the pilot's first task.
- Hard constraints: deadlines, regulated data, approvals that must stay with a person.

If the workflow has not been through the tools yet and the user wants it checked, collect the seven triage fields for it (`name`, `weeklyHours` 0.25 to 500, `predictability`, `judgmentRequired`, `errorCost`, `dataSensitivity` each `low`/`medium`/`high`, `systemsCount` 1 to 20) and, for a baseline value, `people` (1 to 500), `weeklyHoursPerPerson` (0.5 to 60), `loadedHourlyCost` (10 to 500), plus only the optional `automatableShare`, `workingWeeks`, `implementationCost` the user supplies.

## Workflow

1. **Reuse earlier results.** If triage or ROI already ran in this conversation, use those outputs. Do not call the tools again with the same inputs (results are deterministic and would be identical).
2. **Optional posture check.** With the user's okay, call `prioritize_automation_workflows` with a one-item `workflows` array. Read `rankedWorkflows[0].recommendation`, `humanReviewRequired`, `rationale`, and the `guardrails` list.
3. **Optional baseline value.** With the user's okay, call `estimate_automation_roi` with their required inputs, omitting optional ones they did not give (server defaults: 60% share, 48 weeks; no cost means `estimatedPaybackMonths: null`).
4. **Errors.** MCP error -32602 means an out-of-range value or invalid enum; name the field, ask for a fix, call again. Network error: retry once (idempotent), then continue without the tool and say so.
5. **Build the checklist** from `references/checklist.md`, filling each item from the user's facts and tool outputs. Leave unknowns as open questions with an owner, not guesses.
6. **Set the pilot shape** from the posture:
   - `automate`: run in shadow mode first (automation runs alongside the person, outputs compared), then live with spot checks.
   - `assist`: automation prepares or drafts, a named person approves every item during the pilot.
   - `discovery`: no build. Collect real examples, map exceptions and decision rules, measure baseline, then re-triage.
   - If `humanReviewRequired` is `true`, the person-in-the-loop step stays in the plan for the whole pilot and after it, whatever the shape.
7. **Present** with the template below and ask the user what to adjust.

## Answer template

```
Pilot plan: <workflow>   Shape: <shadow then live | assist with approval | discovery only>
Posture from tool: <recommendation>, human review <required/not required>   (or: not checked with the tool)

1. Baseline to measure first: <items from checklist section A>
2. Scope: in <...>; out <...>
3. Data and access: <systems, who grants access, sensitive fields to exclude>
4. Human checkpoints: <where a person approves, and who>
5. Success criteria: <user's targets, or "to be set after baseline">
6. Rollback: <how to switch back to the manual process the same day>
7. Timeline and owner: <user's dates and names>
Open questions: <list with owner>
Guardrails: <tool guardrails if triage ran>
Illustrative baseline value: <ROI outputs if run, labelled illustrative>
```

## Guardrails

- Vendor-neutral. Describe tooling by category only ("workflow automation platform", "the system's built-in rules", "a short script", "document extraction"). Do not recommend specific products.
- Success targets come from the user. You may suggest which metrics to track, not what numbers they will hit.
- Never plan full automation of regulated, safety-critical, financial, medical, or legal judgment.
- A pilot must be reversible: the manual process stays documented and available until the user decides otherwise.
- All value figures are illustrative estimates, not guaranteed savings or professional advice, and the tools did not inspect the user's systems.

## If the Soxoa tools are not connected

The checklist does not depend on the tools. Note that the posture check and baseline value were not run, and tell the user how to connect if they want them:

- Claude apps: Customize > Connectors, add a custom connector with URL `https://soxoa.com/mcp`, no authentication.
- Claude Code: `claude mcp add --transport http soxoa https://soxoa.com/mcp`

Do not state a recommendation, score, or value as if a tool produced it.

## Worked example

User: "Triage said start with invoice data entry. Dana, our AP lead, owns it. PDFs land in the AP inbox and we key them into the accounting system, about 40 a week. No idea on exceptions."

Triage already ran earlier in the conversation (invoice entry: `score` 77, `recommendation` `automate`, `humanReviewRequired` false), so no new tool call. Plan shape: shadow, then live with spot checks. Because it is financial data, Dana or a named backup approves every draft bill in shadow mode even though the tool did not require human review. The first task is a two-week baseline (invoices per week, minutes each, exception rate, error rate) because the user does not know the exception rate. Scope stops at a draft bill; payment release is out. Rollback: the manual keying process stays documented and can resume the same day. Success targets are left for Dana to set after the baseline.

The full plan, including the one-item posture-check arguments for when triage has not run, is in `references/example-pilot.md`.
