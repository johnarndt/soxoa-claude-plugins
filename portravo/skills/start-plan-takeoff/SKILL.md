---
name: start-plan-takeoff
description: Use when the user wants to start a new construction takeoff or estimate in Portravo from a plan PDF, for example "do a takeoff from this plan set", "create a Portravo project for the Elm Street remodel", "upload these blueprints to Portravo", "run the AI takeoff on this PDF", "count the fixtures and measure the walls on these plans", or "start an estimate in Sacramento". Covers choosing a pricing market, creating the project, attaching the first plan PDF, getting explicit permission to use one estimate credit, and running the initial takeoff.
---

# Start a plan takeoff in Portravo

This skill takes a user from "here is a plan PDF" to a Portravo project with an AI takeoff ready for estimator review. It uses five tools in order: `list_pricing_markets`, `create_project`, `attach_plan_pdf`, `run_takeoff`, and optionally `get_takeoff` to show results.

The takeoff produces extracted quantities with confidence scores. It is a starting point for an estimator, never a bid. Pricing, assembly mapping, and line review happen in Portravo afterward.

## When not to use this skill

- The project already exists and has a takeoff: use `review-takeoff` instead.
- The user wants a workbook from a finished estimate: use `export-reviewed-estimate`.
- The user wants to replace a plan, edit quantities, re-run a reviewed takeoff, or change prices. The connection cannot do these. Send them to the project's `reviewUrl` in Portravo.
- General estimating questions ("what is markup vs margin?") need no Portravo tool. Answer directly.

## If the Portravo tools are not available

If no `portravo` tools are connected, say so plainly and explain how to connect:

- Claude apps: Customize > Connectors, add Portravo (or install this plugin), then sign in to Portravo when asked.
- Claude Code: `claude mcp add --transport http portravo https://portravo.com/mcp`, then run `/mcp` and authenticate.

Without the tools you can still help the user prepare: confirm the project name, address, and market, check that the PDF is 10 MiB or smaller, and explain the steps below. Do not claim a project was created or a takeoff ran.

## Inputs to gather

Ask only for what is missing. Never invent a value.

| Ask the user for | Tool argument | Rules from the live schema |
| --- | --- | --- |
| Project name | `create_project.name` | Required. 1 to 120 characters. |
| Site address (optional) | `create_project.address` | Optional. Up to 200 characters. Omit if not given. |
| City or region for pricing | `create_project.metro_code` | Optional. 1 to 40 characters. Must be a `code` returned by `list_pricing_markets`. Never guess a code. |
| The plan PDF | `attach_plan_pdf.plan` or `attach_plan_pdf.plan_inline` | Exactly one of the two. PDF only. See "Attaching the PDF". |
| Permission to use one estimate credit | `run_takeoff.confirm_credit_use` | Must be the literal `true`, and only after the user says yes in this conversation. |

You generate the `idempotency_key` values yourself (see below). Do not ask the user for them.

## Workflow

1. **Pick the market.** Call `list_pricing_markets` (no arguments). Match the user's city to a metro by `name` or `state`. If one clearly matches, use its `code`. If several could match, or none does, show the options and ask. If the user has no preference or their area is not listed, you may create the project without `metro_code` after telling them.
2. **Create the project.** Call `create_project` with `name`, optional `address`, optional `metro_code`, and a new `idempotency_key`. Save `id`, `status` (normally `draft`), and `reviewUrl`. This does not use a credit.
3. **Attach the plan.** Call `attach_plan_pdf` with `project_id` = the new `id`, one plan source, and a new `idempotency_key`. Save `planFileId` and `reviewUrl`. This does not use a credit.
4. **Ask for credit confirmation.** Stop and ask in plain words, for example: "Running the takeoff uses 1 estimate credit from your existing Portravo balance. A failed run refunds it. Run it now?" Wait for a clear yes. "Sure", "yes, run it", or "go ahead" counts. Silence, a question back, or "maybe later" does not.
5. **Run the takeoff.** Only after a yes, call `run_takeoff` with `project_id`, `confirm_credit_use: true`, and a new `idempotency_key`. Never call `run_takeoff` with `false` as a way to "check"; it only returns an argument error.
6. **Report and hand off.** Present the result with the template below. Offer to summarize the lines (that is the `review-takeoff` skill, which calls `get_takeoff`).

If the user said "set it up but do not run it yet", stop after step 3 and give them the `reviewUrl`.

## Attaching the PDF

Follow this order. Never rebuild, retype, or "regenerate" PDF bytes from text you read in the conversation.

