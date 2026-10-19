# Postedly: connection, approval, errors and order states

Shared reference for every Postedly sending skill. Load it when a tool call fails, when an address check fails, or before explaining the review page or an order status.

## Connection

- MCP server: `https://postedly.com/mcp/send` (the path `/mcp` alone is not the server).
- Auth: OAuth 2.0 with dynamic client registration. Scopes: `orders:read` (read the connected account's orders), `quotes:write` (upload documents, prepare upload handoffs, create quotes), `checkout:write` (get review links).
- The client runs the sign-in. The user verifies their email and approves scopes on Postedly's own consent page in a browser. Never ask for a password, token, authorization code or email verification code in chat.
- Not connected? The tools `postedly_services`, `postedly_quote` and so on will be missing. Tell the user:
  - Claude (web or desktop): Customize > Connectors, add or enable Postedly, then sign in.
  - Claude Code: `claude mcp add --transport http postedly https://postedly.com/mcp/send`, then run `/mcp` and authenticate.
  - Or send manually on the website at https://postedly.com/send .
- Without the connection you can still draft and check content, gather addresses and explain requirements. Never say a quote, price, proof or order exists when no tool ran.

## Sender email

- For a connected account, omit `sender.email` in `postedly_quote`. Postedly fills it from the account's verified email.
- Ask only for the missing sender name and the postal or billing fields the service needs.
- Never guess an email. Never ask for a verification code in chat. An explicitly supplied email is never overwritten, and an empty or invalid value is an error, so leave the field out rather than sending "".
- The person paying verifies their own receipt email on the review page. Do not change `sender.email`, reconnect or requote just to route a receipt.

## Approval and payment

1. `postedly_quote` returns a time-limited quote. Quoting never approves, charges or sends.
2. `postedly_checkout` with `{"quoteId": "<quote.id>"}` returns `{url, requiresBrowserApproval: true, expiresAt, instructions}`. It creates no order, approval or payment. Do not pass `acceptedTerms` or `confirmedDocument`; they are deprecated and ignored.
3. Give the user the `url`. On that private Postedly page they review the exact proof or card, recipient, total and terms, verify their receipt email if needed, approve, and then pay on hosted Stripe Checkout.
4. You cannot approve or pay for the user. Payment details never go in chat. OAuth consent and tool approval in Claude are not order approval.
5. Keep the review link private: do not post it anywhere public.

## Address problems (letter, certified, postcard)

- Relay the exact error, and whether it concerns the `sender` or `recipient`.
- `address_unit_required`: the verifier needs an apartment, suite or unit. Ask the user for the real one. Never invent a unit, swap in a nearby address, or conclude a whole city is unsupported.
- Only when the error has `details.canSendAsEntered: true` for a role:
  1. Show the unchanged address and the verifier's warning.
  2. Ask: correct the address, or mail to it exactly as entered and accept the risk of failed delivery?
  3. Only after an explicit "as entered" answer, request a new `postedly_quote` with the same address and `options.sendAsEntered: {"recipient": true}` or `{"sender": true}` (both true only if the user confirmed both).
  4. Show every entry of the returned `addressWarnings` (`role`, `code`, `message`, `address`) with the proof and total. The user accepts the delivery risk on the review page, not in chat.
- `sendAsEntered` is for postal mail only (letter, certified, postcard) and only after an eligible failed check. It never fixes malformed data, missing fields, unsupported destinations or provider outages.

## Errors

Tool failures come back with `isError: true` and `structuredContent.error.{code, message, details?}`.

| Situation | What to do |
| --- | --- |
| `SESSION_EXPIRED` or expired access | Let the client refresh once and retry the read once. If that fails, ask the user to reconnect through normal sign-in. Never start a guest session instead. |
| Missing tool or insufficient scope | Report the exact missing tool or scope and have the user fix the connection. |
| `SERVICE_UNAVAILABLE` or `available: false` | Report it. Do not quote or check out that channel. |
| A failed `postedly_services` call | Availability is unknown, not false. Retry once; if it fails again, say availability is unconfirmed. |
| `INVALID_INPUT` or a layout or page error | Relay the message and fix the input or file with the user. |
| `INTERNAL_ERROR`, timeout or any uncertain result after checkout | Do not repeat a send or payment. Call `postedly_orders` or `postedly_order_status` first and report what exists. |

A tool failure is never permission to silently change the document, card, text, address or service.

## Make & send an object (beta)

`postedly_services` also lists `object`: simple plastic 3D printed objects, `beta: true`, `priceType: "custom"`, `quoteMode: "manual"`, `available: false`, with a `quoteUrl` such as `/send?service=object`. If the user asks for this, give them the `quoteUrl` resolved against `https://postedly.com` (for example `https://postedly.com/send?service=object`). The form prepares an email the user sends from their own mail app with a ready STL or 3MF model, or a request for paid design help. Never upload model files with the document tools, and never call `postedly_quote` or `postedly_checkout` for `object`. Postedly replies with a custom quote that the user approves separately.

## Order states

Order fields: `id`, `service`, `amountCents`, `refundedCents`, `currency`, timestamps, `receiptEmail`, `paymentStatus`, `fulfillmentStatus`, `timeline`, `canCancel`, optional `checkoutUrl` (only while checkout is pending, may be null) and optional `evidence` (varies by provider).

| `paymentStatus` | Meaning |
| --- | --- |
| `checkout_pending` | The user has not finished checkout. |
| `authorized` | A hold. Fax uses this before confirmed transmission, then captures. |
| `paid` | Payment captured. |
| `failed`, `cancelled` | No successful payment. |
| `refund_pending` | A refund is started, not finished. |
| `refunded` | Refunded. |

| `fulfillmentStatus` | Meaning |
| --- | --- |
| `awaiting_payment` | Nothing is sent yet. |
| `queued`, `submitting`, `submitted`, `processing` | In progress with the provider. |
| `submission_unknown` | Needs reconciliation by Postedly. Never send again. |
| `sent` | Mail handed off or produced. For fax, transmission may still be in progress. |
| `delivered` | Fax: all approved pages confirmed by the receiving machine (not that a person read them). Mail: a provider-reported milestone, not a signature. |
| `failed`, `cancelled` | Not completed. Contact support before preparing another attempt. |

Only say "sent" or "delivered" when these fields say so. A checkout redirect, a payment receipt or a quote is not proof of sending.
