![Ocolta](assets/icon.png)

# Ocolta for Claude

Ocolta helps property managers, lenders and other careful reviewers check bank statements and paystubs for document-integrity signals. Its paid Deep Review is a model-assisted second look at one document, run in the Ocolta workspace after you consent to the upload. This plugin connects Claude to the Deep Reviews you already completed, so Claude can tell you which purchase is connected, list the reviews that are still recoverable, explain a review's categorical summary in plain language, and help you plan fair follow-up with the issuing institution. It is read-only: it never uploads a document, starts or pays for a review, or spends a credit. Results are signals for human follow-up, not proof of fraud, authenticity or AI generation.

## What it connects to

- **One remote MCP server:** `https://app.ocolta.com/mcp` (Streamable HTTP). The plugin contacts nothing else and contains no scripts, hooks, or local servers.
- **Authentication:** OAuth 2.0 with PKCE and dynamic client registration (public client, no client secret). You approve the connection in the browser where you bought Ocolta reviews and choose one existing purchase. Permissions requested: `openid` (identify the purchase you select), `reviews:list` (list its recoverable Deep Reviews) and `reviews:read` (read categorical summaries from those reviews). A connection lasts up to 30 days, and you can revoke it at https://app.ocolta.com/oauth/connections. The plugin stores no credentials; your Claude client holds the OAuth token.
- **Data sent to Ocolta:** only the tool calls Claude makes for you and, for a summary, the review ID that Ocolta itself returned. No document, file name, applicant detail or free text is sent through this connection.
- **Data returned to Claude:** a purchase label, whether it is a synthetic reviewer fixture, the number of unused reviews, review IDs, and for each review its status, review priority, confidence, fraud and AI-generation assessments, indicator and limitation counts, and a fixed disclaimer. No source document, personal fields, payment details, account identifiers or report text are returned.
- Your conversation with Claude is covered by Anthropic's terms. Claude may keep summaries it received in the conversation after you revoke access.

## Tools

| Tool | What it does | Access |
| --- | --- | --- |
| `get_connected_purchase` | Shows the connected purchase's label, whether it is a synthetic reviewer fixture, and how many unused reviews it has. | Read-only |
| `list_recent_reviews` | Lists up to ten completed Deep Reviews from that purchase that are still inside the 24-hour recovery window. | Read-only |
| `get_review_summary` | Returns one review's categorical status, priority, confidence, assessments, indicator counts and disclaimer. | Read-only |

## Skills

| Skill | Triggers when you ask to |
| --- | --- |
| `check-connected-purchase` | See which Ocolta purchase is connected, how many reviews are left, or whether the connection works. |
| `find-recoverable-reviews` | Find the Deep Reviews you can still read, or learn why a review is no longer available. |
| `explain-review-summary` | Read and explain a review's priority, confidence and indicator counts for a human reviewer, including what they do not prove. |
| `verification-follow-up` | Build a fair follow-up checklist: what to confirm with the bank, employer or payroll provider, and how to ask without accusing anyone. |

## Setup

You need an existing Ocolta Deep Review purchase, made in the Ocolta workspace at https://app.ocolta.com/workspace. Ocolta has no accounts: access belongs to the browser that made the purchase, so approve the connection in that same browser.

- **Claude directory:** install Ocolta from the plugin directory, then approve the connection in your purchasing browser when Claude asks.
- **Claude Code marketplace:** run `/plugin marketplace add johnarndt/soxoa-claude-plugins`, then `/plugin install ocolta@soxoa-plugins`. Run `/mcp` and authenticate Ocolta.
- **Connector only:** `claude mcp add --transport http ocolta https://app.ocolta.com/mcp` in Claude Code, or add `https://app.ocolta.com/mcp` under Customize > Connectors in Claude apps.

Connection details from Ocolta: https://app.ocolta.com/workspace/integrations

## Example prompts

- "Which Ocolta purchase is connected, and how many reviews do I have left?"
- "Which of my Ocolta reviews can I still read?"
- "Explain the most recent Ocolta review summary for my leasing manager."
- "This review came back high priority. What should we verify with the bank before deciding anything?"
- "Draft a neutral message asking the applicant for the original statement download."

## Limits and boundaries

- Read-only. New reviews, uploads, purchases and report downloads happen only in the Ocolta workspace.
- Completed reviews are recoverable for 24 hours after completion. After that, the summary is no longer available through the connection; download the JSON report in the workspace if you need to keep it.
- Summaries are categorical. The indicators themselves, their locations and explanations stay in the full report in the workspace.
- A summary does not prove fraud, authenticity, intent, identity, account ownership or AI generation. It is not a consumer report, an eligibility decision or legal advice, and it must not be the sole basis for an approval, denial or accusation.
- Claude sees only the purchase you selected when connecting.

## Privacy, terms, support

- Privacy: https://ocolta.com/legal/privacy
- Terms: https://ocolta.com/legal/terms
- Support: https://ocolta.com/contact or hello@ocolta.com (never email applicant documents)

## License

MIT. See [LICENSE](LICENSE). Copyright (c) 2026 Soxoa LLC.
