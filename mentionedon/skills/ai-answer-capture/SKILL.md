---
name: ai-answer-capture
description: Use when a user wants to check, record, or track what AI assistants say about their business, by hand and consistently. Triggers include "does ChatGPT mention my business", "how do I check if AI recommends us", "set up AI visibility tracking", "what prompts should I test", "help me log AI answers", "make a capture sheet", "monitor Perplexity/Gemini/Claude/Grok/Copilot answers monthly", or pasted screenshots or answers from an AI assistant that need recording. Builds a fixed prompt set, a capture log that matches MentionedOn's observations format, and a re-check cadence. Records only answers the user actually captured.
---

# AI answer capture protocol

MentionedOn's tools do not query AI assistants. To learn whether assistants mention or cite a business, someone has to ask them and write down what they said. This skill sets that up so the records are consistent, dated, and ready for the `ai-mention-report` skill (which calls `summarize_scan_evidence`).

## When not to use this skill

- The user already has a log and wants rates: go straight to `ai-mention-report`.
- The user wants you to produce the AI answers: do not. Your own reply in this conversation is not a clean capture of any assistant, and inventing or simulating answers would be fabricated evidence. If the user wants Claude captured, they should open a fresh Claude chat (or API call) with no prior context and record that answer.
- The user wants automated, scheduled scanning across assistants: nothing in this plugin does that. Say so plainly.

## What to gather from the user

1. Business name exactly as customers know it, plus common variants (with and without "LLC", abbreviations).
2. Their own domain and the profile URLs they control (to recognize business citations).
3. Main services and the towns or region they serve, or for a brand, the product category.
4. Two to five competitors they care about (optional, for context only; the tool counts only the named business).
5. Which assistants matter to their customers. Default set: ChatGPT, Claude, Gemini, Perplexity, Grok, Microsoft Copilot, plus Google AI Overviews or AI Mode if they appear for the query.
6. How they will capture: the consumer app or website (most common), a model API, or an AI answer shown on a search results page.

## Workflow

1. **Build the prompt set.** Draft 5 to 12 prompts with the user from `references/prompt-library.md`: mostly unbranded buyer questions ("best emergency plumber in Sacramento"), a few comparison prompts, and one or two branded prompts ("what do you know about <name>"). Keep the wording fixed from now on. Each prompt must be 3 to 1000 characters.
2. **Agree the capture rules** (below) and the assistants list. Write both at the top of the log so the next session repeats them.
3. **Give the user the log template** from `references/capture-log-template.md`, pre-filled with the prompts and assistants. One row per prompt per assistant per session.
4. **User runs the prompts** and pastes each answer, its source links, or a screenshot. For each pasted answer, fill the row: `businessMentioned`, `businessCitationUrls`, `position`, `sentiment`. Show your reading of each row and let the user correct it. If they did not paste the answer text or a screenshot, record only what they tell you and note it.
5. **Record failures honestly.** If an assistant refused, errored, required sign-in, or was skipped, log the row with status `error` or `skipped` and a `reason`. Those rows count as unavailable, not as "not mentioned".
6. **Hand off.** When a session is done, offer to run `ai-mention-report` on the rows. Remind the user that a call takes at most 50 observations.
7. **Set the re-check cadence** (below) and write the next date into the log.

## Capture rules (keep them identical every session)

- Use a fresh chat with no earlier messages, signed out or in a consistent account state, with personal memory or custom instructions off if the user can turn them off. Note the state in `sourceLabel` if it varies, for example "ChatGPT app, signed in".
- Paste the prompt exactly as written. Do not add the business name to unbranded prompts.
- Record the location setting if the assistant uses it (local results change by city).
- Capture the full answer plus any listed sources or citations.
- Record the time with a timezone, for example `2026-10-18T09:30:00-07:00` or `2026-10-18T16:30:00Z`.
- Do not re-run a prompt until you get a better answer. If the user runs a prompt twice on purpose (to see variation), log both rows.

## Field-by-field mapping to the observations schema

Each row becomes one item in `summarize_scan_evidence` `observations`.

Completed capture (`status` must be `"completed"`):

