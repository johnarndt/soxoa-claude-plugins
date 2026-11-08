---
name: start-plan-takeoff
description: Use when the user wants to start a new construction takeoff or estimate in Portravo from a plan PDF, for example "do a takeoff from this plan set", "create a Portravo project for the Elm Street remodel", "upload these blueprints to Portravo", "run the AI takeoff on this PDF", "count the fixtures and measure the walls on these plans", "how many credits would a plumbing takeoff need", or "start an estimate in Sacramento". Covers checking trades and the exact credit requirement with a preflight, choosing a pricing market, creating the project, attaching the first plan PDF, getting explicit approval for the quoted credits, running the takeoff and following its progress until it is verified done.
---

# Start a plan takeoff in Portravo

This skill takes a user from "here is a plan PDF" to a Portravo project with an AI takeoff ready for estimator review. It uses these tools in order: `preflight_takeoff`, `list_pricing_markets`, `create_project`, `attach_plan_pdf`, `preflight_takeoff` again for the project's quote, `run_takeoff`, `get_takeoff_status` until the run is done, and `get_takeoff` to verify the result.

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

Without the tools you can still help the user prepare: confirm the project name, address, market, and trades, and explain the steps below. Do not state a credit cost, claim a project was created, or claim a takeoff ran.

## Inputs to gather

Ask only for what is missing. Never invent a value.

| Ask the user for | Tool argument | Rules from the live schema |
| --- | --- | --- |
| Trades to take off | `preflight_takeoff.trades`, `create_project.trades`, `run_takeoff.confirmed_trades` | 1 to 9 values from: `electrical`, `framing`, `mechanical`, `plumbing`, `landscape`, `painting`, `concrete`, `roofing`, `drywall`, `whole_job`. Use only trades `preflight_takeoff` reports as available. Required for customer projects. |
| Project name | `create_project.name` | Required. 1 to 120 characters. |
| Site address (optional) | `create_project.address` | Optional. Up to 200 characters. Omit if not given. |
| City or region for pricing | `create_project.metro_code` | Optional. 1 to 40 characters. Must be a `code` returned by `list_pricing_markets`. Never guess a code. |
| The plan PDF | `attach_plan_pdf.plan` or `attach_plan_pdf.plan_inline` | Exactly one of the two. PDF only. See "Attaching the PDF". |
| Approval of the exact quote | `run_takeoff.confirm_credit_use`, `run_takeoff.max_credits` | `confirm_credit_use` must be the literal `true`. `max_credits` is an integer from 0 to 3 and must equal the approved `creditsRequired`. Both only after the user approves that quote in this conversation. |

You generate the `idempotency_key` values yourself (see below). Do not ask the user for them.

## Workflow

1. **Preflight the trades.** Call `preflight_takeoff` with `trades` if the user named them, or with no arguments to see what is available. Show which trades are available and whether each is automatic or team-assisted, as the tool reports it. If the user has not chosen trades, ask them to choose an available automatic selection. For a team-assisted-only selection, use the Portravo link the tool returns. If `accountLinked` is false, the user must connect Portravo before you can create a project. This call reserves nothing, starts nothing, and buys nothing.
2. **Pick the market.** Call `list_pricing_markets` (no arguments). Match the user's city to a metro by `name` or `state`. If one clearly matches, use its `code`. If several could match, or none does, show the options and ask. If the user has no preference or their area is not listed, you may create the project without `metro_code` after telling them.
3. **Create the project.** Call `create_project` with `name`, `trades` (the selection from step 1), optional `address`, optional `metro_code`, and a new `idempotency_key`. Save `id`, `status` (normally `draft`), and `reviewUrl`. This does not use a credit.
4. **Attach the plan.** Call `attach_plan_pdf` with `project_id` = the new `id`, one plan source, and a new `idempotency_key`. Save `planFileId` and `reviewUrl`. This does not use a credit.
5. **Get the project quote.** Call `preflight_takeoff` with `{ "project_id": "<id>" }`. Record the quote exactly as returned: the selected trades, `creditsRequired`, and `existingCreditsAvailable`.
   - If `existingCreditsAvailable` is less than `creditsRequired`, do not ask for approval. Say the balance is short and point the user to Portravo. The connection never buys credits or bills overage.
   - If `mayStart` is false on a customer project, use the tool’s notice and `reviewUrl` to explain the next step.
   - If `creditsRequired` is above 3, the connection cannot accept that ceiling (`max_credits` allows 0 to 3). Do not run. Send the user to the project's `reviewUrl`.
