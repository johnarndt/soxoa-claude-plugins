![Intakra](assets/icon.png)

# Intakra

Intakra watches the companies a B2B team tracks and records dated public findings about them: leadership changes, hiring, filings, website changes. When a finding matters for what the team sells, it becomes a lead: a dated reason to look at that account, with the link to check it and who to reach. This plugin connects Claude to Intakra in two ways:

- **Your workspace (sign-in):** ask which tracked accounts are worth a call today, what changed this week, who owns a lead, add accounts, or update what you sell. Claude reads saved, dated records from the workspace you connect.
- **Public evidence tools (no account):** score account-fit and buying-signal evidence you supply and prepare a review-only why-now brief. Nothing is researched, stored or sent.

A lead is a reason to look, not confirmed need, budget or purchase intent. No tool drafts or sends outreach.

## What it connects to

- **One remote MCP server:** `https://intakra.com/mcp` (Streamable HTTP). The plugin contains no scripts, hooks or local servers and contacts nothing else.
- **Authentication:** none to connect. The two public tools work right away. The 13 workspace tools are listed too; the first time one is used, Claude asks you to sign in to Intakra with OAuth (in Claude Code: run `/mcp`, pick `intakra`, sign in in the browser), choose a workspace and approve `accounts:read`, `accounts:write` and `offering:write`. Revoke at https://intakra.com/oauth/connections.
- **Why this address and not `https://intakra.com/api/mcp`:** Intakra runs the same server at two addresses. `/api/mcp` demands sign-in when it is added, which would leave people without an account with no tools at all. `/mcp` lets anyone use the public tools and still signs customers in for the workspace tools. If you prefer to connect with a workspace API key (which adds lead marking, watching and CRM push, not used by these skills), add `https://intakra.com/api/mcp` yourself with `--header "Authorization: Bearer ik_live_..."`, as described at https://intakra.com/agents.
- **Price:** the public tools are free. Workspace tools are included in every Intakra plan and the trial: from $199/month after a 14-day trial on 150 companies, with no per-call fees (see https://intakra.com/agents).
- **Data sent:** the tool arguments Claude builds from the conversation: company domains or names, lead ids, dates, your offering text when you change it, and for the public tools the account name, offer, ideal-customer profile, fit criteria and dated signals you supply.
- **Data returned:** for the workspace, your tracked accounts, dated findings with source links, leads, suggested accounts, your stored offering and, for a lead, the most likely owner (name, role, LinkedIn, and a verified work email when Intakra has one, never for EU, EEA or UK companies). The public tools return a scorecard or brief built only from what you supplied.

Do not paste personal, confidential or login data into the public tools. Use business facts only.

## Tools

| Tool | What it does | Access |
|---|---|---|
| `score_buying_signal_evidence` | Scores supplied fit and signal evidence for one account: fit, timing, evidence quality, priority (0 to 100), a disposition, evidence gaps and unsupported-claim flags. | Public, read-only |
| `prepare_why_now_review` | Turns the same evidence into a why-now brief for a human reviewer, every fact labeled `caller_supplied_unverified`. | Public, read-only |
| `get_daily_brief` | Today's note: each lead with dated proof, what it usually means, who to reach and the time frame. | Workspace, read-only |
| `prioritize_accounts` | Ranks tracked accounts by their best open lead, with dated proof and links. | Workspace, read-only |
| `get_account_changes` | Findings recorded since a date (default seven days), with event date, recorded date and source. | Workspace, read-only |
| `list_accounts` | Tracked accounts, or which of the domains you name are tracked. | Workspace, read-only |
| `get_account` | One account's recent dated findings and open leads. | Workspace, read-only |
| `list_opportunities` | Open leads, or those closing within about 30 days. | Workspace, read-only |
| `get_best_contact` | Who most likely owns a lead, and why. | Workspace, read-only |
| `get_project_updates` | Dated before/after changes on one lead. | Workspace, read-only |
| `list_suggestions` | Companies Intakra suggested adding, each with its reason. | Workspace, read-only |
| `get_offering` | What the workspace says it sells, exactly as stored. | Workspace, read-only |
| `add_accounts` | Adds company domains to the tracked list. Asks you first. | Workspace, write |
| `request_accounts` | Asks Intakra to find companies matching a description or lookalikes; results arrive later as suggestions. Asks you first. | Workspace, write |
| `set_offering` | Replaces what the workspace says it sells. Shows the current text and asks you first. | Workspace, write |

## Skills

| Skill | When it triggers |
|---|---|
| `daily-brief` | "Who is worth a call today?", "what's in my Intakra note?" |
| `prioritize-tracked-accounts` | "Who should I target from my list?", "is acme.com on my list?", "what do we know about acme.com?" |
| `account-changes` | "Anything happening on my list this week?", "what changed at these companies?" |
| `lead-contact-and-updates` | "Which leads are closing soon?", "who should I reach about this lead?", "what changed on that lead?" |
| `manage-account-list` | "Add stripe.com to my Intakra list", "which accounts did Intakra suggest?", "find companies like our best customers" |
| `update-offering` | "What does Intakra think we sell?", "tell Intakra we sell payroll software for restaurant groups" |
| `signal-evidence-intake` | You paste notes, articles or job posts about an account and want them organized into fit facts and dated signals (public tools) |
| `buying-signal-scoring` | "Score this account" from evidence you supply (public tools) |
| `why-now-review-brief` | An evidence-labeled brief for a reviewer deciding whether an account deserves more work (public tools) |
| `account-list-triage` | A short pasted list of accounts with evidence, scored one by one and ranked (public tools) |
| `fit-criteria-definition` | Define your offer, ideal-customer profile and up to 8 fit criteria |

## Setup

- **Claude Code marketplace:** `/plugin marketplace add johnarndt/soxoa-claude-plugins`, then `/plugin install intakra@soxoa-plugins`. For workspace tools, run `/mcp`, pick `intakra` and sign in.
- **Connector only (Claude Code):** `claude mcp add --transport http intakra https://intakra.com/mcp`
- **Connector only (Claude apps):** Customize > Connectors, add a custom connector with `https://intakra.com/mcp`.

## Example prompts

- "Who on my Intakra list is worth a call today, and why?"
- "Anything happening on my account list this week?"
- "Who should I reach at acme.com about that lead?"
- "Add stripe.com and ramp.com to my Intakra list."
- "Score this account against our ICP: we sell patient intake automation to clinic groups with 5 or more locations."

### Test prompts with expected outcomes

Without sign-in (synthetic data):

1. "Score Example Freight Co for Intakra. Offer: route-planning software for regional carriers. ICP: US carriers with 50 to 500 trucks. Fit: 'Fleet size 50 to 500' is a match, evidence 'About 120 trucks per the company site.' Signal: hiring, 'Posted a dispatch operations manager role', observed 2026-10-20, relevance 'May indicate dispatch process changes', confidence medium. As of 2026-11-01."
   Expected: one `score_buying_signal_evidence` call; a scorecard with fit, timing, evidence quality, priority and a disposition, `requiresHumanReview: true`, the signal labeled caller-supplied and unverified. No outreach is drafted.
2. "The CFO definitely has budget approved, add that as a signal."
   Expected: Claude does not state budget as fact; it hedges the claim or the tool flags it as unsupported.

With a connected workspace:

3. "Who is worth a call today?"
   Expected: `get_daily_brief`; dated leads with links, or a plain "nothing today" on a quiet day.
4. "Add acme.example to my Intakra list."
   Expected: Claude shows the domain and asks first; only after a yes does it call `add_accounts`, then reports added or skipped and that no findings exist yet. Without sign-in, Claude asks you to connect instead and does not claim the account was added.
5. "Tell Intakra we sell payroll software for restaurant groups."
   Expected: `get_offering` first, old and new text side by side, a yes, then `set_offering`.

## Limits and boundaries

- Workspace tools read saved, dated records. They do not run new research or open links, and no findings is not proof of no activity.
- A lead or score is a triage aid, not a prediction that anyone will buy. Budget, authority and intent are never stated as fact.
- No tool drafts or sends outreach, emails or sequences. Lead marking, watching and CRM push are not available through this connection.
- Adding accounts, requesting suggestions and replacing the offering always ask you first.
- Public tools: one account per call; up to 8 fit criteria and 10 signals; dates as `YYYY-MM-DD`; credential-free `https://` source links.

## Privacy, terms, support

- Connect and pricing: [intakra.com/agents](https://intakra.com/agents)
- Privacy: [intakra.com/privacy](https://intakra.com/privacy)
- Terms: [intakra.com/terms](https://intakra.com/terms)
- Support: [intakra.com/contact](https://intakra.com/contact) or hello@intakra.com. Send the client name, request ID and a non-sensitive error message. Never send API keys or private data.

## License

MIT. See [LICENSE](LICENSE).
