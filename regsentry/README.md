![RegSentry](assets/icon.png)

# RegSentry Tracking and Consent Review

Inspect a public website you own or are authorized to test, review supplied consent evidence, compare dated observations, and prepare a technical remediation report. The plugin connects to RegSentry's six public tools without an account or API key. It does not set up monitoring or directly edit a website.

## Connection and data

The plugin uses streamable HTTP at `https://regsentry.com/mcp`. Claude sends the domain and tool arguments you provide to RegSentry. Static and runtime inspection contact the specified public site; that site and its providers may receive ordinary request information. Page scripts and consent controls can make public GET requests that have remote effects. Supply only redacted evidence and avoid credentials and sensitive personal information. RegSentry's technical observations are not legal advice, certification or proof of liability. See [privacy](https://regsentry.com/privacy), [terms](https://regsentry.com/terms) and [support](https://regsentry.com/support).

## Public tools

| Tool | Purpose |
| --- | --- |
| `inspect_site_tracking` | Check static homepage markup and identify gaps requiring runtime verification. |
| `inspect_runtime_consent` | Observe known tracker request attempts in bounded isolated browser sessions before consent and after supported reject or accept controls. |
| `interpret_consent_evidence` | Interpret supplied, redacted observations. |
| `compare_consent_observations` | Compare compatible dated observations of the same domain. |
| `get_remediation_playbook` | Get tracker-specific guidance for review. |
| `export_consent_report` | Format supplied observations as plain-text report content. |

Runtime checks use fresh contexts, observe attempted requests rather than proven transmission, and may not exercise every consent flow. Missing controls, blocked redirects and incomplete phases stay unresolved. Inspecting one homepage is not proof of site-wide behavior.

## Install in Claude Code

Once this candidate is published to the marketplace, run:

```
/plugin marketplace add johnarndt/soxoa-claude-plugins
/plugin install regsentry@soxoa-plugins
```

For a connector alone, use `claude mcp add --transport http regsentry https://regsentry.com/mcp`. These instructions do not establish directory publication.

## Example prompts

- "Inspect the tracking signals on my public website example.com. I authorize the inspection."
- "Compare these two dated consent observations and identify unresolved phases."
- "Use these findings to prepare a prioritized remediation plan and retest steps."

## License

MIT. See [LICENSE](LICENSE).