6. **Ask for approval of that exact quote.** State the trades and the credit number from step 5, for example: "Running the takeoff for plumbing and electrical uses 2 existing credits from your Portravo balance (you have 5). Nothing is purchased, and a failed provider run refunds the reservation. Run it now?" Wait for a clear yes. "Yes, run it" or "go ahead" counts. Silence, a question back, or "maybe later" does not.
7. **Run the takeoff.** Only after a yes, call `run_takeoff` with:
   ```json
   { "project_id": "<id>", "confirm_credit_use": true, "confirmed_trades": ["<exactly the approved trades>"], "max_credits": <exactly the approved creditsRequired>, "idempotency_key": "<new key>" }
   ```
   Always send `confirmed_trades` and `max_credits`. Never rely on the `max_credits` default. Never call `run_takeoff` with `confirm_credit_use: false` to "check"; use `preflight_takeoff` for that.
8. **Follow progress.** `run_takeoff` returns asynchronous progress, not finished results. Call `get_takeoff_status` with `{ "project_id": "<id>" }`. While it shows the run queued or in progress, tell the user it is still running. Check again a few times with sensible gaps, not in a tight loop. If it is still running, hand back and offer to check later. `get_takeoff_status` never restarts a run or uses credits, so it is always safe to call.
9. **Verify, then report.** Report success only after `get_takeoff_status` shows the run done. Then call `get_takeoff` to confirm what is available for review. A finished run with no lines or incomplete scope should be reported as such, with its limitations and review link. If the run failed, say so and report any reservation refund the service confirms. Offer the `review-takeoff` summary next.

If the user said "set it up but do not run it yet", stop after step 4 (or step 5 if they want the quote) and give them the `reviewUrl`.

If the user only wants to know what a takeoff would cost or which trades are available, call `preflight_takeoff` and stop. Do not create a project.

## Attaching the PDF

Follow this order. Never rebuild, retype, or "regenerate" PDF bytes from text you read in the conversation.

1. **Host file reference.** If the host gives you a file reference for the attached PDF with both a download URL and a file id, send `plan: { "download_url": ..., "file_id": ..., "mime_type": "application/pdf", "file_name": "<name>.pdf" }`. `download_url` and `file_id` are required; `file_name` must end in `.pdf` (5 to 200 characters, no slashes). The server only accepts download links issued by the assistant host for a file the user attached. A link to a file on some website is refused with `invalid_file_url`.
2. **Exact bytes, small files only.** If you can read the exact bytes of the file the user chose (for example a local path in Claude Code; confirm the path with the user first and read only that file) and the file is 32 KiB or smaller, send `plan_inline: { "data_base64": ..., "mime_type": "application/pdf", "file_name": "<name>.pdf" }`. The base64 must be canonical (standard alphabet, padded, no line breaks), at most 43,692 characters. In Claude Code, `base64 < plan.pdf | tr -d '\n'` on the user's file produces it.
3. **Otherwise, upload in Portravo.** Most real plan sets are larger than 32 KiB. Give the user the project `reviewUrl` and ask them to upload the PDF on the project page. If they come back and ask you to run it, call `get_takeoff` and `get_takeoff_status` first. Continue to the project quote (step 5) only if `files` has an entry, `project.status` is `draft`, and no run has started.

Size limits: plans attached from chat must be 10 MiB or smaller. The browser upload on the project page accepts up to 50 MiB for the selected automatic trades. `preflight_takeoff` reports the current upload limits; follow what it returns. Larger plans are refused before any credit is used (`file_too_large` or `plan_too_large`). Suggest splitting the set and uploading the sheets that need pricing.

## Idempotency keys, timeouts, and reconnects

Every write tool takes an `idempotency_key`: 8 to 128 characters, only letters, digits, and `_ . : -`.

- Make one key per action when you first attempt it, for example `create-elm-st-remodel-20261108a`, `attach-prj_abc123-1`, `takeoff-prj_abc123-1`.
- Repeating a call with the same key and the same arguments returns the original project, file, or run. A repeated `run_takeoff` with the same key does not charge again.
- Changing any argument while reusing a key returns `idempotency_conflict`. Use a new key only for a genuinely new request.

**If `run_takeoff` times out, returns `service_unavailable`, or the connection drops and the user reconnects:**

1. Do not call `run_takeoff` again yet. Call `get_takeoff_status` for the project.
2. If a run exists (queued, in progress, done, or failed), follow it from there. Do not start another one.
3. If no run has started, call `preflight_takeoff` with the `project_id` again.
   - **Same key:** the fresh quote has the same trades and the same `creditsRequired` the user approved, and the approval is in this conversation. Retry `run_takeoff` with the same key and the same arguments.
   - **Stop if the project cannot start or the balance is now short.** Explain what changed and give the review link.
   - **New key and fresh approval:** if the trades or `creditsRequired` changed or the user’s approval is in a different conversation, show the new quote and get a fresh yes before using the new values and a new key.

Recheck `preflight_takeoff` if there is a delay or the connection is re-established. One approval covers one quote for one run.

After a failed takeoff, check the project with `get_takeoff_status` and `get_takeoff` before anything else. A new run needs a fresh preflight quote, a fresh yes, and a new key.

## Errors

