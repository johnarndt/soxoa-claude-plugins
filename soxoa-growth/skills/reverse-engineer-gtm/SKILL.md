---
name: reverse-engineer-gtm
description: "Use when a user wants to work out how another company goes to market from public evidence. Triggers include 'reverse engineer their GTM', 'how does this company get customers', 'what is their sales motion', 'tear down a competitor's go-to-market', 'who do they sell to and how', or 'what channels is this startup using'. Reads pricing, signup flow, jobs, partners, marketplaces, reviews, events and ads, then returns a sourced map of segment, motion, channels and proof, with every inference labeled."
---

# Reverse engineer a go-to-market

Work out how a company finds, sells to and keeps customers, using only what it has made public. The output is a sourced map, not a guess dressed as fact. Every line is either an observation with a link and a date, or an inference marked as one.

## Inputs

- The company's domain, and up to four competitors if a comparison is wanted.
- What the user sells and to whom, so the findings can end in "what to copy, what to skip".
- Any tools available: web search and fetch, a browser, ad libraries, a backlink or traffic tool. The skill works with search and fetch alone and says what it could not see.

## Method

1. **Offer and price.** Read the homepage, pricing page, signup flow and terms. Record plans, prices, billing period, free tier or trial, card required or not, minimum seats, and what "contact sales" hides. The entry price and the trial shape say more about the motion than any tagline.
2. **Who it is for.** Collect the segments the site names: industries pages, case studies, logos, integrations, the job titles in testimonials. Count them. Three case studies in one industry beat a list of twelve industries in the footer.
3. **Sales motion.** Classify as self-serve, sales-assisted or sales-led from evidence: is there a signup button or only a demo form, does the demo form ask for company size, are there SDR or account executive job posts, is there a partner or reseller page.
4. **Channels, one row each.** For every channel record what was found, where, when, and how strong the evidence is:
   - Search: sitemap size and page templates, blog cadence, comparison and alternatives pages.
   - Paid: ad library entries, sponsored newsletter or podcast mentions, landing pages that only make sense as ad destinations.
   - Partners and marketplaces: integration directories, app stores, agency or affiliate programs and their commission terms.
   - Community and social: the accounts that post, how often, and what gets replies. Founder-led or brand-led.
   - Reviews and directories: which review sites carry them, how many reviews, how recent.
   - Events, podcasts, press: appearances in the last twelve months.
   - Outbound: only if there is evidence, such as SDR hiring or published sequences.
5. **Proof layer.** List named customers, numbers they publish, certifications, and third-party reviews. Note which claims have a source and which do not.
6. **Hiring as a forecast.** Open roles show where money goes next. Read the job posts for tools, quotas, segments and territories.
7. **Synthesis.** One paragraph: the wedge, the entry offer, the main channel, the constraint. Then a table of what the user could copy this month, what needs resources they lack, and what to leave alone.

## Rules

- Public pages and public records only. No logging in to a competitor's product under a false identity, no scraping behind authentication, no contacting their staff or customers under a pretext.
- "No evidence found" means the search did not surface it. It never means the company does not do it. Write it that way.
- Traffic and revenue figures from third-party tools are estimates. Name the tool and call it an estimate.
- Date every observation. Pricing pages change monthly.
- Do not copy their text, images or page layouts into the user's work. Describe the pattern.

## Output

A dated report: summary verdict, evidence table by channel (finding, source, date, confidence), maturity snapshot against the user's own company if supplied, and a ranked list of at most five moves with the evidence each one rests on.
