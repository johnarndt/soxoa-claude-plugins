---
name: ai-discovery-audit
description: Use when a user wants to know how ready their website or business is to be understood, mentioned, or cited by AI assistants such as ChatGPT, Claude, Gemini, Perplexity, Grok, or Copilot. Triggers include "AI visibility audit", "AI discovery readiness", "is my site ready for AI search", "why doesn't ChatGPT recommend my business", "GEO audit", "check my site for AI", "score my site for AI assistants", or a user pasting page details and asking how AI-ready they are. Collects evidence for ten discovery signals from pages the user names or pastes, then scores that evidence with the MentionedOn analyze_discovery_readiness tool.
---

# AI discovery readiness audit

This skill turns what the user can show you about their site and business into a scored readiness assessment. You gather evidence for ten signals, the user confirms it, and MentionedOn's `analyze_discovery_readiness` tool scores it with a fixed, weighted rubric.

The MentionedOn tool fetches nothing. It does not visit the URL, crawl the site, run an AI scan, or check whether any AI product mentions the business. It scores only the statuses and evidence text you send. Say this plainly to the user before and after the call.

## When not to use this skill

- The user wants a ranked fix list from findings they already have: use the `visibility-action-plan` skill.
- The user has captured AI answers and wants mention or citation rates: use `ai-mention-report`.
- The user wants to know whether ChatGPT (or another assistant) mentions them right now: no tool here can check that. Offer `ai-answer-capture` so they can record real answers.
- The site is not the user's own or a client's they are authorized to review: do the audit only on public pages and do not suggest contacting the owner on their behalf.

## Inputs and exact tool mapping

Tool: `analyze_discovery_readiness`

| Argument | Required | Type and limits | Where it comes from |
|---|---|---|---|
| `businessName` | yes | string, 2 to 120 characters | The name the user gives. Used only as a label. |
| `websiteUrl` | no | URI string, up to 2048 characters | The main page the user pointed to. Label only, never fetched. Omit if the user gave none. |
| `signals` | yes | array, 1 to 10 items | One item per signal you have a view on. |
| `signals[].signal` | yes | enum, see below | Each signal may appear only once. |
| `signals[].status` | yes | `present`, `partial`, `missing`, `unknown` | Your judgment from the evidence, confirmed by the user. |
| `signals[].evidence` | see note | string, 3 to 500 characters | Concise factual note: where you looked and what you saw. |

Signal enum values and their titles (titles and weights as returned by the live tool):

| `signal` | Title | Weight |
|---|---|---|
| `business_identity` | Canonical business identity | 12 |
| `service_location` | Service and location specificity | 14 |
| `page_description` | Descriptive page copy | 10 |
| `contact_details` | Accessible contact details | 8 |
| `structured_data` | Structured business data | 14 |
| `corroborating_profiles` | Corroborating authoritative profiles | 10 |
| `crawlability` | Crawlability and indexability | 12 |
| `buyer_faq` | Buyer-question coverage | 8 |
| `first_party_evidence` | First-party evidence | 8 |
| `machine_summary` | Machine-readable summary | 4 |

Server-enforced rules that are not visible in the schema:
- `evidence` is required whenever `status` is `present`, `partial`, or `missing`. Only `unknown` may omit it.
- A signal may appear only once in `signals`.
- Omitted signals are treated as `unknown`. No additional properties are accepted.

What to look for on each signal, and how to decide between present, partial, and missing, is in `references/signal-checklist.md`. Read it before collecting evidence.

## Workflow

1. **Confirm scope.** Ask for the business name, the main URL, and which pages matter (home, services, location or service-area pages, contact, about, FAQ). Ask whether the business serves customers at a location, across a service area, or online.
2. **Collect evidence.** Use what the user already provides first: pasted page text, page source, screenshots, a list of profiles. If the user asks you to look at the site and this Claude session already has a web browsing or fetch capability, you may read the specific pages the user named on that site (plus its `/robots.txt` and `/llms.txt` when checking crawlability and machine summary). Tell the user that you, not MentionedOn, are reading those pages. If you cannot browse, ask the user to paste what you need. Never guess at a page you did not see.
3. **Draft the signal table.** For each of the ten signals, write a status and a one-line evidence note in your own words. Use `unknown` whenever you lack evidence. Rendered-only facts you could not see (for example JSON-LD injected by JavaScript when you only have static HTML) are `unknown` or `partial` with that caveat in the evidence, not `missing`.
4. **Show the draft and get confirmation.** Present the table and ask the user to correct anything. They know facts you cannot see (for example a Google Business Profile they own). Do not call the tool until they confirm or say "go ahead".
5. **Call the tool once** with the confirmed signals. The tool is deterministic and stateless, so a retry with identical arguments returns the same result. If you get an input validation error, read the message (it names the field, for example `signals[2].evidence`), fix only that field, and call again. Do not drop a signal to make an error go away without telling the user.
6. **Present the result** using the template below.
7. **Offer next steps:** a ranked fix plan (`visibility-action-plan`, reusing the same signals as findings) and, if they want to know how assistants actually answer today, a capture session (`ai-answer-capture`).

