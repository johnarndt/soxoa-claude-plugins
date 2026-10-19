---
name: track-postedly-orders
description: Use when the user asks about a Postedly order they already placed or a send they started, for example "did my fax go through", "was my letter mailed", "where is my certified mail", "check my Postedly orders", "what's the tracking number", "I paid but nothing happened", "the checkout timed out, did it work", or "cancel my order". Read-only status checks for fax, letter, certified mail, postcard and handwritten card orders.
---

# Track Postedly orders

Read the payment and fulfillment status of orders that belong to the connected Postedly account, and explain what they mean. This skill never creates, pays for, resends or cancels anything.

Do not use this skill to:
- Start a new send. Use the fax, letter, postcard or handwritten card skills.
- Look up orders made from a different Postedly account or browser session. The tools only see orders owned by this connection. Orders the user paid for through a review link are also visible in their order history at https://postedly.com/orders .
- Promise delivery dates or outcomes.

If the Postedly tools are not available, read `references/order-states.md` (Not connected) and tell the user how to connect, or point them to https://postedly.com/track . Do not guess a status.

## Tools

| Tool | Input | Returns |
| --- | --- | --- |
| `postedly_orders` | `{}` | `{orders: [...]}`: up to 50 orders for this account, newest first |
| `postedly_order_status` | `{"orderId": "<id>"}` (required) | One order with its timeline and any provider evidence |

Both are read-only. You may call them as often as needed.

## Workflow

1. If the user gave an order ID, call `postedly_order_status` with it. Otherwise call `postedly_orders` and find the matching order by `service`, recipient snapshot and creation time. If several could match, list them briefly and ask which one.
2. Read `paymentStatus` and `fulfillmentStatus` separately, then `timeline` and `evidence`. Use the tables in `references/order-states.md`.
3. Answer with the template below. Quote dates and evidence exactly as returned.
4. If `paymentStatus` is `checkout_pending` and the order has a `checkoutUrl`, the user has not finished paying. Tell them they can finish there. If `checkoutUrl` is null, say checkout has not been set up yet and suggest checking again shortly.
5. If the user wants to cancel: report `canCancel` (a snapshot, not a guarantee). There is no cancel tool in this connection. Point them to their order page at https://postedly.com/orders or https://postedly.com/support with the order ID. A cancellation is confirmed only when the order shows it.

## After a timeout or "did it work?"

This is the most important case. Before anything else, call `postedly_orders`.

- If an order exists for that send, report its state. Do not start a new quote or checkout for the same item.
- If no order exists and the user only had a quote or review link, nothing was bought. The existing review link may still work until its `expiresAt`; otherwise a new quote is needed, and only if the user wants it.
- `fulfillmentStatus: submission_unknown` means Postedly is reconciling with the provider. Never send again. Suggest contacting support with the order ID if it does not resolve.

## Answer template

```
Order <id> (<service>)
Payment: <paymentStatus in plain words>
Sending: <fulfillmentStatus in plain words>
Latest update: <last timeline entry and time>
Evidence: <tracking number, transmission report or provider milestone if present, else "none reported yet">
Next: <what happens next, or what the user can do>
```

Use plain words, for example "Payment is on hold until the fax goes through" for a fax with `authorized`.

## Guardrails

- Never say "sent" or "delivered" unless `fulfillmentStatus` says so. A paid order is not a sent order.
- A delivered fax means the receiving machine accepted the pages, not that a person read them.
- A mail delivery milestone is the provider's report, not a signature, unless the evidence explicitly includes one.
- Do not share private links, document previews or order details anywhere public.
- Never create a duplicate order to "fix" a slow or unclear status.

## Worked example

User: "I approved the certified letter to my landlord yesterday. Was it mailed?"

1. `postedly_orders` `{}` returns one `certified` order to "Pine Street Properties" created yesterday, `id` "ord_8f2...".
2. `postedly_order_status` `{"orderId": "ord_8f2..."}` returns `paymentStatus: "paid"`, `fulfillmentStatus: "processing"`, a timeline with "submitted" and "printing" entries, and no tracking evidence yet.
3. Answer:

"Order ord_8f2... (certified mail to Pine Street Properties)
Payment: paid.
Sending: in production with the mail provider. It is not marked as mailed yet.
Latest update: printing, <time from timeline>.
Evidence: no tracking number reported yet.
Next: the order will show sent and any tracking number once the provider reports it. I can check again later."
