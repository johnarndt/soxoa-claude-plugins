---
name: buying-signal-scoring
description: Use when a user wants to score one business account's fit and buying-signal evidence with Intakra. Triggers include "score this account", "how strong are these buying signals", "is this company worth a look", "rate this account's fit and timing", "check my signals on <company>", "should I prioritize this account", or a request to run Intakra's score_buying_signal_evidence tool on evidence they supply.
---

# Intakra buying-signal scoring

Score one account with Intakra's `score_buying_signal_evidence` tool. The tool deterministically scores the fit and buying-signal evidence the user supplies and returns a review-only scorecard: fit, timing, evidence quality, a triage priority, a disposition, per-signal flags, evidence gaps, and unsupported-claim flags.

## When to use, when not to

Use it when the user has one account with at least one fit criterion and one signal and wants to know how strong the case is.

Do not use it to:
- Find signals or research the company. The tool has no network access and does not open links.
- Predict whether the company will buy. Priority is a triage aid, not a purchase probability.
- Write outreach, emails, sequences, or messaging of any kind. The plugin stops at the scorecard. If asked, say this plugin does not write outreach and offer to review the evidence further.
- Score more than one account in a single call. For a list, use `account-list-triage`.

If the evidence is still raw notes, run the `signal-evidence-intake` workflow first. If the user wants a written brief for a reviewer, use `why-now-review-brief`.

## Inputs (exact tool arguments)

| Argument | Required | Limits |
|---|---|---|
| `account.name` | yes | 1 to 200 chars, business name only |
| `vendor.offer` | yes | 1 to 1000 chars |
| `vendor.idealCustomerProfile` | yes | 1 to 1000 chars |
| `fitCriteria[]` | yes | 1 to 8 items: `criterion` (max 240), `assessment` (`match`/`mismatch`/`unknown`), `evidence` (max 600), optional `sourceUrl` |
| `signals[]` | yes | 1 to 10 items: `kind`, `evidence` (max 600), `relevanceToOffer` (max 600), `confidence` (`high`/`medium`/`low`), optional `observedAt` (`YYYY-MM-DD`), optional `sourceUrl` |
| `asOfDate` | no | `YYYY-MM-DD`, defaults to the current California date |

`kind` must be one of: `leadership_change`, `hiring`, `funding`, `product_launch`, `expansion`, `technology_change`, `partnership`, `regulatory_event`, `other`.

Send no other fields. The schema rejects extras.

## Workflow

1. **Check required inputs.** If `vendor.offer`, `vendor.idealCustomerProfile`, at least one fit criterion, or at least one signal is missing, ask. Do not invent any of them.
2. **Pre-flight the evidence.** Confirm every `sourceUrl` starts with `https://` and has no credentials or tokens; drop it otherwise and tell the user. Confirm dates are `YYYY-MM-DD`. Trim any field over its limit (keep the facts, cut the filler). Rewrite `relevanceToOffer` in hedged terms if it states budget or intent as fact, and tell the user you did.
3. **Confirm with the user** if you restructured their material. A short "Here is what I will send" table is enough.
4. **Call `score_buying_signal_evidence`** once with the JSON. Pass `asOfDate` only if the user named a review date or wants a reproducible result.
5. **On error.** "Invalid params" means the input broke the schema. Check, in order: a non-https `sourceUrl`, a date not in `YYYY-MM-DD`, a `kind`/`assessment`/`confidence` value outside the enum, an empty or over-length string, more than 8 fit criteria or 10 signals, or an extra field. Fix and retry once. The tool is deterministic and stores nothing, so retrying the same input is safe and returns the same result for the same `asOfDate`. If it still fails or the server is unreachable, stop and tell the user. Never fill in a score yourself.
6. **Read and present the result** with the template below.

## Reading the output

- `status` is always `"draft"` and `requiresHumanReview` is always `true`. Say the result needs a human review.
- `disposition`: `review_now` (evidence supports a closer look now), `verify` (resolve gaps first), `deprioritize` (fit or timing does not hold up on current evidence).
- `scores.fit`, `scores.timing`, `scores.evidenceQuality`, `scores.priority`: integers 0 to 100.
- `fit.matches`, `fit.mismatches`, `fit.unknowns`, `fit.summary`.
- `evidence[]`: per signal, `signalNumber` (1-based, in the order sent), `status` (`admissible`, `needs_verification`, `excluded`), `contribution` (0 to 1), `flags` (reasons, such as "No source URL supplied.").
- `admissibleSignalCount`, `evidenceGaps[]`, `unsupportedClaims[]`, `nextAction`.
- `boundaries`: confirms `callerSuppliedOnly: true`, `sourceVerificationPerformed: false`, `networkAccess: false`, `dataPersisted: false`, `outreachDrafted: false`, `messageSent: false`.

More detail on interpreting statuses and contributions is in `references/reading-the-scorecard.md`.

## Output template

```
<accountName>: <disposition in plain words> (unverified, for human review)
As of <asOfDate>

Scores: priority <n>/100 · fit <n> · timing <n> · evidence quality <n>
Fit: <fit.summary>

Signals
| # | What you supplied | Status | Weight | Flags |
(Weight = contribution; map signalNumber back to the signal the user gave)

Unsupported claims: <list, or "none flagged">
Gaps to close: <evidenceGaps>
Intakra's next step: <nextAction>

Intakra scored only what you supplied. It did not open any source, check any fact, or estimate budget or intent.
```

## Guardrails

- Every input fact is caller-supplied and unverified. Keep that label in the answer.
- Never describe the priority score as a likelihood to buy, and never state budget, authority, or intent as fact.
- Do not add signals the user did not give. Do not upgrade `confidence` to raise a score.
- If a signal comes back `excluded`, explain why from its `flags` and do not reintroduce its claim elsewhere in your answer.
- No outreach, messaging, CRM updates, or follow-up actions.

## If the Intakra server is not connected

Say the scorecard needs the Intakra connector: in Claude, Customize > Connectors and add `https://intakra.com/mcp` (no sign-in needed); in Claude Code, `claude mcp add --transport http intakra https://intakra.com/mcp`. You can still structure and pre-flight the evidence and list obvious gaps (missing dates, missing sources, unknown fit traits). Do not produce scores, a disposition, or anything that looks like tool output.

See `references/worked-example.md` for a full request, call, and answer.
