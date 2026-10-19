---
name: send-a-handwritten-card
description: Use when the user wants a real handwritten card mailed to a US address through Postedly, such as a thank-you note, birthday card, sympathy card, congratulations or client note written in real pen. Triggers include "send a handwritten thank-you card", "mail a birthday card to my aunt", "handwritten note to a client", "send a sympathy card", "which handwriting styles are there".
---

# Send a handwritten card with Postedly

Mail one handwritten card (written in real pen by Postedly's handwriting partner) to one US address. The user chooses a card and a handwriting style, and you supply the exact message and optional closing. No PDF or upload is involved. The user reviews the card, style, exact text, both addresses and total on a private Postedly page, approves, and pays on hosted Stripe Checkout.

Do not use this skill when:
- The user wants their own artwork printed. That is a postcard or letter.
- The address is outside the US.
- The user wants signature codes, QR codes, mail-merge fields or images inside the message. Only plain text is supported.
- The user wants several cards. Each card is one quote, one recipient, one approval.

If the Postedly tools are not available, read `references/approval-and-errors.md` (Connection) and tell the user how to connect. You can still help write the message and count characters. Never claim a quote or card exists.

## Gather from the user

| Need | Maps to | Rules |
| --- | --- | --- |
| Card | `options.productId` | Exact `id` string from `postedly_products` (digits, for example `"60539"`). Must be `available: true` |
| Handwriting style | `options.fontLabel` | Exact `label` from that card's `options.handwritingStyles` (for example `"Casual David"`). The style `id` is not accepted here |
| Message | `options.message` | Required, plain text, not blank, at most the card's `options.maxMessageLength` (never above 1000) |
| Closing | `options.wishes` | Optional, default `""`, at most `options.maxWishesLength` (never above 200) |
| Quantity | `options.quantity` | Always `1` |
| Recipient | `recipient.name`, `address1`, `address2`, `city`, `state`, `postalCode`, `country` | All required except `address2`. `country` is `US` |
| Sender | `sender.name`, `address1`, `address2`, `city`, `state`, `postalCode`, `country` | All required except `address2`. `country` is `US` |
| Sender email | `sender.email` | Omit it. The connected account's verified email is used |

Length rule: `message.length + wishes.length` (raw characters, spaces and line breaks count, nothing is trimmed or added) must be at most the card's `options.combinedCharacterLimit`. Count before quoting. Details and examples: `references/cards-and-styles.md`.

## Workflow

1. **Check availability.** `postedly_services` with `{}`. Find `id: "handwritten"`. If `available` is false, report `unavailableReason` and stop.
2. **List cards.** `postedly_products` with `{"service": "handwritten"}`. Show the available cards (name, description, image link). Visible does not mean orderable: use only cards with `available: true`.
3. **Choose a style.** Show style labels from the chosen card's `options.handwritingStyles`, with their sample `imageUrl` links. Let the user pick. If they do not care, suggest two or three and let them choose; do not pick silently.
4. **Write the message with the user.** Draft it, show the exact text and closing, count characters against the card's limits, and get an explicit OK. Use only facts the user gave you.
5. **Quote.** `postedly_quote` (arguments below). On errors, see `references/approval-and-errors.md`.
6. **Review.** Read back `quote.handwritten`: `cardName`, `fontLabel`, `message`, `wishes`, `sender`, `recipient`, plus `cardImageUrl` and `fontImageUrl`. These images show the card design and a style sample, not the finished message. The review page can show a rendered preview of the actual message.
7. **Review link.** `postedly_checkout` with `{"quoteId": "<quote.id>"}`. Give the user the `url`. Stop and wait.
8. **Track** later with `postedly_order_status` or `postedly_orders`.

Quote arguments:

```json
{
  "service": "handwritten",
  "recipient": { "name": "...", "address1": "...", "city": "...", "state": "..", "postalCode": "...", "country": "US" },
  "sender": { "name": "...", "address1": "...", "city": "...", "state": "..", "postalCode": "...", "country": "US" },
  "options": { "productId": "60539", "fontLabel": "Casual David", "message": "...", "wishes": "...", "quantity": 1 }
}
```

No `documentId`. Do not add other keys inside `options` for handwritten cards; the schema rejects them.

## Reading the output

- Product: `id`, `name`, `description`, `imageUrl`, `available`, `options.handwritingStyles[] {id, label, imageUrl}`, `options.maxMessageLength`, `options.maxWishesLength`, `options.combinedCharacterLimit`.
- Quote: `id`, `amountCents` (USD cents, includes US postage), `lineItems`, `expiresAt`, `estimatedDelivery`, and the immutable `handwritten` snapshot.
- Checkout: `url`, `requiresBrowserApproval`, `expiresAt`.

Answer template:

```
Handwritten card ready for your review (not mailed yet)
Card: <cardName>, handwriting: <fontLabel>
Message: "<message>"
Closing: "<wishes>"
To: <recipient>   From: <sender>
Total: $<amountCents / 100> USD, quote expires <expiresAt>
Review and approve here: <checkout url>
On that page, check the rendered handwriting preview, both addresses and the total. Payment happens there, not in this chat.
```

## Guardrails

- One card, one recipient, one approval.
- The text is final once quoted. Any change needs a new quote.
- The finished card may vary from the preview; do not promise an exact look.
- Never invent personal details, names or memories for the message. Ask.
- Only the user approves and pays, on the Postedly page.
- Never say "mailed" or "delivered" before the order status says so.
- After an uncertain result, check `postedly_orders` before anything else. Never duplicate an order.

## Worked example

User: "Send a handwritten thank-you to my client Dana Kim, 200 Market St, Philadelphia PA 19106, for the referral. Sign it 'Gratefully, Chris'. I'm Chris Park, 45 Main St, Lansdale PA 19446."

1. `postedly_services`: handwritten available. `postedly_products` `{"service":"handwritten"}`: offer the available cards, the user picks "Sophisticated Thank You" (`id` `"333220"`, limits 500 / 200 / 500 in this example) and the style "Casual David".
2. Draft: "Dana, thank you so much for the referral. Your trust means a lot, and I'll take great care of them." (Count: well under the limit.) Closing: "Gratefully, Chris". User approves.
3. Quote:

```json
{
  "service": "handwritten",
  "recipient": { "name": "Dana Kim", "address1": "200 Market St", "city": "Philadelphia", "state": "PA", "postalCode": "19106", "country": "US" },
  "sender": { "name": "Chris Park", "address1": "45 Main St", "city": "Lansdale", "state": "PA", "postalCode": "19446", "country": "US" },
  "options": { "productId": "333220", "fontLabel": "Casual David", "message": "Dana, thank you so much for the referral. Your trust means a lot, and I'll take great care of them.", "wishes": "Gratefully, Chris", "quantity": 1 }
}
```

4. Present the snapshot and total with the template above, then the review link.
