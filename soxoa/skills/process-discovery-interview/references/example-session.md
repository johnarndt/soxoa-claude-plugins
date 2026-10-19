# Example session (condensed)

**User:** We are a 12-person property management office and everyone is buried in admin. Not sure where to start.

**Claude:** I will ask about the recurring work your team does, then turn it into inputs for two planning tools. I will only use numbers you give me, and please skip tenant names or account details. To start: which tasks repeat every week and feel like copy and paste?

**User:** Maintenance requests come in by email and someone types them into our work-order system and texts the vendor. Rent reminders. And owner statements at month end.

**Claude:** Let us take maintenance requests first. What starts it, what are the steps, and where does the information go?

**User:** Email lands in the shared inbox. Coordinator reads it, creates a work order in the property software, picks a vendor from a spreadsheet, texts them from a work phone. Maybe 60 a week, 10 minutes each. Two coordinators.

**Claude:** 60 requests at 10 minutes is 10 hours a week for the team, or about 5 hours each across 2 coordinators. Use 10 for the team and 5 per person? Systems I count: shared inbox, property software, vendor spreadsheet, work phone texts. That is 4. Right?

**User:** Yes and yes.

**Claude:** Now four quick ratings, low, medium, or high. Predictability: are requests similar, or all over the place? Judgment: is picking the vendor rule-based? Error cost: what happens if one is missed? Data sensitivity: what is in the emails?

**User:** Medium predictability, tenants write anything. Judgment low, we have a vendor per trade. Error cost medium, but high for leaks or no heat. Sensitivity medium, names and unit numbers.

**Claude:** For error cost you gave medium, with high for urgent cases. Should I use medium, or high to be cautious?

**User:** High.

(Same pattern for the other two workflows. The user values maintenance only: loaded cost $32/h, no view on share or weeks, no quote yet.)

## Intake sheet

```
Automation intake (your inputs, confirmed 2026-10-18)

Workflows for triage
| # | name | weeklyHours | predictability | judgmentRequired | errorCost | dataSensitivity | systemsCount (systems) |
|---|---|---|---|---|---|---|---|
| 1 | Maintenance request intake and dispatch | 10 | medium | low | high | medium | 4 (shared inbox, property software, vendor spreadsheet, work phone) |
| 2 | Rent reminders | 3 | high | low | low | medium | 2 (property software, email) |
| 3 | Owner statements | 8 | medium | medium | high | high | 3 (property software, accounting system, email) |

ROI inputs
| name | people | weeklyHoursPerPerson | loadedHourlyCost | automatableShare | workingWeeks | implementationCost |
|---|---|---|---|---|---|---|
| Maintenance request intake and dispatch | 2 | 5 | 32 (USD) | not given, server uses 60% | not given, server uses 48 | not given, no payback |

Still missing: nothing
Notes the tools do not use: urgent requests (leaks, no heat) need same-hour response; about 1 in 10 emails lacks a unit number.
```

## Arguments the sheet produces (sent only after the user says go)

`prioritize_automation_workflows`:

```json
{
  "workflows": [
    { "name": "Maintenance request intake and dispatch", "weeklyHours": 10, "predictability": "medium", "judgmentRequired": "low", "errorCost": "high", "dataSensitivity": "medium", "systemsCount": 4 },
    { "name": "Rent reminders", "weeklyHours": 3, "predictability": "high", "judgmentRequired": "low", "errorCost": "low", "dataSensitivity": "medium", "systemsCount": 2 },
    { "name": "Owner statements", "weeklyHours": 8, "predictability": "medium", "judgmentRequired": "medium", "errorCost": "high", "dataSensitivity": "high", "systemsCount": 3 }
  ]
}
```

`estimate_automation_roi` (optional fields omitted because the user gave none):

```json
{ "people": 2, "weeklyHoursPerPerson": 5, "loadedHourlyCost": 32 }
```

Present the results using the templates in `workflow-backlog-triage` and `automation-roi-estimate`, and carry the notes (urgent cases, missing unit numbers) into any pilot plan.
