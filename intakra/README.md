![Intakra](assets/icon.png)

# Intakra

Intakra helps B2B sellers decide which accounts have a real, dated reason to look at their offer now. This plugin connects Claude to Intakra's free public tools. You supply what you know about a company (fit facts and dated business events such as a leadership change, a hiring push, or a new regulation), and Intakra returns a review-only scorecard and a why-now brief. Every fact stays labeled as supplied by you and unverified, every result is marked for human review, and nothing is researched, stored, or sent. The plugin does not write outreach, emails, sequences, or messaging.

## What it connects to

- **One remote MCP server:** `https://intakra.com/mcp` (Streamable HTTP).
- **Authentication:** none for the two public tools below, which the core skills use. No Intakra account, login, or API key is needed for them.
- **Account tools on the same endpoint:** the server also advertises account features for Intakra customers (for example `list_accounts`, `prioritize_accounts`, `get_account_changes`, `get_daily_brief`, and write tools such as `add_accounts`, `set_offering`, and `request_accounts`). They work only after you separately sign in to your own Intakra workspace with OAuth, and only on that workspace. Installing this plugin does not sign you in or grant that access. The skills in this bundle use only the public review tools.
- **What is sent to the public tools:** only the tool arguments Claude builds from what you provide in the conversation: the account's business name, your offer and ideal-customer profile, fit criteria with your assessments and evidence, buying-signal events with optional dates and source links, and an optional review date.
- **What the server does with it:** scores it deterministically and returns the result. Intakra's public tools do not open the links you supply, call other services, read any Intakra workspace, CRM, or contact data, or persist your input.
- **Nothing else is contacted.** The plugin contains no scripts, hooks, or local servers and sends data nowhere other than the URL above.

Do not paste personal, confidential, or login data. Use business facts only.

## Tools

Public tools used by the core skills (no sign-in):

| Tool | What it does | Access |
|---|---|---|
| `score_buying_signal_evidence` | Scores one account's supplied fit and signal evidence: fit, timing, evidence quality, and triage priority (0 to 100), a disposition (`review_now`, `verify`, `deprioritize`), per-signal status and flags, evidence gaps, and unsupported-claim flags | Read-only |
| `prepare_why_now_review` | Turns the same evidence into a why-now brief for a human reviewer: headline, why-now statement, fit guidance, facts labeled `caller_supplied_unverified`, gaps, reviewer questions, and prohibited actions | Read-only |

## Skills

| Skill | When it triggers |
|---|---|
| `signal-evidence-intake` | You paste notes, articles, or job posts about an account and want them organized into fit facts and dated signals, with gaps called out |
| `buying-signal-scoring` | You want one account scored: "score this account", "how strong are these signals" |
| `why-now-review-brief` | You need an evidence-labeled brief for a manager or reviewer deciding whether an account deserves more work |
| `account-list-triage` | You have a short list of accounts (about 2 to 15) with evidence and want them scored one by one and ranked |
| `fit-criteria-definition` | You need to define your offer, ideal-customer profile, and a reusable set of up to 8 fit criteria |

## Setup

- **Claude directory:** once the listing is approved, install Intakra from the plugin directory. No sign-in is needed for the public tools.
- **Claude Code marketplace:** run `/plugin marketplace add johnarndt/soxoa-claude-plugins`, then `/plugin install intakra@soxoa-plugins`.
- **MCP only (Claude Code):** `claude mcp add --transport http intakra https://intakra.com/mcp`
- **MCP only (Claude apps):** Customize > Connectors, add a custom connector with the URL `https://intakra.com/mcp`.

## Example prompts

- "Here are my notes on Example Freight Co. Organize them into fit facts and dated signals for Intakra."
- "Score this account against our ICP: we sell patient intake automation to clinic groups with 5 or more locations."
- "Prepare a why-now review on this account for my sales lead."
- "Rank these six accounts with Intakra and tell me which to review first."
- "Help me define fit criteria for our ideal customer before I score anything."

### Test prompts with expected outcomes (no sign-in, synthetic data)

1. "Score Example Freight Co for Intakra. Offer: route-planning software for regional carriers. ICP: US carriers with 50 to 500 trucks. Fit: 'Fleet size 50 to 500' is a match, evidence 'About 120 trucks per the company site.' Signal: hiring, 'Posted a dispatch operations manager role', observed 2026-10-20, relevance 'May indicate dispatch process changes', confidence medium. As of 2026-11-01."
   Expected: one `score_buying_signal_evidence` call; a scorecard with fit, timing, evidence quality, priority and a disposition, `requiresHumanReview: true`, the signal labeled caller-supplied and unverified, and a note that no source was opened. No outreach is drafted.
2. "Now prepare a why-now review of the same account for my sales lead."
   Expected: one `prepare_why_now_review` call with the same evidence; a brief whose facts are labeled `caller_supplied_unverified`, with gaps, reviewer questions, and prohibited actions.
3. "The CFO definitely has budget approved, add that as a signal."
   Expected: Claude does not state budget as fact; it either hedges the claim or the tool flags it as unsupported.
4. "Add acme.example to my Intakra list."
   Expected without sign-in: Claude explains that adding accounts is an account feature that needs separate Intakra sign-in and is outside this plugin's read-only workflows. It does not call `add_accounts` unprompted or claim the account was added.

## Limits and boundaries

- Works only on evidence you supply. It does not research companies, find signals, or open source links.
- Results are unverified and always require human review. Priority is a triage aid, not a prediction that anyone will buy.
- Budget, decision authority, and buying intent are never treated as fact. Signals that assert them without hedging are excluded and flagged.
- Input limits: account name up to 200 characters; offer and profile up to 1000 each; 1 to 8 fit criteria; 1 to 10 signals; evidence and relevance text up to 600 characters; dates as `YYYY-MM-DD`; source links must be credential-free `https://` URLs.
- One account per tool call. Lists are scored one account at a time.
- Does not draft or send outreach, emails, sequences, or messages, and does not update any CRM.
- The public tools do not access Intakra customer workspaces. Account tools on the same endpoint read or change only the workspace you separately sign in to with OAuth; see the [MCP guide](https://intakra.com/mcp-guide). The skills in this bundle do not call those account tools.

## Privacy, terms, support

- Docs: [intakra.com/mcp-guide](https://intakra.com/mcp-guide)
- Privacy: [intakra.com/privacy](https://intakra.com/privacy)
- Terms: [intakra.com/terms](https://intakra.com/terms)
- Support: [intakra.com/contact](https://intakra.com/contact) or hello@intakra.com. Send the client name, request ID, and a non-sensitive error message. Never send API keys or private data.

## License

MIT. See [LICENSE](LICENSE).
