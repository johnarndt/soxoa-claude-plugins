---
name: signup-pulse
description: "Use when an owner wants to know who signs up for their product and where those people get stuck. Triggers include 'email me when someone signs up', 'am I getting alerts for new signups', 'who signed up this week', 'morning list of new users', 'where are people dropping off', 'why isn't anyone converting', or 'audit my funnel'. Adds an instant per-signup alert, a people-first morning digest with each person's furthest journey stage, and a drop-off review that walks the real funnel and ranks the blockers."
---

# Signup pulse

Three pieces that let a small team see real people instead of totals:

1. **Instant alert**: one email to the owner the moment an account is created.
2. **Morning digest**: who is new, and how far each recent signup got.
3. **Drop-off review**: walk the funnel as a new user, find where people stop, rank the fixes.

Build them in that order. Ask which products are in scope and confirm before changing any code.

## 1. Instant alert

- Fire on **account creation**, not on onboarding completion. People who quit halfway are the ones the owner most needs to see.
- Hook it after the user row commits (an ORM after-create hook, a database trigger, or the auth provider's webhook). Send it in the background so a mail failure can never block or slow signup.
- Make it idempotent: claim a row (`signup_alerts(user_id primary key)`) before sending, so retries and double hooks send once.
- Subject: `New <Product> signup: <email>`. Body: email, name if given, signup source or UTM if known, time, and a link to the admin record. Nothing else.
- Add an hourly backstop that alerts on any account created without a claim row, then claims it.
- Filter obvious bots (disposable domains, bursts from one IP, honeypot fields filled) into a separate "probably bots" line instead of silently dropping them.

## 2. Morning digest

People first, numbers last.

```
3 new since yesterday
- dana@… (via google ad) : created account → connected data source · active 2h ago
- …

Last 30 days, by furthest stage
- marcus@… : created account only · STUCK 6 days
- …

Ops: 2 failed payments, 1 bounced email        (only lines that are non-zero)
```

- Define the journey stages per product with the owner (for example: created account → verified email → first project → first result → paid). Store each user's furthest stage and last-active time; compute both from existing tables where possible.
- Flag `STUCK` when someone has not moved for N days (owner picks N, default 3).
- Never put a zero in the subject line. If nobody signed up, say so in one line and skip the email if the owner prefers.
- Keep the digest cheap: one query per product at send time. Do not wake sleeping databases on a frequent schedule for this.

## 3. Drop-off review

1. Create a fresh account per product through the real public path (or a staging copy), on desktop and phone width. Record each step, the time it took, and anything that confused you.
2. Pull the stage counts for real (non-bot) signups over the window the owner names.
3. For each step where people stop, write: the step, how many reached it vs. passed it, the likely cause you observed, and a specific fix (copy, layout, a removed field, a broken email, a missing default).
4. Rank fixes by people affected × ease. Mark anything you could not reproduce as a hypothesis.
5. Deliver one document per product; implement fixes only after the owner picks them.

## Rules

- Real people only. Report bots separately and say how you identified them.
- Small numbers are fine; do not dress them up. "1 of 7 reached first result" is the useful sentence.
- Alert emails go to the owner only. Never email, message or retarget the signups from this skill.
- Store the minimum: email, timestamps, stage. No passwords, payment data or message contents in the digest.
- Customer-facing emails, if the owner asks for any later, come from the product and its founder, not from a parent company or agency.
