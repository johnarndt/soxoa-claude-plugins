---
name: answer-change-test
description: "Use when a user wants to know whether something they published changed what AI assistants say. Triggers include 'did our new page change ChatGPT's answer', 'measure AI visibility before and after', 'did the article work', 'are we mentioned more often now', 'test whether this content moved AI answers', or 'set up a before and after for AEO'. Fixes one question and one assistant setup, compares equal windows either side of the change, and reports a change only when the sample supports it."
---

# Answer change test

Assistant answers vary from run to run. Ask the same question twice and the business may appear once. So "we published a page and now we are mentioned" proves nothing from a single check. This skill sets up a before and after comparison that can tell a real change from noise, and says "still collecting" when it cannot.

## Inputs

- The change: what was published or fixed, where, and the date it went live.
- The buyer question it was meant to affect. One question per test.
- Saved answers to that question, with date, assistant, model or mode, and whether web search was on. If none exist from before the change, the test cannot look backward: start collecting now and run it for the next change.

## Method

1. **Fix the question.** Exact wording, unprimed, no brand name unless it is a brand question. It does not change during the test.
2. **Fix the setup per assistant.** Assistant, model or mode, web search on or off, location if relevant. Only answers captured with matching settings are compared. A change of model in the middle of a window splits that window.
3. **Set the windows.** Equal length before and after the publication date. Twenty-eight days each is a workable default. Drop the publication day itself.
4. **Count per assistant.** For each window: number of answers captured, number that mention the business, number that cite the business's page. Keep assistants separate. A gain in one says nothing about another.
5. **Apply the minimum sample.** With fewer than eight answers on either side for an assistant, the result is "still collecting". Report the counts and stop.
6. **Test the difference.** With enough answers, compare the mention rate before and after with a two-proportion test. Report the counts, both rates and whether the difference clears the threshold. If it does not, the result is "no clear change".
7. **Look for other causes.** Did anything else change in the window: other pages published, a press mention, a model update, a pricing change? List them. The test shows that answers changed, not why.
8. **Check the mechanism.** If the mention rate rose, do the newer answers cite the new page or repeat facts from it? That supports the link. If they cite something else, say so.
9. **Run one test at a time per question.** Overlapping changes to the same question cannot be separated afterward.

## Rules

- Captured answers stay verbatim. Never edit, summarize in place or correct the evidence.
- Never add instructions to the question to make the business appear. The measurement must be what a neutral buyer would get.
- Small samples get the "still collecting" label, not a percentage.
- A clear change is a change in this assistant, for this question, in this period. Do not generalize it to "AI visibility".
- Capturing answers costs money or time. Agree the cadence and the budget before starting.

## Output

A test card: the change and its date, the fixed question, per assistant the windows, counts, rates and one of three verdicts (clear change, no clear change, still collecting), the other changes in the window, the citation check, and the date of the next reading.
