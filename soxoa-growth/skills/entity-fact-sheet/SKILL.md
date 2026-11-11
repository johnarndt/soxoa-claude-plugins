---
name: entity-fact-sheet
description: "Use when a user wants the facts about their business to be the same everywhere a search engine or AI assistant reads them. Triggers include 'AI gets our business wrong', 'ChatGPT says the wrong price', 'make our company facts consistent', 'build an entity fact sheet', 'fix our NAP', 'what should our about page say', or 'audit our business info across the web'. Builds one confirmed record of the business and finds every place that disagrees with it."
---

# Entity fact sheet

Assistants describe a business by combining what many pages say about it. When those pages disagree on the name, the price or what the company does, the answer comes out vague or wrong. This skill produces one confirmed record and a list of every place that contradicts it.

## Inputs

- The business's website and any profiles the user knows of.
- A person who can confirm facts. Nothing goes on the sheet as confirmed without them.

## Method

1. **Draft the sheet from the site.** Collect, with the page each was found on:
   - legal name, trading name, and how the name is written (spacing, capitals)
   - one-sentence description: what it is, for whom
   - founding year, founders, owner, location, service area
   - contact: phone, email, address, hours
   - products or services, each with a one-line description
   - prices, billing period, trial or guarantee terms
   - the official URL of the site and of each profile
   - identifiers the business holds: registration or license numbers it already publishes
2. **Confirm.** Show the draft to the user. Each line becomes confirmed, corrected or removed. Record the date. Unconfirmed lines stay out.
3. **Find the disagreements on the site.** Check the homepage, about, pricing, contact, footer, terms, structured data, page titles, social preview text and any machine-readable summary file. List every statement that differs from the sheet. Old prices and old taglines survive longest in metadata and legal pages.
4. **Find the disagreements off the site.** Check the business profiles, directories, review sites, app or plugin listings and social bios the user controls. Record what each says for name, description, URL, contact and price.
5. **Check what assistants say, if captured answers are supplied.** Compare each captured answer with the sheet and mark claims as correct, outdated, wrong or unsupported. Do not run new assistant queries unless the user asks.
6. **Write the canonical statements.** A short description (under 160 characters), a medium one (about 50 words) and a full one (about 150 words), all built only from confirmed lines. These are the versions to paste into profiles.
7. **Fix list.** One row per disagreement: where, what it says, what it should say, who can change it.

## Rules

- The business owner is the source of truth, not the website and not an assistant.
- Do not add facts to look complete. A missing founding year is better than a guessed one.
- Do not publish private data: home addresses, personal phone numbers, anything the user has not chosen to make public.
- Changing third-party profiles is the user's action. This skill prepares the text.
- Recheck after every price or positioning change. The sheet carries its confirmation date for that reason.

## Output

The confirmed fact sheet with dates, the three canonical descriptions, the on-site and off-site disagreement tables, and an ordered fix list starting with the pages assistants read most: homepage, pricing, about, structured data.
