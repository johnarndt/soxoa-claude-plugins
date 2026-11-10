---
name: export-consent-report
description: Use when the user wants a written record of a RegSentry runtime consent check, for example "export that consent check", "give me a report I can send to my developer", "save the tracking evidence as a file", or "write up the consent results". Formats one runtime snapshot as a private plain-text report.
---

# Export a technical consent report

## Flow

1. Use a snapshot returned by `inspect_runtime_consent` in this conversation, unchanged. If there is none, run `runtime-consent-check` first, with the user's authorization.
2. Call `export_consent_report` with `snapshot`.
3. Show the report text. In Claude Code, offer to save it using the returned `filename`, and write it only where the user agrees.

## Rules

- The report keeps the date, method, phase results and limitations. Do not remove the limitations or add conclusions to it.
- It is a technical record, not a compliance certificate or legal opinion; say so if the user plans to show it to a regulator, lawyer or customer.
- Exporting does not publish, share or store the report. The user decides who receives it.
