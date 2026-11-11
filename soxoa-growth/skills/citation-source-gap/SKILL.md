---
name: citation-source-gap
description: "Use when a user wants to know which websites AI assistants rely on in their category and where the business is missing. Triggers include 'which sites does ChatGPT cite for our category', 'where do AI answers get their sources', 'why are competitors cited and not us', 'find our citation gaps', 'what directories matter for AI answers', or 'plan off-site work for AI visibility'. Tallies cited sources from captured answers by site type, finds the ones that name competitors but not the user, and plans legitimate ways to earn a place."
---

# Citation source gap

Assistants that search the web lean on a small set of sources per topic: a few directories, review sites, publications, forums and vendor pages. Being absent from those sources is often why a business is absent from the answer. This skill finds the sources and the gaps.

## Inputs

- Captured answers with their cited links, for a fixed set of buyer questions. If none exist, run the questions in whichever assistants the session can reach and save each answer verbatim with date, assistant and settings.
- The business name and domain, and the competitors that keep appearing.

## Method

1. **Extract citations.** For every answer list each cited URL, the question, the assistant and the date. Keep answers with no citations in the count: an assistant answering from memory is a different situation from one that searched.
2. **Group by domain and classify the site type.**

   | Type | Examples |
   |---|---|
   | Own site | the business's domain |
   | Competitor site | another vendor's pages |
   | Directory or marketplace | category listings, app stores |
   | Review site | customer review platforms |
   | Editorial | news, trade press, blogs |
   | Community | forums, question sites, social threads |
   | Reference | encyclopedias, government, standards bodies |

3. **Count.** For each domain: number of answers citing it, number of questions it appears in, which assistants. Report the denominator. Five citations across fifty answers is thin evidence.
4. **Find the gaps.** For each frequently cited page, open it and record whether it mentions the business, mentions competitors, and how one gets included: a listing form, an editor, a review threshold, a community that allows vendor participation, or no route at all.
5. **Rank the gaps** by how often the source is cited, whether a legitimate route exists, and whether the business qualifies today.
6. **Plan the work, one line per source.**
   - Listing: claim or create the profile with the confirmed facts.
   - Review site: ask real customers, in line with the site's rules.
   - Editorial: offer something worth covering: original data, a clear expert answer, a correction with evidence.
   - Community: answer questions as the business, disclosed.
   - Own site: where competitors' own pages are cited, the user's site may lack the equivalent page. Note which.
7. **Set the recheck.** Same questions, same assistants, a later date. Sources shift from month to month.

## Rules

- No fake reviews, no undisclosed accounts, no paying for placements presented as editorial, no claiming a competitor's listing.
- Citations vary from run to run. Treat one capture as a sample and say how many answers the tally rests on.
- A cited source is correlated with the answer. It is not proof that adding the business there will change it.
- Quote assistant answers exactly. Never tidy the evidence.

## Output

A source table (domain, type, citations, questions, mentions us, mentions competitors, route in), the ranked gap list with one action each, the own-site pages to consider, and the recheck date.
