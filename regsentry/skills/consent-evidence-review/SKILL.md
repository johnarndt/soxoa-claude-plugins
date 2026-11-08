---
name: consent-evidence-review
description: Inspect an authorized public website's tracking signals, compare consent observations, and prepare technical remediation guidance.
---

# Review website tracking and consent evidence

Use RegSentry only on a public site the user owns or is expressly authorized to test. Ask for the domain and authorization when missing; do not invent either, and do not invent observations or scan history. Only describe a scan when its tool result is in the conversation, and cite the observation date when the result includes it. Results are technical observations, not legal advice, a compliance certification or proof of liability.

## Inspecting a site

Use `inspect_site_tracking` for static markup and `inspect_runtime_consent` for bounded browser observations when needed. Both take a public domain without a path, port, query or credentials; they normalize the hostname and start at its HTTPS homepage. Both contact the public site, and runtime sessions can trigger public GET requests with remote effects, so confirm authorization before the first call. Runtime inspection blocks redirects. If a redirect prevents observation, report the phase as incomplete and ask the user to authorize inspection of the final canonical domain; do not silently substitute it.

Runtime phases use fresh browser contexts and supported exact English consent buttons. They report attempted requests to known trackers, not proof of successful transmission. Present each phase separately. Missing controls and incomplete phases are unresolved, never a pass; absence from a bounded window is not proof of absence. Restrictions on navigation, frames and other traffic can affect results. One homepage is not proof of site-wide behavior.

## Working from supplied evidence

Use `interpret_consent_evidence` for supplied redacted observations, `compare_consent_observations` for actual compatible snapshots of the same domain, and `get_remediation_playbook` for fix guidance. Use `export_consent_report` for requested report content. These tools do not contact the site. Preserve observation dates, limitations and incomplete states. If snapshots differ in domain or format, say so rather than reconciling them. Ask for an earlier snapshot if it is not available instead of inventing one.

These public tools do not create monitoring projects or store reports. Frame remediation as technical guidance for the user's review, and leave compliance or liability conclusions to them and their advisers.
