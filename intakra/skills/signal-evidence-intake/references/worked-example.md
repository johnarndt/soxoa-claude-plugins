# Worked example: notes to tool-ready evidence

All names and links below are fictional.

## User request

"I sell route-planning software for regional trucking fleets, 50 to 500 trucks, mostly carriers still dispatching on spreadsheets. Here are my notes on Example Freight Co: about 180 trucks per their site, runs Ohio, Indiana and Michigan. They put out a press release on Sept 22 naming a new VP of Operations (https://example.com/news/new-vp-ops). Saw a dispatch analyst job post mentioning route optimization, not sure when it went up. My buddy says they definitely have budget this quarter. Can you organize this?"

## Sorting

- Fit facts: fleet size (about 180, a match), region (match), dispatch tooling (not stated, so `unknown`).
- Signals: VP of Operations press release (dated, sourced), dispatch analyst job post (undated, no link).
- Left out: "definitely have budget" is an opinion about budget, not an observed event.

## Tool-ready JSON

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
  ]
}
```

## What to show the user

| # | Kind | Event (caller-supplied) | Date | Source | Confidence |
|---|---|---|---|---|---|
| 1 | leadership_change | New VP of Operations announced | 2026-09-22 | example.com press release | high |
| 2 | hiring | Dispatch analyst post mentions route optimization | missing | missing | medium |

Gaps before scoring:
- Signal 2 has no date or link. If you can find the posting date and URL, the signal will count for more.
- Current dispatch tooling is unknown. It is the trait closest to your offer, so it is worth confirming.

Left out: "they definitely have budget this quarter" is a secondhand opinion about budget, not an observed event. Intakra excludes budget or intent claims stated as fact.

Then ask: "Want me to score this with Intakra?"
