---
name: programmatic-page-gate
description: "Use when a user is generating many pages from a template and data, and wants to publish only the ones worth indexing. Triggers include 'programmatic SEO quality check', 'which of these generated pages should be indexed', 'we have thousands of city pages', 'avoid thin content at scale', 'set a publish rule for template pages', or 'audit our programmatic pages'. Defines a per-page data test, splits pages into publish, hold and drop, and wires the sitemap and index directives to that test."
---

# Programmatic page gate

A template times a dataset can produce thousands of pages in an afternoon. Most of them will have nothing to say. The fix is a gate: a test each page must pass on its own data before it is allowed into the sitemap and the index.

## Inputs

- The template and the dimensions it multiplies: service by city, product by integration, term by industry.
- The dataset behind it, or a sample of rendered pages.
- How pages currently reach the sitemap and what index directive they carry.

## Method

1. **Name the unique value per page.** Write one sentence: "This page is worth visiting because it shows ___ for ___." If the blank is filled by the same text on every page with a name swapped, the template has no per-page value yet. Stop and fix that first.
2. **Define the data test.** Turn that sentence into a rule a script can check. Examples:
   - at least N real records for this combination
   - the records are newer than a set age
   - at least one field differs from the parent page and from sibling pages

   Word count is not the test. Real data that differs from page to page is.
3. **Measure the current set.** Run the test over every combination. Report how many pass, fail for no data, fail for stale data, and are near-duplicates of a sibling.
4. **Set three states.**

   | State | Meaning | Sitemap | Index directive | Links |
   |---|---|---|---|---|
   | Publish | passes the test | included | indexable | linked from hubs |
   | Hold | page exists, data not there yet | excluded | noindex | reachable, not promoted |
   | Drop | combination makes no sense | excluded | not generated | none |

   The state must be computed from the data at build or request time, not kept in a hand-edited list.
5. **Check the pages that pass.** Read ten at random as a visitor. Does each answer the query its title implies? Is the data dated and sourced? Would the page embarrass the business if a customer landed on it?
6. **Check the hubs.** Every published page needs a path from a hub a person could follow. Hubs list only published pages.
7. **Watch for drift.** Data goes stale and pages should fall back to hold. Add a count of pages by state to a regular report, so a jump in either direction is noticed.
8. **Scale in steps.** Publish a few hundred, watch how many get indexed and get impressions, then widen. An index rate that falls as volume rises is the search engine's verdict on the template.

## Rules

- Never fill empty pages with generated filler to pass the gate. The gate exists to keep those out.
- State the data's source and date on the page.
- Page count is a cost, not an achievement. Report published pages that receive impressions, not pages generated.
- Changing thousands of pages' index status at once is a large change. Recommend it and let the owner approve and time it.

## Output

The one-sentence value statement, the data test in plain words and as pseudocode, counts by state, the ten-page reading notes, the sitemap and directive rules, and the rollout steps with what to measure between them.
