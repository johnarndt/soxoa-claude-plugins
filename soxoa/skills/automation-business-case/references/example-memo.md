# Example memo

Inputs from the user: 4 AP staff, 6 hours a week each on invoice entry, $45 loaded hourly cost (USD), contractor quote $12,000. The user also asked to see "only 40% automatable and an $18,000 quote". No working weeks given. Audience: business partner. Decision: approve a pilot.

Tool calls and live results:

| Call | Arguments | weeklyHoursReclaimed | annualHoursReclaimed | annualCapacityValue | estimatedPaybackMonths |
|---|---|---|---|---|---|
| Base | people 4, weeklyHoursPerPerson 6, loadedHourlyCost 45, implementationCost 12000 | 14.4 | 691 | 31104 | 4.6 |
| Cautious (user) | same, plus automatableShare 0.4, implementationCost 18000 | 9.6 | 461 | 20736 | 10.4 |

Both returned `recommendedNextStep`: "Validate the estimate against one workflow using real task volume, exception rate, and fully loaded labor cost."

---

# Automation planning memo: invoice data entry
Illustrative planning estimate, not guaranteed savings or professional advice.
Prepared for: business partner    Decision requested: approve a pilot    Date: 2026-10-18

## Recommendation
Approve a small pilot to automate invoice data entry, with a person reviewing exceptions, and measure real volume and exception rate during the first month before committing the full build.

## Assumptions
| Input | Value | Source |
|---|---|---|
| People doing the work | 4 | you supplied |
| Hours per person per week | 6 | you supplied |
| Loaded hourly cost | $45 | you supplied |
| Reclaimable share | 60% | server default (base); 40% you supplied (cautious) |
| Working weeks per year | 48 | server default |
| Implementation cost | $12,000 (base); $18,000 (cautious) | you supplied |

Tool assumption notes:
- Capacity value is not the same as guaranteed cash savings or revenue.
- A process review should validate exceptions, integrations, and human-review needs before implementation.

## Illustrative result (base case)
- Hours reclaimed: 14.4 per week, 691 per year
- Annual capacity value: $31,104 (time back, not guaranteed cash savings)
- Payback: about 4.6 months on $12,000

## Sensitivity (your alternate assumptions)
| Scenario | What changed | Hours/yr | Capacity value | Payback |
|---|---|---|---|---|
| Base | server default share 60%, $12,000 | 691 | $31,104 | 4.6 months |
| Your cautious case | share 40%, $18,000 | 461 | $20,736 | 10.4 months |

## What would change this
- The reclaimable share and the build cost together move payback from under 5 months to over 10. The real exception rate on invoices is the biggest unknown.
- If exceptions need more review than expected, the share could be lower than either case.

## Risks and guardrails
- This is financial data. Keep a person approving anything that posts to the ledger or releases a payment.
- Capacity value becomes cash only if hours are reduced or moved to other paid work. That is our decision, not a tool output.

## Next step
Track one month of real invoice volume, exception rate, and loaded labor cost, then rerun this estimate with those numbers.

Method: figures from Soxoa's public planning tools, computed only from the inputs above. The tools did not access any company system or data.
