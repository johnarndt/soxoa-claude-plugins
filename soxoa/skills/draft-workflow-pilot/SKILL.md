---
name: draft-workflow-pilot
description: Use when the user wants a concrete pilot plan for one workflow drafted with Soxoa, for example "draft a pilot plan for invoice intake", "turn this workflow into a step-by-step pilot", "build the pilot for the workflow triage picked", or "what would the first version of this automation look like?". Collects the eleven facts build_workflow_pilot needs from the user and returns its steps, review gates, acceptance checks and Markdown plan. For a broader vendor-neutral checklist (baseline, scope, rollback), use pilot-scoping-checklist.
---

# Draft a workflow pilot with Soxoa

## Flow

1. **Collect the facts.** Ask only for what is missing, in the user's words. Required: `workflowName`, `trigger`, `inputDescription`, `desiredOutput`, `sourceSystem`, `destinationSystem`, `currentSteps` (1 to 8, in order), `reviewOwner` (a role is fine), `riskLevel` (`low`, `medium` or `high`, as the user judges the cost of a wrong output), `sensitiveData` (true or false), `successChecks` (1 to 6). Optional: `systemsAlreadyUsed`, `constraints`. Reuse facts already given in this conversation.
2. **Read them back** as a short list and ask the user to confirm or correct. Never fill a gap with a plausible guess.
3. **Call `build_workflow_pilot`** with exactly the confirmed fields. If the workflow has not been ranked and the user wants a posture check first, run `prioritize_automation_workflows` on it before this step.
4. **Present** the pilot steps, review gates, acceptance checks and rollout, then offer the Markdown plan. Keep every human review gate; add one if the user's constraints require approval.
5. On error -32602, name the field that is out of range or missing, ask the user, and call again.

## Rules

- Never invent a system, step, owner, risk level or success check.
- The plan is a draft for people to review. `build_workflow_pilot` connects no accounts, stores nothing, sends nothing and runs nothing; never say the pilot was set up or started. Its drafting prompt is for the builder to review, not for you to run.
- Do not plan full automation of regulated, safety-critical, financial, medical or legal judgment.
- Do not put customer names, account numbers or secrets in any field.
