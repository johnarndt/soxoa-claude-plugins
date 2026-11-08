# Portravo tool errors and what to do

A failed Portravo tool call returns an error object with a `code` and a `message`, for example `{"error":{"code":"review_required","message":"Review every line and price the estimate in Portravo before exporting it.","reviewUrl":"https://portravo.com/projects"}}`. Read the `code`, act on the table below, and show the user the server's `message` in plain words. Do not guess at causes the message does not state.

These are the codes Portravo's connection can return today. If you see a code that is not listed, report the message as given and point the user to https://portravo.com/support.

## Connection and account

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_token` | Not connected yet, or the connection expired or was revoked. | Ask the user to connect or reconnect Portravo and sign in again (Claude apps: Customize > Connectors; Claude Code: `/mcp`). Then retry read-only calls. For `run_takeoff`, follow "After a timeout or reconnect" below before any retry. |
| `insufficient_scope` | The connection was approved without the permission this tool needs. | Ask the user to reconnect and approve the requested permissions. |
| `onboarding_required` | The Portravo account has not finished setup. | Ask the user to sign in at https://portravo.com and complete account setup, then retry. |
| `api_unavailable` | Portravo has external access turned off right now. | Tell the user the connection is temporarily unavailable; suggest trying later or contacting support. |
| `service_unavailable` | Temporary server problem. | Retry once with the same `idempotency_key` and the same arguments. For `run_takeoff`, check `get_takeoff_status` and refresh the quote first (see below). If it fails again, stop and tell the user. |

## Input problems

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_arguments` | An argument broke the schema (wrong type, too long, bad characters in `idempotency_key`, `confirm_credit_use` not `true`, `max_credits` outside 0 to 3, a trade not in the allowed list, both or neither of `plan` and `plan_inline`). | Fix the argument. Never "fix" `confirm_credit_use`, `confirmed_trades`, or `max_credits` to values the user has not approved. |
| `invalid_metro` | `metro_code` is not a supported market. | Call `list_pricing_markets`, show the options, and ask. Or create the project without `metro_code` if the user agrees. |
| `invalid_offset` | `list_projects.offset` out of range. | Use `0` or the `nextOffset` value returned by the previous page. |
| `idempotency_conflict` | The same `idempotency_key` was sent before with different arguments. | If this is a retry, resend the original arguments. If it is a new request, make a new key. |
| `plan_required` | `run_takeoff` was called before the project has a plan PDF. Nothing was charged and the `idempotency_key` was not used up. | Give the user the `uploadUrl` from the error and wait for them to upload the plan. Confirm it with `get_takeoff` and check `get_takeoff_status` for a run started in Portravo. Then call `preflight_takeoff` with the `project_id`. If the quote is unchanged, call `run_takeoff` again with the same `idempotency_key` and arguments. If it changed, get a fresh yes and use a new key. |
| `not_found` | No project with that id in this account. | Call `list_projects` and let the user pick. Do not suggest the project belongs to someone else. |

## Plan file problems (`attach_plan_pdf`)

When a plan cannot be attached from chat, the error also carries the project page link (`uploadUrl` and `reviewUrl`, for example `https://portravo.com/projects/<id>`). Give the user that link and ask them to upload the PDF there. Then call `get_takeoff` to confirm the file and `preflight_takeoff` for the quote before `run_takeoff`.

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_file_url` | The `download_url` is not a file link issued by the assistant host. | Do not try other URLs. Use `plan_inline` if the exact file is 32 KiB or smaller, otherwise have the user upload the PDF at the project's `reviewUrl`. |
| `file_unavailable` | The attachment link expired or could not be downloaded. | Ask the user to attach the PDF again, then retry with a new file reference and a new key. |
| `file_too_large` | Over the 10 MiB limit for plans attached from chat. | Have the user upload it at the project's `reviewUrl` instead. The browser upload accepts up to 50 MiB for the selected automatic trades. If it is larger still, ask them to split the PDF and upload the sheets that need pricing. |
| `invalid_inline_file` | `plan_inline.data_base64` is not canonical base64 or is over 32 KiB. | Re-encode the exact file bytes without line breaks. If the file is larger than 32 KiB, use the upload route in Portravo. |
| `invalid_pdf` | The bytes are not a PDF, or `file_name` or `mime_type` is wrong. | Confirm the user selected a real `.pdf`. Never construct a PDF yourself. |
| `plan_protected` | The project already has a plan, or it changed. | The connection only adds a project's first plan. Replacing plans happens in Portravo at `reviewUrl`. |

## Takeoff problems (`run_takeoff`)

| Code | Meaning | What to do |
| --- | --- | --- |
| `no_balance` | Not enough existing credits for this run. | Tell the user. They can buy credits or start a plan in Portravo. The connection never purchases anything or bills overage. |
| `plan_too_large` | The attached plan is over the size limit for this project. Refused before charging. | Ask the user to split the set and upload the needed sheets in Portravo. `preflight_takeoff` reports the current upload limits. |
| `review_protected` | The project already has a takeoff or review work. | Do not retry. Send the user to `reviewUrl` to review or re-run in Portravo. |
| `revision_protected` | The project is a revision of an estimate. | Revisions are edited in Portravo; extraction is not available here. |
| `extraction_failed` | The run failed. The credit reservation is refunded. | Call `get_takeoff_status` and `get_takeoff` to check the project. Only start another run after a fresh `preflight_takeoff` quote, the user's fresh yes, and a new `idempotency_key`. |

### Changed quote or short balance

`run_takeoff` refuses before starting if the trade selection or credit cost no longer matches `confirmed_trades` and `max_credits`, or if the balance is too low. Nothing is charged. The code for these refusals is not listed here, so read the server's `message`.

1. Call `preflight_takeoff` with the `project_id` and show the user the new quote: trades, `creditsRequired`, and `existingCreditsAvailable`.
2. If the balance is short, stop and point the user to Portravo.
3. Otherwise ask for a fresh yes to the new quote, then call `run_takeoff` with the new `confirmed_trades` and `max_credits` and a new `idempotency_key`. Reusing the old key with new arguments returns `idempotency_conflict`.

Never raise `max_credits` above the approved number to get past a refusal.

### After a timeout or reconnect

When a `run_takeoff` call times out, returns `service_unavailable`, or fails with `invalid_token` and the user reconnects:

1. Call `get_takeoff_status`. It is read-only and never restarts a run or uses credits.
2. If a run exists (queued, in progress, done, or failed), follow it. Do not call `run_takeoff` again.
3. If no run started, call `preflight_takeoff` with the `project_id`. Reuse the same key and identical arguments only if the trades and `creditsRequired` match what the user approved in this conversation. Otherwise get a fresh yes and use a new key.

## Progress problems (`get_takeoff_status`)

`get_takeoff_status` only reads. If it shows the run failed, report it as failed with any limitation it gives, and follow `extraction_failed` above. If it shows the run still queued or in progress after several checks, say so with the `reviewUrl`. Do not call it failed, and do not start another run.

## Export problems (`export_reviewed_estimate`)

| Code | Meaning | What to do |
| --- | --- | --- |
| `review_required` | Some lines are unreviewed, assemblies are unmapped, or the estimate is not priced or final. | Give the user the project `reviewUrl` (from `get_takeoff` or `list_projects`) and explain what to finish there. |
