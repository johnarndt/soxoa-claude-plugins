---
name: ai-crawler-access-check
description: "Use when a user wants to know whether AI assistants and their crawlers can actually read the site. Triggers include 'can ChatGPT read our site', 'are we blocking AI crawlers', 'check our robots.txt for GPTBot', 'why does the assistant say it cannot access our page', 'is our content visible without JavaScript', or 'audit AI bot access'. Tests robots rules, firewall behavior and what the server HTML contains for each important page, then reports what a crawler sees."
---

# AI crawler access check

An assistant cannot describe a page it cannot fetch. Three things block it without anyone noticing: a robots rule, a firewall or bot filter, and content that only exists after JavaScript runs. This skill checks all three on the user's own site.

## Inputs

- The site and a list of the pages that matter: homepage, pricing, product pages, the best guides.
- Whether the user wants AI crawlers allowed, blocked, or split by purpose. This is a business decision. The skill reports against whatever they choose.

## Method

1. **Robots rules.** Fetch the robots file. For each AI user agent the vendors publish, record allowed, blocked or unmentioned, and which paths. Separate the purposes, because vendors run different agents for them:
   - training crawlers
   - search and answer indexing crawlers
   - agents fetching a page on a user's request
   Blocking a training crawler and blocking a search crawler have different consequences. Check the vendors' current documentation for the agent names. They change.
2. **Robots file health.** Wrong content type, a redirect, a 5xx response or a file served only to browsers can each cause a crawler to treat the whole site as off limits or open. Record status and headers.
3. **Firewall and bot filtering.** Request each key page with a plain HTTP client and with each AI user agent string. Record status code, any challenge page, and response size. A 403, a challenge, or a tiny response means the request never reached the page. If the site sits behind a CDN with a bot or AI-crawler setting, ask the user what it is set to. A user agent string from the user's own machine is only a rough test, since real crawlers come from known address ranges.
4. **Server HTML content.** For each key page, fetch the raw HTML and extract the visible text without running scripts. Record word count, whether the main heading, the direct answer, prices and key facts are present, and whether the page is an empty shell that says "loading". Many crawlers do not run JavaScript.
5. **Head and directives.** Status, canonical, robots meta, and any header that tells crawlers not to index or not to use the content.
6. **Server logs, if the user can supply them.** Count requests by AI user agent, the status codes they received, and which pages they asked for. This is the only direct evidence of real crawler visits.
7. **Supporting files.** Presence and accuracy of the sitemap and any machine-readable summary file.

## Rules

- Test only sites the user controls or is authorized to test. Keep request volume small.
- Do not try to get past a firewall or challenge. Record it and stop.
- Allowing a crawler does not mean being cited. This check removes obstacles only.
- State plainly when a result comes from a simulated user agent rather than a real crawler visit.

## Output

A table per page: fetch status by agent, text visible without scripts, key facts present, directives. A robots summary by agent purpose. Findings in order: blocks the user did not intend, pages that render empty without scripts, then smaller issues, each with the owner who can change it.
