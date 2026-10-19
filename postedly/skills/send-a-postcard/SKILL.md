---
name: send-a-postcard
description: Use when the user wants a printed postcard mailed to a US address through Postedly, either from finished front-and-back artwork or from a postcard you help design first. Triggers include "mail a postcard", "send this postcard design", "print and mail a postcard to my parents", "make a postcard for my customers and mail one", "postcard to this address".
---

# Send a postcard with Postedly

Print and mail one two-sided postcard to one US address. The input is a two-page landscape PDF (front, then back) that matches the live postcard template. Postedly places the address on the back. The user reviews both final sides and the total on a private Postedly page, approves, and pays on hosted Stripe Checkout.

Do not use this skill when:
- The user wants a handwritten card in real pen. Use the handwritten card skill.
- The user has only a message or a single image. That is not a postcard file yet. You can build the two-page PDF with them first (see `references/postcard-artwork.md`).
- The address is outside the 50 states and DC.
- The user wants many postcards to a list. Each postcard is one quote, one recipient and one approval.

If the Postedly tools are not available, read `references/approval-and-errors.md` (Connection) and tell the user how to connect. You can still help make the artwork. Never claim a quote or mailing exists.

## Gather from the user

| Need | Maps to | Rules |
| --- | --- | --- |
| Two-page postcard PDF | upload | Page 1 front, page 2 back. Landscape. Exact size and bleed from the live catalog. Unencrypted, at most 10 MiB |
| Recipient name and full US address | `recipient.name`, `address1`, `address2`, `city`, `state`, `postalCode`, `country` | Name 2 to 120 characters. `address2` only for a real unit. `country` is `US` |
| Sender name and full return address | `sender.name`, `address1`, `address2`, `city`, `state`, `postalCode`, `country` | Same rules |
| Sender email | `sender.email` | Omit it. The connected account's verified email is used |

The message belongs in the artwork (on the back, inside the safe area). Do not put it in `options.message`.

## Workflow

1. **Check availability and the template.** `postedly_services` with `{}`. Find `id: "postcard"`. If `available` is false, report `unavailableReason` and stop. Read its `documentRequirements`: `pageCount`, `orientation`, `bleedInches`, `finishedSizeInches`, `artworkSizeInches`, `templateUrl`. Always use these live values; the size can change.
2. **Get or make the artwork.** If the user has a PDF, check it against the requirements. If you are making it, follow `references/postcard-artwork.md`.
3. **Render and inspect both pages.** Right size, landscape, front then back, text inside the safe area, the back's address and barcode area left clear (see the template), no clipping or placeholder text.
4. **Transfer the bytes.** `references/file-transfer.md` with `service: "postcard"`. Confirm `document.pages` is 2 and the hash matches.
5. **Quote.** `postedly_quote`:

```json
{
  "service": "postcard",
  "documentId": "<documentId>",
  "recipient": { "name": "...", "address1": "...", "city": "...", "state": "..", "postalCode": "...", "country": "US" },
  "sender": { "name": "...", "address1": "...", "city": "...", "state": "..", "postalCode": "...", "country": "US" }
}
```

   Size or page errors: fix the artwork and upload again. Address errors: `references/approval-and-errors.md` (Address problems).
6. **Review the proof.** The quote's `document` is the two-page final proof with the postal address placed on the back. Check both pages for overlaps between your design and the address block.
7. **Review link.** `postedly_checkout` with `{"quoteId": "<quote.id>"}`. Give the user the `url`. Stop and wait.
8. **Track** later with `postedly_order_status` or `postedly_orders`.

## Reading the output

- Services entry: `available`, `unavailableReason`, `startingPriceCents`, `documentRequirements`.
- Quote: `id`, `amountCents`, `lineItems`, `expiresAt`, `estimatedDelivery`, `recipient` (as verified), `document` (final proof), optional `addressWarnings`.
- Checkout: `url`, `requiresBrowserApproval`, `expiresAt`.

Answer template:

```
Postcard ready for your review (not mailed yet)
To: <recipient as quoted>
Proof: front and back, with the address placed on the back
Total: $<amountCents / 100> USD, estimated delivery <estimatedDelivery>, quote expires <expiresAt>
Review and approve here: <checkout url>
Check both sides before you approve. Payment happens on that page, not in this chat.
```

## Guardrails

- One postcard, one recipient, one approval.
- Use the live `documentRequirements`; never assume a size from memory.
- Do not use someone else's photos, logos or artwork unless the user says they have the right to use them.
- No Postedly branding or tool instructions in the artwork.
- Only the user approves and pays, on the Postedly page.
- Never say "mailed" or "delivered" before the order status says so. Delivery dates are estimates.
- After an uncertain result, check `postedly_orders` before anything else. Never duplicate an order.

## Worked example

User: "Make a postcard that says 'Happy 40th anniversary, Mom and Dad! Love, Sam' with this photo, and mail it to them at 88 Lake Rd, Madison WI 53703. I'm Sam Ortiz, 9 Elm St, Denver CO 80203."

1. `postedly_services`: postcard available; requirements say 2 pages, landscape, 6 x 4 finished, 6.25 x 4.25 artwork, 0.125 bleed (example values; use what the call returns).
2. Build `anniversary-postcard.pdf`: page 1 the photo full-bleed at 6.25 x 4.25 in, page 2 the message on the left half, the address area on the right left blank per the template. Render both pages and check them. Show the user and get an OK.
3. Upload with `service: "postcard"`, quote with the recipient "Mom and Dad Ortiz" (ask the user for the exact name line they want) and the sender address.
4. Present the total and the review link, and remind the user to check both sides.
