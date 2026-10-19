---
name: verification-follow-up
description: Use when the user needs to decide what to do after an Ocolta Deep Review, for example "what should I verify with the bank", "how do I follow up on this flagged paystub", "write a checklist for my underwriter", "draft a message asking the applicant for the original statement", "how do I confirm employment without accusing anyone", "the review was high priority, now what", or "the review was inconclusive, what next". Builds a fair, non-accusatory follow-up checklist for a human reviewer, covering what to confirm with the issuing bank, employer or payroll provider, how to source contact details independently, and a neutral request to the applicant. Can read the review summary first; works without it.
---

# Plan document-verification follow-up

This skill turns an Ocolta review result into concrete next steps for the human reviewer: what to re-check, what to ask the applicant for, and what to confirm with the institution that issued the document. Ocolta's own position is that file review is triage and the last question (where a document came from) is answered at the source, not in the file. The checklist follows that order.

It never decides whether to approve or deny, never characterizes the applicant, and never asks for anyone's banking or payroll login.

## When not to use this skill

- The user only wants the review explained: use `explain-review-summary`.
- The user wants Claude to contact the bank, employer or applicant. Claude drafts; the user sends, using their own channels and authorization.
- The user wants a legal opinion on fair housing, credit or consumer-reporting rules. Say those rules apply and that their counsel or policy owner decides; do not give legal advice.

## If the Ocolta tools are not available

This skill works without the connection. Ask the user what the review reported (or what they observed), the document type, and the decision it supports, then build the checklist. Say the checklist is based on what they told you, not on a live Ocolta read. To connect Ocolta: Customize > Connectors in Claude apps, or `claude mcp add --transport http ocolta https://app.ocolta.com/mcp` in Claude Code.

## Inputs to gather

| Need | Source | Rules |
| --- | --- | --- |
| The review result | `get_review_summary` with `{ "review_id": "<exact id>" }`, or the user's description | Optional. Use `find-recoverable-reviews` to get an exact ID. Summaries are recoverable for 24 hours after completion. |
| Document type | Ask | Bank statement, paystub, employment or income letter, or other. Ocolta's supported workflows today are bank statements and paystubs. |
| Decision it supports | Ask | For example a rental application or a loan file. Shapes which facts are material. |
| What the user already holds | Ask | Other periods, other documents, an authorization form. |
| Their policy constraints | Ask | Whether written authorization is required to contact employers or banks, deadlines, who signs off. |

Never ask the user to paste the document, account numbers, Social Security numbers or other personal data into the chat. The checklist does not need them.

## Workflow

1. If a review ID is available, call `get_review_summary` and note `reviewPriority`, `confidence`, both assessments and `limitationCount`. Read the values with `explain-review-summary` rules.
2. Pick the path:
   - `high` or `moderate` priority, or `indicators_present`: full checklist (all four steps below).
   - `unable_to_determine` status or assessments, or `limitationCount` above 0: start with a better copy (step 2 below), then continue.
   - `low` priority with `no_supported_indicators`: short checklist; normal policy checks and any source verification the decision requires.
   - `refused`: the review gives nothing to act on; use the normal policy checklist.
3. Build the checklist from the four steps, choosing document-specific items from `references/follow-up-by-document.md`.
4. If the user wants it, draft the applicant request and the institution confirmation script from the same reference. Keep them neutral.
5. End with the record-keeping line and the disclaimer.

### The four steps

1. **Re-check the finding.** Open the full Ocolta report in the purchasing browser, find each indicator, and compare it with the file. Recompute any math yourself. Consider ordinary explanations (scanner, portal, e-signature service, merged pages, mid-year raise, payroll service name on deposits).
2. **Get a better copy, not another copy.** Ask for the original download from the institution's portal, untouched (not printed, scanned, screenshotted or re-saved), or an adjacent period that lets you test continuity.
3. **Verify at the source.** Confirm material facts with the bank, employer or payroll provider, under the authorization your policy requires, using contact details you found independently (published main line, registry, directory), never contact details printed on the document in question. A consumer-permissioned data connection the applicant authorizes is a strong alternative.
4. **Document and decide by policy.** Record what was observed, what was asked, who was contacted, how they were found, when, and exactly what they confirmed. Apply the same policy to every applicant.

## Output template

```
Follow-up for <document type> (<review_id or "described by you">)
Why: <one line from the review result, e.g. "high priority, 2 fraud-risk indicators, medium confidence">

1. Re-check
   - [ ] <specific re-check items>
2. Better copy
   - [ ] <what to request, from the reference>
3. Verify at the source
   - [ ] <who to contact, how to find them, what to confirm>
4. Record
   - [ ] <what to write down>

Do not: ask for login credentials or one-time codes, use contact details from the document, or tell the applicant what you suspect.
Ocolta results are signals for human follow-up, not proof of fraud, authenticity, intent, identity, account ownership or AI generation, and not a basis on their own for approval or denial.
```

## Guardrails

- No accusations. Never write "fake", "forged", "fraudulent" or "lying" about the applicant or document, in the checklist or in any draft message.
- No adverse-action advice. Do not recommend denying, approving or reporting anyone. Ocolta is not a consumer reporting agency and its output is not a consumer report.
- Never ask for, or suggest asking for, online banking or payroll usernames, passwords, one-time codes or a screen-share of a logged-in session.
- Independent contact details only. A fabricated document can supply a fabricated verifier.
- Difficulty getting a document is not a signal (statement history limits, app-only accounts, shared devices). Say so if the user reads delay as guilt.
- Consistency: the same checks for every applicant at the same decision point.

## Worked example

User: "Ocolta flagged this applicant's bank statement as high priority. What do I do now?"

1. `list_recent_reviews` with `{}`, then `get_review_summary` with `{ "review_id": "ent_9a1b2c3d4e5f60718293a4b5c6d7e8f9" }` returns `high` priority, `medium` confidence, `fraudAssessment: "indicators_present"`, `fraudIndicatorCount: 2`, `aiGenerationAssessment: "unable_to_determine"`, `limitationCount: 1`.
2. Reply:

```
Follow-up for bank statement (ent_9a1b2c3d4e5f60718293a4b5c6d7e8f9)
Why: high priority, 2 fraud-risk indicators, medium confidence, 1 limitation

1. Re-check
   - [ ] Open the full report in your purchasing browser and locate both indicators on the statement
   - [ ] Recompute opening balance + deposits - withdrawals = closing balance yourself
   - [ ] Check whether the file came through a portal, scanner or e-signature tool that rewrites metadata
2. Better copy
   - [ ] Ask for the same statement as downloaded from the bank's website or app, sent untouched
   - [ ] Ask for the month before or after to test that balances carry forward
3. Verify at the source
   - [ ] If still unresolved, offer a consumer-permissioned bank data connection the applicant authorizes
   - [ ] Or confirm with the bank under the applicant's written authorization, using the bank's published number
4. Record
   - [ ] Note each observation in narrow factual terms, what you requested, and every confirmation

Do not: ask for login credentials or one-time codes, use contact details from the document, or tell the applicant what you suspect.
Ocolta results are signals for human follow-up, not proof of fraud, authenticity, intent, identity, account ownership or AI generation, and not a basis on their own for approval or denial.
```

Then offer the neutral applicant request from `references/follow-up-by-document.md`.
