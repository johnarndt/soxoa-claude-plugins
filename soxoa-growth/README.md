![Soxoa Growth](.claude-plugin/icon.png)

# Soxoa Growth

Twenty-two skills for being found: in search results (SEO), in the sources AI assistants draw on (GEO) and in the answers they give (AEO). Three of them read another company's go-to-market, marketing stack and site strategy from public evidence. They come from the checks Soxoa runs on its own product sites and from MentionedOn, its AI-visibility product.

This plugin is instructions only. It has no MCP server, hooks, scripts or network calls of its own, and it sends data nowhere. Each skill works with the files, connectors and browsing tools your Claude session already has, and says what it needs when something is missing.

## Skills

### See what other companies are doing

| Skill | What it does |
|---|---|
| `reverse-engineer-gtm` | Work out how another company finds, sells to and keeps customers from its pricing, jobs, partners, reviews and ads, with every inference labeled. |
| `reverse-engineer-marketing` | List the tools, pixels, ads, emails and content tactics a company is running, each with the evidence a person can check. |
| `reverse-engineer-seo` | Read a competitor's sitemap, templates, internal links and structured data to see which page types carry the site. |

### Answers (AEO)

| Skill | What it does |
|---|---|
| `buyer-question-map` | Collect the real questions buyers ask, tag them by buying stage, and freeze a tracked set for content and AI-answer monitoring. |
| `answer-first-page` | Restructure one page so the direct answer comes first and stands alone, with tables, steps and sourced facts. |
| `answer-change-test` | A before and after comparison that tells a real change in AI answers from run-to-run noise. |
| `comparison-page-builder` | Build a versus or alternatives page from dated, sourced facts that says who each option suits, including when the competitor wins. |

### Sources and machine readability (GEO)

| Skill | What it does |
|---|---|
| `entity-fact-sheet` | One confirmed record of the business, and a list of every page, profile and listing that disagrees with it. |
| `write-llms-txt` | Write a short, accurate llms.txt from live pages and confirmed facts, check every link, and name who updates it. |
| `ai-crawler-access-check` | Test whether AI crawlers and agents can fetch your pages: robots rules, firewall behavior, and the HTML without JavaScript. |
| `citation-source-gap` | Tally which sites AI answers cite in your category and plan legitimate ways onto the ones that leave you out. |
| `ai-referral-tracking` | Count visits and conversions that arrive from AI assistants, apart from crawler fetches, with the blind spots stated. |
| `ai-shopping-feed` | Prepare a business profile, a product feed that matches the live pages, and agent instructions for assistant listing programs. |

### Search (SEO)

| Skill | What it does |
|---|---|
| `serp-teardown` | Read the live results and any AI answer for one query, name the intent and winning format, and write a page brief. |
| `content-refresh-triage` | Sort existing pages into refresh, merge, redirect, remove from search or leave alone, using your own query data. |
| `programmatic-page-gate` | A per-page data test that decides which template pages get published and indexed, which wait, and which should not exist. |
| `technical-seo-preflight` | A pass or fail check of status codes, redirects, canonicals, index directives, sitemap and titles around a launch. |
| `search-impact-check` | Line up releases against search data and say whether a change helped, hurt, or is too small to tell. |
| `schema-markup-check` | Compare each page's structured data with what the page visibly says, fix mismatches and draft what is missing. |
| `local-profile-audit` | Check a local business's map profile, listings, reviews and location pages against confirmed facts. |
| `prerender-public-pages` | Render a JavaScript app's public routes to real HTML at build time and fail the build if a page comes out empty. |

### Voice

| Skill | What it does |
|---|---|
| `authority-script` | Rebuild a short video script around a claim you can back from your own work, in your voice, with nothing invented. |

## Setup

- **Claude Code marketplace:** run `/plugin marketplace add johnarndt/soxoa-claude-plugins`, then `/plugin install soxoa-growth@soxoa-plugins`.
- **One skill:** copy its folder from `skills/` into `~/.claude/skills/` or a repository's `.claude/skills/`.
- **Claude apps:** zip a skill's folder (or download it from [johnarndt.net/skills](https://johnarndt.net/skills)) and upload it under Customize → Skills.

## Example prompts

- "Reverse engineer how this company goes to market. Public pages only."
- "Which marketing tools and ads is this competitor running?"
- "Can AI crawlers read our pricing page without JavaScript?"
- "Did the guide we published last month change what assistants say?"
- "Which of our pages should we refresh first? Here is the Search Console export."

## Limits and boundaries

- Every skill stops at a report, a draft or a tested change in your own repository. Publishing, submitting, deploying and editing third-party profiles stay with you.
- The teardown skills use public evidence only: no false identities, no scraping behind a login, no copying another company's text or creative.
- No skill writes fake reviews, hidden text or instructions aimed at AI models, and none promises a ranking, a citation or traffic. They find, check, draft and measure.
- Skills never invent statistics or results. Third-party traffic and rank figures are labeled as estimates, and small samples are reported as counts.
- These are new drafts: the methods have been run on Soxoa's own products, but the packaged skills are new. Try each on a small task you can check first, and report problems at [soxoa.com/support](https://soxoa.com/support).

## Related

The [`mentionedon`](../mentionedon/) plugin connects Claude to MentionedOn's saved AI-answer checks, share of voice and website fixes. `buyer-question-map`, `citation-source-gap` and `answer-change-test` can work from that evidence when it is connected. [`soxoa-ops`](../soxoa-ops/) holds the operating routines, including `claim-audit` and `audit-site-discoverability`.
