---
name: consent-evidence-review
description: Inspect an authorized public website's tracking signals, compare consent observations, and prepare technical remediation guidance.
---

# Review website tracking and consent evidence

Use RegSentry only on a public site the user owns or is authorized to test. Ask for the domain and authorization when missing; do not invent either, observations or scan history. Results are technical observations, not legal advice, a compliance certification or proof of liability.

Use `inspect_site_tracking` for static markup and `inspect_runtime_consent` for bounded browser observations when needed. Both take a public domain without a path, port, query or credentials; they normalize the hostname and start at its HTTPS homepage. Runtime inspection blocks redirects. If a redirect prevents observation, report the phase as incomplete and ask the user to authorize inspection of the final canonical domain; do not silently substitute it.

Runtime phases use fresh browser contexts and supported exact English consent buttons. They report attempted requests to known trackers, not proof of successful transmission. Missing controls and incomplete phases are unresolved; absence from a bounded window is not proof of absence. Restrictions on navigation, frames and other traffic can affect results.

Use `interpret_consent_evidence` for supplied redacted observations, `compare_consent_observations` for actual compatible snapshots of the same domain, and `get_remediation_playbook` for fix guidance. Use `export_consent_report` for requested report content. Preserve observation dates, limitations and incomplete states. These public tools do not create monitoring projects or store reports. Ask for an earlier snapshot if it is not available instead of inventing one.
