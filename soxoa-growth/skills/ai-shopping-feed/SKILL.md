---
name: ai-shopping-feed
description: "Use when a user wants their business profile and fixed-price offers listed where AI assistants surface products. Triggers include 'set up our ChatGPT business profile', 'build a product feed for AI shopping', 'list our products in an AI assistant', 'prepare a merchant feed CSV', 'our feed was rejected', or 'one profile for several brands'. Prepares the profile copy, a product feed that matches the live offer pages, the domain checks and the agent instructions, and records each rejection and its fix."
---

# AI shopping feed

Assistants are adding business profiles and product listings that merchants supply themselves. The work is mostly careful data entry: a short profile, a feed where every row matches a real page, and domain ownership the platform can check. This skill prepares all of it and leaves the submitting to the owner.

## Inputs

- The business: legal name, website, category, contact, policies for returns and delivery.
- The offers to list. Fixed-price items only, each with a live page that shows the price.
- The platform's current feed specification. Read it at the time of the work. These programs are new and the fields change.
- Which domains the business has verified with the platform.

## Method

1. **Decide the profile shape.** One company with several product brands can use a single umbrella profile that names each brand, or a profile per brand. Use the umbrella when the brands share an owner and support contact, and when separate verification for each brand is not available.
2. **Write the profile copy to the limits.** Record the character limit of each field and write to it: a short description that names what is sold, a longer one, the policies in plain sentences. Use only confirmed facts.
3. **Choose the offers.** Each must have a fixed price, a page on a verified domain, an image and a clear name. Leave out anything quoted individually. For subscriptions, include them only if the platform can show the billing period and trial terms clearly. Otherwise keep them in the profile text.
4. **Build the feed.** One row per offer. For every row check against the live page on the day:

   | Field | Check |
   |---|---|
   | Identifier | stable, never reused for another item |
   | Title, description | match the page, no claims the page does not make |
   | Price and currency | equal to the price a visitor sees |
   | Link | on a domain verified for this profile, returns the page directly |
   | Image | reachable, shows the item |
   | Availability | true today |
   | Target countries | set explicitly on every row, even when a default exists |
   | Surface flags | search, ads and checkout enabled only as the owner has decided |

5. **Handle domain rules.** If item links must be on the profile's verified domain and the offers live on other brand domains, the choices are to verify those domains or to publish an item page for each offer on the verified domain that shows the offer and links to the order flow. Keep each item page and its feed row in step.
6. **Preview, then submit.** Use the platform's preview. A preview that passes is not the same as ingestion. After the owner submits, read the processing result and the count of items accepted.
7. **Keep a rejection log.** For each rejection: the message as shown, what was changed, the result. Do not assume the message states the true cause.
8. **Write the agent instructions,** if the platform offers a business agent: who it represents, what each product is for, links for each, and firm limits. It cannot place orders, it gives no legal advice, it never asks for passwords or card numbers, and it states only facts from the listed pages.
9. **Set the upkeep.** When a price or offer changes, the page and the feed change together. Add tracking parameters to feed links if the platform keeps them, so clicks can be counted.

## Rules

- The feed states what the page states. A mismatch in price is the fastest route to a suspended feed.
- Do not claim another company's listing or brand.
- Creating accounts, accepting platform terms and submitting are the owner's actions.
- Listing is not placement. Being in a feed does not mean an assistant will recommend the item.

## Output

Profile copy with character counts, the feed file, the row-by-row check against live pages, the domain plan, the agent instructions, a set of test questions to try in preview, and the rejection log.
