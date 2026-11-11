---
name: buyer-question-map
description: "Use when a user needs the real questions buyers ask, for search content or for tracking AI answers. Triggers include 'what questions should we answer', 'build a prompt set for AI visibility', 'what do people ask ChatGPT about our category', 'keyword research for AEO', 'map buyer questions', or 'what should our FAQ cover'. Collects questions from the user's own sources, groups them by buying stage and intent, and returns a fixed, deduplicated list with the source of each one."
---

# Buyer question map

Search engines and assistants answer questions. Before writing a page or tracking an answer, fix the list of questions that matter, in buyers' words, and keep it stable so results can be compared over time.

## Inputs

Ask for whatever exists. More sources give a better map.

- Sales and support: call notes, chat logs, emails, the questions asked before buying and after.
- Search data: a query export from the site's search console, site search terms, paid search terms.
- Public sources: "people also ask" boxes, forum and community threads, review sites, competitor FAQ pages.
- The business basics: what is sold, to whom, where, at what price.

## Method

1. **Collect verbatim.** Pull questions as written. Keep the buyer's wording, including the awkward phrasing. Record the source of each.
2. **Normalize lightly.** Merge exact duplicates and trivial variants. Keep variants that change intent: "best payroll software" and "cheapest payroll software" are two questions.
3. **Tag each question.**
   - Stage: problem (do I have this problem), category (what kinds of solutions exist), shortlist (who is good), comparison (A or B), brand (is this company any good), purchase (price, contract, setup), use (how do I do X with it).
   - Local or not: does the answer depend on a place.
   - Who is asking: role or segment when it is clear.
4. **Mark commercial weight.** Flag questions asked just before buying. Twenty problem-stage questions matter less than five shortlist ones if the goal is revenue this quarter.
5. **Write the assistant version.** People type keywords into search and sentences into assistants. For each priority question write the natural-language form a person would give an assistant, with their situation in it. Do not add the brand name unless it is a brand-stage question.
6. **Check coverage.** For each priority question, note whether the site has a page that answers it directly, a page that touches it, or nothing.
7. **Freeze the set.** Pick 20 to 50 questions as the tracked set. Give each an ID. Changes get a dated note, so month-over-month comparisons stay honest.

## Rules

- Do not invent questions to fill a stage. An empty stage is a finding: go and collect more from sales.
- Do not prime the assistant version. No "explain why X is the best". The question must be one a neutral buyer would ask.
- Search volume from tools is an estimate and often missing for long questions. Absence of volume is not absence of demand.
- Strip personal details from quotes before the list is shared.

## Output

A table: ID, question as asked, assistant phrasing, stage, local, source, commercial weight, current coverage. Then three lists: questions with no page, questions where a page exists but buries the answer, and the frozen tracking set.