See `references/errors.md` for every error code and what to say. The common ones: `invalid_token` (reconnect, then check status before any retry of `run_takeoff`), `invalid_metro` (pick a listed code), `no_balance` (the user buys or starts a plan in Portravo; this connection never buys), `plan_protected` or `review_protected` (work already exists; use Portravo), `extraction_failed` (reservation refunded; check the project before another run).

## Reading the results

- `preflight_takeoff`: available trades (automatic or team-assisted), `creditsRequired`, `existingCreditsAvailable` (null before account linking), `accountLinked`, upload limits, published prices, and a review link. Published prices are for purchases made in Portravo. They are not what this run charges, because a run uses existing credits only.
- `run_takeoff`: asynchronous progress. It is not a finished takeoff.
- `get_takeoff_status`: the project, the latest run's progress, any completion limitations, and the review link. Quote completion limitations as given; do not reword them into certainty.
- `get_takeoff`: the verified result: `project.status`, `lines`, `files`, `reviewRequired`, `reviewUrl`. Field details are in the `review-takeoff` skill.

Output template, only after verification:

```
Takeoff ready for review: <project name>
- Trades: <approved trades>
- Market: <metro name or "none set">
- Plan: <filename>
- Lines extracted: <count of get_takeoff lines>
- Limitations reported: "<completion limitations from get_takeoff_status, if any>"
Credits: approved up to <max_credits> existing credit(s); nothing was purchased.
Next: review each line, its assembly mapping and pricing in Portravo: <reviewUrl>
These are extracted quantities for estimator review, not a bid.
```

While the run is still going, say "The takeoff is still running" with the `reviewUrl`, not "ready".

## Guardrails

- Never set `confirm_credit_use: true` without a yes from the user in this conversation to the exact quote you are sending, even if they asked for a takeoff earlier in general terms. One yes covers one quote for one run.
- `confirmed_trades` and `max_credits` must match the approved quote exactly. Never raise `max_credits` above what the user approved to get past a refusal.
- Never state a credit cost that did not come from `preflight_takeoff`.
- The tools never purchase credits, bill overage, or change billing. If the balance is short, say so and point to Portravo.
- Do not report a takeoff as done until `get_takeoff_status` shows it done and `get_takeoff` confirms it.
- Do not describe quantities as final, verified, or bid-ready. Do not promise accuracy.
- Do not invent sheets, quantities, metros, trades, or project ids. Use only tool output.
- The connection adds a project's first plan only. Replacing plans and re-running reviewed takeoffs happen in Portravo.
- Only the signed-in user's own projects are visible. A `not_found` on a project id means it does not exist in this account; do not speculate about other accounts.

## Worked example

User: "Start a Portravo plumbing and electrical takeoff for the Riverside workshop, 1200 Garden Hwy, Sacramento. Plan is ./plans/workshop.pdf."

All values below are illustrative.

1. `preflight_takeoff` with `{ "trades": ["plumbing", "electrical"] }` reports both trades available.
2. `list_pricing_markets` returns a metro `{ "code": "sacramento-ca", "name": "Sacramento, CA", "state": "CA", "hasDirectPrices": true }`.
3. `create_project`:
   ```json
   { "name": "Riverside workshop", "address": "1200 Garden Hwy, Sacramento, CA", "metro_code": "sacramento-ca", "trades": ["plumbing", "electrical"], "idempotency_key": "create-riverside-workshop-20261108a" }
   ```
   Returns `{ "id": "prj_7k2m9q", "status": "draft", "reviewUrl": "https://portravo.com/projects/prj_7k2m9q" }`.
4. The file is 12 KB and on disk, so `attach_plan_pdf`:
   ```json
   { "project_id": "prj_7k2m9q", "plan_inline": { "data_base64": "JVBERi0xLjcK...", "mime_type": "application/pdf", "file_name": "workshop.pdf" }, "idempotency_key": "attach-prj_7k2m9q-1" }
   ```
5. `preflight_takeoff` with `{ "project_id": "prj_7k2m9q" }` returns `creditsRequired: 2` and `existingCreditsAvailable: 5`.
6. Ask: "Running the plumbing and electrical takeoff uses 2 existing credits from your Portravo balance (you have 5). Nothing is purchased, and a failed provider run refunds the reservation. Run it now?" User: "Yes."
7. `run_takeoff`:
   ```json
   { "project_id": "prj_7k2m9q", "confirm_credit_use": true, "confirmed_trades": ["plumbing", "electrical"], "max_credits": 2, "idempotency_key": "takeoff-prj_7k2m9q-1" }
   ```
   Returns running progress.
8. `get_takeoff_status` shows the run in progress, then done on a later check.
9. `get_takeoff` shows `project.status: "review"` with lines. Present with the template, ending with the `reviewUrl` and the reminder that the quantities need estimator review.

More examples, including a plan too large to attach here and a timeout after approval, are in `references/examples.md`.
