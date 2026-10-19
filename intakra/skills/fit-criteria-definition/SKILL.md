---
name: fit-criteria-definition
description: Use when a B2B seller wants to define or tighten their ideal-customer profile and a reusable set of account fit criteria before scoring accounts with Intakra. Triggers include "define my ICP", "what fit criteria should I use", "help me describe who we sell to", "set up criteria for scoring accounts", "turn our best customers into fit rules", or when a user wants to score accounts but has no clear offer description or fit criteria yet.
---

# Intakra fit-criteria definition

Help the user write the three inputs that every Intakra score depends on and that stay the same across accounts: `vendor.offer`, `vendor.idealCustomerProfile`, and a set of up to 8 fit criteria (the `criterion` strings in `fitCriteria`). Clear, testable criteria make scores comparable across a list and make `unknown` assessments meaningful.

## When to use, when not to

Use it when the user is starting out, their ICP is vague ("mid-market companies that need us"), or scores across accounts look inconsistent because criteria keep changing.

Do not use it to:
- Score an account. When the criteria are ready, hand off to `buying-signal-scoring` or `account-list-triage`.
- Research markets, size a TAM, or find accounts. Work only from what the user tells you about their offer and customers.
- Write positioning, messaging, taglines, or outreach. This plugin does not produce messaging of any kind.

## Inputs to gather

Ask, in plain questions:
1. What do you sell, in one or two sentences? (becomes `vendor.offer`, max 1000 chars)
2. Who gets the most value from it: industry, size, region, business model? (becomes `vendor.idealCustomerProfile`, max 1000 chars)
3. Think of two or three of your best customers (no confidential details needed). What do they have in common?
4. What disqualifies an account: too small, wrong region, a system you cannot work with, a regulated sector you avoid?
5. What has to be true about their current setup for your offer to matter (a tool they use, a process they run manually)?

Do not invent answers. If the user cannot answer one, leave that trait out or mark it as a hypothesis to test.

## Workflow

1. **Write `vendor.offer`.** Plain language: what it is and what it replaces or improves. No superlatives. Keep it under 1000 characters; 1 to 2 sentences is best.
2. **Write `vendor.idealCustomerProfile`.** Who, how big, where, and the operating condition that makes the offer relevant. Under 1000 characters.
3. **Write candidate criteria**, then cut to the strongest 8 or fewer. Each must be:
   - One trait, not two joined with "and".
   - Checkable from public or user-held business facts (headcount, locations, industry, region, stated tooling).
   - Phrased so `match` and `mismatch` are both possible: "50 to 500 power units", not "Good-sized fleet".
   - At most 240 characters.
4. **Add an assessment rule to each criterion** so the user (or you, later) can map evidence to `match`, `mismatch`, or `unknown` the same way every time. See `references/criteria-patterns.md`.
5. **Order criteria** with disqualifiers and the trait closest to the offer first. A `mismatch` on a core criterion can drive the fit score to 0 and the disposition to `deprioritize`, so only include hard requirements as criteria you would actually walk away over; put nice-to-haves later or leave them out.
6. **Show the final set** using the template and ask the user to confirm. Offer to apply it to an account with `buying-signal-scoring` or to a list with `account-list-triage`. Do not call a tool unless the user asks.

## Output template

```
vendor.offer:
<text>

vendor.idealCustomerProfile:
<text>

Fit criteria (<n>/8)
| # | criterion | match when | mismatch when | unknown when |

Hypotheses not yet used as criteria
- <trait>: why it is unconfirmed

Next: score an account or a short list with these criteria.
```

Also give the criteria as a JSON skeleton the user can reuse, with `assessment` and `evidence` left for each account:

```json
[
  { "criterion": "<trait 1>", "assessment": "unknown", "evidence": "Not supplied." }
]
```

## Guardrails

- Criteria describe businesses, not people. No personal traits, demographics, or protected characteristics.
- Do not include confidential customer names or deal data in the ICP text; the account name field and evidence fields are sent to Intakra when scoring.
- Do not turn the ICP into marketing copy or messaging.
- Make clear the criteria are the user's own hypotheses. Intakra applies them as supplied and does not validate them.

## If the Intakra server is not connected

This skill does not need the server. Complete the workflow and give the user the text and JSON. When they want to score accounts, tell them to connect Intakra: in Claude, Customize > Connectors and add `https://intakra.com/mcp` (no sign-in); in Claude Code, `claude mcp add --transport http intakra https://intakra.com/mcp`.

## Worked example

User: "We sell route-planning software for trucking companies. Our best customers are regional carriers in the Midwest with 100 to 300 trucks that were dispatching on spreadsheets. We cannot work with fleets under 50 trucks, and we do not support intermodal."

Result:

- `vendor.offer`: "Route-planning software for regional trucking fleets with 50 to 500 trucks. Replaces spreadsheet or legacy dispatch planning."
- `vendor.idealCustomerProfile`: "US regional freight carriers, 50 to 500 power units, running dispatch on spreadsheets or a legacy TMS. Not intermodal."

| # | criterion | match when | mismatch when | unknown when |
|---|---|---|---|---|
| 1 | Fleet size 50 to 500 power units | Stated count in range | Under 50 or over 500 | No count supplied |
| 2 | Regional over-the-road freight carrier, not intermodal | Describes regional trucking | Intermodal or rail-led | Business model unclear |
| 3 | Dispatch on spreadsheets or a legacy TMS | Evidence of manual or legacy dispatch | Uses a modern routing platform | Tooling not supplied |
| 4 | Operates in the United States | US operations stated | Non-US only | Region unclear |

Hypothesis not used: "Midwest" (best customers are there, but the user did not say other regions fail).

Then: "Want to score an account against these?"
