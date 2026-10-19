# Portravo tool errors and what to do

A failed Portravo tool call returns an error object with a `code` and a `message`, for example `{"error":{"code":"review_required","message":"Review every line and price the estimate in Portravo before exporting it.","reviewUrl":"https://portravo.com/projects"}}`. Read the `code`, act on the table below, and show the user the server's `message` in plain words. Do not guess at causes the message does not state.

These are the codes Portravo's connection can return today. If you see a code that is not listed, report the message as given and point the user to https://portravo.com/support.

## Connection and account

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_token` | Not connected yet, or the connection expired or was revoked. | Ask the user to connect or reconnect Portravo and sign in again (Claude apps: Customize > Connectors; Claude Code: `/mcp`). Then retry the same call. |
| `insufficient_scope` | The connection was approved without the permission this tool needs. | Ask the user to reconnect and approve the requested permissions. |
| `onboarding_required` | The Portravo account has not finished setup. | Ask the user to sign in at https://portravo.com and complete account setup, then retry. |
| `api_unavailable` | Portravo has external access turned off right now. | Tell the user the connection is temporarily unavailable; suggest trying later or contacting support. |
| `service_unavailable` | Temporary server problem. | Retry once with the same `idempotency_key` and the same arguments. If it fails again, stop and tell the user. |

## Input problems

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_arguments` | An argument broke the schema (wrong type, too long, bad characters in `idempotency_key`, `confirm_credit_use` not `true`, both or neither of `plan` and `plan_inline`). | Fix the argument. Never "fix" `confirm_credit_use` by setting it to `true` without the user's yes. |
| `invalid_metro` | `metro_code` is not a supported market. | Call `list_pricing_markets`, show the options, and ask. Or create the project without `metro_code` if the user agrees. |
| `invalid_offset` | `list_projects.offset` out of range. | Use `0` or the `nextOffset` value returned by the previous page. |
| `idempotency_conflict` | The same `idempotency_key` was sent before with different arguments. | If this is a retry, resend the original arguments. If it is a new request, make a new key. |
| `not_found` | No project with that id in this account. | Call `list_projects` and let the user pick. Do not suggest the project belongs to someone else. |

## Plan file problems (`attach_plan_pdf`)

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_file_url` | The `download_url` is not a file link issued by the assistant host. | Do not try other URLs. Use `plan_inline` if the exact file is 32 KiB or smaller, otherwise have the user upload the PDF at the project's `reviewUrl`. |
| `file_unavailable` | The attachment link expired or could not be downloaded. | Ask the user to attach the PDF again, then retry with a new file reference and a new key. |
| `file_too_large` | Over the plan size limit (10 MiB). | Ask the user to split the PDF and attach the sheets that need pricing. |
| `invalid_inline_file` | `plan_inline.data_base64` is not canonical base64 or is over 32 KiB. | Re-encode the exact file bytes without line breaks. If the file is larger than 32 KiB, use the upload route in Portravo. |
| `invalid_pdf` | The bytes are not a PDF, or `file_name` or `mime_type` is wrong. | Confirm the user selected a real `.pdf`. Never construct a PDF yourself. |
| `plan_protected` | The project already has a plan, or it changed. | The connection only adds a project's first plan. Replacing plans happens in Portravo at `reviewUrl`. |

## Takeoff problems (`run_takeoff`)

| Code | Meaning | What to do |
| --- | --- | --- |
| `no_balance` | No estimate credits left. | Tell the user. They can buy an estimate or start a plan in Portravo. The connection never purchases anything. |
| `plan_too_large` | The attached plan is over 10 MiB. Refused before charging. | Ask the user to split the set and upload the needed sheets in Portravo. |
| `review_protected` | The project already has a takeoff or review work. | Do not retry. Send the user to `reviewUrl` to review or re-run in Portravo. |
| `revision_protected` | The project is a revision of an estimate. | Revisions are edited in Portravo; extraction is not available here. |
| `extraction_failed` | The run failed. The credit reservation is refunded. | Call `get_takeoff` to check the project. Only start another run with the user's fresh yes and a new `idempotency_key`. |

## Export problems (`export_reviewed_estimate`)

| Code | Meaning | What to do |
| --- | --- | --- |
| `review_required` | Some lines are unreviewed, assemblies are unmapped, or the estimate is not priced or final. | Give the user the project `reviewUrl` (from `get_takeoff` or `list_projects`) and explain what to finish there. |
