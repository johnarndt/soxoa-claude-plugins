---
name: audit-site-discoverability
description: Audit an authorized site's public page inventory and internal links to find disconnected content, crawl barriers, and practical navigation repairs.
---

# Audit site discoverability

Find content that exists but lacks a usable path from the site's public entry points. Produce a dated read-only audit and repair recommendations. This skill does not publish links, change content, submit forms, or promise search-ranking improvements.

## Inputs and access

Use the homepage, sitemap or supplied URL inventory, allowed domains, intended public entry points, and available browsing or HTTP tools. If only an HTML export or crawl file is available, audit that material and identify its date and limits. Use public pages or existing authorized access. Do not cross authentication, payment, CAPTCHA, or explicit access barriers.

Agree a practical crawl boundary from the task: hosts, path families, volume, request pace, and exclusions such as logout, checkout, account actions, and unbounded query calendars. A sitemap locates pages but is not itself proof of a visitor navigation path.

## Method

1. Record the observation time and build the URL inventory from supplied sources and discovered public links. Normalize fragments and equivalent URL forms carefully. Preserve meaningful query parameters, redirects, and cross-host differences rather than merging unrelated resources.
2. For each inspected page, record final URL, response status, canonical, indexing directives, and relevant links. Note inaccessible pages separately. Check whether robots instructions or page directives limit the intended discovery path.
3. Build a directed graph from actual navigational links, starting at the authorized public entry points. Compare the reachable set with the inventory. Separate disconnected pages, redirect problems, broken destinations, blocked paths, and pages with uncertain reachability because a crawl was incomplete.
4. Distinguish links observed in server HTML from links observed after browser rendering. If JavaScript navigation may change the result and browser tools are available, inspect representative affected pages. Do not describe an HTML-only graph as a full rendered crawl.
5. Inspect the human path for each material disconnected cluster. Recommend the smallest useful set of links: a relevant parent page or topic hub, meaningful anchor text, a place users would expect it, and links to the relevant children. Avoid a sitewide link dump designed only to change the count.
6. Prioritize by user intent and business relevance, then by size and confidence of the gap. A small disconnected support section may matter more than many low-value archive pages. Identify any misleading page copy encountered only when it affects the proposed path.

## Output

Return an inventory summary, the crawl scope and method, a table of material gaps with evidence, recommended source-page-to-destination links, and a bounded verification plan. Include counts with their denominator, observation time, and any uninspected URLs. Distinguish an observed disconnected path from a suspected search-engine indexing issue; do not infer indexing or ranking from link reachability alone.

When asked to verify an implemented repair, reread the changed public pages, confirm the intended links resolve, and recompute reachability for the affected cluster. Check the relevant status, canonical and indexing directives. Compare the same scope before and after and preserve both observations.

Stop when the authorized inventory is accounted for, or access/rate/volume limits prevent completion. Return the partial result with remaining scope instead of repeated blocked requests. Changes require a separate editing task; this audit grants no deployment authority.

Package status: this Claude skill draft has not been behaviorally tested in Claude. Historical navigation audits informed the method; they do not validate this package or establish SEO gains.
