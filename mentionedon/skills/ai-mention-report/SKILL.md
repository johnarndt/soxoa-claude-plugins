---
name: ai-mention-report
description: Use when a user has captured AI assistant answers (from ChatGPT, Claude, Gemini, Perplexity, Grok, Copilot, Google AI Overviews, or an API) and wants them summarized into mention rate, citation rate, per-assistant breakdown, sentiment, or a month-over-month comparison. Triggers include "summarize my AI scan results", "what's our mention rate", "how often does ChatGPT cite us", "compare this month's AI answers to last month", "turn this capture log into a report", or a pasted spreadsheet of prompts and answers. Calculates the numbers with the MentionedOn summarize_scan_evidence tool and reports them with dates and limits.
---

# AI mention and citation report

This skill turns dated captures of AI answers into counts and rates with MentionedOn's `summarize_scan_evidence` tool. The tool only does arithmetic on the observations it is given. It does not call any AI provider, fetch any URL, store the data, or establish what an assistant says today; its output field `establishesLiveInclusion` is always `false`.

## When not to use this skill

- No captures exist yet: use `ai-answer-capture` to set them up.
- The user wants a site readiness score or fix list: use `ai-discovery-audit` or `visibility-action-plan`.
- The user wants competitor share of voice: the tool counts only the one named business. You can describe competitor names that appear in the pasted answers, but label that as your own reading, separate from the tool's numbers.

## Inputs and exact tool mapping

Tool: `summarize_scan_evidence`

| Argument | Required | Rule |
|---|---|---|
| `businessName` | yes | 2 to 120 characters. |
| `observations` | yes | 1 to 50 items. Each item is either a completed capture or an unavailable capture. |

Completed capture: `sourceLabel` (1 to 80 chars), `surfaceType` (`model_api_capture`, `consumer_app_capture`, `search_ai_capture`, `other`), `prompt` (3 to 1000 chars), `observedAt` (ISO 8601 date-time with `Z` or offset), `status` `"completed"`, `businessMentioned` (boolean), optional `businessCitationUrls` (0 to 10 URIs, default empty), optional `position` (integer 1 to 100), optional `sentiment` (`positive`, `neutral`, `negative`, `mixed`, `not_scored`).

Unavailable capture: `sourceLabel`, `surfaceType`, `prompt`, `observedAt`, `status` (`error` or `skipped`), `reason` (3 to 500 chars). No other fields.

Full row rules and the log format are in `../ai-answer-capture/SKILL.md` and `../ai-answer-capture/references/capture-log-template.md`.

## Workflow

1. **Get the captures.** Accept a pasted table, CSV, or a list of answers. Every row must come from a real capture by the user (or a capture they asked you to make and that you labeled as such). If a row lacks a date and time, ask for it; if they only know the day, ask for an approximate time and timezone and say in the report that times are approximate. Never fill gaps with guesses.
2. **Normalize and check.** Convert rows to observations. Keep `sourceLabel` values consistent (merge "ChatGPT" and "chatgpt app" only if the user confirms they are the same surface). Check every URL in `businessCitationUrls` is a full URL and really points to the business's site or a page specifically about it. Remove any field not in the schema.
3. **Confirm questionable judgments** with the user, especially `businessMentioned` when the answer used a variant name, and `sentiment`.
4. **Split if needed.** Over 50 observations, or more than one period: make one call per period (for example one per monthly session). Do not mix periods in one call when the goal is a comparison.
5. **Call the tool.** It is deterministic and stateless, so retries with the same input are safe. On a validation error, read the path in the message (for example `observations[7].observedAt`), fix that row with the user's information, and retry.
6. **Present** with the template below. For comparisons, follow `references/reading-results.md`.
7. **Suggest next steps** that follow from the data: for low citation rates, `visibility-action-plan` with `goal` `strengthen_citation_evidence`; for many unavailable rows, fix the capture setup before the next session.

## Reading the output

