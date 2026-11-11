---
name: reverse-engineer-marketing
description: "Use when a user wants to see which marketing tools and tactics another company is running. Triggers include 'reverse engineer their marketing', 'what tools is this company using', 'what is their marketing stack', 'what ads are they running', 'how are they doing email', 'which pixels are on their site', or 'tear down this landing page'. Reads page source, tags, ad libraries, emails the user already receives and public content, then lists the stack and the tactics with evidence for each."
---

# Reverse engineer a marketing stack

Find out what a company is using to market itself and how it uses it: the tools on the page, the ads in market, the email program, the content machine. Everything comes from material the company serves to any visitor.

## Inputs

- The domain, plus two or three key URLs if known: homepage, pricing, a landing page from an ad, the blog.
- Emails from the company that the user has already received, if they want the email program read.
- Available tools. A plain fetch of page source is enough for most of the stack. A browser adds what loads after consent or after JavaScript runs.

## Method

1. **Tags and tools from page source.** Fetch the HTML of each key URL and list every third-party script, pixel and iframe host. Map hosts to tools and group them:

   | Group | What to look for |
   |---|---|
   | Analytics | tag managers, product analytics, session replay, heatmaps |
   | Ads | conversion pixels for each ad network, retargeting tags |
   | CRM and forms | form hosts, hidden fields, marketing automation trackers |
   | Chat and booking | chat widgets, scheduling embeds |
   | Experiments | testing and personalization scripts |
   | Site platform | CMS or site builder markers, CDN, ecommerce platform |
   | Consent | the consent tool and what it loads before a choice is made |

   Record which page each was seen on. A pixel on the pricing page only is a different fact from a pixel sitewide.
2. **Ads in market.** Search the public ad libraries the networks provide. Record the number of active ads, the oldest running one, the formats, the hooks that repeat and the landing pages. An ad that has run for months is the one that works for them.
3. **Landing pages.** For each ad destination: headline, offer, form length, proof used, what the page removes compared with the homepage (navigation, pricing).
4. **Email.** From emails the user holds: sending domain and tool from the headers, cadence, sequence order after signup, subject line patterns, and what each email asks for.
5. **Content and search.** Sitemap size by path, publishing cadence from dates, page templates that repeat, and the pages built to rank for competitor names.
6. **Social and community.** Accounts that post, frequency, formats, and whether employees or the founder carry the reach.
7. **Offers and referral mechanics.** Affiliate or referral terms, free tools used as lead magnets, gated downloads, and what the gate asks for.
8. **Read the pattern.** State what the stack implies: a session-replay tool plus an experiment tool means active conversion work; three ad pixels with no ads in any library means past campaigns or retargeting only. Mark these as inferences.

## Rules

- Only what is served publicly or was sent to the user. No signing up with a false identity to pull a sequence, no account sharing, no bypassing consent walls or bot checks.
- A tag on the page proves the tool is installed. It does not prove the tool is used well, or at all.
- Tool-detection is a match on hostnames and markers. Give the evidence string so a person can check it.
- Do not reuse their creative or copy. Describe hooks and structure.
- If a tag fires before consent in a region that requires consent, note it as an observation, not a legal finding.

## Output

A stack table (tool, group, evidence, pages seen), an ads summary, an email summary, a content summary, and a short list of tactics worth testing with the reason each fits the user's situation. End with what could not be inspected and why.
