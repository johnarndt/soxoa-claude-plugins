---
name: technical-seo-preflight
description: "Use when a user is about to launch, redesign or migrate a site and wants the search basics checked first. Triggers include 'SEO check before launch', 'pre-launch technical SEO', 'check canonicals and redirects', 'did the migration break our SEO', 'audit titles and meta descriptions', 'is the staging noindex still on', or 'run a technical SEO preflight'. Checks status codes, redirects, canonicals, index directives, the sitemap, titles and internal links on a defined set of URLs and returns a pass or fail list."
---

# Technical SEO preflight

Most search damage from a launch is caused by a few dull mistakes: a noindex left over from staging, redirects that drop pages, canonicals pointing at the old host. This is the checklist that catches them before and after the release.

## Inputs

- The site, or the staging host and the production host.
- The URL list to check: the sitemap plus the pages that earn traffic or money today. For a migration, the old URL list with intended new URLs.
- What changed in this release.

## Method

1. **Host and protocol.** Request the four variants of the homepage: with and without www, http and https. Exactly one should answer directly. The others should reach it in a single permanent redirect.
2. **Robots file.** It must exist, return a successful response as plain text, allow the pages meant for search, and point to the sitemap. Compare it with the previous version. A blanket disallow from staging is the classic failure.
3. **Sitemap.** Valid, reachable, and listing only URLs that return a direct successful response, are canonical to themselves and are indexable. Count them and compare with the previous count. A large unexplained change is a finding.
4. **Per URL.** For each URL in the list record:

   | Check | Pass when |
   |---|---|
   | Status | direct success, no redirect chain |
   | Canonical | absolute, on the production host, pointing at itself unless there is a reason |
   | Index directive | no stray noindex in meta or headers |
   | Title | present, unique on the site, describes the page |
   | Description | present and specific |
   | Main heading | one, matching the page's subject |
   | Content | main text present in the server HTML |
   | Language tags | consistent where the site has several languages |

5. **Redirects, for a migration.** Every old URL must reach its mapped new URL in one step with a permanent redirect, and the destination must pass the per-URL checks. List old URLs that return an error or land on the homepage.
6. **Internal links.** Sample the navigation, footer and in-content links. None should point at redirected, staging or error URLs.
7. **Error pages.** A URL that does not exist must return a real not-found status, not a success page that says "not found".
8. **Structured data and social previews.** Present where they were before, and not pointing at the old host.
9. **Speed sanity.** Note anything gross: multi-megabyte pages, render-blocking failures, images with no dimensions. Leave full performance work to its own task.
10. **After launch.** Rerun the same list against production, then check the search console for coverage and crawl errors over the following days.

## Rules

- Read-only. This skill reports. Fixes and deploys are separate tasks.
- Same list before and after, so the comparison means something.
- A passing preflight removes known causes of loss. It does not predict rankings.
- Keep request rates polite, and do not crawl beyond the agreed list.

## Output

A pass or fail table per check with counts, the failing URLs with the observed and expected values, the blockers that should stop the launch, and the same table rerun after release.
