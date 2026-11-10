![Soxoa Automation Planning](assets/icon.png)

# Soxoa Automation Planning

Soxoa is an AI automation studio for small and mid-size businesses: you talk through how your team works and get a plan for what to build. This plugin brings that planning into Claude. It connects Claude to Soxoa's three public, read-only planning tools and adds six skills that interview you about your recurring work, rank a backlog of workflows into automate, assist, or discovery, estimate illustrative hours and capacity value, write a business case memo with explicit assumptions, and scope and draft a small, reversible first pilot. Every number comes from facts you supply. Nothing is guessed, and every result is an illustrative planning estimate, not guaranteed savings or professional advice.

## What it connects to

| Item | Detail |
|---|---|
| MCP server | `https://soxoa.com/mcp` (the only endpoint this plugin contacts) |
| Transport | Streamable HTTP |
| Authentication | None. No account, API key, or OAuth. |
| Data sent | Only the tool arguments Claude builds from what you type: workflow names, weekly hours, low/medium/high ratings, system counts, headcount, hourly labor cost, and optional reclaimable share, working weeks, and implementation cost. For a pilot plan: the workflow's trigger, inputs, desired output, source and destination system names, current steps, review owner, risk level, a sensitive-data yes/no, success checks, and optional constraints. |
| Data not sent | No files, emails, credentials, or system access. The skills tell Claude not to put customer names, account numbers, or secrets into workflow names. |

The server calculates from the inputs in each request. According to the [MCP guide](https://soxoa.com/mcp-guide), it does not access a customer workspace, fetch external data, start a job, send a message, implement an automation, or persist business inputs. As with any website, the hosting provider processes ordinary request information such as IP address and request time (see the [privacy policy](https://soxoa.com/privacy)). The plugin has no hooks, scripts, or local servers and sends data nowhere else.

## Tools

| Tool | What it does | Access |
|---|---|---|
| `estimate_automation_roi` | From people, weekly hours per person, and loaded hourly cost, returns illustrative weekly and annual hours reclaimed, annual capacity value, and payback months when you supply an implementation cost. Defaults to 60% reclaimable share and 48 working weeks when you give none. | Read-only |
| `prioritize_automation_workflows` | Ranks 1 to 12 workflows by hours, predictability, judgment required, error cost, data sensitivity, and systems touched. Returns a score, an automate, assist, or discovery recommendation, a human-review flag, a suggested first workflow, and guardrails. | Read-only |
| `build_workflow_pilot` | From one workflow's current steps, trigger, inputs, desired output, source and destination systems, review owner, risk level, sensitive-data flag, and success checks, returns proposed steps, tools, a drafting prompt, review gates, acceptance checks, a rollout, and a Markdown plan. It does not connect accounts, store the plan, send messages, or run the workflow. | Read-only |

All three tools are deterministic and idempotent: the same inputs always return the same result.

## Skills

| Skill | Triggers when you |
|---|---|
| `process-discovery-interview` | want help figuring out what to automate and do not have clean numbers yet |
| `workflow-backlog-triage` | have a list of manual processes and ask which to automate first |
| `automation-roi-estimate` | ask what automating one task is worth, how many hours it frees up, or the payback on a quote |
| `automation-business-case` | need a one-page memo for an owner, manager, or partner, optionally with your own best and worst case values |
| `draft-workflow-pilot` | want a concrete pilot plan for one workflow drafted with `build_workflow_pilot`, after confirming its eleven facts with you |
| `pilot-scoping-checklist` | have picked a first workflow and want a safe, reversible pilot plan (optionally drafted with `build_workflow_pilot`) |

## Setup

- **Claude directory:** once the listing is approved, install Soxoa Automation Planning from the plugin directory. The connector is added automatically.
- **Claude Code marketplace:** run `/plugin marketplace add johnarndt/soxoa-claude-plugins`, then `/plugin install soxoa@soxoa-plugins`.
- **Connector only:** in Claude, go to Customize > Connectors and add a custom connector with URL `https://soxoa.com/mcp` and no authentication. In Claude Code, run `claude mcp add --transport http soxoa https://soxoa.com/mcp`.

After connecting, Claude should list the three tools above.

## Example prompts

- "Interview me about our office admin work and figure out what we could automate."
- "Here are six manual processes with hours per week. Which should we automate first?"
- "Three coordinators each spend 8 hours a week on scheduling at $38 an hour loaded. What could automating it be worth?"
- "Write a one-page business case for automating invoice entry. The quote is $12,000. Also show it if only 40% is automatable."
- "We picked maintenance request intake. Scope a pilot we can roll back."

### Test prompts with expected outcomes (synthetic data)

1. "Three coordinators each spend 8 hours a week on scheduling at $38 an hour loaded. What could automating it be worth?"
   Expected: one `estimate_automation_roi` call with `people` 3, `weeklyHoursPerPerson` 8, `loadedHourlyCost` 38 and no optional fields; illustrative hours and capacity value using the 60% and 48-week defaults, stated as assumptions, and no payback because no cost was given.
2. "Rank these: invoice entry, 10 h/week, high predictability, low judgment, medium error cost, medium sensitivity, 2 systems; contract review, 6 h/week, low predictability, high judgment, high error cost, high sensitivity, 3 systems."
   Expected: one `prioritize_automation_workflows` call with two workflows; a score, recommendation, and human-review flag for each, a recommended first workflow, and guardrails.
3. "Draft a pilot plan for maintenance request intake using the synthetic fixture."
   Expected: one `build_workflow_pilot` call with the exact arguments in [`skills/pilot-scoping-checklist/references/build-workflow-pilot-fixture.md`](skills/pilot-scoping-checklist/references/build-workflow-pilot-fixture.md); proposed steps, review gates, acceptance checks, rollout, and a Markdown plan. Nothing is connected, stored, sent, or run.

## Limits and boundaries

- Results are illustrative planning estimates. They are not guaranteed savings, implementation quotes, forecasts, or financial, legal, or other professional advice, and they do not replace process discovery.
- The tools only calculate from what you provide. They do not inspect your systems, staff, or data, and they do not build or run any automation.
- Required inputs that are missing are asked for, never invented. Optional reclaimable share and working weeks are left to the server defaults (60% and 48) unless you give your own values, which are kept exactly.
- Value inputs must fall within the tool limits: 1 to 500 people, 0.5 to 60 hours per person per week, and 10 to 500 hourly cost in your currency. Triage takes 1 to 12 workflows per request. A pilot plan takes one workflow with 1 to 8 current steps, 1 to 6 success checks, and up to 6 constraints.
- A pilot plan is a draft for people to review. The drafting prompt and tool suggestions it returns are not run by the plugin.
- Sensitivity scenarios are run only with alternate values you supply.
- Regulated, safety-critical, financial, medical, or legal judgment is never planned for full automation.
- Do not enter credentials or sensitive business data. The tools need only names, numbers, and ratings.

## Soxoa builds MCP servers too

These tools are a small example of Soxoa's own work. If you want your own SaaS product usable by AI agents (a production MCP server with OAuth sign-in and directory listings), see https://soxoa.com/agent-ready. The skills never pitch this; Claude mentions it only if you ask.

## Privacy, terms, support

- Privacy: https://soxoa.com/privacy
- Terms: https://soxoa.com/terms
- Support: https://soxoa.com/support or hello@soxoa.com
- Tool guide: https://soxoa.com/mcp-guide

## License

MIT. See [LICENSE](LICENSE).
