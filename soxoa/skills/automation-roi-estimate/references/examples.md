# Worked examples for estimate_automation_roi

Outputs below are real responses from the live tool for these inputs.

## Example 1: required fields plus a cost, defaults for the rest

User: "Four people on our AP team each spend about 6 hours a week keying invoices into the accounting system. Loaded cost is about $45 an hour. A contractor quoted $12,000 to automate it. Worth it?"

Arguments (no share, no weeks, because the user gave none):

```json
{
  "people": 4,
  "weeklyHoursPerPerson": 6,
  "loadedHourlyCost": 45,
  "implementationCost": 12000
}
```

Result:

```json
{
  "status": "illustrative_estimate",
  "weeklyHoursReclaimed": 14.4,
  "annualHoursReclaimed": 691,
  "annualCapacityValue": 31104,
  "estimatedPaybackMonths": 4.6,
  "assumptions": [
    "60% of the identified repetitive time can be reclaimed.",
    "48 working weeks per year.",
    "Capacity value is not the same as guaranteed cash savings or revenue.",
    "A process review should validate exceptions, integrations, and human-review needs before implementation."
  ],
  "recommendedNextStep": "Validate the estimate against one workflow using real task volume, exception rate, and fully loaded labor cost."
}
```

Presentation:

> **Illustrative estimate (not guaranteed savings)**
>
> Inputs you gave: 4 people x 6 h/week at $45/h, $12,000 implementation cost.
> Assumptions applied: 60% of the repetitive time can be reclaimed (server default, since you did not give one); 48 working weeks per year (server default).
>
> - Hours reclaimed per week: 14.4
> - Hours reclaimed per year: 691
> - Annual capacity value: $31,104
> - Payback: about 4.6 months on $12,000
>
> Capacity value is time back, not guaranteed cash savings. The 60% share is the biggest unknown; if your invoices have many exceptions (missing PO numbers, odd formats), the real share could be lower.
> Next step: validate the estimate against one workflow using real task volume, exception rate, and fully loaded labor cost.

## Example 2: no implementation cost

Same inputs without `implementationCost`. The result is identical except `"estimatedPaybackMonths": null`. Present payback as "Not calculated: no implementation cost given. If you get a quote, I can add it." Do not estimate a cost yourself.

## Example 3: user-supplied share and weeks

User: "Same team, but I think only 40% is automatable, and we work 46 weeks a year."

```json
{
  "people": 4,
  "weeklyHoursPerPerson": 6,
  "loadedHourlyCost": 45,
  "automatableShare": 0.4,
  "workingWeeks": 46
}
```

Returns `weeklyHoursReclaimed` 9.6, `annualHoursReclaimed` 442, `annualCapacityValue` 19872, and assumptions "40% of the identified repetitive time can be reclaimed." and "46 working weeks per year." Present those exact assumption strings.

## Example 4: validation error

User: "Two people, 5 hours a week, they earn $8 an hour."

Calling with `loadedHourlyCost: 8` returns a validation error similar to:

```
MCP error -32602: Too small: expected number to be >=10 at loadedHourlyCost
```

Response: "The estimator accepts a loaded hourly cost between 10 and 500. $8 is a base wage; with payroll taxes and overhead your loaded cost may be higher. What loaded hourly figure would you like to use?" Do not pick 10 for them.

## Example 5: missing required input

User: "What would automating our scheduling save? Three coordinators do it."

Missing: `weeklyHoursPerPerson` and `loadedHourlyCost`. Ask: "How many hours a week does each coordinator spend on scheduling, and what is their loaded hourly cost (wages plus taxes and benefits)? If you also have a view on how much of that time could be automated, or a build cost, include it." Do not call the tool until both required values arrive.
