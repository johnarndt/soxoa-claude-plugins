# More start-plan-takeoff examples

All ids below are illustrative. Use only values returned by the tools.

## 1. Set up only, no credit used

User: "Create a Sacramento workshop estimate and attach this plan PDF. Do not run extraction yet."

1. `list_pricing_markets` → choose `sacramento-ca`.
2. `create_project`:
   ```json
   { "name": "Sacramento workshop", "metro_code": "sacramento-ca", "idempotency_key": "create-sacramento-workshop-20261018a" }
   ```
3. `attach_plan_pdf` with the host file reference or `plan_inline`, key `attach-<id>-1`.
4. Stop. Do not ask about credits unless the user asks to run it.

Reply:

```
Project created and plan attached: Sacramento workshop
- Market: Sacramento, CA
- Plan: workshop.pdf (stored privately in your Portravo account)
- Status: draft, no credit used
When you want the takeoff, tell me and I will confirm the credit first, or start it on the project page: <reviewUrl>
```

## 2. Plan too large to attach from this conversation

User: "Here is the 6 MB plan set for the Oak Lane duplex, Phoenix. Run the takeoff."

The host gives no file reference and the file is far over 32 KiB, so it cannot go through `plan_inline`.

1. `list_pricing_markets` → if a Phoenix metro is listed, use its `code`.
2. `create_project` with the name, metro, and a new key.
3. Do not call `attach_plan_pdf`. Reply:

```
I created the Oak Lane duplex project (draft, no credit used), but I can't send a 6 MB PDF through this connection. Upload it on the project page: <reviewUrl>
From there you can start the takeoff, or come back and ask me to run it. I'll check the plan is attached and confirm the credit with you first.
```

When the user returns: call `get_takeoff`. If `files` has the plan and `project.status` is `draft`, ask for credit confirmation, then call `run_takeoff`. If `project.status` is already `extracting` or `review`, the takeoff was started in Portravo; do not call `run_takeoff`. Summarize with `review-takeoff` instead.

## 3. User says yes to the credit, then the call times out

1. First call: `run_takeoff` with `{ "project_id": "prj_7k2m9q", "confirm_credit_use": true, "idempotency_key": "takeoff-prj_7k2m9q-1" }` → timeout.
2. Do not make a new key. Call `get_takeoff` to see `project.status`.
   - `extracting`: tell the user the takeoff is still running; check again when they ask.
   - `review`: the run finished; summarize it.
   - `draft` or no result: retry `run_takeoff` with exactly the same arguments and the same key. Portravo will not charge twice for the same key.

## 4. Market not listed

User: "Start an estimate for a garage in Boise, Idaho."

`list_pricing_markets` has no Boise or Idaho metro. Reply: "Portravo does not list a Boise market. I can create the project without a pricing market, or you can pick one of these: <names>. Which do you want?" Do not pick the nearest city on your own.

## 5. Credit confirmation wording

Good: "Running the takeoff uses 1 estimate credit from your existing Portravo balance. If the run fails, the credit is refunded. Run it now?"

Not acceptable: running it because the user earlier said "do a takeoff", or asking "Shall I proceed?" without naming the credit.
