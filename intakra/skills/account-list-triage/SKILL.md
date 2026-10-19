---
name: account-list-triage
description: Use when a user has a short list of business accounts (roughly 2 to 15) with evidence for each and wants them scored and ranked with Intakra. Triggers include "rank these accounts", "which of these companies should I look at first", "triage my account list", "score this list of prospects", "who on this list has a real reason to buy now", or a pasted table of companies with notes or signals.
---

# Intakra account list triage

Score a short list of accounts one at a time with `score_buying_signal_evidence`, then rank them so the user knows which accounts to review first and which need more evidence. Intakra scores each account; the ranking is a sort you do over the returned fields, and you should say so.

## When to use, when not to

Use it for a short list where the user can supply, per account, at least one fit fact and at least one signal.

Do not use it to:
- Discover accounts or find signals. The tool only reads what the user supplies. Accounts with no evidence cannot be scored.
- Bulk-process large lists. Each account is a separate call. For more than 15 accounts, ask the user to pick the top 15 or split into batches, and confirm before each batch.
- Produce outreach, emails, sequences, or messaging for the top accounts. The plugin stops at the ranked review list.

## Inputs

Shared across the list (ask once):
- `vendor.offer` (1 to 1000 chars) and `vendor.idealCustomerProfile` (1 to 1000 chars).
- The fit criteria to test (1 to 8 `criterion` strings, max 240 chars each). Use the same criteria for every account so scores are comparable. If the user has none, run the `fit-criteria-definition` workflow first.
- One `asOfDate` (`YYYY-MM-DD`) for the whole run. If the user does not give one, use today's date in California so every account is scored against the same day.

Per account:
- `account.name` (1 to 200 chars, business name only).
- For each shared criterion: `assessment` (`match`, `mismatch`, `unknown`) and `evidence` (1 to 600 chars), optional https `sourceUrl`. If the user has nothing for a criterion, use `unknown` with evidence like "Not supplied."
- 1 to 10 `signals`: `kind` (`leadership_change`, `hiring`, `funding`, `product_launch`, `expansion`, `technology_change`, `partnership`, `regulatory_event`, `other`), `evidence` (max 600), `relevanceToOffer` (max 600, hedged), `confidence` (`high`, `medium`, `low`), optional `observedAt` (`YYYY-MM-DD`), optional https `sourceUrl`.

## Workflow

1. **Set up the shared frame**: offer, ICP, criteria, `asOfDate`. Confirm with the user.
2. **Build one input per account.** Put accounts with zero signals in a "Not scored" list rather than inventing a signal. Show the user the account count and a compact evidence table, and confirm before calling.
3. **Call `score_buying_signal_evidence` once per account**, sequentially, using the shared `vendor`, the shared criteria, and the same `asOfDate`. Keep each result with its account name.
4. **Handle failures per account.** On "Invalid params", fix that account's input (non-https link, bad date format, enum value, length, item count) and retry once. The tool is deterministic and stores nothing, so retries are safe. If it still fails, list the account under "Could not score" with the reason and continue with the rest. Do not estimate a score for it.
5. **Rank.** Sort by disposition (`review_now`, then `verify`, then `deprioritize`), then by `scores.priority` descending, then by `scores.evidenceQuality` descending. Tell the user this order is your sort over Intakra's fields.
6. **Present** with the template below. Offer a `prepare_why_now_review` brief for any account the user picks, one at a time.

## Reading each result

Use `disposition`, `scores.priority`, `scores.fit`, `scores.timing`, `scores.evidenceQuality`, `admissibleSignalCount`, `unsupportedClaims`, `evidenceGaps`, and `nextAction`. Every result has `status: "draft"` and `requiresHumanReview: true`, and `boundaries` confirms no source verification, no network access, nothing persisted, no outreach drafted, and nothing sent.

## Output template

```
Triage of <n> accounts · as of <asOfDate> · offer: <short offer>
All scores are Intakra results on evidence you supplied. Unverified; for human review.

| Rank | Account | Disposition | Priority | Fit | Timing | Evidence | Admissible signals | Top gap |

Review now: <names, one line each on the leading dated signal, labeled caller-supplied>
Verify first: <names, with the single most useful gap to close>
Deprioritized: <names, with the reason from fit summary or nextAction>
Unsupported claims flagged: <account: claim>, or "none"
Not scored: <names and why (no signals, could not score)>
```

## Guardrails

- Keep every signal labeled caller-supplied and unverified.
- Do not describe rank or priority as likelihood to buy, and never state budget or intent as fact.
- Do not fill missing evidence for one account by copying it from another.
- Use the same criteria and `asOfDate` across the list, or say clearly that results are not comparable.
- No outreach, messaging, sequences, or CRM updates for any account.

## If the Intakra server is not connected

Explain that scoring needs the Intakra connector: in Claude, Customize > Connectors and add `https://intakra.com/mcp` (no sign-in); in Claude Code, `claude mcp add --transport http intakra https://intakra.com/mcp`. You can still organize the list into the shared frame and per-account evidence tables and point out which accounts lack dates, sources, or signals. Do not rank them or assign scores.

See `references/worked-example.md` for a three-account example.