- `scope` is always `caller_supplied_captures_only`; `establishesLiveInclusion` is always `false`. Say both in plain words.
- `observationCount` = all rows; `completedCount` = rows with status `completed`; `unavailableCount` = `error` plus `skipped`.
- `mentionCount` and `mentionRatePercent`: completed rows with `businessMentioned` true, over `completedCount`. Unavailable rows are not in the denominator. `null` when there were no completed rows.
- `businessCitationCount` and `businessCitationRatePercent`: completed rows with at least one `businessCitationUrls` entry, over `completedCount`. A row can count as a citation even when `businessMentioned` is false (a source link without the name in the text). Point that out if it happens.
- `observedAtRange` gives `earliest` and `latest` timestamps, or `null`.
- `uniqueBusinessCitationHosts`: the distinct hostnames among citation URLs. Useful to show which of the business's pages or profiles assistants cite.
- `sentimentBreakdown`: counts for `positive`, `neutral`, `negative`, `mixed`, `notScored`. Completed rows without a sentiment count as `notScored`.
- `bySource`: per `sourceLabel`, the same counts and rates. A source with only unavailable rows has `null` rates.
- `unavailable`: the error and skipped rows, with reasons.
- `evidenceStatements`: plain sentences the tool generated. Quote them as they are.
- `limitations`: always show them.

## Answer template

```
**AI answer summary: <businessName>**
Captures from <observedAtRange.earliest> to <observedAtRange.latest>, supplied by <the user>. MentionedOn calculated these numbers from those captures only; it did not query any assistant, and this is not proof of what assistants say today.

- Mentioned in <mentionCount> of <completedCount> completed captures (<mentionRatePercent>%).
- Business citation link in <businessCitationCount> of <completedCount> (<businessCitationRatePercent>%).
- Not captured: <unavailableCount> (<short reasons>).

| Assistant | Completed | Mentioned | Mention rate | Cited | Citation rate |
(one row per bySource item)

Cited hosts: <uniqueBusinessCitationHosts>
Sentiment when scored: <positive> positive, <neutral> neutral, <negative> negative, <mixed> mixed (<notScored> not scored)

**What the tool says**
- <each evidenceStatements item>

**Limits**
- <each limitations item>
- Sample size: <completedCount> answers. Small samples move a lot between sessions.
```

## Guardrails

- Never add, alter, or "correct" captures to improve the numbers. Report what was captured.
- Never state or imply that the business is or is not recommended by an assistant in general. Say "in these captures".
- Do not claim that a site change caused a change in rates. At most say the rates differed between two sets of captures and list what else changed (prompts, assistants, account state, dates).
- Do not promise future mentions, citations, rankings, traffic, or revenue.
- Keep observations (the numbers) and your interpretation in separate sections.

## If the MentionedOn tools are not connected

If `summarize_scan_evidence` is not available, tell the user the MentionedOn connector is not connected. In Claude, add `https://mentioned-on.com/mcp` under Customize > Connectors (no sign-in). In Claude Code, run `claude mcp add --transport http mentionedon https://mentioned-on.com/mcp`. You may still tally the rows by hand using the same definitions, but label the result "manual tally by Claude, not a MentionedOn calculation", and do not present `evidenceStatements` or `limitations` as if the tool returned them.

## Worked example

User pastes three rows from a session on 2026-10-18: ChatGPT app mentioned the business at position 2 with a positive tone and cited `https://example.com/`; Perplexity web answered without naming it; Gemini app was skipped because it required sign-in.

Call:

```json
{
  "businessName": "Sample Plumbing Co",
  "observations": [
    {"sourceLabel": "ChatGPT app", "surfaceType": "consumer_app_capture", "prompt": "best plumber in Sacramento", "observedAt": "2026-10-18T17:00:00Z", "status": "completed", "businessMentioned": true, "businessCitationUrls": ["https://example.com/"], "position": 2, "sentiment": "positive"},
    {"sourceLabel": "Perplexity web", "surfaceType": "search_ai_capture", "prompt": "best plumber in Sacramento", "observedAt": "2026-10-18T17:05:00Z", "status": "completed", "businessMentioned": false},
    {"sourceLabel": "Gemini app", "surfaceType": "consumer_app_capture", "prompt": "best plumber in Sacramento", "observedAt": "2026-10-18T17:10:00Z", "status": "skipped", "reason": "Gemini required sign-in on this device."}
  ]
}
```

The live tool returns `completedCount` 2, `unavailableCount` 1, `mentionRatePercent` 50, `businessCitationRatePercent` 50, `uniqueBusinessCitationHosts` `["example.com"]`, sentiment 1 positive and 1 not scored, and `bySource` rows of 100% for ChatGPT, 0% for Perplexity, and `null` for Gemini. Present: "Mentioned in 1 of 2 completed captures (50%) on 2026-10-18; Gemini was not captured (sign-in required). Two answers is far too few to call a trend; the monthly session with the full prompt set will say more."
