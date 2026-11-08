# Synthetic fixture: `build_workflow_pilot`

A fictional workflow for testing the pilot tool. No real company, person, or system is involved. Every field matches the server's input schema: all eleven required fields are present, lengths and item counts are within limits, and no extra fields are sent (the schema rejects them).

## Prompt

"Draft a pilot plan with Soxoa for this synthetic workflow: maintenance request intake. Use exactly these arguments."

## Arguments

```json
{
  "workflowName": "Maintenance request intake (synthetic)",
  "trigger": "A tenant emails the shared maintenance inbox",
  "inputDescription": "Free-text tenant emails describing a repair issue, sometimes with a photo. About 60 per week. Most include a unit number; some do not.",
  "desiredOutput": "A draft work order in the property management system with unit, category, urgency, and a short summary, held for coordinator approval.",
  "sourceSystem": "Shared maintenance inbox",
  "destinationSystem": "Property management system",
  "currentSteps": [
    "Coordinator reads each new email in the shared inbox",
    "Coordinator looks up the unit and tenant in the property management system",
    "Coordinator picks a category and urgency",
    "Coordinator types a work order and assigns a vendor",
    "Coordinator replies to the tenant with the work order number"
  ],
  "reviewOwner": "Property coordinator",
  "riskLevel": "medium",
  "sensitiveData": true,
  "systemsAlreadyUsed": ["Email", "Property management system"],
  "successChecks": [
    "Every draft work order is approved by the coordinator before it is created",
    "Category and urgency match the coordinator's choice on at least 9 of 10 drafts during shadow mode",
    "Emergency requests are still flagged to the coordinator within 15 minutes"
  ],
  "constraints": [
    "No automatic replies to tenants during the pilot",
    "No vendor assignment without coordinator approval",
    "Manual process stays available for same-day rollback"
  ]
}
```

## Expected outcome

- One `build_workflow_pilot` call with the arguments above, no validation error.
- The result contains proposed steps, tools, a drafting prompt, review gates, acceptance checks, a rollout, and a Markdown plan.
- Because `sensitiveData` is true and `riskLevel` is medium, the review gates should keep the coordinator approving drafts. Report what the tool actually returns rather than assuming specific wording.
- The tool connects no accounts, starts no provider work, stores nothing, sends nothing, and does not run the workflow. Present the drafting prompt and any named tools as suggestions for people to review, not as something Claude ran or will run.

The tool is deterministic, so the same arguments return the same plan.
