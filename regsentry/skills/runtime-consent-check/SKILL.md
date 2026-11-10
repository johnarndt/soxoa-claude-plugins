---
name: runtime-consent-check
description: Use when the user wants to know which trackers fire before consent or after rejecting cookies on a site they own or are authorized to test, for example "does anything fire before consent on example.com?", "test my cookie banner", "what loads after I click reject all?", or "check consent timing on my homepage". Runs RegSentry's three-session browser observation.
---

# Runtime consent check

## Flow

1. Ask the user to confirm they own or are authorized to inspect the domain. Tell them the check loads the public homepage in three temporary browser sessions (before consent, after reject-all, after accept-all), and that page scripts and consent controls may make public GET requests with remote effects. Wait for a clear yes.
2. Call `inspect_runtime_consent` with the bare `domain` and `authorizationAcknowledged: true`.
3. Report, phase by phase, the status (`observed`, `control_not_found` or `incomplete`) and the tracker request attempts, with the observation time. Treat any phase with a missing control or an incomplete run as untested, not clean.
4. Keep the returned snapshot unchanged in the conversation. Offer `export-consent-report` to save it, or `compare-consent-runs` after the owner makes a fix.
5. For trackers that fired too early, offer `get_remediation_playbook` for each.

## Rules

- Never run without authorization confirmed for that exact domain in this conversation.
- Request attempts are bounded observations, not proof of data transmission, compliance or a violation.
- Never describe results as legal advice or a compliance certification.
- Do not edit the snapshot; the comparison and report tools need it exactly as returned.
