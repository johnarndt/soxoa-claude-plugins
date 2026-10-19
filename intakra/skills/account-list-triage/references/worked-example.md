# Worked example: triaging three accounts

All company names and links are fictional. Scores shown are what the live tool returned for these inputs.

## User request

"We sell patient intake automation for US outpatient clinic groups with 5+ locations. Rank these for me:
1. Example Clinic Group: 6 locations. State intake-records rule took effect 2026-08-01 (https://example.com/rule). Series A in March 2024 (https://example.com/series-a).
2. Sample Health Partners: 3 locations. Opening a fourth on 2026-10-01 (https://example.com/fourth).
3. Demo Care Network: 12 locations. No news I know of."

## Shared frame

- `vendor.offer`: "Patient intake automation for multi-site clinics."
- `vendor.idealCustomerProfile`: "US outpatient clinic groups with 5 or more locations."
- Criterion: "5 or more locations".
- `asOfDate`: "2026-10-18".

Demo Care Network has no signal, so it goes to "Not scored". Ask whether the user has any dated event for it.

## Calls (one per account)

Account 1, `score_buying_signal_evidence`:

```json
{
  "account": { "name": "Example Clinic Group" },
  "vendor": { "offer": "Patient intake automation for multi-site clinics.", "idealCustomerProfile": "US outpatient clinic groups with 5 or more locations." },
  "fitCriteria": [ { "criterion": "5 or more locations", "assessment": "match", "evidence": "Site lists 6 locations." } ],
  "signals": [
    { "kind": "funding", "evidence": "Raised a Series A.", "observedAt": "2024-03-01", "sourceUrl": "https://example.com/series-a", "relevanceToOffer": "New funding may support operational tooling upgrades.", "confidence": "high" },
    { "kind": "regulatory_event", "evidence": "State rule on intake records takes effect.", "observedAt": "2026-08-01", "sourceUrl": "https://example.com/rule", "relevanceToOffer": "The rule could prompt a review of intake forms.", "confidence": "medium" }
  ],
  "asOfDate": "2026-10-18"
}
```

Account 2, `score_buying_signal_evidence`:

```json
{
  "account": { "name": "Sample Health Partners" },
  "vendor": { "offer": "Patient intake automation for multi-site clinics.", "idealCustomerProfile": "US outpatient clinic groups with 5 or more locations." },
  "fitCriteria": [ { "criterion": "5 or more locations", "assessment": "mismatch", "evidence": "Site lists 3 locations." } ],
  "signals": [
    { "kind": "expansion", "evidence": "Announced a fourth location opening.", "observedAt": "2026-10-01", "sourceUrl": "https://example.com/fourth", "relevanceToOffer": "A new site may add intake volume and could prompt a process review.", "confidence": "medium" }
  ],
  "asOfDate": "2026-10-18"
}
```

## Results used for ranking (abridged)

| Account | disposition | priority | fit | timing | evidenceQuality |
|---|---|---|---|---|---|
| Example Clinic Group | verify | 62 | 75 | 25 | 95 |
| Sample Health Partners | deprioritize | 36 | 0 | 45 | 100 |

A `mismatch` on the only criterion sets fit to 0 and the disposition to `deprioritize`, even with a fresh, fully sourced expansion signal (timing 45, evidence quality 100). Use the numbers exactly as returned.

## Answer to the user

Triage of 3 accounts · as of 2026-10-18 · offer: patient intake automation.
All scores are Intakra results on evidence you supplied. Unverified; for human review. The ranking is my sort: disposition first, then priority, then evidence quality.

| Rank | Account | Disposition | Priority | Fit | Timing | Evidence | Admissible | Top gap |
|---|---|---|---|---|---|---|---|---|
| 1 | Example Clinic Group | verify | 62 | 75 | 25 | 95 | 2 | Confirm location count from a current source |
| 2 | Sample Health Partners | deprioritize | 36 | 0 | 45 | 100 | 1 | Below the 5-location threshold |

Verify first: Example Clinic Group. Fit holds; timing rests on the August state rule. The 2024 Series A adds little because of its age.
Deprioritized: Sample Health Partners. Three locations (four after the opening) is under your 5-location profile.
Not scored: Demo Care Network. No signal supplied. If you have a dated event, I can add it.

Want a why-now review brief on Example Clinic Group for your reviewer?
