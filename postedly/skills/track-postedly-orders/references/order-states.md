# Postedly order fields and states

## Not connected

If `postedly_orders` and `postedly_order_status` are missing, the Postedly server is not connected:

- Claude (web or desktop): Customize > Connectors, add or enable Postedly, then sign in on Postedly's page.
- Claude Code: `claude mcp add --transport http postedly https://postedly.com/mcp/send`, then `/mcp` to authenticate.
- Without a connection the user can check orders at https://postedly.com/orders or https://postedly.com/track .

Never ask for a password, token or email code in chat. If the client reports `SESSION_EXPIRED`, let it refresh once and retry the read once; if that fails, the user reconnects through normal sign-in.

## Order fields

| Field | Meaning |
| --- | --- |
| `id` | Order ID. Use it with `postedly_order_status` and when contacting support |
| `service` | `fax`, `letter`, `certified`, `postcard` or `handwritten` |
| `amountCents`, `currency` | Amount charged or authorized |
| `refundedCents` | Amount refunded so far |
| timestamps | When the order was created and updated |
| contact and options snapshots | Recipient, sender and options as approved |
| `receiptEmail` | Where the receipt goes (the verified payer email for reviewed orders) |
| `paymentStatus` | See below |
| `fulfillmentStatus` | See below |
| `timeline` | Ordered list of recorded events |
| `canCancel` | Whether a cancellation could be requested right now. A snapshot, not a guarantee |
| `checkoutUrl` | Only while checkout is pending; can be null |
| `evidence` | Optional, varies by provider: fax transmission details, mail tracking or milestones |

## `paymentStatus`

| Value | Plain words |
| --- | --- |
| `checkout_pending` | Waiting for the user to finish checkout |
| `authorized` | Payment is on hold (fax holds until transmission succeeds, then captures) |
| `paid` | Payment captured |
| `failed` | Payment did not go through |
| `cancelled` | Payment cancelled; no charge, or the hold was released |
| `refund_pending` | A refund has started but is not finished |
| `refunded` | Refunded |

## `fulfillmentStatus`

| Value | Plain words |
| --- | --- |
| `awaiting_payment` | Nothing is sent until payment completes |
| `queued` | Waiting to go to the provider |
| `submitting` | Being handed to the provider |
| `submission_unknown` | Postedly is confirming with the provider whether it was accepted. Do not send again |
| `submitted` | The provider accepted it |
| `processing` | Being printed, written or transmitted |
| `sent` | Mail: produced and handed off. Fax: transmission started and may still be in progress |
| `delivered` | Fax: all approved pages confirmed by the receiving machine. Mail: the provider reported a delivery milestone |
| `failed` | Not completed. Check the timeline and contact support before trying again |
| `cancelled` | Cancelled |

## Service notes

- **Fax:** usually transmits within minutes of approval, then reports. `authorized` plus `sent` is normal while transmitting. A delivered fax is not proof a person read it. A fax to a wrong but working number cannot be recalled.
- **Letter and postcard:** printing and postal transit take several business days. Ordinary mail may not have a final delivery confirmation.
- **Certified mail:** report any tracking number in `evidence`. Do not claim a return receipt or signature unless the evidence shows one.
- **Handwritten card:** production then first-class mailing. Delivery dates are estimates.

## Cancellations and refunds

Postedly cancels before irreversible production or transmission when the provider confirms, and refunds any captured payment. A cancellation request is not a guarantee. Policy: https://postedly.com/refunds . Support: https://postedly.com/support (include the order ID; keep document contents and payment details out of the message).
