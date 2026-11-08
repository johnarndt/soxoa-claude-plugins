# More start-plan-takeoff examples

All ids, trades, and credit numbers below are illustrative. Use only values returned by the tools.

## 1. Set up only, no credit used

User: "Create a Sacramento workshop framing estimate and attach this plan PDF. Do not run extraction yet."

1. `preflight_takeoff` with `{ "trades": ["framing"] }` → framing is available.
2. `list_pricing_markets` → choose `sacramento-ca`.
3. `create_project`:
   ```json
   { "name": "Sacramento workshop", "metro_code": "sacramento-ca", "trades": ["framing"], "idempotency_key": "create-sacramento-workshop-20261108a" }
   ```
4. `attach_plan_pdf` with the host file reference or `plan_inline`, key `attach-<id>-1`.
5. Stop. Do not ask for credit approval unless the user asks to run it.

Reply:

```
Project created and plan attached: Sacramento workshop
- Trades: framing
- Market: Sacramento, CA
- Plan: workshop.pdf (stored privately in your Portravo account)
- Status: draft, no credit used
When you want the takeoff, tell me. I'll check the exact credit requirement and ask you first. You can also start it on the project page: <reviewUrl>
```

## 2. Preflight only

User: "How many credits would a roofing and drywall takeoff need? Don't set anything up."

1. `preflight_takeoff` with `{ "trades": ["roofing", "drywall"] }`.
2. Report what it returns: availability of each trade (automatic or team-assisted), `creditsRequired`, `existingCreditsAvailable` (or that it is unknown because `accountLinked` is false), and the upload limits.
3. Stop. Do not create a project or call `run_takeoff`.

Reply:

```
Portravo preflight for roofing and drywall:
- Availability: <as reported per trade>
- Credits required: <creditsRequired> existing credit(s)
- Your balance: <existingCreditsAvailable, or "not shown until you connect your account">
Nothing was reserved, started, or purchased. When you're ready, I can create the project, and I'll confirm the credits with you before any run.
```

## 3. Plan too large to attach from this conversation

User: "Here is the 6 MB plan set for the Oak Lane duplex, Phoenix. Run the concrete takeoff."

The host gives no file reference and the file is far over 32 KiB, so it cannot go through `plan_inline`.

1. `preflight_takeoff` with `{ "trades": ["concrete"] }` → available.
2. `list_pricing_markets` → if a Phoenix metro is listed, use its `code`.
3. `create_project` with the name, `trades: ["concrete"]`, metro, and a new key.
4. Do not call `attach_plan_pdf`. Reply:

```
I created the Oak Lane duplex project (draft, no credit used), but I can't send a 6 MB PDF through this connection. Upload it on the project page: <reviewUrl>
From there you can start the takeoff, or come back and ask me to run it. I'll check the plan is attached and confirm the exact credits with you first.
```

When the user returns: call `get_takeoff` and `get_takeoff_status`.

- If a run is queued, in progress, or done, the takeoff was started in Portravo. Do not call `run_takeoff`. Follow it with `get_takeoff_status`, then summarize with `review-takeoff` once it is done.
- If `files` has the plan, `project.status` is `draft`, and no run exists, call `preflight_takeoff` with the `project_id`, ask for approval of that quote, then call `run_takeoff` with the approved `confirmed_trades` and `max_credits`.

## 4. User approves, then the call times out

The user approved "plumbing, 1 existing credit".

1. First call: `run_takeoff` with
   ```json
   { "project_id": "prj_7k2m9q", "confirm_credit_use": true, "confirmed_trades": ["plumbing"], "max_credits": 1, "idempotency_key": "takeoff-prj_7k2m9q-1" }
   ```
   → timeout.
2. Do not make a new key and do not call `run_takeoff` yet. Call `get_takeoff_status`.
   - Queued or in progress: tell the user the takeoff is running and keep following it with `get_takeoff_status`.
   - Done: call `get_takeoff`, confirm `project.status` is `review`, then report.
   - Failed: say so. The reservation is refunded for failed provider runs. Another run needs a fresh quote, a fresh yes, and a new key.
   - No run started: call `preflight_takeoff` with `{ "project_id": "prj_7k2m9q" }`.
     - Still `plumbing` and `creditsRequired: 1`: retry `run_takeoff` with exactly the same arguments and the same key. Portravo does not charge twice for the same key.
     - Anything changed (for example `creditsRequired: 2`): the old approval no longer applies. Show the new quote, ask again, and use a new key such as `takeoff-prj_7k2m9q-2` with the new `max_credits`.

## 5. Connection expired before the run

The user approved a quote, then `run_takeoff` returns `invalid_token`.

1. Ask the user to reconnect Portravo and sign in again.
2. After they reconnect, call `get_takeoff_status`, then `preflight_takeoff` with the `project_id`, as in example 4.
3. If the quote is unchanged and the approval is in this conversation, retry with the same key and arguments. If this is a new conversation, or the quote changed, ask again and use a new key.

## 6. Market not listed

User: "Start an estimate for a garage in Boise, Idaho."

`list_pricing_markets` has no Boise or Idaho metro. Reply: "Portravo does not list a Boise market. I can create the project without a pricing market, or you can pick one of these: <names>. Which do you want?" Do not pick the nearest city on your own.

## 7. Approval wording

Good: "Running the takeoff for plumbing and electrical uses 2 existing credits from your Portravo balance (you have 5). Nothing is purchased, and a failed provider run refunds the reservation. Run it now?" The trades and the number come straight from `preflight_takeoff`.

Not acceptable:

- Running it because the user earlier said "do a takeoff".
- Asking "Shall I proceed?" without naming the trades and credits.
- Quoting a credit number from memory, from an earlier project, or from this document instead of from a fresh `preflight_takeoff`.
