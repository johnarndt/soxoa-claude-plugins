---
name: feedback-inbox
description: "Use when a user wants to capture customer feedback and turn it into a ranked list of what to work on. Triggers include 'log this feedback', 'my customer said...', 'save this review', 'what are customers asking for', 'what should I work on next for <product>', 'group these complaints', or pasting a forwarded email, text, app-store review or call note. Keeps every quote verbatim, groups quotes into issues, ranks issues by how many people asked, and records the fix when one ships. Never decides on its own what gets built."
---

# Feedback inbox

A plain-file inbox that turns scattered feedback (forwarded email, texts, app-store reviews, call notes) into one ranked list per product. The owner reads the list and decides. The skill never fixes anything on its own.

## When not to use this skill

- The user wants survey analytics or NPS math across thousands of responses. This is for the dozens-to-hundreds of real quotes a small business gets.
- The user wants to reply to the customer. Draft a reply only if asked, and never send it.
- The feedback is about a person (an employee review, a complaint naming staff). Do not store it here.

## Layout

Create this in the folder the user picks (default `feedback/` at the project root). Ask before creating it the first time.

```
feedback/
  OPEN.md                        # every product, most-asked issue first (generated)
  <product>/
    OPEN.md                      # this product's open and planned issues (generated)
    inbox.jsonl                  # one row per piece of feedback, append-only
    issues/<slug>.md             # one file per issue
```

`inbox.jsonl` row:

```json
{"id": 41, "product": "acme", "source": "email|text|review|call|chat", "from": "who said it", "received": "2026-10-13", "quote": "their exact words", "issue": "slug-or-null", "status": "new|triaged|skip"}
```

Issue file:

```markdown
---
title: Export to CSV drops the date column
status: open            # open | planned | shipped | wontfix
asks: 3                 # distinct rows grouped here
first_seen: 2026-09-02
last_seen: 2026-10-13
row_ids: [12, 29, 41]
shipped_sha:
---

## What users say
> "the export is missing dates again" (Dana, email, 2026-10-13)

## Done when
One or two sentences an owner could check by hand.

## Fix
(empty until something ships: branch, commit, how it was verified)
```

## Workflow

1. **Capture.** Append one row per piece of feedback with the quote exactly as given. Strip only signatures, legal footers and quoted reply chains. Record who said it and where it came from. If one message holds two separate requests, write two rows.
2. **Triage.** For each `new` row, either attach it to an existing issue (same underlying problem, even in different words), open a new issue with a short kebab-case slug, or mark it `skip` (spam, thanks-only, no actionable content). Prefer attaching over opening near-duplicates.
3. **Update issues.** Append the quote under "What users say", bump `asks`, `last_seen` and `row_ids`. Write "Done when" once, in terms a non-engineer could verify.
4. **Rebuild the lists.** Regenerate each `<product>/OPEN.md` and the top-level `OPEN.md`: open and planned issues only, sorted by `asks` then `last_seen`, one line each with the slug, title, ask count and newest quote. These files are generated; never hand-edit them.
5. **Report.** Tell the user what was added, which issues moved up, and the top three per product. Stop there.

## Recording a fix

When the user (or you, at their request) fixes an issue:

- Add a `## Fix` note: branch, commit SHA, and how it was checked.
- Set `status: planned` if it is merged but waiting for a release, or `status: shipped` with `shipped_sha:` once it is live.
- Leave the quotes alone.

## Rules

- Quotes are evidence. Never paraphrase, correct, shorten or merge them.
- Nothing gets built because it is on the list. The owner decides. Answer "what should I work on" with the list and the ask counts, then let them choose.
- Count distinct people, not messages. Three emails from one customer about one thing is one ask with three quotes; note it.
- Keep personal data minimal: a first name or handle in `from` is enough. Do not store phone numbers, addresses or payment details that arrive inside a forwarded message.
- Do not log feedback the user did not give you. Never scrape reviews from accounts the user does not own.

## Optional automation

Once the files work by hand, the same layout can be fed automatically: a forwarding address per product that appends rows, a phone shortcut that posts a text, and a nightly job that pulls app-store reviews and runs steps 2-4. Build that only when the user asks, and keep the rule that the job writes the list, not the code.
