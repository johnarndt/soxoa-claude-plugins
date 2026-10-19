# Reading Portravo takeoff lines

## Line fields

| Field | Type | How to use it |
| --- | --- | --- |
| `id` | string | Internal line id. Do not show it unless the user asks. |
| `page` | integer or null | Plan page the line came from. Show as "p.3". Null means no single page. |
| `trade` | string | Group the summary by this (for example framing, electrical, plumbing, drywall, concrete, roofing). |
| `category` | string | Material category. Use it only when it adds meaning. |
| `description` | string | The scope item, as extracted. Quote it; do not rename it. |
| `qty` | number | Quantity as extracted or as edited by the estimator. |
| `unit` | string | Typically `ea` (count), `lf` (linear feet), `sf` (square feet). Never add quantities with different units. |
| `confidence` | number 0 to 1 | The extractor's estimate that a competent estimator would agree with the quantity within about 10%. Show as a percent. |
| `status` | string | `pending`, `confirmed`, `edited`, or `rejected`. |
| `assemblyId` | string or null | The pricing assembly the line maps to. Null means a reviewer must map it before pricing. |
| `notes` | string or null | The extractor's working, for example the arithmetic behind an area, or "ceiling height assumed". Quote it when it explains low confidence. |

## Confidence bands (how to describe them)

These are descriptive bands for the summary, not Portravo rules.

| Confidence | Describe as | Typical source |
| --- | --- | --- |
| 0.85 and up | High | Counts from a schedule or legend. |
| 0.60 to 0.84 | Medium | Measured or scaled from dimensions. |
| Below 0.60 | Low, check first | Inferred, or depends on a value the plans do not state. |

If the user gives their own cutoff ("anything under 70%"), use theirs.

## Triage order for "Check first"

Rank pending lines (`status: "pending"`) in this order, then by size of `qty` within each group:

1. Low confidence (below 0.60).
2. Notes that say a value was assumed, inferred, or not applied (for example "ceiling height assumed", "plan area, pitch and overhang not applied").
3. `assemblyId` is null (cannot be priced until mapped).
4. Medium confidence lines with large quantities, because a small percentage error moves the estimate most there.

Lines with status `confirmed` or `edited` were already reviewed by a person. Mention them only in counts unless the user asks. Lines with status `rejected` are excluded by the estimator; count them separately and leave them out of trade totals.

## Counts to report

- Total lines.
- Pending: `status == "pending"`.
- Reviewed: `confirmed` plus `edited`.
- Rejected.
- Unmapped: `assemblyId == null` and not rejected.
- Low confidence pending: pending and `confidence < 0.60`.

## Trade summaries

Within a trade, list the largest items by `qty` with their unit. If a trade has items in several units, list them separately (for example "framing: 254 lf of 2x6 wall, 14 ea headers"). Do not convert lf to sf or estimate materials from them.

## What the takeoff does not tell you

- Prices, labor, or totals. Those are set in Portravo after review.
- Whether scope was left out on purpose. The extractor only lists scope it found evidence for on the sheets; it does not add standard items the plans do not show. The `scopeNotes` from `run_takeoff` (if the run happened in this conversation) explain skipped sheets and omitted scope.
- Whether the estimate can be exported. Only `export_reviewed_estimate` answers that.
