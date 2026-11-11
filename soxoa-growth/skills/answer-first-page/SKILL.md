---
name: answer-first-page
description: "Use when a user wants a page rewritten so search engines and AI assistants can lift a correct answer from it. Triggers include 'optimize this page for AI answers', 'make this page AEO ready', 'rewrite for featured snippets', 'why does ChatGPT not quote our page', 'make this answer extractable', or 'restructure this article around the question'. Reorders the page to lead with a direct answer, adds the facts and structure an answer engine needs, and keeps every claim true."
---

# Answer-first page

An answer engine quotes the passage that answers the question cleanly. Most pages bury that passage under an introduction. This skill restructures one page so the answer comes first and stands on its own.

## Inputs

- The page: URL or source text.
- The one main question it should answer, and up to five related questions. If unknown, derive them from the title and ask the user to confirm.
- Facts the page may state: prices, dates, limits, names. Anything not supplied or already on the page is not added.

## Method

1. **State the question.** Write it as a buyer would ask it. If the page tries to answer four unrelated questions, recommend splitting it and proceed with the main one.
2. **Write the direct answer.** 40 to 60 words, directly under the main heading. It must make sense with nothing else on the page: name the subject, give the answer, give the key condition or number. No "it depends" without saying on what.
3. **Use question headings.** Turn section headings into the related questions in plain wording. Under each, answer in the first sentence, then explain.
4. **Add the extractable blocks** where the content supports them:
   - a table for anything compared across options, plans or cases
   - numbered steps for any process
   - a short definition for any term the page relies on
   - a dated line for anything that changes: "Prices checked on <date>"
5. **Name things.** Replace "we", "our tool" and "it" with the business or product name in the sentences most likely to be quoted. A quoted sentence loses its surrounding context.
6. **Show the source of each fact.** Link the primary source or state how the business knows. First-hand numbers with a date and a method are the content competitors cannot copy.
7. **Cut.** Remove the warm-up paragraph, repeated claims and filler. Keep the reader's next step near the answer, not only at the bottom.
8. **Match the markup.** Title and meta description should contain the question's key words. If an FAQ block is visible on the page, matching FAQ structured data may be added. Never mark up text that is not visible.
9. **Check it without scripts.** Confirm the answer is in the HTML the server sends, not inserted later by JavaScript.

## Rules

- No new facts. If the page lacks the number an answer needs, list it as missing and ask.
- Do not write for the engine at the reader's expense. The direct answer should be the best first paragraph for a person too.
- No hidden text, no instructions aimed at AI models, no stuffing of questions the page does not answer.
- Nobody controls what an assistant quotes. Promise a clearer page, not a citation.

## Output

The rewritten page in the same format it arrived in, a short change list (what moved, what was cut, what was added), the list of facts still missing, and the title and description.
