---
name: visibility-action-plan
description: Use when a user wants a prioritized, phased list of fixes to improve how AI assistants understand or cite their business, based on findings they already have. Triggers include "what should I fix first for AI search", "AI visibility action plan", "prioritize my GEO fixes", "make me a plan to get mentioned by ChatGPT", "turn this audit into a to-do list", "what's the order of work", or a follow-up after an AI discovery readiness audit. Ranks supplied findings with the MentionedOn build_visibility_action_plan tool and turns the ranked actions into concrete, reviewable tasks.
---

# AI visibility action plan

This skill takes findings the user already has (from the `ai-discovery-audit` skill, from their own review, or from an agency report) and ranks them into a phased plan with MentionedOn's `build_visibility_action_plan` tool. The tool uses a fixed rubric. It does not edit a website, contact anyone, store data, or predict how any AI provider will behave.

## When not to use this skill

- The user has no findings yet: run `ai-discovery-audit` first, or collect findings with them using `../ai-discovery-audit/references/signal-checklist.md`.
- The user wants to know whether assistants mention them today: use `ai-answer-capture` and `ai-mention-report`.
- The user wants you to make the changes on their live site: this skill plans. You can draft copy or JSON-LD for their review, but publishing is their decision and their action.

## Inputs and exact tool mapping

Tool: `build_visibility_action_plan`

| Argument | Required | Type and limits | Notes |
|---|---|---|---|
| `businessName` | yes | string, 2 to 120 characters | Label only. |
| `goal` | yes | `improve_discovery_clarity`, `strengthen_citation_evidence`, `prepare_for_monitoring` | Breaks ties in the rubric. See below. |
| `effortBudget` | yes | `lean`, `balanced`, `comprehensive` | Controls how many actions return and how they are phased. |
| `findings` | yes | array, 1 to 10 items | Same shape as the audit signals. |
| `findings[].signal` | yes | one of the ten signal enum values | `business_identity`, `service_location`, `page_description`, `contact_details`, `structured_data`, `corroborating_profiles`, `crawlability`, `buyer_faq`, `first_party_evidence`, `machine_summary`. Each at most once. |
| `findings[].status` | yes | `present`, `partial`, `missing`, `unknown` | `present` findings are acknowledged but create no action. |
| `findings[].evidence` | see note | string, 3 to 500 characters | Required for `present`, `partial`, and `missing` (server-enforced). Optional for `unknown`. |

Choosing `goal` (ask the user which matters most, offer the default):
- `improve_discovery_clarity` (label "Improve discovery clarity"): default. The user wants assistants to understand who they are, what they do, and where.
- `strengthen_citation_evidence` (label "Strengthen citation evidence"): the user is already understood but wants more checkable proof that an answer could cite (FAQs, first-party evidence).
- `prepare_for_monitoring` (label "Prepare for repeatable monitoring"): the user plans to track AI answers over time and wants the basics stable first.

Choosing `effortBudget` (ask how much time or help they have):
- `lean`: a small team or one person. In testing it returned up to 4 actions.
- `balanced`: steady work over a few weeks. In testing, up to 7.
- `comprehensive`: full list. In testing, up to 10 (every non-present finding).
Rely on `omittedActionCount` in the response rather than these counts.

## Workflow

1. **Get findings.** If the user just ran `ai-discovery-audit` in this conversation, reuse its confirmed signals as `findings` verbatim (same statuses and evidence). Otherwise ask for findings and map each to a signal. If a finding does not fit any of the ten signals (for example "our reviews are bad"), tell the user it is outside this rubric and keep it as a separate note rather than forcing it into a signal.
2. **Ask for `goal` and `effortBudget`** if the user has not made them clear. Do not guess silently; if they say "you pick", use `improve_discovery_clarity` and `balanced` and say so.
3. **Show the findings list and confirm** before calling, especially any evidence you summarized.
4. **Call the tool once.** It is deterministic: the same arguments give the same plan, so retrying is safe. On a validation error, read the path in the message (for example `findings[3].evidence`), fix that item, and retry. Never add evidence you do not have to pass validation; change the status to `unknown` instead and tell the user.
5. **Present the plan** with the template below, then translate each action into concrete tasks using `references/action-playbook.md`.
6. **Offer drafts** only for items the user wants help with (for example a LocalBusiness JSON-LD draft using facts they confirm, or FAQ answers from facts they give you). Mark drafts as drafts for their review.
7. **Close with a re-check plan:** suggest re-running `ai-discovery-audit` after changes ship, and, if they want outcome tracking, `ai-answer-capture`.

