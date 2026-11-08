![RegSentry](assets/icon.png)

# RegSentry Tracking and Consent Review

Inspect a public website you own or are expressly authorized to test, review supplied consent evidence, compare dated observations of the same domain, and prepare a technical remediation report. The plugin connects Claude to RegSentry's six public tools. It does not set up monitoring, store reports, or edit a website.

## Connection and data

- **One remote MCP server:** `https://regsentry.com/mcp` (Streamable HTTP). The plugin contacts nothing else and contains no scripts, hooks or local servers.
- **Authentication:** none. The six public tools need no account, API key or OAuth connection.
- **Data sent to RegSentry:** the domain and tool arguments you provide, including any observations you paste. Supply only redacted evidence. Do not include credentials or sensitive personal information.
- **Effects on the inspected site:** static and runtime inspection contact the specified public site, and that site and its providers may receive ordinary request information. In runtime sessions, page scripts and consent controls can make public GET requests that have remote effects.
- **Nature of results:** RegSentry returns technical observations. They are not legal advice, a compliance certification or proof of liability.

## Public tools

| Tool | Purpose |
| --- | --- |
| `inspect_site_tracking` | Check static homepage markup and identify gaps requiring runtime verification. |
| `inspect_runtime_consent` | Observe known tracker request attempts in bounded isolated browser sessions before consent and after supported reject or accept controls. |
| `interpret_consent_evidence` | Interpret supplied, redacted observations. |
| `compare_consent_observations` | Compare compatible dated observations of the same domain. |
| `get_remediation_playbook` | Get tracker-specific guidance for review. |
| `export_consent_report` | Format supplied observations as plain-text report content. |

Runtime checks use fresh isolated browser contexts, observe attempted requests to known trackers rather than proven transmission, and press only supported exact English consent buttons, so they may not exercise every consent flow. Missing controls, blocked redirects and incomplete phases stay unresolved. Absence of a request in a bounded window is not proof of absence. Inspecting one homepage is not proof of site-wide behavior.

## Install in Claude Code

The RegSentry bundle is available from the `codex/regsentry-claude-plugin-20261029` branch of the Soxoa GitHub marketplace. In Claude Code v2.1.275 or later, install it in one step:

```
/plugin install regsentry --marketplace johnarndt/soxoa-claude-plugins#codex/regsentry-claude-plugin-20261029
```

Other options:

- **Older Claude Code:** run `/plugin marketplace add johnarndt/soxoa-claude-plugins#codex/regsentry-claude-plugin-20261029`, then `/plugin install regsentry@soxoa-plugins`.
- **Connector only:** run `claude mcp add --transport http regsentry https://regsentry.com/mcp` in Claude Code, or add `https://regsentry.com/mcp` under Customize > Connectors in Claude apps.

The GitHub marketplace install requires no RegSentry sign-in.

## Reviewer prompts

Each prompt below is safe to run against a site you own or are expressly authorized to test. Replace `YOUR-AUTHORIZED-DOMAIN` with that hostname only. The placeholder is not a real site, and nothing in this document reports a scan that has been run.

### 1. Static check of an authorized fixture

> Run a static tracking check on YOUR-AUTHORIZED-DOMAIN. I own this site. Do not run a browser session yet.

If you are an authorized tester rather than the owner, say so instead: "I am expressly authorized to test it."

**Expected outcome.** Claude calls `inspect_site_tracking` once with the bare hostname. The result lists tracker-related markup found on the HTTPS homepage, such as scripts, pixels and consent-management markers, and flags gaps that need runtime verification. Claude reports the observation date when present and leaves runtime consent behavior unresolved.

**Unresolved caveats.** Static markup shows what is present, not what fires or when. Dynamically loaded tags, tag-manager containers and consent-gated scripts remain unresolved until a runtime check. One homepage is not the whole site. If the homepage redirects to another hostname, Claude reports that and asks for authorization before inspecting the final domain.

### 2. Bounded browser check of the same fixture

> Now run the bounded runtime consent check on YOUR-AUTHORIZED-DOMAIN, same authorization. Report attempted tracker requests before consent and after the reject and accept controls, and tell me which phases were incomplete.

**Expected outcome.** Claude calls `inspect_runtime_consent` for the same hostname. The result reports, per phase where supported, attempted requests to known trackers observed in fresh isolated browser sessions: before consent, after reject and after accept. Claude presents each phase separately and preserves any incomplete or control-not-found state as unresolved rather than as a pass.

**Unresolved caveats.** Attempted requests are not proven transmission. Only supported exact English consent buttons are pressed, so a custom, translated or multi-step banner may leave the reject or accept phase incomplete. Redirects are blocked, so a redirecting homepage yields an incomplete phase. Absence of a request in a bounded window is not proof of absence. Page scripts and consent controls can make public GET requests with remote effects on the site's providers.

### 3. Comparison and report from supplied dated observations

> Here are two dated, redacted consent observations for YOUR-AUTHORIZED-DOMAIN, one from the earlier date and one from the later date: [paste both]. Compare them, note unresolved phases, pull remediation guidance for any tracker still requesting before consent, and format a plain-text report.

**Expected outcome.** Claude calls `compare_consent_observations` on the two supplied snapshots, then `get_remediation_playbook` for the trackers named in the comparison, then `export_consent_report`. No site contact occurs. These tools work only on what you supplied. The output preserves both observation dates, states what changed and what did not, lists which phases are unresolved in either snapshot, and presents remediation as technical guidance for review.

**Unresolved caveats.** Comparison requires compatible snapshots of the same domain. If they differ in domain or format, Claude reports that rather than reconciling them. A missing earlier snapshot is requested, not invented. The report is formatted content, not a stored or certified document, and it does not conclude whether the site is compliant or liable.

## Privacy, terms, support

- Privacy: https://regsentry.com/privacy
- Terms: https://regsentry.com/terms
- Support: https://regsentry.com/support
- Documentation: https://regsentry.com/agents

## License

MIT. See [LICENSE](LICENSE).
