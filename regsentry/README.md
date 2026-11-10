![RegSentry](assets/icon.png)

# RegSentry for Claude

RegSentry shows which third-party trackers a website loads, and when: before a visitor consents, after they reject, or after they accept. This plugin connects Claude to RegSentry's six public tools, which need no account, and adds skills to inspect a site you own or are authorized to test, grade consent evidence, compare a run before and after a fix, export a dated plain-text report, and get tracker-specific consent-gating playbooks. Every result is a technical observation of what a browser saw, never legal advice, a compliance certification or proof of liability.

## What it connects to

- **One remote MCP server:** `https://regsentry.com/mcp` (Streamable HTTP). The plugin contains no scripts, hooks or local servers and contacts nothing else.
- **Authentication:** none. The six public tools work without an account or key.
- **Why the anonymous address:** RegSentry's account tools (monitored sites, scheduled scans, findings, deploy checks) use the same address but need an API key sent as `Authorization: Bearer rs_live_...`. A plugin cannot hold your key, so this plugin connects without one. To add the account tools for your own sites, create an API key in your RegSentry dashboard (read tools from the Monitor plan; scans and deploy checks on Team or Protect) and add the server yourself, as RegSentry's agent page shows: `claude mcp add --transport http regsentry https://regsentry.com/mcp --header "Authorization: Bearer $REGSENTRY_API_KEY"`. The skills in this plugin use only the public tools. Plans: https://regsentry.com/pricing.
- **What the server does:** `inspect_site_tracking` makes one bounded GET of the homepage of the domain you name. `inspect_runtime_consent` loads that homepage in three temporary browser sessions, blocks non-GET requests and supplies no credentials; page scripts and consent buttons may still make public GET requests with remote effects. The other four tools make no network requests and store nothing.
- **Data sent:** a domain, your confirmation that you are authorized to inspect it, redacted tracker observations you supply, tracker names, and runtime snapshots returned earlier.
- **Data returned:** tracker markup and consent signals, per-phase tracker request attempts with dates and limitations, evidence grades, comparisons, report text and playbook steps.

## Tools

| Tool | What it does | Access |
|---|---|---|
| `inspect_site_tracking` | Static read of one authorized public homepage: tracker references, consent setup signals and what still needs runtime verification. Runs no JavaScript. | Public, read-only |
| `inspect_runtime_consent` | Three isolated browser visits (before consent, after reject-all, after accept-all) recording known tracker request attempts. Missing controls are reported as untested. | Public, read-only |
| `interpret_consent_evidence` | Grades redacted tracker observations you supply by consent phase. | Public, read-only |
| `compare_consent_observations` | Compares two runtime snapshots of the same domain, phase by phase. | Public, read-only |
| `export_consent_report` | Formats a runtime snapshot as a dated plain-text report with method and limitations. Nothing is published or stored. | Public, read-only |
| `get_remediation_playbook` | Consent-gating steps for a named tracker from RegSentry's maintained playbooks. | Public, read-only |

## Skills

| Skill | When it triggers |
|---|---|
| `consent-evidence-review` | "What trackers are on my site?", "grade these consent observations", "how do I gate this tracker?" |
| `runtime-consent-check` | "Does anything fire before consent?", "test my cookie banner", "what loads after reject all?" |
| `compare-consent-runs` | "Did my consent fix work?", "compare today's check with last week's" |
| `export-consent-report` | "Export that consent check", "give me a report for my developer" |

## Setup

- **Claude Code marketplace:** `/plugin marketplace add johnarndt/soxoa-claude-plugins`, then `/plugin install regsentry@soxoa-plugins`.
- **Connector only (Claude Code):** `claude mcp add --transport http regsentry https://regsentry.com/mcp`
- **Connector only (Claude apps):** Customize > Connectors, add a custom connector with `https://regsentry.com/mcp`.

## Example prompts

- "I own example.com. What trackers does the homepage load?"
- "Test whether anything fires before consent on example.com, and what loads after reject all."
- "I changed the banner. Compare a new run with the one from this morning."
- "Export that run as a report I can send to my developer."
- "Give me the playbook for gating Meta Pixel behind consent."

## Limits and boundaries

- Inspect only domains you own or are authorized to test. Claude asks you to confirm before every inspection.
- Static inspection does not show when trackers fire; claims about timing need the runtime check.
- Runtime results are bounded observations of request attempts in a short window. A missing control or incomplete run is untested, not clean. They are not proof of data transmission, a violation or compliance.
- A tracker no longer observed after a change is not a verified fix.
- Nothing here is legal advice or a compliance certification.

## Privacy, terms, support

- Agents and API: https://regsentry.com/agents
- Privacy: https://regsentry.com/privacy
- Terms: https://regsentry.com/terms
- Support: https://regsentry.com/support

## License

MIT. See [LICENSE](LICENSE). Copyright (c) 2026 Soxoa LLC.
