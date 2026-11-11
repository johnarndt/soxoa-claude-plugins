---
name: search-impact-check
description: "Use when a user asks whether a change they shipped helped or hurt their search visibility. Triggers include 'did our release hurt SEO', 'did that change affect our rankings', 'traffic dropped after the deploy', 'did the new pages help', 'check search visibility before and after', or 'is this a Google update or us'. Lines up releases against search data, separates brand from non-brand demand, checks the crawl signals, and says what the evidence supports and what it is too small to show."
---

# Search impact check

"Did what we shipped change our search visibility?" has three possible answers: yes, no, and the data cannot tell. The third is the most common and the least often given. This skill works out which one applies.

## Inputs

- What changed and when: release dates, the pages touched, anything about titles, URLs, templates, robots rules or rendering.
- Search console data by day, by page and by query for a period before and after.
- Optional: analytics and first-party order or signup counts, and the dates of known search engine updates.

## Method

1. **Build the timeline.** List every release in the window with its date and what it touched. Include the ones nobody thinks are relevant.
2. **Check the crawl signals now.** For the affected pages: status code as a crawler sees it, index directive, canonical, robots rules, presence in the sitemap, and whether the main content is in the server HTML. If these are healthy and unchanged, a technical cause is unlikely. If one changed on a release date, that is the lead.
3. **Size the channel.** State total search clicks per week before any analysis. If search brings seven clicks a week, it cannot explain a swing in orders, and no comparison of positions will be meaningful. Say so and stop the search analysis there.
4. **Compare like with like.** Same weekdays, complete days only, equal-length periods. Search console data lags by a few days: exclude the unfinished tail.
5. **Split brand from non-brand.** Brand clicks follow awareness, ads, press and word of mouth. Non-brand clicks follow content and rankings. A change in one says little about the other.
6. **Look at the affected pages against the rest.** If the pages the release touched moved and the untouched pages did not, the release is a candidate. If everything moved together, look outside: seasonality, a search engine update, a tracking change.
7. **Read the query rows.** For the pages that moved, which queries gained or lost impressions and position? A lost query with a stable position means lower demand or a new feature on the results page, not a ranking loss.
8. **Check measurement.** Did consent settings, tags or the analytics property change in the window? Many "drops" are tracking changes.
9. **Give the verdict in one of four forms.**
   - Caused by the release: the mechanism is identified and the timing fits.
   - Not caused by the release: signals healthy, untouched pages moved the same way.
   - Too small to tell: state the sample and what volume would be needed.
   - Something else changed: name it.

## Rules

- Timing alone is not cause. Two things happening in the same week is where the investigation starts.
- Report raw counts beside percentages. "Up 250%" on two clicks misleads.
- Average position is an average over different queries and days. Do not treat it as a rank.
- If the honest answer is that search is too small to matter here, give that answer and point to where the real cause may be.

## Output

The timeline, the crawl-signal table, weekly clicks and impressions split by brand and non-brand, affected against unaffected pages, the verdict with its evidence, and what to check next if the cause lies outside search.
