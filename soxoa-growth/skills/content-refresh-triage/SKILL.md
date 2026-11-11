---
name: content-refresh-triage
description: "Use when a user has search performance data and wants to know which existing pages to fix first. Triggers include 'which pages should we update', 'find our striking distance keywords', 'analyze this Search Console export', 'which content is decaying', 'do we have keyword cannibalization', 'what should we prune', or 'prioritize our content refresh'. Sorts pages into refresh, merge, redirect, remove from search or leave alone, using the user's own query and page data, with the evidence for each call."
---

# Content refresh triage

Most sites gain more from fixing pages they already have than from publishing new ones. This skill takes the site's own search data and sorts every page into a short list of actions.

## Inputs

- A search console export by page and by query, ideally with two comparable periods: the last 28 days and the 28 days before, or the same weeks a year apart.
- The sitemap or a list of URLs with publish dates.
- Optional: conversions by page, so pages can be ranked by what they earn rather than by clicks.

## Method

1. **Check the data before reading it.** Confirm both periods are complete, cover the same weekdays, and are not split by a tracking change, a migration or a holiday. Note the totals. If the whole site gets 30 clicks a month, say that page-level conclusions are weak.
2. **Separate brand from non-brand queries.** Brand clicks move with the company's reputation, not with content work. Report them apart.
3. **Striking distance.** Queries with real impressions where the page sits just off the first page or low on it. For each, check whether the page actually answers that query. If it does not, the fix is a section or a clearer answer, not more keywords.
4. **Low click-through at a good position.** Pages ranking in the top five with a click rate well below the site's own norm for that position. Check what else is on the results page before blaming the title: an AI answer or a large feature above the result explains many of these.
5. **Decay.** Pages that lost a meaningful share of clicks between periods. Open each one and look for the cause: outdated facts, a year in the title, a competitor with fresher content, or a query whose results page changed.
6. **Cannibalization.** Queries where two or more of the site's pages trade places. Decide which page should own the query, then merge the other into it or change its focus.
7. **Dead weight.** Pages with no impressions over a long period. Decide per page: improve, merge, remove from search while leaving the URL up, or delete with a redirect. Pages that exist for customers and not for search are left alone.
8. **Score and sort.** For each candidate estimate effort (small edit, rewrite, merge) and upside (impressions available, commercial intent). List the top ten actions.

## Rules

- Averages hide everything. Position in an export is an average across queries, places and days. Look at the query-level rows before acting.
- Do not rewrite a page that is working because it looks old.
- Removing pages is hard to undo. Recommend it with evidence and leave the decision to the user.
- Small numbers get small claims. With a few dozen clicks, describe what was seen and avoid percentages.
- Anonymized queries are missing from exports. Totals by query will not add up to totals by page. That is expected.

## Output

A table of pages with action, evidence and effort. The top ten in order. A list of cannibalized queries with the page that should own each. A note on data limits and the date to rerun the same comparison.
