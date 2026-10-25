---
name: owner-actions
description: "Use at the end of agent work, or when asked, to separate what the AI finished and verified from what only the owner can do. Triggers include 'what do I need to do', 'what's left for me', 'make me a to-do list from this', 'what's blocked on me', 'list the dashboard steps', or the end of a long session with logins, payments, approvals or account settings involved. Produces a dated, copy-paste-ready owner action list ordered by urgency, with proof for everything marked done."
---

# Owner actions

Agents can run commands, edit code and check results. They should not click "pay", sign in as the owner, grant access, approve a message to a customer, or make the strategy call. This skill draws that line in writing, every time, so nothing waits silently on a person who does not know it is waiting.

## What belongs to the owner

- Signing in, OAuth consent, creating accounts, multi-factor prompts.
- Payments, plan changes, refunds, anything that spends money.
- Sending to customers, prospects or the public: emails, posts, ads, store submissions.
- Account, security, DNS and billing settings in third-party dashboards.
- Legal, compliance or contractual sign-off.
- Decisions: what to build, what to stop, what to charge.
- Rotating any credential that appeared in chat or logs.

Everything else (running commands, editing files, testing, drafting, verifying) the agent does itself and records as done.

## Output

Write `OWNER_ACTIONS_YYYY-MM-DD.md` (or the name the user prefers) and summarize it in chat.

```markdown
# Owner actions · 2026-10-25

## Done (verified)
1. ~~Fixed the signup alert on Acme~~ · test signup at 10:42 produced one email · commit 3f9c2e1

## Do now (money or customers affected)
2. **Turn on the payment webhook.** Dashboard → Developers → Webhooks → Add endpoint → paste `https://acme.example/api/webhook` → select `checkout.session.completed`. Why: paid orders are not being recorded. If skipped: every sale needs manual entry.

## Toggles (flip when ready)
3. …

## Decisions
4. **Keep or stop the free tier?** Options and what each changes, in two lines.
```

Each item has: the exact place (URL or menu path), the exact value or command to paste, one line on why, and what happens if it is not done. Number items across sections so the owner can reply "did 2 and 4".

## Rules

- Never write a secret, password or full key into the list. Name it ("the payment provider's webhook signing secret") and say where it goes.
- "Done" requires proof: a command output, a test result, a live URL, a commit. Without proof it stays in a "Done, not verified" line.
- Do the work before listing it. If the agent can do a step, it does the step instead of listing it.
- Keep it short. If the owner has more than about ten open items, put the top five first and the rest under "Later".
- Carry unfinished items forward into the next dated file; do not silently drop them.
- A gate that exists on purpose (a human review queue, an approval step) is listed as a gate, not reported as a bug.
