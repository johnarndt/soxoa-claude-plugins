---
name: ai-referral-tracking
description: "Use when a user wants to measure visits and customers that arrive from AI assistants. Triggers include 'how much traffic do we get from ChatGPT', 'track AI referrals', 'are people coming from Perplexity', 'set up AI traffic reporting', 'measure visitors from AI assistants', or 'why does AI traffic show as direct'. Defines the referrer and campaign rules, sets up a privacy-light count, separates human visits from crawler fetches, and reports what can and cannot be seen."
---

# AI referral tracking

Being mentioned by an assistant matters when someone then visits. Those visits are small in number, partly hidden, and easy to confuse with crawler traffic. This skill sets up a count that is honest about all three.

## Inputs

- Where the data can come from: the analytics tool, server or CDN logs, or the ability to add a small script.
- The site's consent setup and privacy commitments.
- The conversion that matters: signup, order, booking, call.

## Method

1. **Separate the three kinds of traffic.**
   - People who clicked a link in an assistant's answer. These are visits.
   - Agents fetching a page for a user during a conversation. These are reads, not visits.
   - Crawlers indexing or collecting training data. These are neither.
   Each needs its own line. Adding them together inflates the number.
2. **Define the visit rules.** A visit counts as assistant-referred when either holds:
   - the referrer host is one of the assistant products. Keep the list in one place and review it quarterly, since hosts change.
   - the landing URL carries a campaign source the assistant added. Some assistants append one to the links they cite.
3. **Define the fetch rules.** Identify agent and crawler requests by the user agent strings the vendors publish, from server or CDN logs. Browser analytics will not see these, because they do not run scripts.
4. **Set up the count.** Choose the lightest option that works:
   - a saved segment or channel group in the existing analytics tool
   - a log query run daily
   - a small first-party script that records only: date, assistant, landing path. No cookies, no IP address, no user identifier. Daily totals are enough.
5. **Connect to outcomes.** Carry the source through to the conversion event, so the report can show visits and conversions per assistant. With small numbers, list the conversions individually rather than quoting a rate.
6. **State the blind spots in the report itself.**
   - Assistant apps and some browsers send no referrer. Those visits appear as direct.
   - A person who reads an answer and types the brand into search later appears as brand search.
   - Consent choices and blockers remove visits from script-based counts.
   The count is therefore a floor.
7. **Report.** Weekly or monthly: visits by assistant, landing pages, conversions, agent fetches and crawler requests as separate lines, and the trend. Put brand search and direct visits next to it for context, without claiming them.

## Rules

- Collect the minimum. Aggregate counts answer the question. Do not fingerprint or identify visitors.
- Follow the site's consent rules. A first-party script still needs to fit the privacy policy.
- User agent strings can be faked. For decisions that matter, verify crawler traffic against the vendors' published address ranges.
- Do not present the floor as the total, or model the hidden part with an invented multiplier.

## Output

The rule definitions (referrer hosts, campaign markers, user agents), the setup steps for the chosen method, a report template, the stated blind spots, and the first dated reading if data is available.
