---
name: explain-review-summary
description: Use when the user wants an Ocolta Deep Review result read or explained, for example "what did Ocolta find on this bank statement", "explain this review summary", "is this paystub high priority", "what does medium confidence mean", "how many fraud indicators were there", "was it flagged as AI generated", "summarize my latest review for my manager", or "is this review inconclusive". Reads one recoverable review's categorical status, priority, confidence, fraud and AI-generation assessments and counts, then explains what each means and what it does not prove, for a human reviewer. Read-only; no credit is spent.
---

# Read and explain an Ocolta review summary

This skill calls `get_review_summary` for one recoverable Deep Review and explains the result in plain language for the person who has to decide what to do next: a leasing manager, an underwriter, a small landlord. The summary is categorical (labels and counts). It contains no document text, applicant details or indicator descriptions.

Every explanation must keep one idea intact: these are signals that tell a human where to look, not findings about a person.

## When not to use this skill

- The user does not have a review ID yet: run `find-recoverable-reviews` first.
- The user wants the specific indicators, page locations or explanations: those are only in the full report in the Ocolta workspace (the purchasing browser, within 24 hours) or in the JSON report they downloaded. The connection does not return them.
- The user wants to know what to do next with the applicant or institution: use `verification-follow-up` after this skill.
- The user asks Claude to decide whether a document is fake, whether to approve or deny, or whether someone committed fraud. Explain that the summary cannot answer that and offer the follow-up checklist instead.

## If the Ocolta tools are not available

Say the Ocolta connection is not active and explain how to add it (Claude apps: Customize > Connectors, add Ocolta, approve in the purchasing browser; Claude Code: `claude mcp add --transport http ocolta https://app.ocolta.com/mcp`, then `/mcp`).

If the user pastes values from a downloaded Ocolta report, you can explain those values with the same rules, and say the explanation is based on what they pasted, not on a live read.

## Inputs to gather

| Need | Tool argument | Rules |
| --- | --- | --- |
| Which review | `get_review_summary.review_id` | Required, the only argument. Must match `^ent_[a-f0-9]{32}(?:c[0-9]{2,3})?$`, exactly as returned by `list_recent_reviews`. |

If the user says "the latest one" or gives no ID, call `list_recent_reviews` with `{}` and use the first `review_id` (most recent). If they describe a review by applicant or file name, explain that the connection returns no names, list the available IDs, and ask which one. Never construct or edit an ID.

## Workflow

1. Resolve the `review_id` (above).
2. Optionally call `get_connected_purchase` with `{}` once per conversation, so you know whether `synthetic` is true.
3. Call `get_review_summary` with `{ "review_id": "<id>" }`.
4. Handle errors:
   - "Use the exact review ID from your recoverable reviews." The ID was malformed. Re-list and use an exact ID.
   - "That review is unavailable to this connection or its recovery period has expired." It is older than 24 hours, belongs to another purchase, or never completed. Say so; do not retry.
   - Authorization or permission error: ask the user to reconnect and approve all permissions, including reading summaries.
   - "Connection request limit reached. Try again in a minute." Pause, then continue only if the user wants.
5. Explain the result with the template, using `references/summary-fields.md` for each value and the combined readings.
6. Offer `verification-follow-up` when `reviewPriority` is `moderate` or `high`, or when `status` or any assessment is `unable_to_determine`.

## Reading the output

Fields from `get_review_summary` (all always present):

- `status`: `completed`, `unable_to_determine` or `refused`.
- `reviewPriority`: `low`, `moderate`, `high` or `unable_to_determine`.
- `confidence`: `low`, `medium`, `high` or `unable_to_determine`.
- `fraudAssessment` and `aiGenerationAssessment`: `no_supported_indicators`, `indicators_present` or `unable_to_determine`.
- `fraudIndicatorCount`, `aiGenerationIndicatorCount`, `limitationCount`: whole numbers, 0 or more.
- `disclaimer`: a fixed sentence. Quote it verbatim at the end of every explanation.

What each value means, and does not mean, is in `references/summary-fields.md`. Read it before explaining a result you have not explained before in this conversation.

## Output template

```
Ocolta review <review_id><" (synthetic test data)" if synthetic>
Status: <status in words>
Review priority: <priority>. <one line on what it means for workload>
Confidence: <confidence>. <one line: how well supported the review's own observations are>
Fraud-risk signals: <assessment in words>, <fraudIndicatorCount> indicator(s)
AI-generation signals: <assessment in words>, <aiGenerationIndicatorCount> indicator(s)
Limitations noted: <limitationCount>

What this means: <2 to 4 plain sentences combining the values, from the reference>
What it does not tell you: <1 to 2 sentences: no proof either way; details are in the full report>
Next step: <one concrete step, usually: open the full report in the workspace, then verify at the source>

"<disclaimer, verbatim>"
```

For several reviews, use a compact table (ID, status, priority, confidence, fraud signals, AI signals, limitations), then one "What this means" line per review that is not low priority, then the disclaimer once.

## Guardrails

- Never say or imply a document is fake, forged, altered, genuine, verified, safe or AI-generated. Say "the review reported N fraud-risk indicators", not "the document has fraud".
- `no_supported_indicators` is not a clean bill of health. Clean results do not prove authenticity.
- Confidence is about the review's support for its own observations, not the probability of fraud. Never convert it to a percentage.
- Do not invent what the indicators were. The connection returns counts only.
- Do not recommend approval, denial or any adverse action. Ocolta is decision support, not a consumer report or eligibility decision.
- Do not ask the user to paste the applicant's document or personal data into the chat to "check it".
- Keep the disclaimer intact and unedited.

## Worked example

User: "Explain my latest Ocolta review for the leasing team."

1. `list_recent_reviews` with `{}` returns `{ "reviews": [ { "review_id": "ent_9a1b2c3d4e5f60718293a4b5c6d7e8f9" } ], "recoveryWindow": "24 hours after completion" }`.
2. `get_review_summary` with `{ "review_id": "ent_9a1b2c3d4e5f60718293a4b5c6d7e8f9" }` returns:
   `{ "status": "completed", "reviewPriority": "high", "confidence": "medium", "fraudAssessment": "indicators_present", "aiGenerationAssessment": "unable_to_determine", "fraudIndicatorCount": 2, "aiGenerationIndicatorCount": 0, "limitationCount": 1, "disclaimer": "This review identifies document-level signals for human follow-up. It does not prove fraud, authenticity, intent, identity, account ownership, or AI generation." }`
3. Reply:

```
Ocolta review ent_9a1b2c3d4e5f60718293a4b5c6d7e8f9
Status: completed
Review priority: high. Put this file at the front of the human-review queue.
Confidence: medium. The review's observations are reasonably supported, but not strongly.
Fraud-risk signals: indicators present, 2 indicators
AI-generation signals: could not be determined, 0 indicators
Limitations noted: 1

What this means: The review found two things about this document that a person should look at before relying on it, and it was moderately sure of what it saw. It could not say anything either way about AI generation. It also noted one limit on what it could check, so part of the document may not have been fully assessed.
What it does not tell you: Whether the document is genuine or not, or anything about the applicant. The two indicators, where they are, and their possible ordinary explanations are in the full report in the Ocolta workspace.
Next step: Open the full report in the purchasing browser (it is recoverable for 24 hours after completion), check each indicator against the file, then verify the key figures with the bank. I can draft that checklist.

"This review identifies document-level signals for human follow-up. It does not prove fraud, authenticity, intent, identity, account ownership, or AI generation."
```
