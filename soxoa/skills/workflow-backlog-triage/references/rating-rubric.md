# Rating rubric for prioritize_automation_workflows

Share this with the user when they are unsure how to rate a workflow. The user picks the rating. These descriptions are guidance for the user's own judgment, not rules the server publishes.

## predictability (inputs and steps)

| Rating | Looks like |
|---|---|
| high | Same input format and same steps almost every time. Exceptions are rare and obvious. Example: a weekly report pulled from the same two sources. |
| medium | Mostly standard, with regular exceptions someone handles by habit. Example: invoices from known vendors, but 1 in 5 has a missing PO. |
| low | Inputs or steps change case by case. Free-form requests, phone calls, or many one-off formats. |

Helpful question: "If you handed this to a new hire with a one-page checklist, how often would they get stuck?"

## judgmentRequired

| Rating | Looks like |
|---|---|
| low | Decisions follow written rules (if amount is under X, approve; copy field A to field B). |
| medium | A trained person decides using guidelines, and most cases are routine. |
| high | Expertise, negotiation, policy interpretation, approvals, or exceptions that need a manager. |

## errorCost

| Rating | Looks like |
|---|---|
| low | Mistakes are internal, easy to spot, and quick to fix. |
| medium | Rework, a delayed task, or an annoyed customer. |
| high | Money moves wrongly, a customer or patient is harmed, a legal, safety, or regulatory line is crossed, or it is hard to undo. |

## dataSensitivity

| Rating | Looks like |
|---|---|
| low | Public or non-confidential internal data. |
| medium | Customer contact details, order history, internal pricing or financial summaries. |
| high | Health, payment card, bank, government ID, HR, legal, or other regulated or confidential records. |

When unsure between two ratings, ask the user to choose the higher one for error cost and data sensitivity. That only makes the tool more cautious.

## systemsCount (integer 1 to 20)

Count every distinct place the work reads from or writes to: each app, shared inbox, spreadsheet, portal, or paper form. Example: "Read the PDF in the AP inbox, type it into the accounting system" is 2. Ask the user to list them; do not guess.

## weeklyHours (number 0.25 to 500)

Total team hours per week on this workflow, all people combined. Fifteen minutes a week is the minimum (0.25). If the user only knows a monthly figure, show your conversion and confirm it.
