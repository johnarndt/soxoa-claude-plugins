# Worked example for prioritize_automation_workflows

The output below is a real response from the live tool for these inputs.

## User request

"We have three things eating our week. AP keys invoices from emailed PDFs into the accounting system, about 10 hours a week across the team. Refund approvals take maybe 4 hours a week and touch the helpdesk, the payment portal, and our order system. And someone builds the weekly sales report, about 3 hours, from the CRM and a spreadsheet. Which do we automate first?"

## Gaps and confirmation

Hours and system counts are present. The four ratings are missing. Ask, offering the rubric. Suppose the user answers (or confirms your labelled suggestions):

| Workflow | predictability | judgmentRequired | errorCost | dataSensitivity |
|---|---|---|---|---|
| Invoice data entry | high | low | medium | medium |
| Refund approvals | medium | high | high | high |
| Weekly sales report | high | low | low | low |

## Arguments

```json
{
  "workflows": [
    { "name": "Invoice data entry from emailed PDFs", "weeklyHours": 10, "predictability": "high", "judgmentRequired": "low", "errorCost": "medium", "dataSensitivity": "medium", "systemsCount": 2 },
    { "name": "Customer refund approvals", "weeklyHours": 4, "predictability": "medium", "judgmentRequired": "high", "errorCost": "high", "dataSensitivity": "high", "systemsCount": 3 },
    { "name": "Weekly sales report", "weeklyHours": 3, "predictability": "high", "judgmentRequired": "low", "errorCost": "low", "dataSensitivity": "low", "systemsCount": 2 }
  ]
}
```

## Result

```json
{
  "rankedWorkflows": [
    { "name": "Invoice data entry from emailed PDFs", "score": 77, "recommendation": "automate", "humanReviewRequired": false,
      "rationale": ["10 team hours per week are in scope.", "high input and output predictability.", "low human judgment requirement.", "2 systems involved."] },
    { "name": "Weekly sales report", "score": 64, "recommendation": "assist", "humanReviewRequired": false,
      "rationale": ["3 team hours per week are in scope.", "high input and output predictability.", "low human judgment requirement.", "2 systems involved."] },
    { "name": "Customer refund approvals", "score": 10, "recommendation": "discovery", "humanReviewRequired": true,
      "rationale": ["4 team hours per week are in scope.", "medium input and output predictability.", "high human judgment requirement.", "3 systems involved.", "Keep a human checkpoint because the workflow has judgment, sensitivity, or high error-cost risk."] }
  ],
  "recommendedFirstWorkflow": "Invoice data entry from emailed PDFs",
  "guardrails": [
    "Treat the score as a discovery aid, not a promise of savings or feasibility.",
    "Confirm data access, exception paths, security requirements, and ownership before building.",
    "Do not fully automate regulated, safety-critical, financial, medical, or legal judgment.",
    "Pilot with a reversible workflow and measurable baseline."
  ]
}
```

## Presentation

> **Workflow triage (discovery aid, not a feasibility promise)**
>
> | Rank | Workflow | Score | Recommendation | Human review |
> |---|---|---|---|---|
> | 1 | Invoice data entry from emailed PDFs | 77 | automate | no |
> | 2 | Weekly sales report | 64 | assist | no |
> | 3 | Customer refund approvals | 10 | discovery | yes |
>
> **Start with invoice data entry.** It has the most hours in scope (10 a week), high predictability, low judgment, and only 2 systems.
>
> The sales report scored well but has fewer hours, so the tool suggests assist: automate the data pull and draft, a person reviews before it goes out.
>
> Refund approvals need discovery first. They involve high judgment, high error cost, and sensitive payment data, so keep a human checkpoint even after any automation.
>
> Guardrails from the tool:
> - Treat the score as a discovery aid, not a promise of savings or feasibility.
> - Confirm data access, exception paths, security requirements, and ownership before building.
> - Do not fully automate regulated, safety-critical, financial, medical, or legal judgment.
> - Pilot with a reversible workflow and measurable baseline.
>
> Want an illustrative ROI estimate for invoice entry, or a pilot checklist for it?

Note the presentation describes "assist" in the tool's own terms and does not claim the tool checked the CRM, the payment portal, or any other system.

## Validation error example

If the user rates a workflow "very high", the call fails with MCP error -32602 on a path like `workflows.1.errorCost` (expected one of low, medium, high). Tell the user: "The second workflow, Customer refund approvals, needs error cost as low, medium, or high. Should 'very high' be high?" Call again only after they answer.
