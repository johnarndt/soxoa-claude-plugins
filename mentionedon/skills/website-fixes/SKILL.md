---
name: website-fixes
description: Use when a MentionedOn customer wants to fix the business facts on their website so AI assistants describe them correctly, for example "fix my business info for AI", "generate schema for my site", "check my website facts", "prepare website fixes", "did I install the fixes right?", or "verify my schema is live". Inspects the owned site, drafts reviewed fixes and verifies them, saving each step only with the user's confirmation.
---

# Prepare and verify website fixes

The three tools that save need a paid or 7-day trial monitoring slot (Local is $99/month). Each saved step creates a new revision, and every call must carry the current revision.

## Flow

1. Call `list_monitored_businesses` and confirm the business.
2. Call `get_website_fixes` with `businessId`. Note the current `revision` (0 if no record) and which fixes are installed. If drafts already exist, skip to step 6 or 7.
3. Ask the user to confirm they own, or are allowed to inspect, the business website. Only after a clear yes, call `inspect_business_website` with `businessId`, the exact `revision`, and `authorizationAcknowledged: true`. It fetches a few public pages and saves candidate facts with where each was found.
4. Call `get_website_fixes` again for the new `revision`. Show every candidate fact with its source and ask the user to confirm, correct or remove each. Ask for missing facts; never fill them in yourself.
5. Ask which schema.org `businessType` fits (from the tool's list, for example `Plumber`, `Dentist`, `LocalBusiness`). Then ask: "Save these confirmed facts and generate the fixes?" Only on a yes, call `draft_website_fixes` with `businessId`, the exact current `revision`, the confirmed `facts`, `businessType` and `confirmed: true`.
6. Show the generated schema, website copy and business-profile description. The user installs them on their own site; Claude does not.
7. After the user says they installed them, ask for the page URL on their own domain and reconfirm ownership. Then call `verify_website_fixes` with `businessId`, the current `revision`, `url` and `authorizationAcknowledged: true`. Report found, not found or unknown for each fix.

## Rules

- Ask before every call that saves (`inspect_business_website`, `draft_website_fixes`, `verify_website_fixes`). Never set `authorizationAcknowledged` or `confirmed` to true on the user's behalf or from an earlier, general yes.
- Always pass the exact revision from the latest `get_website_fixes`. If a call is refused for a stale revision, re-read it; do not guess a number.
- Never infer that the owner confirmed a fact. Never invent hours, prices, licenses, service areas or reviews.
- Never publish or edit the website. No tool here runs a paid AI scan.
- A found fix does not prove better AI visibility.
- Up to 20 website checks a day. If the limit is hit, say so and stop.
- Not connected, or no monitoring slot? In Claude Code run `/mcp`, pick `mentionedon` and sign in; the trial or plan is started in MentionedOn (https://mentioned-on.com/developers/mcp).
