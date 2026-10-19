![Soxoa Automation Planning](assets/icon.png)

# Soxoa Automation Planning

Soxoa is an AI automation studio for small and mid-size businesses: you talk through how your team works and get a plan for what to build. This plugin brings that planning into Claude. It connects Claude to Soxoa's two public, read-only planning tools and adds five skills that interview you about your recurring work, rank a backlog of workflows into automate, assist, or discovery, estimate illustrative hours and capacity value, write a business case memo with explicit assumptions, and scope a small, reversible first pilot. Every number comes from facts you supply. Nothing is guessed, and every result is an illustrative planning estimate, not guaranteed savings or professional advice.

## What it connects to

| Item | Detail |
|---|---|
| MCP server | `https://soxoa.com/mcp` (the only endpoint this plugin contacts) |
| Transport | Streamable HTTP |
| Authentication | None. No account, API key, or OAuth. |
| Data sent | Only the tool arguments Claude builds from what you type: workflow names, weekly hours, low/medium/high ratings, system counts, headcount, hourly labor cost, and optional reclaimable share, working weeks, and implementation cost. |
| Data not sent | No files, emails, credentials, or system access. The skills tell Claude not to put customer names, account numbers, or secrets into workflow names. |

The server calculates from the inputs in each request. According to the [MCP guide](https://soxoa.com/mcp-guide), it does not access a customer workspace, fetch external data, start a job, send a message, implement an automation, or persist business inputs. As with any website, the hosting provider processes ordinary request information such as IP address and request time (see the [privacy policy](https://soxoa.com/privacy)). The plugin has no hooks, scripts, or local servers and sends data nowhere else.

## Tools

| Tool | What it does | Access |
|---|---|---|
| `estimate_automation_roi` | From people, weekly hours per person, and loaded hourly cost, returns illustrative weekly and annual hours reclaimed, annual capacity value, and payback months when you supply an implementation cost. Defaults to 60% reclaimable share and 48 working weeks when you give none. | Read-only |
| `prioritize_automation_workflows` | Ranks 1 to 12 workflows by hours, predictability, judgment required, error cost, data sensitivity, and systems touched. Returns a score, an automate, assist, or discovery recommendation, a human-review flag, a suggested first workflow, and guardrails. | Read-only |

Both tools are deterministic and idempotent: the same inputs always return the same result.

## Skills

| Skill | Triggers when you |
|---|---|
| `process-discovery-interview` | want help figuring out what to automate and do not have clean numbers yet |
| `workflow-backlog-triage` | have a list of manual processes and ask which to automate first |
| `automation-roi-estimate` | ask what automating one task is worth, how many hours it frees up, or the payback on a quote |
| `automation-business-case` | need a one-page memo for an owner, manager, or partner, optionally with your own best and worst case values |
| `pilot-scoping-checklist` | have picked a first workflow and want a safe, reversible pilot plan |

## Setup

- **Claude directory:** install Soxoa Automation Planning from the plugin directory. The connector is added automatically.
- **Claude Code marketplace:** run `/plugin marketplace add johnarndt/soxoa-claude-plugins`, then `/plugin install soxoa@soxoa-plugins`.
- **Connector only:** in Claude, go to Customize > Connectors and add a custom connector with URL `https://soxoa.com/mcp` and no authentication. In Claude Code, run `claude mcp add --transport http soxoa https://soxoa.com/mcp`.

After connecting, Claude should list exactly the two tools above.

## Example prompts

- "Interview me about our office admin work and figure out what we could automate."
- "Here are six manual processes with hours per week. Which should we automate first?"
- "Three coordinators each spend 8 hours a week on scheduling at $38 an hour loaded. What could automating it be worth?"
- "Write a one-page business case for automating invoice entry. The quote is $12,000. Also show it if only 40% is automatable."
- "We picked maintenance request intake. Scope a pilot we can roll back."

## Limits and boundaries

- Results are illustrative planning estimates. They are not guaranteed savings, implementation quotes, forecasts, or financial, legal, or other professional advice, and they do not replace process discovery.
- The tools only calculate from what you provide. They do not inspect your systems, staff, or data, and they do not build or run any automation.
- Required inputs that are missing are asked for, never invented. Optional reclaimable share and working weeks are left to the server defaults (60% and 48) unless you give your own values, which are kept exactly.
- Value inputs must fall within the tool limits: 1 to 500 people, 0.5 to 60 hours per person per week, and 10 to 500 hourly cost in your currency. Triage takes 1 to 12 workflows per request.
- Sensitivity scenarios are run only with alternate values you supply.
- Regulated, safety-critical, financial, medical, or legal judgment is never planned for full automation.
- Do not enter credentials or sensitive business data. The tools need only names, numbers, and ratings.

## Privacy, terms, support

- Privacy: https://soxoa.com/privacy
- Terms: https://soxoa.com/terms
- Support: https://soxoa.com/support or hello@soxoa.com
- Tool guide: https://soxoa.com/mcp-guide

## License

MIT. See [LICENSE](LICENSE).
