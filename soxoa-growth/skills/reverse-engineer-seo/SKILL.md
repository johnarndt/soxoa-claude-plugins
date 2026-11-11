---
name: reverse-engineer-seo
description: "Use when a user wants to understand how a competitor's site is built to win search and AI answers. Triggers include 'reverse engineer their SEO', 'how is this site getting traffic', 'what pages do they rank with', 'break down their content strategy', 'what templates are they using', or 'are they doing programmatic SEO'. Reads the sitemap, robots file, page templates, internal links and structured data, then returns the site's page types, scale, linking pattern and the few plays worth copying."
---

# Reverse engineer a site's search strategy

Read a site the way a crawler does and work out its plan: which page types it publishes, at what scale, how they link together, and which ones are doing the work.

## Inputs

- The domain. Optional: the queries the user cares about and their own domain for comparison.
- Tools: fetch for the sitemap, robots file and sample pages. A rank or backlink tool adds estimates but is not required.

## Method

1. **Inventory.** Fetch the robots file and every sitemap it lists. Count URLs by first path segment. A site with 40 blog posts and 3,000 pages under one directory is a programmatic site with a blog attached.
2. **Page types.** Sample three to five URLs from each path group and name the template: glossary term, city page, comparison, integration, tool, guide, template gallery, data study. For each template record:
   - the title and heading pattern, with the variables visible in it
   - which blocks are unique per page and which are boilerplate
   - word count of the unique part
   - structured data types present
   - whether the page is indexable (status, canonical, robots directive)
3. **Data source.** For programmatic templates, work out where the per-page data comes from: their own product data, a public dataset, user submissions, or generated text. Pages backed by data nobody else has are hard to copy. Pages backed by generated filler are a risk, not a play.
4. **Linking.** From the homepage and a hub page, map how each template is reached: navigation, hubs, related links, footers, breadcrumbs. Note the click depth of the money pages.
5. **Money path.** Find where each template sends a reader next: signup, free tool, demo, another article. Templates with no path to a product are traffic for its own sake.
6. **What ranks.** If a rank tool is available, list the top pages and queries as estimates. Without one, search a handful of the user's queries and record where the site appears and with which template.
7. **AI readiness.** Check for a machine-readable summary file, markdown versions of pages, crawl rules for AI user agents, and whether pages lead with a direct answer.
8. **Freshness.** Use sitemap dates and visible dates to estimate publishing cadence per template.

## Rules

- Respect the robots file and keep request volume small: sample, do not mirror the site.
- Third-party traffic and rank numbers are estimates. Say so and name the source.
- A large page count is not evidence of traffic. Many programmatic sections are mostly unindexed.
- Describe structure. Do not copy text, data tables or designs.

## Output

A table of page types (template, count, unique content, data source, indexable, links in, next step), a short description of the linking pattern, the two or three templates that appear to carry the site, and for each a note on whether the user has the data or expertise to build an honest version. List what was sampled and what was not.