## Reading the output

- `scope` is always `caller_supplied_signals_only`. Repeat that meaning to the user.
- `readinessScore` (0 to 100, or `null`) is computed only over signals with a known status. It is `null` when nothing known was supplied.
- `evidenceCoveragePercent` is the share of total weight that had a known status. Always report it next to the score. A score of 80 at 30% coverage says little about the whole site.
- `assessment` is one of `strong_observed`, `developing_observed`, `limited_observed`, `weak_observed`, `insufficient_evidence`. Translate it to plain words ("strong based on what was observed").
- `evaluatedSignals` always lists all ten signals with `title`, `status`, `weight`, and the `evidence` you sent (or `null`).
- `priorities` (up to 5) are partial or missing signals with `impactWeight`, `action`, and `verification`.
- `verificationNeeded` lists signals still `unknown`, each with a `verification` step that tells the user how to check it.
- `limitations` must be passed through to the user, not paraphrased away.

## Answer template

```
**AI discovery readiness: <businessName>** (<websiteUrl or "no URL label">)
Based only on the evidence below, which <you/the user> collected on <date>. MentionedOn scored this evidence; it did not visit the site or check any AI assistant.

Score: <readinessScore>/100, <assessment in plain words>, covering <evidenceCoveragePercent>% of the rubric weight.

| Signal | Status | Evidence |
(one row per evaluatedSignals item, in tool order)

**Fix first**
1. <priorities[0].title>: <action>. Check it worked: <verification>
...

**Still unverified**
- <verificationNeeded[].title>: <verification>

**Limits**
- <each limitations item>
```

## Guardrails

- Never say MentionedOn crawled, scanned, or tested the site. If you read pages yourself, say so and give the date.
- Never invent evidence, profile URLs, schema types, or review counts. `unknown` is a valid, honest answer.
- Do not present the score as a prediction of mentions, rankings, citations, traffic, or revenue.
- Do not edit the user's site, submit forms, or contact anyone. Recommendations are for the user to review and apply.
- Keep observed facts separate from your inferences in the write-up.

## If the MentionedOn tools are not connected

If `analyze_discovery_readiness` is not available, tell the user the MentionedOn connector is not connected and how to add it: in Claude, open Customize > Connectors and add `https://mentioned-on.com/mcp` (no sign-in needed); in Claude Code run `claude mcp add --transport http mentionedon https://mentioned-on.com/mcp`. You can still collect and confirm the ten-signal evidence table and explain what each gap means, but do not produce a score, assessment label, or weights-based ranking and do not imply a tool ran.

## Worked example

User: "Can you check if Rivera Roofing's site is ready for AI search? It's https://riveraroofing.example. We do roof repair in Fresno and Clovis."

After reading the home and contact pages the user named, and confirming the draft with the user, call:

```json
{
  "businessName": "Rivera Roofing",
  "websiteUrl": "https://riveraroofing.example/",
  "signals": [
    {"signal": "business_identity", "status": "present", "evidence": "Title tag, H1, and footer all read Rivera Roofing (home page, read 2026-10-18)."},
    {"signal": "service_location", "status": "partial", "evidence": "Home page says roof repair; Fresno named once in footer, Clovis not named anywhere."},
    {"signal": "contact_details", "status": "present", "evidence": "Phone and street address as text on /contact and in footer."},
    {"signal": "structured_data", "status": "missing", "evidence": "No application/ld+json block in home page source."},
    {"signal": "buyer_faq", "status": "missing", "evidence": "No FAQ page or Q&A section on home, services, or contact pages."},
    {"signal": "corroborating_profiles", "status": "unknown"},
    {"signal": "crawlability", "status": "present", "evidence": "robots.txt allows all user agents; page text present in static HTML."}
  ]
}
```

The live tool returns `readinessScore` 57.4, `assessment` `limited_observed`, and `evidenceCoveragePercent` 68, with three `priorities` (structured data, service and location, buyer FAQ) and four `verificationNeeded` items. Present it as "57 out of 100, limited based on what was observed, covering 68% of the rubric", list the priorities in order, and turn `verificationNeeded` into a short checklist (for example: "Tell me which directory and review profiles you control so we can check that their name, phone, and address match the site.").
