# Pilot checklist

Fill each item from the user's facts. Anything unknown becomes an open question with an owner.

## A. Baseline (measure before building)

- [ ] Items per week (invoices, requests, reports) for at least two typical weeks.
- [ ] Average handling time per item, timed by the people who do it.
- [ ] Exception rate: share of items that need extra handling, and the top three exception types.
- [ ] Error rate today and how errors are found.
- [ ] Turnaround time from trigger to done.
- [ ] Loaded hourly cost the user wants to use (for any later ROI rerun).

## B. Scope

- [ ] One trigger and one outcome. Example: "PDF invoice arrives in the AP inbox" to "draft bill created in the accounting system".
- [ ] In scope: the common case the baseline shows is most frequent.
- [ ] Out of scope for the pilot: named exception types, edge cases, any step involving approvals of money, contracts, or personnel.
- [ ] Volume cap for the pilot (for example one vendor group, one location, or one shift).

## C. Data and access

- [ ] Every system touched, with who can grant access.
- [ ] Least-privilege access: read only where possible; write only to the target field or record.
- [ ] Sensitive fields that must be excluded or masked.
- [ ] Where outputs and logs are stored and for how long.
- [ ] Security or IT review if `dataSensitivity` is medium or high.

## D. Human checkpoints

- [ ] Named reviewer for each checkpoint and a backup.
- [ ] What the reviewer sees (side-by-side input and output) and how they approve or correct.
- [ ] Mandatory review for every item when the tool returned `humanReviewRequired: true`, or `errorCost` or `dataSensitivity` is high.
- [ ] How corrections are captured so the rules can improve.

## E. Build approach (vendor-neutral)

- [ ] Prefer what the user already owns: built-in rules or automation in their existing systems.
- [ ] Otherwise a category, not a brand: workflow automation platform, document extraction, a short script, or an AI drafting step with review.
- [ ] Who builds it (in-house person or outside builder), and who maintains it after the pilot.

## F. Success criteria (user sets the targets)

- [ ] Time per item versus baseline.
- [ ] Share of items handled without manual rework.
- [ ] Error rate versus baseline (must not rise).
- [ ] Reviewer effort per item.
- [ ] Staff feedback from the people who did the work manually.

## G. Rollback and safety

- [ ] Manual process documented and still runnable the same day.
- [ ] Kill switch: who can turn it off, and how.
- [ ] Shadow mode period length, if the shape is shadow then live.
- [ ] What happens to in-flight items when switched off.

## H. Timeline and decision

- [ ] Pilot length (the user's choice; 4 to 8 weeks is common for one workflow).
- [ ] Check-in dates and who attends.
- [ ] Decision at the end: expand, adjust, or stop, and who decides.
- [ ] Rerun `estimate_automation_roi` with measured volume and exception data if the user wants an updated illustrative value.
