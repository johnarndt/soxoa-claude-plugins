# Worked example: scoring one account

All names and links are fictional. The output shown is the real shape returned by the live tool for this input.

## User request

"Score Example Clinic Group for me. We sell patient intake automation to US outpatient clinic groups with 5 or more locations. They have 6 locations. They raised a Series A in March 2024 (https://example.com/series-a). A state rule on intake records took effect Aug 1, 2026 (https://example.com/rule)."

## Tool call

`score_buying_signal_evidence`

```json
{
  "account": { "name": "Example Clinic Group" },
  "vendor": {
    "offer": "Patient intake automation for multi-site clinics.",
    "idealCustomerProfile": "US outpatient clinic groups with 5 or more locations."
  },
  "fitCriteria": [
    { "criterion": "5 or more locations", "assessment": "match", "evidence": "Site lists 6 locations." }
  ],
  "signals": [
    {
      "kind": "funding",
      "evidence": "Raised a Series A.",
      "observedAt": "2024-03-01",
      "sourceUrl": "https://example.com/series-a",
      "relevanceToOffer": "New funding may support operational tooling upgrades.",
      "confidence": "high"
    },
    {
      "kind": "regulatory_event",
      "evidence": "State rule on intake records takes effect.",
      "observedAt": "2026-08-01",
      "sourceUrl": "https://example.com/rule",
      "relevanceToOffer": "The rule could prompt a review of intake forms.",
      "confidence": "medium"
    }
  ],
  "asOfDate": "2026-10-18"
}
```

Note: the user said "March 2024" with no day. Ask before choosing a day. Here the user confirmed March 1.

## Result (abridged)

```json
{
  "status": "draft",
  "requiresHumanReview": true,
  "disposition": "verify",
  "scores": { "fit": 75, "timing": 25, "evidenceQuality": 95, "priority": 62 },
  "fit": { "matches": 1, "mismatches": 0, "unknowns": 0 },
  "evidence": [
    { "signalNumber": 1, "status": "admissible", "contribution": 0.045, "flags": [] },
    { "signalNumber": 2, "status": "admissible", "contribution": 0.448, "flags": [] }
  ],
  "admissibleSignalCount": 2,
  "evidenceGaps": ["Verify fit assessments against current source material."],
  "unsupportedClaims": []
}
```

## Answer to the user

**Example Clinic Group: verify before deciding** (unverified, for human review). As of 2026-10-18.

Scores: priority 62/100 · fit 75 · timing 25 · evidence quality 95

| # | What you supplied | Status | Weight | Flags |
|---|---|---|---|---|
| 1 | Series A, March 2024 | admissible | 0.05 | none, but it is over two years old so it adds little timing |
| 2 | State intake-records rule, Aug 2026 | admissible | 0.45 | none |

Unsupported claims: none flagged.
Gaps to close: confirm the location count against a current source.

Timing is the weak point. The only recent event is the state rule. A dated, account-specific event (for example a new operations hire or a system change) would make the case stronger.

Intakra scored only what you supplied. It did not open either link or estimate budget or intent.
