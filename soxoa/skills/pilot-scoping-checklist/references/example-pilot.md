# Example pilot plan

## User request

"The triage said start with invoice data entry. How do we pilot it? Our AP lead Dana owns it. We get PDFs in the AP inbox and key them into the accounting system. About 40 a week. No idea on the exception rate."

## Posture check (only if not already run, and with the user's okay)

The ratings, hours, and system count below are the ones the user confirmed for the earlier triage. In a new conversation, ask for them first.

```json
{
  "workflows": [
    { "name": "Invoice data entry from emailed PDFs", "weeklyHours": 10, "predictability": "high", "judgmentRequired": "low", "errorCost": "medium", "dataSensitivity": "medium", "systemsCount": 2 }
  ]
}
```

Live result: `score` 77, `recommendation` `automate`, `humanReviewRequired` false, rationale "10 team hours per week are in scope.", "high input and output predictability.", "low human judgment requirement.", "2 systems involved.", and the four standard guardrails.

## Presented plan

> **Pilot plan: invoice data entry from emailed PDFs**  Shape: shadow, then live with spot checks
> Posture from tool: automate, human review not required by the tool. Because this is financial data, the plan still keeps a person approving anything that posts.
>
> 1. **Baseline to measure first (2 weeks):** invoices per week (you estimate about 40), minutes per invoice, exception rate and top three exception types (unknown today), current error rate.
> 2. **Scope:** in: PDF invoices from existing vendors arriving in the AP inbox, through to a draft bill in the accounting system. Out: new vendors, credit memos, anything without a PO, payment release.
> 3. **Data and access:** read access to the AP inbox, permission to create draft bills only. No access to bank details or payment runs. IT review because vendor and amount data is medium sensitivity.
> 4. **Human checkpoints:** Dana or a named backup approves every draft bill during shadow mode, then a daily spot check of 1 in 5 once live.
> 5. **Success criteria:** set by Dana after the baseline. Suggested metrics: minutes per invoice, share of drafts posted without correction, error rate not higher than baseline.
> 6. **Rollback:** manual keying stays documented; Dana can switch the automation off and the team resumes the same day. Drafts in progress are finished by hand.
> 7. **Timeline and owner:** Dana owns it. Length and check-in dates: your call (4 to 8 weeks is common).
>
> **Build approach:** first check whether the accounting system's own inbox or bill-capture features cover this. Otherwise a document extraction step plus a workflow automation platform, or a short script, with a draft-and-review step.
>
> **Open questions:** exception rate (Dana, during baseline); who maintains it after the pilot (you); whether IT needs a formal review (IT lead).
>
> **Guardrails from the tool:** treat the score as a discovery aid, not a promise of savings or feasibility; confirm data access, exception paths, security requirements, and ownership before building; do not fully automate regulated, safety-critical, financial, medical, or legal judgment; pilot with a reversible workflow and measurable baseline.
