---
name: automation-roi-estimate
description: "Use when a user asks what automating a recurring task is worth, how many hours automation could free up, or how fast an automation project would pay back. Triggers include 'is it worth automating our invoice entry', 'estimate the ROI of automating this', 'how many hours would we get back', 'what is the payback on a 12k automation build', 'calculate capacity value for my team', or any request to turn people, weekly hours, and hourly cost into an illustrative capacity and payback figure with the Soxoa estimate_automation_roi tool."
---

# Automation ROI estimate

Turn the user's own workload numbers into an illustrative estimate of reclaimable hours, annual capacity value, and (only when the user gives an implementation cost) payback months, using the Soxoa MCP tool `estimate_automation_roi`.

The tool is public, read-only, deterministic, and needs no account. It calculates only from the arguments in the request. It does not inspect the user's systems, fetch data, or save inputs.

## When not to use this skill

- The user has several candidate workflows and wants to know which to do first. Use `workflow-backlog-triage` instead (it ranks 1 to 12 workflows).
- The user wants a full decision memo for a manager or owner. Use `automation-business-case`, which calls this tool as one step.
- The user has not described the work yet and needs help figuring out the numbers. Run `process-discovery-interview` first.
- The user wants a quote, a vendor price, a tax or accounting treatment, or financial advice. This tool gives none of those.

## Inputs and exact argument mapping

| Ask the user | Argument | Type and limits | Required |
|---|---|---|---|
| How many people do this work? | `people` | integer, 1 to 500 | yes |
| Hours per week each person spends on it | `weeklyHoursPerPerson` | number, 0.5 to 60 | yes |
| Loaded hourly labor cost (wages plus taxes and benefits), and the currency | `loadedHourlyCost` | number, 10 to 500, in the user's currency | yes |
| Share of that time they believe can be reclaimed | `automatableShare` | number, 0.05 to 0.95 (0.6 means 60%) | no |
| Working weeks per year | `workingWeeks` | integer, 1 to 52 | no |
| One-time implementation cost, same currency | `implementationCost` | number, 0 to 10,000,000 | no |

There are no other arguments. Do not send currency codes, workflow names, or notes to the tool.

Rules for each field are in `references/input-rules.md`. The short version:

- Required fields come from the user. If any is missing, ask for it. Never guess a headcount, an hour count, or a wage.
- If the user did not give `automatableShare` or `workingWeeks`, leave them out of the call. The server applies 0.6 and 48. Do not fill in 0.6 or 48 yourself, and never substitute 52 calendar weeks.
- If the user did give them, pass their exact values (convert "40%" to 0.4, nothing else).
- Pass `implementationCost` only when the user supplied it or approved a specific figure. Without it the tool returns `estimatedPaybackMonths: null`, which is the correct result.

## Workflow

1. Restate what the user gave you as a short list, mapped to the argument names above. Mark each missing required field.
2. Ask for every missing required field in one message. Offer the optional fields once ("If you have a view on how much of this time could be reclaimed, working weeks per year, or an implementation cost, tell me. Otherwise I will use the server defaults of 60% and 48 weeks and skip payback.").
3. Check limits before calling (see `references/input-rules.md`). If a value is out of range, tell the user and ask how they want to proceed. Do not clamp silently.
4. Call `estimate_automation_roi` once with only the supplied fields.
5. If the call returns a validation error (MCP error -32602 with a field path such as `loadedHourlyCost`), explain which field failed and why, ask the user for a corrected value, then call again. Do not loop on the same input.
6. If the call fails for a network or server reason, retry once. The tool is idempotent, so a retry with identical arguments is safe and returns the same result. If it fails again, say so and follow "If the Soxoa tools are not connected" below.
7. Present the result with the template below.

## Reading the output

| Field | Meaning |
|---|---|
| `status` | Always `illustrative_estimate`. Say so in the answer. |
| `weeklyHoursReclaimed` | people x weekly hours x automatable share |
| `annualHoursReclaimed` | weekly hours reclaimed x working weeks, rounded |
| `annualCapacityValue` | annual hours reclaimed x loaded hourly cost, in the user's currency |
| `estimatedPaybackMonths` | months for capacity value to equal `implementationCost`; `null` when no cost was sent |
| `assumptions` | the share and weeks actually applied, plus caveats. Quote these, do not paraphrase them away. |
| `recommendedNextStep` | the server's suggested validation step. Include it. |

Report the server's numbers as returned. Do not re-round them or replace them with your own arithmetic. The formula notes above are only for sanity checks; if your check disagrees with the server, report the server value and mention the difference.

## Answer template

```
Illustrative estimate (not guaranteed savings)

Inputs you gave: <people> people x <weeklyHoursPerPerson> h/week at <currency><loadedHourlyCost>/h
Assumptions applied: <each string from assumptions>

- Hours reclaimed per week: <weeklyHoursReclaimed>
- Hours reclaimed per year: <annualHoursReclaimed>
- Annual capacity value: <currency><annualCapacityValue>
- Payback: <estimatedPaybackMonths> months on <currency><implementationCost>   (or: not calculated, no implementation cost given)

What this means: capacity value is time your team gets back, not cash that leaves the budget, unless you cut hours or redeploy the time to paid work.
Next step: <recommendedNextStep>
```

Use the user's currency symbol. If the user never named a currency, write "in your currency" rather than assuming dollars.

## Guardrails

- Every figure is an illustrative planning estimate. Never call it guaranteed savings, a quote, a forecast of profit, or financial, tax, legal, or other professional advice.
- The estimate is not a substitute for process discovery. Exceptions, integrations, and human review can shrink the reclaimable share.
- Do not say the tool looked at the user's systems, data, or staff. It only did arithmetic on what the user typed.
- Do not run extra scenarios the user did not ask for. If they want a range, ask them for the alternate values (see `automation-business-case`).
- Remind the user not to share credentials or sensitive personal data; the tool needs only numbers.

## If the Soxoa tools are not connected

If `estimate_automation_roi` is not available, say so plainly and tell the user how to connect:

- Claude apps: Customize > Connectors, add a custom connector with URL `https://soxoa.com/mcp`, no authentication.
- Claude Code: `claude mcp add --transport http soxoa https://soxoa.com/mcp`

Until it is connected you may still gather and confirm the inputs. If the user asks for numbers anyway, you may show the plain arithmetic from the "Reading the output" formulas, labelled "manual arithmetic, not a Soxoa tool result", using only values the user supplied (if they gave no share or weeks, state that you are using 60% and 48 weeks because those are the tool's documented defaults). Never present manual math as a tool result.

## Worked example

User: "Four people each spend about 6 hours a week keying invoices. Loaded cost is $45 an hour. A contractor quoted $12,000."

Arguments (share and weeks omitted because the user gave none):

```json
{ "people": 4, "weeklyHoursPerPerson": 6, "loadedHourlyCost": 45, "implementationCost": 12000 }
```

Live result: `weeklyHoursReclaimed` 14.4, `annualHoursReclaimed` 691, `annualCapacityValue` 31104, `estimatedPaybackMonths` 4.6, assumptions "60% of the identified repetitive time can be reclaimed." and "48 working weeks per year." Present it as: about 14 hours a week and 691 hours a year of illustrative capacity, worth about $31,104 a year, payback about 4.6 months on $12,000, with the 60% and 48-week defaults named as server defaults and the next step quoted.

More examples (no cost, user-supplied share and weeks, a validation error, a missing input) are in `references/examples.md`.
