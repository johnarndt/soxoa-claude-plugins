---
name: compare-consent-runs
description: Use when the user wants to know whether a consent fix changed anything, for example "did my fix work?", "compare today's consent check with last week's", "what changed since the banner update?", or "is the pixel still firing before consent?". Compares two RegSentry runtime snapshots of the same domain.
---

# Compare two runtime consent snapshots

## Flow

1. Get two snapshots of the same domain, both returned by `inspect_runtime_consent`: a baseline (before the change) and a current one. If the user has only the baseline, run `runtime-consent-check` for the current one, with their authorization.
2. Call `compare_consent_observations` with `baseline` and `current`, each passed exactly as returned.
3. Report whether the runs are comparable, then each change by phase and tracker: newly observed, no longer observed, increased, decreased or unchanged. List unresolved phases (missing controls or incomplete runs) separately.

## Rules

- A tracker no longer observed is not a verified fix and does not show what caused the change. Say so.
- Never edit, merge or reconstruct a snapshot, and never compare snapshots of different domains.
- The comparison makes no network requests and stores nothing.
- Never present the result as legal advice or a compliance certification.
