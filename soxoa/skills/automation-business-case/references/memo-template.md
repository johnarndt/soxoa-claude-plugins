# Memo template

Fill only from confirmed user inputs and tool outputs. Delete sections that do not apply (for example the triage table when only one workflow was considered, or the sensitivity table when the user gave no alternates).

```
# Automation planning memo: <workflow name>
Illustrative planning estimate, not guaranteed savings or professional advice.
Prepared for: <audience>    Decision requested: <decision>    Date: <date>

## Recommendation
<One or two sentences. Example: "Run a 6-week pilot automating invoice entry, keeping a person to review exceptions." Match the tool's recommendation: automate, assist (person in the loop), or discovery (map the process before building).>

## Why this workflow
<If triage ran:>
| Rank | Workflow | Score | Recommendation | Human review |
|---|---|---|---|---|
| ... from rankedWorkflows, in the order returned ... |

Tool's suggested first workflow: <recommendedFirstWorkflow>
Reasons: <rationale items for the chosen workflow>
<If the user chose a different workflow: "We chose <X> instead of the tool's suggestion because <user's reason>.">

## Assumptions
| Input | Value | Source |
|---|---|---|
| People doing the work | <people> | you supplied |
| Hours per person per week | <weeklyHoursPerPerson> | you supplied |
| Loaded hourly cost | <currency><loadedHourlyCost> | you supplied |
| Reclaimable share | <x%> | you supplied / server default (60%) |
| Working weeks per year | <n> | you supplied / server default (48) |
| Implementation cost | <currency><cost> or not given | you supplied / not given |

Tool assumption notes:
- <each string from assumptions>

## Illustrative result (base case)
- Hours reclaimed: <weeklyHoursReclaimed> per week, <annualHoursReclaimed> per year
- Annual capacity value: <currency><annualCapacityValue> (time back, not guaranteed cash savings)
- Payback: <estimatedPaybackMonths> months, or "not calculated (no cost supplied)"

## Sensitivity (your alternate assumptions)
| Scenario (your words) | What changed | Hours/yr | Capacity value | Payback (months) |
|---|---|---|---|---|
| Base | server defaults for share and weeks | ... | ... | ... |
| <user label> | <field: value> | ... | ... | ... |

## What would change this
- <Input that moved the result most in the sensitivity runs, or, with no runs, the inputs most uncertain in the user's own description: exception rate, real hours, build cost.>
- Exceptions, integrations, and human review needs found in discovery can lower the reclaimable share.

## Risks and guardrails
- <each string from guardrails, if triage ran>
- <"Keep a human checkpoint" if humanReviewRequired is true>
- Capacity value becomes cash only if hours are reduced or redeployed to paid work. That is a management decision, not a tool output.

## Next step
<Based on recommendedNextStep. Example: "Measure one month of real invoice volume, exception rate, and loaded labor cost, then rerun this estimate.">

Method: figures from Soxoa's public planning tools (estimate_automation_roi, prioritize_automation_workflows), computed only from the inputs above. The tools did not access any company system or data.
```

## Style checks before sending

- No sentence promises a result ("will save", "guaranteed", "eliminates").
- Every number in the memo appears either in the Assumptions table or in a tool output.
- No vendor names or product recommendations unless the user named their own existing systems.
- One page if possible. Cut the triage table first if space is tight, but keep its guardrails.
