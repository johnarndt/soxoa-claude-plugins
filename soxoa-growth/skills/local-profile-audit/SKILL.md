---
name: local-profile-audit
description: "Use when a local or service-area business wants to be found in map results and in AI answers about places near the customer. Triggers include 'audit our Google Business Profile', 'why are we not in the map pack', 'local SEO check', 'fix our business listings', 'does ChatGPT recommend us locally', 'check our NAP consistency', or 'what should our service area pages say'. Reviews the business profile, listings, reviews and location pages against confirmed facts and returns a fix list the owner can work through."
---

# Local profile audit

For a local business, the profile on the map and a handful of listings do more than the website. Assistants answering "who is good near me" draw on the same sources. This skill checks them against the facts and against each other.

## Inputs

- Business name, address or service area, phone, hours, categories and services, confirmed by the owner.
- Links to the business profile and any listings the owner knows about. The owner's view of the profile dashboard helps, as a screenshot or export.
- The towns and services that matter most.

## Method

1. **Profile basics.** Compare every field with the confirmed facts: name written exactly as on the storefront and paperwork, address or service area, phone, website link, hours including holidays.
2. **Categories.** Record the primary and secondary categories. Compare with the categories of the businesses that appear for the owner's main searches. The primary category is the strongest lever on the profile, so a mismatch goes to the top of the list.
3. **Services and description.** Are the services the owner sells listed, in customers' words? Does the description say what the business does and where, in its first sentence?
4. **Photos and posts.** Count and recency. Real photos of the work, the team and the premises. Note stock images.
5. **Reviews.** Count, average, recency, and how many have a reply. Read the last twenty: what do customers praise and what do they complain about? Those phrases are the words buyers use, and assistants quote them.
6. **Listing consistency.** For each directory, map service and review site found: name, address, phone, website, hours. Mark every difference. Flag duplicates and listings for old addresses.
7. **Website match.** The contact page and footer must show the same name, address and phone as the profile. Check for LocalBusiness structured data that matches. Check that each priority town or service has a real page: what is offered there, proof of work there, how to book. A page that swaps the town name into the same paragraph is not one.
8. **What shows up.** If tools allow, search the main queries from the service area and record who appears in the map results and what an assistant answers. Save it with the date and location used. Results depend heavily on where the searcher stands.
9. **Fix list.** Ordered by effect and effort: wrong facts first, then category, then missing services, then reviews and photos, then listings, then pages.

## Rules

- The owner confirms facts. The profile, the website and any directory can all be wrong.
- No keywords added to the business name, no virtual-office addresses, no listings for places the business does not serve from. These break the platform's rules and get profiles suspended.
- Reviews come from real customers, asked fairly. No incentives where the platform forbids them, no review gating, no writing them.
- Editing a profile is the owner's action. This skill writes the exact text to enter.
- Map rankings vary by searcher location. One search from one place is a sample.

## Output

A facts table (confirmed value, profile, website, each listing), the category comparison, a review summary with the customer phrases worth using, the page gaps by town and service, and the ordered fix list with the text to paste for each item.