| Field | Required | Rule |
|---|---|---|
| `sourceLabel` | yes | 1 to 80 characters. Assistant plus surface, for example "ChatGPT app", "Perplexity web", "Gemini API". Keep labels identical across sessions so results group correctly. |
| `surfaceType` | yes | `consumer_app_capture` (chat app or website), `model_api_capture` (API call), `search_ai_capture` (AI answer inside a search results page), `other`. |
| `prompt` | yes | The exact prompt text, 3 to 1000 characters. |
| `observedAt` | yes | ISO 8601 date-time with `Z` or an offset. A date alone is rejected. |
| `status` | yes | `"completed"`. |
| `businessMentioned` | yes | `true` only if the answer names the business (or an unmistakable variant). A citation link alone without the name is `false`. |
| `businessCitationUrls` | no | Up to 10 full URLs from the answer's sources that point to the business's own site or a page specifically about the business (its profile, a review page about it). Not generic directory home pages, not competitor pages. Empty or omitted if none. |
| `position` | no | 1 to 100. The business's place in a ranked or bulleted list of businesses. Omit if it is not a list or the business is not named. |
| `sentiment` | no | `positive`, `neutral`, `negative`, `mixed`, or `not_scored`. Only judge it when the business is mentioned; otherwise omit or use `not_scored`. |

Unavailable capture: `sourceLabel`, `surfaceType`, `prompt`, `observedAt` as above, `status` `error` or `skipped`, and `reason` (3 to 500 characters, for example "Required sign-in", "Refused to name local businesses", "Rate limited"). No other fields are allowed on these rows.

## Re-check cadence

- Baseline: one full session (every prompt on every assistant) before any site changes.
- Then monthly, on roughly the same day and time of day, with the same prompts, assistants, and account state.
- After a significant site change, wait until the change is live and has had a chance to be crawled (weeks, not days) before reading anything into new captures.
- Optional: run each prompt twice per session to see how much answers vary on their own. Variation between runs is normal and should temper any conclusions.
- Keep each session's rows together with the date so `ai-mention-report` can compare periods.

## Guardrails

- Never fabricate, simulate, or "estimate" an AI answer, a citation URL, or a position.
- Do not run prompts in other AI products on the user's behalf unless the user explicitly asks and this Claude session has a way to do it; even then, say how it was captured in `sourceLabel` and `surfaceType`.
- A capture shows what one assistant said once, at one time, in one context. It does not prove what other users see.
- Do not promise that mentions will increase.

## If the MentionedOn tools are not connected

This skill does not need the connector until the report step. You can build the prompt set, the log, and the cadence without it. For the report, the user needs the connector: in Claude, add `https://mentioned-on.com/mcp` under Customize > Connectors (no sign-in); in Claude Code, `claude mcp add --transport http mentionedon https://mentioned-on.com/mcp`. Without it, you can count rows by hand for the user, but label the counts as your own tally.

## Worked example

User: "I run Bright Smile Dental in Boise. How do I see if AI recommends us?"

1. Prompt set (fixed): "best family dentist in Boise", "dentist in Boise that takes new patients and does Saturday appointments", "Bright Smile Dental vs other Boise dentists", "what do you know about Bright Smile Dental in Boise, Idaho".
2. Assistants: ChatGPT app, Claude app, Gemini app, Perplexity web.
3. The user pastes the ChatGPT answer to prompt 1. It lists five dentists, Bright Smile Dental third, positively, and cites `https://brightsmile.example/` among its sources. Row:

```json
{"sourceLabel": "ChatGPT app", "surfaceType": "consumer_app_capture", "prompt": "best family dentist in Boise", "observedAt": "2026-10-18T10:05:00-06:00", "status": "completed", "businessMentioned": true, "businessCitationUrls": ["https://brightsmile.example/"], "position": 3, "sentiment": "positive"}
```

4. Gemini asked the user to sign in and they skipped it:

```json
{"sourceLabel": "Gemini app", "surfaceType": "consumer_app_capture", "prompt": "best family dentist in Boise", "observedAt": "2026-10-18T10:12:00-06:00", "status": "skipped", "reason": "Sign-in required on this device; not captured."}
```

5. After all rows are logged, offer `ai-mention-report` and set the next session for 2026-11-18.
