---
name: quiet-day-check
description: "Use when orders or signups suddenly stop and the user wants to know whether something broke. Triggers include 'we had orders Friday and nothing today', 'why did signups stop', 'sales went quiet, is something broken', 'did a deploy break checkout', 'is this a real drop or just noise', or 'check whether the site is still taking orders'. Compares the quiet period with the business's normal rhythm, lines up recent releases, and walks the live path to the payment step to prove it still works."
---

# Quiet day check

A good day followed by silence feels like a fault. Often it is ordinary variation in a small number. Sometimes it is a broken checkout. This skill tells the two apart in a fixed order: is it unusual, did something change, does the path still work.

## Inputs

- Read access to orders or signups with timestamps, and to the release history.
- The customer-facing path: the pages from landing to the payment or confirmation step.
- The business's time zone and its customers' time zone.

## Method

1. **Count by local day.** Group orders by calendar day in the customers' time zone, not server time. A "quiet day" in UTC can be an artifact of where midnight falls. Show at least four weeks, with created, paid and cancelled as separate counts.
2. **Establish normal.** Weekly totals for the previous weeks, and the usual number of zero days. If the business averages a few orders a week, two empty days in a row is normal, and the good day was the unusual one. Say which it is.
3. **Look at who ordered.** Distinct customers on the busy day. Eight orders from two customers is one event, not a trend.
4. **Line up the releases.** Every deploy between the last order and now, with time and what it changed. Mark any that touched pricing, checkout, forms, authentication, email or payment configuration.
5. **Check the service's own signals.** Health endpoint, error logs and monitoring for the window. Failed payments, abandoned checkouts and error counts by day. A rise in started-but-unpaid orders after a release is the strongest sign of a break.
6. **Walk the live path.** In a browser, as a new customer on production: land, enter the details, get the quote or cart, reach the payment page. Stop before paying. Use obviously fake test details and record them so the test record can be found and removed later. Note every step that is slow, confusing or broken.
7. **Check the messages.** If the path depends on an email or a code, confirm that message sends and arrives.
8. **Check demand.** Where do orders come from: search, ads, referrals, direct, an agent or partner channel? Is that source still sending visits? A paused ad or a lapsed listing looks the same as a broken checkout from the orders table.
9. **Give the verdict.** One of: the path is broken at a named step, demand fell from a named source, a release changed behavior, or this is within normal variation. State the evidence for the one chosen and what was ruled out.

## Rules

- Read-only on production data. One test order, clearly marked, never paid.
- Do not enter real card details or complete a purchase to test.
- Small numbers: report counts, not percentages, and do not build a story on one day.
- If the walk-through finds a real fault, report it at once before finishing the rest.
- Keep customer data out of the report. Counts and order states are enough.

## Output

The daily table in local time, the weekly baseline, the release timeline, the result of each step in the walk-through, where demand comes from, the verdict, and the test record to clean up.
