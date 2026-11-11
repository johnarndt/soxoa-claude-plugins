---
name: serp-teardown
description: "Use when a user wants to understand one search query before writing or rewriting a page for it. Triggers include 'tear down this SERP', 'what does it take to rank for this query', 'what is Google showing for this keyword', 'is there an AI Overview on this search', 'write a content brief for this query', or 'what is the search intent here'. Reads the live results and any AI answer for the query, names the intent and the winning formats, and turns that into a page brief."
---

# SERP teardown

Before writing a page for a query, look at what the search engine has already decided the query means. The results page shows the intent, the format that wins, the features that take the clicks and the sources an AI answer draws on. This skill reads one query at a time and produces a brief.

## Inputs

- The query, the country and language, and the device if it matters.
- The user's existing page for it, if any.
- A way to see results: a browser, a search tool or a results API. If none is available, ask the user to paste the results page.

## Method

1. **Capture the page as seen.** Date, location and device. Results differ by all three, so record them.
2. **List the features in order.** Ads, AI answer, featured snippet, local pack, "people also ask", video, images, shopping, discussions, then the organic results. Note how far down the first organic result sits. A query where four features precede it sends few clicks to anyone.
3. **Read the AI answer, if present.** Save its text verbatim, the sources it cites, and the structure it uses: a list, steps, a comparison, a definition. Those cited pages are the ones to study first.
4. **Classify the top ten organic results.**

   | Field | What to record |
   |---|---|
   | Page type | guide, tool, product page, category page, comparison, forum thread, video |
   | Who | vendor, publisher, marketplace, community, government |
   | Angle | beginner, expert, price-led, local, year in the title |
   | Depth | rough length and what it covers |
   | Freshness | published or updated date |

5. **Name the intent.** Learn, compare, buy, find a place, or reach a specific site. If the top ten are all tools and the user planned an essay, the plan is wrong for this query.
6. **Find what every strong result covers,** then find what none of them does. The first list is the entry fee. The second is the reason a new page deserves to exist: original data, a real example, a clear answer the others bury.
7. **Collect the related questions** from the page and note which ones the user's page should answer.
8. **Judge the odds honestly.** Who holds the top spots, how strong their sites are, whether the user has anything those pages lack. Recommend going for it, going for a narrower version of the query, or skipping it.

## Rules

- One capture is a sample. Results rotate, and AI answers vary between runs. Say so.
- Do not copy competitors' text or structure wholesale. Record what they cover, not their sentences.
- Difficulty scores from tools are estimates. Give the evidence, such as who ranks, rather than a number alone.
- A brief promises a better-matched page. It does not promise a position.

## Output

The dated capture, the feature list, the results table, the intent call, and a brief: target question, page type, the direct answer to lead with, sections to include, the gap to fill, facts and sources needed, and a go, narrow or skip recommendation with the reason.
