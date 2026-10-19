# Reading an Intakra scorecard

These notes describe behavior seen from the live `score_buying_signal_evidence` tool. The scoring is deterministic: the same input and `asOfDate` give the same result. Exact weights are internal to Intakra, so describe results in terms of the returned fields, not formulas.

## Signal status

| `status` | What it means | What to tell the user |
|---|---|---|
| `admissible` | Counted toward timing and evidence quality | "Counted. Still unverified." |
| `needs_verification` | Counted at a small weight because something is missing, usually a source or date | Read the `flags` aloud and ask whether they can supply the missing piece |
| `excluded` | Not counted. For example, the `relevanceToOffer` text asserted budget, authority, or buying intent without hedging | Explain the flag. Do not repeat the claim as if it were true |

`contribution` is the signal's weight from 0 to 1. A recent, dated, sourced signal can contribute most of the timing; an old signal can be admissible but contribute very little because recency matters. Present it as "weight" and avoid implying precision beyond two decimals.

## Common flags and gaps

| Text you may see | Meaning | Fix |
|---|---|---|
| "No source URL supplied." | Signal has no `sourceUrl` | Ask for an https link if one exists |
| "No observation date supplied." | Signal has no `observedAt` | Ask for the event date |
| "Text asserts budget, authority, or buying intent without an inference marker." | Unhedged claim in the signal | Rewrite the relevance as a hedged possibility, or drop it |
| "Verify fit assessments against current source material." | Standard reminder that fit is caller-assessed | Point to the `unknown` criteria first |

`unsupportedClaims` names signals whose text claims budget, authority, or intent. Show every entry.

## Disposition

| `disposition` | Plain wording |
|---|---|
| `review_now` | "Worth a human review now, based on what you supplied." |
| `verify` | "Promising or mixed. Close the listed gaps before deciding." |
| `deprioritize` | "On current evidence, fit or timing does not hold up." |

A single `mismatch` on a core criterion can push fit to 0 and the disposition to `deprioritize` even with a fresh signal. If the user disagrees with a fit assessment, they can correct the input and run it again.

## Scores

- `fit`: how the supplied criteria line up with the profile. `unknown` criteria hold it down.
- `timing`: how recent and relevant the admissible signals are, relative to `asOfDate`.
- `evidenceQuality`: how complete the evidence is (sources, dates, specific relevance).
- `priority`: a blended triage number. It is not a probability of purchase.

## The boundaries block

Always true or false as listed. Use it to answer "did Intakra check this?": no. `sourceVerificationPerformed` is `false`, `networkAccess` is `false`, `dataPersisted` is `false`, `outreachDrafted` is `false`, `messageSent` is `false`.
