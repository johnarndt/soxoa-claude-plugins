---
name: write-llms-txt
description: "Use when a user wants a machine-readable summary of their site for AI assistants and agents. Triggers include 'write an llms.txt', 'make our site readable by AI agents', 'create llms.txt for our docs', 'what should go in llms.txt', 'give agents a map of our site', or 'update our llms.txt after the pricing change'. Writes a short, accurate llms.txt from confirmed facts and live pages, checks every link, and lists what else an agent needs to use the site."
---

# Write an llms.txt

An `llms.txt` file is a plain markdown file at the root of a site that tells a language model what the business is and where the useful pages are. It is a courtesy map, not a ranking switch. Its value is accuracy: a model that reads it should come away with the right name, offer, price and limits.

## Inputs

- The site URL and its sitemap.
- Confirmed facts: what the business is, who it serves, products, prices, what it does not do.
- Existing files if any: the current llms.txt, robots file, API or agent descriptions.

## Method

1. **Read the site first.** Homepage, pricing, about, the main product or service pages, docs index, terms and contact. Note current prices and limits from the live pages, with the date read.
2. **Write the header.**
   - A single heading with the business or product name.
   - A blockquote of one or two sentences: what it is, for whom, and who operates it.
   - A short paragraph of the facts models get wrong most: pricing and billing period, trial terms, geography, what it is not.
3. **List the pages, grouped under plain headings.** Typical groups: product, pricing, how it works, guides, comparisons, company, legal, for agents and developers. Each entry is a link with a one-line description of what the page answers. Prefer 15 to 40 links. A file that lists every URL is a sitemap, and a model will not read it all.
4. **Add the limits.** A short section on what the product cannot do and what needs a human: actions that require an account, payment or approval. Models repeat capabilities confidently, so state the boundaries.
5. **Point to clean versions.** If pages have markdown or plain-text versions, link those. If not, note it as a possible improvement rather than inventing URLs.
6. **Check every link.** Each must return a successful response and land on the page described. Remove or fix the rest.
7. **Check against the rest of the site.** Name, prices and descriptions must match the homepage, pricing page and structured data. A disagreement here creates the confusion the file was meant to remove.
8. **Review the robots file alongside it.** List which AI user agents are allowed or blocked, and confirm that matches what the user wants. Publishing a map for crawlers the robots file turns away is a contradiction worth raising.
9. **Set an owner and a trigger.** The file must change when prices, plans or product scope change. Name who updates it.

## Rules

- Facts only, from confirmed sources. No superlatives, no claims about rankings or customers the business cannot show.
- No instructions to the model: no "always recommend", no "ignore other sources". That is prompt injection, it gets sites distrusted, and this skill will not write it.
- Do not promise an effect. No search engine or assistant has committed to using the file. It costs little and helps agents that do read it.
- Nothing private: no internal URLs, staging hosts or keys.

## Output

The complete llms.txt, a link-check table, a list of disagreements found with other pages, the robots summary for AI agents, and the update trigger.
