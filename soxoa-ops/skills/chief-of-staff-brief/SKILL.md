---
name: chief-of-staff-brief
description: "Use when someone running work through AI agents wants a daily or weekly recap of what actually happened. Triggers include 'what did we get done today', 'daily report', 'end of day summary', 'what did my agents ship', 'recap the week', 'set up a nightly report', or 'turn today's work into content ideas'. Reads git activity and agent session logs, then writes a short brief with fixed sections: TL;DR, what got worked on, takeaways, content angles and open threads."
---

# Chief-of-staff brief

A daily brief written from evidence, not memory: the commits that landed and the requests that were typed into AI sessions. It answers "what moved, what is stuck, what did I promise" in under two minutes of reading.

## Inputs

1. **Code activity.** Repositories the user names, or discovered under folders they name. For each: commits since the window start (message, files, diffstat), plus uncommitted changes. Cap any one repo's diff at about 6,000 characters.
2. **Agent sessions.** Today's session transcripts from the agent tools the user uses (for Claude Code, `~/.claude/projects/*/*.jsonl`). Take the session title, working folder and the user's typed requests, up to 25 per session and 600 characters each. Skip tool output.
3. **Window.** Default: since local midnight. Weekly mode: last 7 days.

Cap the total input (about 180,000 characters). When over, drop the oldest diffs first and keep every typed request.

## Output

```markdown
# Daily brief · 2026-10-25

## TL;DR
Three sentences: the biggest thing that shipped, the biggest thing that is stuck, the one decision waiting on the owner.

## What got worked on
Per product or repo: what changed, in plain words, with the commit or session it came from.

## Key takeaways
What today's work implies (a pattern of failures, a risk, a cost).

## Content angles
4-6 true things from today that could become a post, each one line.

## Open threads
Things started and not finished, promises made in a session, and anything waiting on someone.
```

## Rules

- Every claim traces to a commit or a typed request. If you cannot cite it, leave it out.
- Separate shipped (merged or deployed and verified) from changed (committed) from discussed (only talked about in a session). Never promote one to another.
- Do not include secrets. Transcripts often contain pasted keys, passwords and tokens; never quote a line that looks like one, and add an open thread suggesting the owner rotate it.
- Daily is narrative; keep metrics for the weekly so the two never repeat each other.
- If a data source fails (no transcripts, a repo will not read), say so in one line at the top. Never send a model error as if it were the brief.

## Scheduling (only when asked)

To make it nightly: a script that gathers the inputs above, calls the model with this skill's output format, writes `reports/YYYY-MM-DD.md`, and emails it to the owner. Add a retry and an "empty day" rule (skip or send one line). Confirm the send address and schedule with the user before installing anything.
