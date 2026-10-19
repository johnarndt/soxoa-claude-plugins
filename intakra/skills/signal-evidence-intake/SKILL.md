---
name: signal-evidence-intake
description: Use when a user pastes notes, press releases, job posts, news links, or research about a business account and wants it organized into structured account, fit-criteria, and dated buying-signal evidence before scoring. Triggers include "organize my research on this account", "turn these notes into signals", "structure this for Intakra", "what evidence do I have on this company", "clean up my account notes", or "is this enough evidence to score".
---

# Intakra signal evidence intake

Turn the material a user already has about one business account into the exact input shape the Intakra tools accept: `account`, `vendor`, `fitCriteria`, `signals`, and optional `asOfDate`. This is the step before scoring. Good intake is what makes the score worth reading.

## When to use, when not to

Use this skill when the user has raw material (notes, pasted articles, job posts, links with dates) and needs it sorted into fit facts and dated signal events, with gaps called out.

Do not use it to:
- Research the account. Neither this skill nor the Intakra server looks anything up. Work only from what the user gives you.
- Write outreach, emails, call scripts, sequences, LinkedIn messages, or any messaging. The Intakra plugin stops at evidence and review. If asked, say so plainly and offer to continue the evidence review instead.
- Handle personal or confidential data. Account names are business names only. Leave out people's personal details, private CRM notes, deal values, credentials, and anything the user marks confidential.

If the user already has structured evidence and just wants a score, use the `buying-signal-scoring` skill. If they need to define what a good-fit customer looks like first, use `fit-criteria-definition`.

## Inputs to gather

Ask for anything required that is missing. Never fill a required field with a guess.

| Need from the user | Maps to | Rule |
|---|---|---|
| Company name | `account.name` | Required, 1 to 200 chars, business name only |
| What they sell | `vendor.offer` | Required, 1 to 1000 chars, plain language |
| Who they sell to | `vendor.idealCustomerProfile` | Required, 1 to 1000 chars |
| Fit facts | `fitCriteria[]` | 1 to 8 items |
| Business events | `signals[]` | 1 to 10 items |
| Review date | `asOfDate` | Optional, `YYYY-MM-DD`; omit to use the current California date |

Each fit criterion needs `criterion` (max 240), `assessment` (`match`, `mismatch`, or `unknown`), `evidence` (max 600), and optional `sourceUrl`.

Each signal needs `kind`, `evidence` (max 600), `relevanceToOffer` (max 600), `confidence` (`high`, `medium`, or `low`), plus optional `observedAt` (`YYYY-MM-DD`) and `sourceUrl`.

The allowed `kind` values are exactly: `leadership_change`, `hiring`, `funding`, `product_launch`, `expansion`, `technology_change`, `partnership`, `regulatory_event`, `other`. See `references/field-guide.md` for how to classify events and write each field.

## Workflow

1. **Collect the raw material.** Ask the user to paste notes and links, and to say what they sell and who their ideal customer is if you do not already know.
2. **Split facts from opinions.** For each sentence, decide: is it a fit fact (a stable trait such as size, industry, location, tooling), a signal (a dated event or change), or an opinion (a guess about budget, intent, or readiness)? Opinions do not become evidence.
3. **Build `fitCriteria`.** One criterion per ICP trait, at most 8. Use `match` or `mismatch` only when the user's material states the fact. Use `unknown` when nothing supports either way, and say so in `evidence` (for example "No public information supplied about current tooling.").
4. **Build `signals`.** One entry per distinct event, at most 10. Keep `evidence` to the observed fact. Put the reasoning in `relevanceToOffer` and hedge it ("may", "could", "might"). Copy the date the user gave into `observedAt`. Only use dates the material states; if the date is missing, leave `observedAt` out and list it as a gap.
5. **Check every `sourceUrl`.** It must be a credential-free `https://` link. The server rejects `http://` links with an "Invalid params" error. Remove tracking tokens, login links, and signed URLs; if a link is not https or carries credentials, leave it out and note the gap.
6. **Set `confidence` from the user's own certainty**, not yours: `high` for a primary source they read (company press release, filing), `medium` for secondhand reporting or an undated post, `low` for rumor or inference. Ask if unclear.
7. **Show the structured evidence back** as a table and list the gaps (missing dates, missing sources, unknown fit traits). Ask the user to confirm or correct before any tool call.
8. **Offer the next step.** With confirmation, call `score_buying_signal_evidence` (score) or `prepare_why_now_review` (review brief) with the exact JSON. Do not call either without the user asking for it or agreeing.

## Output template

```
Account: <name>   Review date: <asOfDate or "today, California time">

Fit criteria (<n>/8)
| # | Criterion | Assessment | Evidence | Source |

Signals (<n>/10)
| # | Kind | Event (caller-supplied) | Date | Source | Confidence |

Gaps before scoring
- <missing date / source / unknown trait>

Left out (not evidence)
- <opinions about budget or intent, personal data, non-https links>

Ready to score? I can send this to Intakra's score_buying_signal_evidence tool.
```

## Guardrails

- Every fact stays labeled as supplied by the user and unverified. Intakra does not open or check `sourceUrl`.
- Never write budget, authority, or buying intent as fact. The server excludes a signal whose `relevanceToOffer` asserts budget, authority, or intent without hedging, and lists it in `unsupportedClaims`.
- Never invent dates, sources, numbers, or events to fill a gap.
- No outreach or messaging of any kind.

## If the Intakra server is not connected

Intake does not need the server. Do steps 1 to 7 and give the user the finished JSON. Tell them scoring needs the Intakra connector: in Claude, Customize > Connectors and add `https://intakra.com/mcp`; in Claude Code, `claude mcp add --transport http intakra https://intakra.com/mcp`. Do not present any score or disposition, because none was computed.

See `references/worked-example.md` for a full example from pasted notes to tool-ready JSON.
