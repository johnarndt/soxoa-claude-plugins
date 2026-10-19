# Fit criteria patterns

Each `criterion` string is at most 240 characters and is paired, per account, with `assessment` (`match`, `mismatch`, `unknown`) and `evidence` (1 to 600 characters). A set holds at most 8 criteria.

## Good and weak criteria

| Weak | Why | Better |
|---|---|---|
| "Good-sized company" | Not testable | "200 to 2,000 employees" |
| "In our space" | Vague | "Outpatient clinic group (not hospital system)" |
| "Uses modern tools and is growing" | Two traits joined | Split into "Uses a cloud EHR" and a growth signal (growth is a signal, not a fit trait) |
| "Has budget for software" | Budget is not observable fit and must not be asserted | Drop it. Budget is never a fit criterion |
| "Decision maker is open to change" | About a person and intent | Drop it |
| "Recently raised money" | Event, not a trait | Move to `signals` with `kind: funding` and a date |

Rule of thumb: fit criteria are stable traits; signals are dated events. If it has a date, it is a signal.

## Common criterion types

| Type | Example criterion | Typical evidence |
|---|---|---|
| Size | "50 to 500 employees" | Company site, filing, job board count |
| Footprint | "5 or more locations" | Locations page |
| Industry | "Commercial HVAC contractor" | About page, industry listing |
| Region | "Operates in the United States" | Address, service area |
| Business model | "Sells B2B on annual contracts" | Pricing page |
| Current tooling | "Runs dispatch on spreadsheets or a legacy TMS" | Job posts naming tools, public case studies |
| Regulatory scope | "Subject to state intake-records rules" | Licensing or sector |
| Exclusion | "Not a franchise location" | Ownership info |

## Assessment rules

Write one line per criterion so different people assess it the same way:

- `match`: the supplied evidence states the trait directly.
- `mismatch`: the supplied evidence states the opposite or falls outside the range.
- `unknown`: nothing supplied, the evidence is ambiguous, or it is out of date. Put what is missing in `evidence` (for example "No location count supplied.").

Never mark `match` because something is "likely". Use `unknown` and list it as a gap; Intakra's fit summary reports unknowns as items that "require verification".

## How many criteria

- 3 to 5 is usually enough. More criteria means more `unknown` cells for thin accounts.
- Put hard disqualifiers first. A single `mismatch` on the only or core criterion has driven fit to 0 and the disposition to `deprioritize` in live results.
- Keep the same criteria for every account in a triage run so results compare.
