---
name: ad-path-check
description: "Use when a user is about to run paid social or search ads and wants concepts that convert plus proof the whole path works. Triggers include 'give me ad concepts', 'write Meta ads', 'what should I target', 'are we ready to run ads', 'will people actually put a card down', 'check the funnel before we spend', or 'ad hooks that convert'. Writes ten distinct concepts tied to personas, sets exact targeting, then clicks through every ad's landing path to the payment step and blocks launch on anything broken."
---

# Ad path check

Ad money is wasted twice: once on a weak hook, and again when the click lands on a broken or confusing path. This skill handles both, and treats the path as the bigger risk.

## Inputs

- The product, the offer, and the price or trial terms exactly as they stand.
- Two to four buyer personas, in the owner's words.
- Copy rules: banned words, required qualifiers, tone, claims that need evidence.
- The ad platform(s) and the budget range. Ask; never assume a budget.

## Part 1 · Concepts

Write ten concepts that differ in mechanic, not just wording. Mix formats: a static note or document, a phone screenshot (notes app, text thread), founder to camera, a comparison card, a single highlighted item in a grid, a plain-text price anchor, a seasonal or planning angle, a short demo, a retargeting reminder. For each:

```
## <n>. <name> (format) · persona
Visual: what is on screen
Hook: the first line or first 3 seconds
Primary text / Headline / CTA
Landing: exact URL with UTM parameters
Why: the reasoning, labeled as judgment
```

Every concept states the same real offer. Example companies or people in an ad are fictional and labeled as examples if shown. Research on what is running in the category is fine; cite it as observation, and never copy a competitor's ad.

## Part 2 · Targeting

Give exact settings per ad set: locations, ages, languages, placements, interests or job titles where the platform allows, custom audiences (site visitors, signups to exclude), lookalikes if a seed exists, and an avoid list (audiences that look relevant but will not buy). Look up what the platform currently offers rather than relying on memory; options change.

## Part 3 · Path check (blocks launch)

For every landing URL, on a phone-width browser and on desktop:

1. Load the page from the ad's exact URL. Confirm the UTM parameters survive redirects and reach analytics.
2. Confirm the first screen matches the ad's promise.
3. Complete the signup with a test email. Confirm the signup alert and any welcome email arrive.
4. Reach the payment or trial step. Using the payment provider's test mode, confirm the card form loads, a test card succeeds, a declined test card shows a clear error, and the trial terms on the page match the ad.
5. Confirm the conversion event fires once, with the right value, in the ad platform's test tool.
6. Confirm the retargeting and exclusion audiences receive the visitor.

Report a pass/fail table per URL. Any fail is a launch blocker until fixed or explicitly accepted by the owner.

## Rules

- Never launch, publish or spend. The owner creates or approves campaigns.
- No live payments. Test mode only; never enter real card details.
- No claims the product cannot back today, and no invented statistics in ad copy.
