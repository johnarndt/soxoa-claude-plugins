---
name: schema-markup-check
description: "Use when a user wants the structured data on their site checked or written. Triggers include 'check our schema markup', 'add JSON-LD to this page', 'is our structured data correct', 'why are rich results not showing', 'write Organization schema', 'FAQ schema for this page', or 'does our markup match the page'. Compares each page's structured data with its visible content and the confirmed business facts, fixes mismatches, and drafts missing markup that states only what the page shows."
---

# Schema markup check

Structured data is a machine-readable restatement of what a page already says. It helps when it is accurate and matches the page. It hurts when it claims things a visitor cannot see. This skill checks and drafts markup on that basis.

## Inputs

- The pages to check: URLs or source.
- Confirmed business facts if available (name, address, prices, founders). Without them, the visible page is the only source.
- What the user hopes the markup will do, so expectations can be set.

## Method

1. **Extract.** Pull every JSON-LD block, and any microdata, from each page's server HTML. Note pages where markup only appears after JavaScript runs.
2. **Parse.** Report syntax errors first: invalid JSON, missing context, wrong nesting, strings where objects belong.
3. **Match type to page.** One primary type per page, chosen by what the page is:

   | Page | Usual type |
   |---|---|
   | Homepage, about | Organization or LocalBusiness, WebSite |
   | Product or plan page | Product or SoftwareApplication with Offer |
   | Article, guide | Article with author and dates |
   | Visible FAQ | FAQPage |
   | Steps the reader follows | HowTo |
   | Person page | Person, ProfilePage |
   | Any deep page | BreadcrumbList |

4. **Compare with the visible page, field by field.** Name, description, price, currency, availability, rating, review count, author, dates, address, phone, hours. Each field is: matches, differs, or not visible on the page. "Not visible" fields are removed.
5. **Compare across pages.** The organization's name, logo, URL and profile links should be identical everywhere. Give the organization one stable identifier and reference it rather than restating it differently on each page.
6. **Check the risky fields.**
   - Ratings and reviews: only for reviews shown on that page and collected by the business about that item. Never self-authored, never copied from another site.
   - Prices: must equal the price a visitor sees, with currency.
   - FAQ: every question and answer must appear in the page text.
   - Dates: modified dates change only when the content does.
7. **Draft what is missing.** Write the JSON-LD from page content and confirmed facts only. Leave out any property with no source.
8. **Validate.** Run the vendor's rich-result test and a schema validator if tools allow, and report their output. If not, say the markup is unvalidated.

## Rules

- Markup never adds a claim. If it is not on the page, it is not in the markup.
- Eligibility for a rich result is not a promise of one. Search engines decide, and they have withdrawn several result types.
- Do not mark up content hidden from users.
- Keep one block per entity. Three conflicting Organization blocks from three plugins is a common fault: find and remove the extras.

## Output

Per page: what was found, errors, field-by-field mismatches, and the corrected or new JSON-LD ready to paste. Then a sitewide summary of inconsistencies and the validation results.
