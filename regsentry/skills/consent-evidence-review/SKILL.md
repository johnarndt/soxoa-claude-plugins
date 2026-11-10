---
name: consent-evidence-review
description: Use when the user wants a quick look at the trackers on a website they own or are authorized to test, or wants consent observations graded, for example "what trackers are on example.com?", "does my site load Meta Pixel?", "grade these consent observations", or "how do I gate Google Analytics behind consent?". Covers a static homepage inspection, grading supplied observations, and tracker remediation playbooks.
---

# Static tracking check, evidence grading and playbooks

RegSentry is a technical evidence aid, not a legal authority.

## Flow

1. Ask the user to confirm they own or are authorized to inspect the domain. Only after a clear yes, call `inspect_site_tracking` with the bare `domain` (no path or query) and `authorizationAcknowledged: true`. Report the tracker markup and consent setup signals it found and the runtime gaps it lists.
2. A static read does not show when trackers fire. To claim timing (before consent, after reject), run `runtime-consent-check` next.
3. If the user already has redacted observations (tracker, phase `before_consent` / `after_reject` / `after_accept` / `unknown`, request count, whether typed values were sent), call `interpret_consent_evidence` with `domain`, `consentBannerPresent` and `observations`. Report the evidence grade, what was observed in each phase, unresolved trackers, and the recommended next step, with its disclaimer.
4. For a named tracker, call `get_remediation_playbook` with `tracker` and present the consent-gating steps as guidance for the site owner.

## Rules

- Never call an inspection tool without the user's confirmation of authorization for that exact domain.
- Never describe results as legal advice, a compliance certification or proof of liability.
- A playbook does not change the website or verify a fix.
