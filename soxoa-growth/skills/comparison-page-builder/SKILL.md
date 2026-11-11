---
name: comparison-page-builder
description: "Use when a user wants a fair comparison or alternatives page that buyers and AI assistants can rely on. Triggers include 'write a versus page', 'us vs competitor page', 'build an alternatives page', 'compare our product with theirs', 'best tools for this job roundup', or 'make a comparison table that is honest'. Gathers dated, sourced facts about each option, says who each one suits, including when the competitor is the better pick, and writes the page."
---

# Comparison page builder

Buyers ask "A or B" right before they choose, and assistants answer that question from comparison pages. A page that only flatters its author is discounted by readers and by the models that summarize it. A fair one, with sources and dates, gets used. This skill builds the fair one.

## Inputs

- The user's product and the alternatives to compare, three at most for a versus page.
- The user's confirmed facts: features, prices, limits, who it is for.
- The buyer the page is for and the decision they are making.

## Method

1. **Collect facts from primary sources.** For each competitor read its own pricing page, feature pages, documentation, terms and changelog. Record each fact with the URL and the date read. Do not take competitor facts from third-party roundups.
2. **Choose the criteria from the buyer's side.** Five to eight things that decide the purchase: price at the buyer's size, the main job to be done, setup effort, limits, integrations, support, contract terms. Not a list of forty features chosen because the user wins thirty-eight.
3. **Fill the table.** One row per criterion, one column per option. Each cell is a short fact, not an adjective. "Not published" is a valid cell. So is "No".
4. **Find where each option wins.** Write one honest sentence per option: "Choose X if ___." If there is no situation in which the competitor is the better choice, the criteria are rigged. Go back to step 2.
5. **Write the page.**
   - Direct answer first: two or three sentences saying who should pick which.
   - The table, with a "facts checked on" date.
   - A short section per criterion where a table cell needs explaining.
   - Who each option suits.
   - What switching involves, if the reader is on the competitor today.
   - Sources.
6. **Disclose.** Say near the top that the page is written by one of the vendors compared.
7. **Check the claims.** Reread every statement about a competitor against its source. Remove anything that cannot be sourced, anything that describes their intent or quality in general terms, and any claim about their customers.
8. **Set the review date.** Prices and plans change. Give the page an owner and a recheck interval, and show the checked date on the page.

## Rules

- Facts about a competitor must be true, current and sourced. Opinions are labeled as opinions.
- Use competitor names in plain text to identify them. No logos, no screenshots of their product, no copied copy.
- No invented benchmarks, no unnamed "users say", no fake review quotes.
- Do not buy ads on or build pages around a competitor's name in ways that suggest affiliation.
- If the user's product loses the comparison for this buyer, say so on the page. That sentence is why the rest is believed.

## Output

The fact ledger (claim, source, date), the criteria with the reason each was chosen, the finished page, the disclosure line, and the list of facts that could not be confirmed and were left out.