## Reading the output

- `scope` is always `caller_supplied_findings_only`; `goalLabel` is the human label for the goal.
- `actions[]` (up to 10) each have `rank`, `phase` (`now`, `next`, `later`), `signal`, `title`, `status` (`partial`, `missing`, or `unknown`), `effort` (`low`, `medium`, `high`), `priorityScore`, `suppliedEvidence` (or `null`), `action`, and `verification`.
- Actions for `unknown` findings start with "Verify before changing the site:". Present those as checks to do first, not changes to make.
- `omittedActionCount` is how many non-present findings did not fit the budget. If it is above zero, say so and offer a larger budget.
- `excludedPresentSignals` lists signals already in place. Mention them briefly as strengths.
- `limitations` must be shown to the user.

## Answer template

```
**AI visibility plan: <businessName>**
Goal: <goalLabel>. Budget: <effortBudget>. Ranked by MentionedOn's fixed rubric from the findings below; it does not predict what any AI assistant will do.

**Now**
1. <title> (<status>, effort <effort>): <action>
   Why: <suppliedEvidence or "not yet verified">
   Done when: <verification>
   Tasks: <2 to 4 concrete steps from the playbook>

**Next**
...

**Later**
...

Already in place: <excludedPresentSignals as titles>
Not included at this budget: <omittedActionCount> more item(s).

**Limits**
- <each limitations item>
```

## Guardrails

- Never promise or imply that completing the plan will produce mentions, citations, rankings, traffic, or revenue.
- Use only facts the user confirms in any draft copy, JSON-LD, or FAQ. Do not invent license numbers, addresses, review counts, prices, awards, or years in business.
- Do not recommend fake reviews, doorway pages, keyword stuffing, hidden text, or schema that does not match visible content.
- Do not contact third parties, submit listings, or change any site.
- Present the `priorityScore` as the rubric's ordering, not a measured impact.

## If the MentionedOn tools are not connected

If `build_visibility_action_plan` is not available, tell the user the MentionedOn connector is not connected. In Claude, add `https://mentioned-on.com/mcp` under Customize > Connectors (no sign-in). In Claude Code run `claude mcp add --transport http mentionedon https://mentioned-on.com/mcp`. Without it you can still organize the findings and explain each fix using the playbook, but say that the order is your own suggestion, not the MentionedOn rubric, and do not show rank, phase, or priority scores as if a tool produced them.

## Worked example

User (after an audit): "OK, what do I do first? It's just me, maybe two hours a week."

Call:

```json
{
  "businessName": "Sample Plumbing Co",
  "goal": "improve_discovery_clarity",
  "effortBudget": "lean",
  "findings": [
    {"signal": "business_identity", "status": "present", "evidence": "Home page H1 and footer both say Sample Plumbing Co."},
    {"signal": "service_location", "status": "partial", "evidence": "Mentions Sacramento in footer only."},
    {"signal": "structured_data", "status": "missing", "evidence": "No JSON-LD found."},
    {"signal": "buyer_faq", "status": "missing", "evidence": "No FAQ section found."},
    {"signal": "corroborating_profiles", "status": "unknown"},
    {"signal": "machine_summary", "status": "missing", "evidence": "No llms.txt or summary page found."},
    {"signal": "contact_details", "status": "partial", "evidence": "Phone only in image header."}
  ]
}
```

The live tool returned four actions: 1 `structured_data` (now, medium effort), 2 `service_location` (next), 3 `buyer_faq` (later), 4 `contact_details` (later, low effort), with `omittedActionCount` 2 and `excludedPresentSignals` `["business_identity"]`. Present them in that order, add tasks from the playbook (for example, for structured data: "Draft LocalBusiness JSON-LD with the name, URL, phone, and service area you confirm; add it to the home page; validate it; compare every value with the visible page"), note the business name is already consistent, and tell the user two more items would appear with a `balanced` budget.
