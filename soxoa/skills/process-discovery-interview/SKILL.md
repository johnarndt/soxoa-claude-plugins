---
name: process-discovery-interview
description: "Use when a user wants to talk through how their team works to find automation opportunities, but does not yet have clean numbers. Triggers include 'help me figure out what to automate', 'interview me about our processes', 'walk me through an automation assessment', 'I do not know how many hours this takes', 'map our manual work', 'where is my team wasting time', or a vague request like 'we do a lot of copy and paste'. Runs a short structured interview that collects only the user's own facts and produces a ready-to-run intake for the Soxoa estimate_automation_roi and prioritize_automation_workflows tools."
---

# Process discovery interview

A structured conversation that turns "we spend too much time on admin" into a confirmed intake sheet: a list of recurring workflows with the exact fields the two Soxoa tools need. It never fills a number or rating the user did not give or confirm.

This skill gathers inputs. It calls a tool only at the end, and only after the user says to.

## When not to use this skill

- The user already has the numbers for one workflow and wants a dollar figure: go straight to `automation-roi-estimate`.
- The user already has a list with hours and ratings: go to `workflow-backlog-triage`.
- The user wants a compliance, security, or legal review of a process. This interview does not assess those.
- The user wants someone to observe staff, read their email, or connect to their systems. Nothing here does that; the interview relies on what the user tells you.

## What the interview must produce

For every workflow (up to 12 per tool call):

| Field | Tool argument | Source |
|---|---|---|
| Workflow name | `name` (1 to 120 chars) | user's words, kept generic |
| Team hours per week | `weeklyHours` (0.25 to 500) | user |
| Predictability | `predictability` (low, medium, high) | user, rubric offered |
| Judgment required | `judgmentRequired` (low, medium, high) | user, rubric offered |
| Error cost | `errorCost` (low, medium, high) | user, rubric offered |
| Data sensitivity | `dataSensitivity` (low, medium, high) | user, rubric offered |
| Systems touched | `systemsCount` (integer 1 to 20) | user lists them, you count |

For any workflow the user wants valued, also:

| Field | Tool argument | Source |
|---|---|---|
| People who do it | `people` (integer 1 to 500) | user |
| Hours per person per week | `weeklyHoursPerPerson` (0.5 to 60) | user |
| Loaded hourly cost and currency | `loadedHourlyCost` (10 to 500) | user |
| Reclaimable share | `automatableShare` (0.05 to 0.95) | optional, user only |
| Working weeks per year | `workingWeeks` (integer 1 to 52) | optional, user only |
| One-time implementation cost | `implementationCost` (0 to 10,000,000) | optional, user only |

Leave optional fields blank when the user has no view. Blank means "omit from the call", and the server then applies 60% and 48 weeks.

## Interview flow

Ask a few questions at a time, not a wall of 20. The full question bank is in `references/question-bank.md`.

1. **Frame.** "I will ask about the recurring work your team does, then turn it into inputs for two planning tools. I will only use numbers you give me. Please skip customer names, passwords, or account details."
2. **Inventory.** Ask for the recurring tasks that feel manual, repetitive, or annoying. Capture each as a short generic name. Stop at 12, or ask the user which 12 matter most.
3. **Walk each one.** For each workflow, ask what starts it, what the person does step by step, where the information comes from and goes to (this gives `systemsCount`), how often it happens, and what goes wrong.
4. **Hours.** Ask who does it and how long it takes. Accept the user's form (per item, per day, per week), then show the conversion to weekly hours and get a yes. If they truly do not know, ask them to time it for a week, or to give a rough number they are comfortable labelling as rough. Do not supply one.
5. **Ratings.** For predictability, judgment, error cost, and sensitivity, read the user's step-by-step answers back and ask them to pick low, medium, or high (rubric in `references/question-bank.md`). You may suggest a rating with a one-line reason, marked "suggested", but the user must confirm it.
6. **Cost (only if they want value).** Ask headcount, hours per person, loaded hourly cost and currency, and whether they have a view on reclaimable share, working weeks, or a build cost.
7. **Read back.** Show the intake sheet (template below). Mark anything still missing as `MISSING`. Ask for corrections.
8. **Offer next steps.** Ask whether to run the triage, the ROI estimate, or both. Do not call either tool until the user says yes.

When the user approves:

- Triage: call `prioritize_automation_workflows` with the confirmed `workflows` array. Follow `workflow-backlog-triage` for presenting.
- ROI: call `estimate_automation_roi` per workflow the user chose, omitting blank optional fields. Follow `automation-roi-estimate` for presenting.
- If a call returns MCP error -32602, name the workflow and field, ask for the fix, and call again. On a network error, retry once (both tools are idempotent), then fall back as below.

## Intake sheet template

```
Automation intake (your inputs, confirmed <date>)

Workflows for triage
| # | name | weeklyHours | predictability | judgmentRequired | errorCost | dataSensitivity | systemsCount (systems) |
|---|---|---|---|---|---|---|---|
| 1 | ... | ... | ... | ... | ... | ... | 2 (shared inbox, accounting system) |

ROI inputs (only for workflows you want valued)
| name | people | weeklyHoursPerPerson | loadedHourlyCost (currency) | automatableShare | workingWeeks | implementationCost |
|---|---|---|---|---|---|---|
| ... | 4 | 6 | 45 (USD) | not given, server uses 60% | not given, server uses 48 | not given, no payback |

Still missing: <list, or "nothing">
Notes the tools do not use: <exceptions, volumes, error rates, pain points>
```

Keep the notes column. It is the raw material for `pilot-scoping-checklist`.

## Guardrails

- Never invent a number, a rating, a headcount, a wage, or a system count. A rough number from the user is fine if they call it rough; say "rough, per user" in the sheet.
- Do not ask for or record credentials, personal data about staff or customers, or confidential records. The tools need only names, numbers, and ratings.
- The interview is a planning aid. It is not a process audit, and the tool outputs are illustrative estimates, not guaranteed savings or professional advice.
- Do not imply that anyone observed the work or inspected the user's systems.

## If the Soxoa tools are not connected

The interview works fully without the tools; only the final calculations need them. Tell the user how to connect:

- Claude apps: Customize > Connectors, add a custom connector with URL `https://soxoa.com/mcp`, no authentication.
- Claude Code: `claude mcp add --transport http soxoa https://soxoa.com/mcp`

Give the user the finished intake sheet so they can run it later. Do not present scores, rankings, or ROI figures as tool results.

## Worked example

User: "Maintenance requests come in by email, a coordinator types them into our property software, picks a vendor from a spreadsheet, and texts them. About 60 a week, 10 minutes each, two coordinators."

Read back: "60 at 10 minutes is 10 hours a week for the team, 5 each. Systems: shared inbox, property software, vendor spreadsheet, work phone, so 4. Right?" After the user confirms and picks ratings (medium predictability, low judgment, high error cost, medium sensitivity), the intake row becomes:

```json
{ "name": "Maintenance request intake and dispatch", "weeklyHours": 10, "predictability": "medium", "judgmentRequired": "low", "errorCost": "high", "dataSensitivity": "medium", "systemsCount": 4 }
```

With a user-supplied loaded cost of $32 and no view on share, weeks, or build cost, the ROI arguments are `{ "people": 2, "weeklyHoursPerPerson": 5, "loadedHourlyCost": 32 }`. Show the intake sheet and ask before running either tool.

The full condensed session is in `references/example-session.md`.
