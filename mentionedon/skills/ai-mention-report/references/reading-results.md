# Reading and comparing results

## Sample size

Rates from a handful of answers swing a lot. Show counts next to every rate ("3 of 8", not just "38%"). Rough guide for how to describe a single session:

- Under 10 completed captures: describe what happened in those answers only. Do not call it a rate trend.
- 10 to 30: a rough picture for this prompt set and these assistants.
- Over 30 across several sessions with the same setup: comparisons become more meaningful, still with the caveats below.

## Comparing two periods

Run one `summarize_scan_evidence` call per period, then compare the outputs yourself. Before comparing, check that the two periods used:

1. The same prompt set (same wording).
2. The same `sourceLabel` set and surfaces.
3. A similar account state and location setting.

If any differ, say so first and compare only the overlapping prompts and assistants (filter rows before calling, and say you did).

Comparison table:

```
| Measure | <period A dates> | <period B dates> | Change |
| Completed captures | a | b | |
| Mentioned | x of a (p%) | y of b (q%) | +/- points |
| Business citation | ... | ... | |
| Unavailable | ... | ... | |
```

Then per assistant from `bySource`. Report changes in percentage points with the counts. Use neutral wording: "higher in these captures", "lower in these captures".

## What a change does and does not mean

- Assistants change answers between runs, between days, and with model updates. A change between periods can come from any of these.
- A site change shipped between periods may or may not be related. Do not claim cause.
- A drop in unavailable rows is a change in capture setup, not in visibility.

## Useful observations to add (labeled as your reading)

From the pasted answer text (not from the tool), you may note, clearly separated from the tool's numbers:

- Which competitors were named most often.
- Facts an assistant got wrong about the business (wrong hours, wrong area). These are good inputs for `ai-discovery-audit` and `visibility-action-plan`.
- Which source sites the assistants cited for the category (directories, review sites, local news). The user may want to check their own presence there.

## Citation hosts

`uniqueBusinessCitationHosts` shows which of the business's own pages or profiles were cited. If only third-party profiles appear and never the business's own domain, that is a reason to look at `first_party_evidence`, `buyer_faq`, and `structured_data` in the plan, framed as something to try, not a fix that guarantees citations.

## Data handling reminder

Observations sent to the tool contain the business name, prompts, timestamps, mention flags, citation URLs, positions, and sentiment labels. Do not put customer names, phone numbers, or other personal data into prompts or labels.
