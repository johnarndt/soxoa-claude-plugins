---
name: mail-a-letter
description: Use when the user wants a physical letter printed and mailed in the US through Postedly, by regular mail or USPS certified mail, either from a PDF they already have or from a letter you write together first. Triggers include "mail this letter", "send this PDF by mail", "send it certified", "certified mail to my landlord", "write and mail a letter to...", "print and mail this for me", "send a demand letter by certified mail".
---

# Mail a letter or certified letter with Postedly

Print and mail one finished PDF to one US address, as a regular `letter` or as `certified` (USPS Certified Mail with a tracking number). Postedly adds a separate address page. The user reviews the final proof and total on a private Postedly page, approves, and pays on hosted Stripe Checkout.

Do not use this skill when:
- The user only wants a letter drafted or edited. Write it, and do not quote or upload anything unless they ask to mail it.
- The user wants to email a PDF, or send a handwritten card (use the handwritten card skill) or a postcard (use the postcard skill).
- Either address is outside the 50 states and DC. International addresses and US territories are not supported.
- The user wants a physical object made and shipped (3D print beta). See "Make & send an object" in `references/approval-and-errors.md`.
- The user needs a return receipt, a signature or restricted delivery. The certified service is described as certified mail with tracking. Do not promise any extra service the quote does not show.

If the Postedly tools are not available, read `references/approval-and-errors.md` (Connection) and tell the user how to connect. You can still write the letter and export and check the PDF. Never claim a quote or mailing exists.

## Choose the service

| User wants | `service` |
| --- | --- |
| Ordinary mailed letter | `letter` |
| USPS Certified Mail with tracking | `certified` |

If the user says "send it" without saying how, ask. Certified mail costs more; read both prices from `postedly_services`. Do not say whether certified mail satisfies a legal notice requirement; the user must confirm that with the recipient's rules or their adviser.

## Gather from the user

| Need | Maps to | Rules |
| --- | --- | --- |
| The finished letter as PDF | upload | Portrait US Letter (8.5 x 11 in), unencrypted, at most 10 MiB. At most six physical sheets including the added address sheet |
| Recipient name | `recipient.name` | Required, 2 to 120 characters |
| Recipient street | `recipient.address1`, `recipient.address2` | `address1` required. Put apartment or suite in `address2` (120 max each) |
| Recipient city, state, ZIP | `recipient.city`, `recipient.state`, `recipient.postalCode` | Required. Two-letter state |
| Recipient country | `recipient.country` | `US` |
| Sender name and full return address | `sender.name`, `sender.address1`, `sender.address2`, `sender.city`, `sender.state`, `sender.postalCode`, `sender.country` | All required except `address2`. `country` is `US` |
| Sender email | `sender.email` | Omit it. The connected account's verified email is used |

Never infer an address, pick a different recipient, or fill in a unit number the user did not give.

## Workflow

1. **Check availability.** `postedly_services` with `{}`. Find `letter` or `certified`. If `available` is false, report `unavailableReason` and stop. Use `startingPriceCents` only as a starting price.
2. **Get the real letter as a PDF.**
   - The user has a PDF: identify the exact file and keep its bytes unchanged unless they ask for edits.
   - You are writing it: follow `references/writing-and-checking-the-letter.md`. Finish the real letter with confirmed facts, export it to PDF, and render and inspect every page.
   - Never upload a sample, placeholder, outline or instructions to write a letter. A form that asks for a letter is not the letter.
3. **Check the PDF.** Every page must be the right content, portrait US Letter, nothing clipped, no leftover template text. Count pages against the six-sheet limit (the address sheet uses one).
4. **Transfer the bytes.** Follow `references/file-transfer.md` with the chosen `service`. Confirm `document.pages` and `document.sha256`.
5. **Quote.** `postedly_quote` (arguments below). On an address error, follow `references/approval-and-errors.md` (Address problems). On page or size errors, fix the PDF with the user and upload again.
6. **Review the proof.** The quote's `document` is the final print proof including the address page. Check every page you can access. Show the user the recipient as quoted (it may include a postal correction), the total and the expiry, plus any `addressWarnings`.
7. **Get the review link.** `postedly_checkout` with `{"quoteId": "<quote.id>"}`. Give the user the `url`. They review, approve and pay there. Stop and wait.
8. **Track.** Later, `postedly_order_status` or `postedly_orders`. For certified mail, report any tracking evidence the order returns.

Quote arguments:

```json
{
  "service": "certified",
  "documentId": "<documentId>",
  "recipient": { "name": "...", "address1": "...", "address2": "...", "city": "...", "state": "CA", "postalCode": "...", "country": "US" },
  "sender": { "name": "...", "address1": "...", "city": "...", "state": "CA", "postalCode": "...", "country": "US" }
}
```

Leave out `address2` when there is none. Add `options.sendAsEntered` only in the exact case described in the reference.

## Reading the output

- Quote: `id`, `amountCents` (USD cents), `lineItems`, `expiresAt`, `estimatedDelivery` (an estimate, never a guarantee), `summary`, `recipient`, `sender`, `document` (final proof), optional `addressWarnings`.
- Checkout: `url`, `requiresBrowserApproval`, `expiresAt`, `instructions`.
- Order: `paymentStatus`, `fulfillmentStatus`, `timeline`, optional `evidence`. Full tables in `references/approval-and-errors.md`.

Answer template after quoting:

```
<Letter | Certified letter> ready for your review (not mailed yet)
To: <recipient name and address as quoted>
From: <sender name and address>
Proof: <N> pages including the address page
Total: $<amountCents / 100> USD, estimated delivery <estimatedDelivery>, quote expires <expiresAt>
<Address warnings, if any, quoted exactly>
Review and approve here: <checkout url>
Check every page of the proof before you approve. Payment happens on that page, not in this chat.
```

## Guardrails

- One document, one recipient, one approval. Two recipients means two quotes and two approvals.
- Never invent facts, dates, amounts, signatures or approval in a letter. Ask.
- Keep tool instructions and Postedly branding out of the letter.
- Only the user approves and pays, on the Postedly page. No card details or email codes in chat.
- Never say "mailed" or "delivered" until order status shows it. Delivery dates are estimates. Ordinary mail may not have final delivery proof.
- After an uncertain result, check `postedly_orders` first. Never create a duplicate order.

## Worked example

User: "Write a letter to my landlord, Pine Street Properties, 410 Pine St, Suite 200, Sacramento CA 95814, asking for my $1,800 deposit back. I moved out of unit 3B at 22 Oak Ave, Sacramento CA 95816 on Sept 30. Send it certified. I'm Jordan Reyes, my new address is 1500 J St Apt 12, Sacramento CA 95811."

1. Ask for anything missing (for example, the forwarding address is given, so ask only whether there is a lease date or deadline to cite). Draft the letter, show the text, get the user's OK.
2. Export `deposit-request.pdf`, render both pages to images, inspect them, and fix any layout problems.
3. `postedly_services` shows `certified` available. Upload with `service: "certified"`.
4. Quote:

```json
{
  "service": "certified",
  "documentId": "doc_...",
  "recipient": { "name": "Pine Street Properties", "address1": "410 Pine St", "address2": "Suite 200", "city": "Sacramento", "state": "CA", "postalCode": "95814", "country": "US" },
  "sender": { "name": "Jordan Reyes", "address1": "1500 J St", "address2": "Apt 12", "city": "Sacramento", "state": "CA", "postalCode": "95811", "country": "US" }
}
```

5. Present the proof page count, total from `amountCents`, and estimate, then the `postedly_checkout` link: "Nothing is mailed until you approve and pay on that page. I'll check tracking afterward."
