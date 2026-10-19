---
name: why-now-review-brief
description: Use when a user wants a short, evidence-labeled why-now brief on one business account for a human reviewer, such as a sales lead, founder, or account owner deciding whether the account deserves more research. Triggers include "why now for this account", "prepare a why-now review", "write up the case for <company> for my manager", "summarize the evidence for review", "what should a reviewer check before we pursue this account", or a request to run Intakra's prepare_why_now_review tool.
---

# Intakra why-now review brief

Prepare a review brief for one account with Intakra's `prepare_why_now_review` tool. The tool turns the user's fit criteria and signals into a headline, a why-now statement, fit guidance, a list of supported facts each labeled `caller_supplied_unverified`, evidence gaps, questions for the reviewer, and actions the reviewer must not take.

The brief is for an internal decision: is this account worth a closer look, and what needs checking first. It is not a pitch, not talking points, and not outreach.

## When to use, when not to

Use it when the user wants something a colleague can read and decide on, or wants to know what a reviewer should challenge.

Do not use it to:
- Write emails, call scripts, LinkedIn notes, sequences, openers, or any customer-facing message. This plugin does not draft outreach. If the user asks, say so and offer to tighten the evidence or the reviewer questions instead.
- Research the account or confirm facts. The tool does not open links or look anything up.
- State budget, authority, buying intent, or purchase likelihood as fact.

For just the numbers, use `buying-signal-scoring`. For raw notes, start with `signal-evidence-intake`.

## Inputs (exact tool arguments)

The input is the same as the scoring tool:

| Argument | Required | Limits |
|---|---|---|
| `account.name` | yes | 1 to 200 chars, business name only, no personal or confidential data |
| `vendor.offer` | yes | 1 to 1000 chars |
| `vendor.idealCustomerProfile` | yes | 1 to 1000 chars |
| `fitCriteria[]` | yes | 1 to 8: `criterion` (max 240), `assessment` (`match`/`mismatch`/`unknown`), `evidence` (max 600), optional `sourceUrl` |
| `signals[]` | yes | 1 to 10: `kind`, `evidence` (max 600), `relevanceToOffer` (max 600), `confidence` (`high`/`medium`/`low`), optional `observedAt` (`YYYY-MM-DD`), optional `sourceUrl` |
| `asOfDate` | no | `YYYY-MM-DD`, defaults to the current California date |

`kind` is one of `leadership_change`, `hiring`, `funding`, `product_launch`, `expansion`, `technology_change`, `partnership`, `regulatory_event`, `other`. `sourceUrl` must be credential-free `https://`. No other fields are accepted.

## Workflow

1. **Gather or reuse evidence.** If you already structured or scored this account in the conversation, reuse the same JSON so the brief matches the scorecard. Otherwise collect the inputs above and ask for anything required that is missing.
2. **Ask who the reviewer is** (optional) so you can pitch the summary at the right level. It does not change the tool call.
3. **Pre-flight**: https-only links, `YYYY-MM-DD` dates, enum values, lengths, hedged `relevanceToOffer`.
4. **Call `prepare_why_now_review`** once. Pass the same `asOfDate` used for any earlier score so the two agree.
5. **On "Invalid params"**, fix the input (see the pre-flight list) and retry once. The tool is deterministic and stores nothing, so a retry is safe. If it fails again or the server is unreachable, stop and say so. Never write a brief that looks like tool output when the tool did not run.
6. **Present the brief** with the template below, keeping every fact labeled.

## Reading the output

- `status: "draft"`, `requiresHumanReview: true`, `sourceVerificationPerformed: false`: always. The brief is for review.
- `headline`: a short title. `disposition`: `review_now`, `verify`, or `deprioritize`.
- `whyNow`: the tool's hedged statement of the leading signal. Quote it; do not strengthen it.
- `fitGuidance`: the fit summary plus a reminder that priority is a triage aid.
- `supportedFacts[]`: `signalNumber`, `claim` (prefixed "Caller supplied:"), `sourceUrl` (string or `null`), `observedAt` (string or `null`), `verificationStatus` (always `caller_supplied_unverified`).
- `evidenceGaps[]`, `questionsForReviewer[]`, `prohibitedActions[]`.

`supportedFacts` lists every signal the user supplied, including ones the scorer would exclude. If a fact makes a budget or intent claim, mark it in your brief as "not usable as evidence" and point to the scoring tool's `unsupportedClaims` if you ran it.

## Output template

```
Why-now review: <accountName>
Status: unverified, for human review · Disposition: <disposition> · As of <date>

Why now (as supplied): <whyNow>
Fit: <fitGuidance>

Facts supplied (none verified by Intakra)
| # | Claim | Date | Source |
(null date or source -> "missing")

Close these gaps first
- <evidenceGaps>

Questions for the reviewer
- <questionsForReviewer>

Do not
- <prohibitedActions>
```

Keep the brief under one screen. Add at most two sentences of your own, and only to connect the gaps to the user's offer.

## Guardrails

- Keep "caller-supplied, unverified" on every fact. Do not drop the label to make the brief read better.
- Show `prohibitedActions` every time. They include not treating the score as buyer intent, not claiming budget or authority, not sending outreach or updating a CRM, and not including private data.
- No outreach, messaging, or "suggested angle" lines. The reviewer decides next steps.
- No guaranteed outcomes and no purchase probabilities.

## If the Intakra server is not connected

Tell the user the brief needs the Intakra connector: in Claude, Customize > Connectors and add `https://intakra.com/mcp` (no sign-in); in Claude Code, `claude mcp add --transport http intakra https://intakra.com/mcp`. Without it you may give a plain evidence table and list the obvious gaps, clearly titled "Not run through Intakra", with no disposition.

See `references/worked-example.md` for a complete example.