1. **Host file reference.** If the host gives you a file reference for the attached PDF with both a download URL and a file id, send `plan: { "download_url": ..., "file_id": ..., "mime_type": "application/pdf", "file_name": "<name>.pdf" }`. `download_url` and `file_id` are required; `file_name` must end in `.pdf` (5 to 200 characters, no slashes). The server only accepts download links issued by the assistant host for a file the user attached. A link to a file on some website is refused with `invalid_file_url`.
2. **Exact bytes, small files only.** If you can read the exact bytes of the file the user chose (for example a local path in Claude Code; confirm the path with the user first and read only that file) and the file is 32 KiB or smaller, send `plan_inline: { "data_base64": ..., "mime_type": "application/pdf", "file_name": "<name>.pdf" }`. The base64 must be canonical (standard alphabet, padded, no line breaks), at most 43,692 characters. In Claude Code, `base64 < plan.pdf | tr -d '\n'` on the user's file produces it.
3. **Otherwise, upload in Portravo.** Most real plan sets are larger than 32 KiB. Give the user the project `reviewUrl` and ask them to upload the PDF on the project page. They can start the takeoff there. If they come back and ask you to run it, call `get_takeoff` first and continue only if `files` has an entry and `project.status` is `draft`.

Size limit: keep plan PDFs at 10 MiB or smaller. Portravo's connection guide states 10 MiB, and larger plans are refused before any credit is used (`file_too_large` or `plan_too_large`). Suggest splitting the set and uploading the sheets that need pricing.

## Idempotency keys

Every write tool takes an `idempotency_key`: 8 to 128 characters, only letters, digits, and `_ . : -`.

- Make one key per action when you first attempt it, for example `create-elm-st-remodel-20261018a`, `attach-prj_abc123-1`, `takeoff-prj_abc123-1`.
- On a timeout or `service_unavailable`, retry the same call with the same key and the same arguments. Portravo then returns the original project, file, or run instead of creating a second one or charging twice.
- Changing any argument while reusing a key returns `idempotency_conflict`. Use a new key only for a genuinely new request.
- After a failed takeoff, check the project with `get_takeoff` before anything else. A new run needs a new key and a fresh yes from the user.

## Errors

See `references/errors.md` for every error code and what to say. The common ones: `invalid_token` (reconnect), `invalid_metro` (pick a listed code), `no_balance` (the user buys or starts a plan in Portravo; this tool never buys), `plan_protected` or `review_protected` (work already exists; use Portravo), `extraction_failed` (credit refunded; check the project before another run).

## Reading the results

`run_takeoff` returns:

- `ok`: true when the takeoff finished.
- `lines`: the number of takeoff lines extracted.
- `sheets`: names of the plan sheets the extraction read.
- `scopeNotes`: the extractor's notes on skipped sheets and scope it left out because the plans did not show it. Quote these; do not reword them into certainty.

Output template:

```
Takeoff ready for review: <project name>
- Market: <metro name or "none set">
- Plan: <file_name>
- Lines extracted: <lines>
- Sheets read: <sheets, comma separated>
- Scope notes: "<scopeNotes>"
Credit: 1 estimate credit used from your balance.
Next: review each line, its assembly mapping and pricing in Portravo: <reviewUrl>
These are extracted quantities for estimator review, not a bid.
```

## Guardrails

- Never set `confirm_credit_use: true` without a yes from the user in this conversation, even if they asked for a takeoff earlier in general terms. One yes covers one run.
- The tools never purchase credits or change billing. If the balance is empty, say so and point to Portravo.
- Do not describe quantities as final, verified, or bid-ready. Do not promise accuracy.
- Do not invent sheets, quantities, metros, or project ids. Use only tool output.
- The connection adds a project's first plan only. Replacing plans and re-running takeoffs happen in Portravo.
- Only the signed-in user's own projects are visible. A `not_found` on a project id means it does not exist in this account; do not speculate about other accounts.

## Worked example

User: "Start a Portravo takeoff for the Riverside workshop, 1200 Garden Hwy, Sacramento. Plan is ./plans/workshop.pdf."

1. `list_pricing_markets` returns a metro `{ "code": "sacramento-ca", "name": "Sacramento, CA", "state": "CA", "hasDirectPrices": true }`.
2. `create_project`:
   ```json
   { "name": "Riverside workshop", "address": "1200 Garden Hwy, Sacramento, CA", "metro_code": "sacramento-ca", "idempotency_key": "create-riverside-workshop-20261018a" }
   ```
   Returns `{ "id": "prj_7k2m9q", "status": "draft", "reviewUrl": "https://portravo.com/projects/prj_7k2m9q" }`.
3. The file is 12 KB and on disk, so `attach_plan_pdf`:
   ```json
   { "project_id": "prj_7k2m9q", "plan_inline": { "data_base64": "JVBERi0xLjcK...", "mime_type": "application/pdf", "file_name": "workshop.pdf" }, "idempotency_key": "attach-prj_7k2m9q-1" }
   ```
4. Ask: "Running the takeoff uses 1 estimate credit from your Portravo balance (refunded if the run fails). Run it now?" User: "Yes."
5. `run_takeoff`:
   ```json
   { "project_id": "prj_7k2m9q", "confirm_credit_use": true, "idempotency_key": "takeoff-prj_7k2m9q-1" }
   ```
6. Present with the template, ending with the `reviewUrl` and the reminder that the quantities need estimator review.

More examples, including a plan too large to attach here, are in `references/examples.md`.
