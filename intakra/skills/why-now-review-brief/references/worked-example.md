# Worked example: why-now brief for a reviewer

All names and links are fictional. The result is the real shape returned by the live tool for this input.

## User request

"My sales lead wants a quick case on Example Freight Co before I spend time on it. We sell route-planning software for regional fleets of 50 to 500 trucks that still dispatch on spreadsheets or an old TMS. They have about 180 trucks across Ohio, Indiana and Michigan. New VP of Operations announced Sept 22 (https://example.com/news/new-vp-ops). There is also a dispatch analyst job post mentioning route optimization, date unknown."

## Tool call

`prepare_why_now_review`

```json
{
  "account": { "name": "Example Freight Co" },
  "vendor": {
    "offer": "Route-planning software for regional trucking fleets with 50 to 500 trucks.",
    "idealCustomerProfile": "US regional freight carriers, 50 to 500 power units, running dispatch on spreadsheets or a legacy TMS."
  },
  "fitCriteria": [
    { "criterion": "Fleet size 50 to 500 power units", "assessment": "match", "evidence": "Company site lists about 180 trucks." },
    { "criterion": "US regional freight carrier", "assessment": "match", "evidence": "Operates in Ohio, Indiana and Michigan per its About page." },
    { "criterion": "Dispatch on spreadsheets or legacy TMS", "assessment": "unknown", "evidence": "No information supplied about current dispatch tooling." }
  ],
  "signals": [
    {
      "kind": "leadership_change",
      "evidence": "Press release announced a new VP of Operations.",
      "observedAt": "2026-09-22",
      "sourceUrl": "https://example.com/news/new-vp-ops",
      "relevanceToOffer": "A new operations leader may review dispatch and routing tools in the first months.",
      "confidence": "high"
    },
    {
      "kind": "hiring",
      "evidence": "Job post for a dispatch analyst mentions route optimization.",
      "relevanceToOffer": "May indicate interest in improving routing; the posting date is unknown.",
      "confidence": "medium"
    }
  ],
  "asOfDate": "2026-10-18"
}
```

## Result (abridged)

```json
{
  "status": "draft",
  "requiresHumanReview": true,
  "headline": "Caller-supplied why-now evidence review",
  "disposition": "verify",
  "whyNow": "The caller reports this unverified leadership change signal: \"Press release announced a new VP of Operations.\". It may justify a closer fit review for the supplied offer, but Intakra has not opened the source or established budget, authority, or buying intent.",
  "fitGuidance": "... Priority 48/100 is a triage aid, not a purchase-probability prediction.",
  "supportedFacts": [
    { "signalNumber": 1, "claim": "Caller supplied: Press release announced a new VP of Operations.", "sourceUrl": "https://example.com/news/new-vp-ops", "observedAt": "2026-09-22", "verificationStatus": "caller_supplied_unverified" },
    { "signalNumber": 2, "claim": "Caller supplied: Job post for a dispatch analyst mentions route optimization.", "sourceUrl": null, "observedAt": null, "verificationStatus": "caller_supplied_unverified" }
  ],
  "evidenceGaps": ["Verify the source for signal 2.", "Verify the date for signal 2.", "Verify fit assessments against current source material."],
  "questionsForReviewer": [
    "Does each source actually support the stated business event and date?",
    "Is the link to the vendor offer account-specific rather than a generic growth claim?",
    "What fit criterion is still unknown or contradicted?",
    "Can the review proceed without asserting budget, authority, or intent that the evidence does not establish?"
  ],
  "prohibitedActions": [
    "Do not treat the score as verified buyer intent or purchase probability.",
    "Do not claim budget or decision authority without direct evidence.",
    "Do not send outreach or update a CRM from this public tool.",
    "Do not include personal, confidential, credentialed, or private workspace data."
  ],
  "sourceVerificationPerformed": false
}
```

## Brief to show the user

**Why-now review: Example Freight Co**
Status: unverified, for human review · Disposition: verify · As of 2026-10-18

Why now (as supplied): a new VP of Operations was announced on 2026-09-22. That may justify a closer fit review. Intakra has not opened the source or established budget, authority, or buying intent.

Fit: 2 criteria match, 1 is unknown (current dispatch tooling). Priority 48/100 is a triage aid, not a purchase prediction.

| # | Claim (caller-supplied) | Date | Source |
|---|---|---|---|
| 1 | New VP of Operations announced | 2026-09-22 | example.com/news/new-vp-ops |
| 2 | Dispatch analyst post mentions route optimization | missing | missing |

Close these gaps first: date and link for the job post; confirm current dispatch tooling, since it is the trait closest to the offer.

Questions for the reviewer: (list all four from the tool).

Do not: (list all four from the tool).

Stop there. Do not add an email, opener, or talking points.
