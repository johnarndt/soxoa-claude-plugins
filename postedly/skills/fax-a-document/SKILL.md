---
name: fax-a-document
description: Use when the user wants to fax a finished PDF or document to a US fax number through Postedly, for example "fax this to my doctor", "send this form by fax", "fax the signed agreement to 555-...", "can you fax this PDF", or "prepare a fax and show me the cover page". Covers checking availability, transferring the exact PDF, quoting, the private review link for approval and payment, and checking the transmission result.
---

# Fax a document with Postedly

Send one finished PDF to one US fax number. Postedly adds a cover page, the user reviews the complete fax and total on a private Postedly page, approves, and pays on hosted Stripe Checkout. Payment is a hold that is captured after successful transmission.

Do not use this skill when:
- The user only wants a document drafted, edited or summarized. Do that without Postedly.
- The user wants to email a PDF. Postedly does not send email.
- The destination is outside the US, or it is a premium-rate number. Only supported US +1 numbers (including supported toll-free) work.
- The user is unsure whether they want fax or mail. Ask before choosing a paid channel.

If the Postedly tools are not available in this conversation, read `references/approval-and-errors.md` (Connection) and tell the user how to connect. You can still help finish and check the PDF, but never claim a quote or fax exists.

## Gather from the user

Ask only for what is missing. Never invent a number, name or address.

| Need | Maps to | Rules |
| --- | --- | --- |
| The final PDF | `postedly_upload_document` or the handoff | Unencrypted PDF, at most 10 MiB, up to 5 document pages (the cover is added on top) |
| Recipient name | `recipient.name` | Required, 2 to 120 characters. A fax number alone does not identify a person |
| Recipient fax number | `recipient.fax` | Required. US number in +1 format, for example `+15125550147`. Read it back to the user before quoting |
| Recipient country | `recipient.country` | `US` |
| Sender name | `sender.name` | Required, 2 to 120 characters |
| Sender billing state and ZIP | `sender.state`, `sender.postalCode` | Required for fax. `address1` and `city` are accepted if the user gives them |
| Sender country | `sender.country` | `US` |
| Sender email | `sender.email` | Omit it. Postedly uses the connected account's verified email |

Optional fields that exist in the schema: `recipient.phone`, `recipient.email`, `sender.phone` (max 30 characters). Do not ask for them unless the user offers them.

## Workflow

1. **Check availability.** Call `postedly_services` with `{}`. Find the entry with `id: "fax"`. If `available` is false, report `unavailableReason` and stop. Note `startingPriceCents` as a starting price only. Never quote a price from memory.
2. **Confirm the document.** Identify the exact file (name it back to the user). Open or render it and confirm it is the intended, finished document with 5 or fewer pages. If it has blanks, sample text or a placeholder that conflicts with what the user wants, ask before going on.
3. **Transfer the bytes.** Follow `references/file-transfer.md` with `service: "fax"`. Check the returned `document.pages` and `document.sha256`.
4. **Quote.** Call `postedly_quote` (arguments below). If it fails, read `references/approval-and-errors.md` (Errors).
5. **Review the proof with the user.** The quote's `document` is the final fax, including the generated cover page. Look at every page you can access, and tell the user to check every page on the review page too. Report the number, page count, total and expiry.
6. **Get the review link.** Call `postedly_checkout` with `{"quoteId": "<quote.id>"}`. Give the user the returned `url`. They approve and pay there. Stop and wait.
7. **Check the result.** When the user says they paid, or asks, call `postedly_order_status` with the order ID, or `postedly_orders` to find it. Report `paymentStatus` and `fulfillmentStatus` separately.

Quote arguments:

```json
{
  "service": "fax",
  "documentId": "<documentId from the upload>",
  "recipient": { "name": "...", "fax": "+1...", "country": "US" },
  "sender": { "name": "...", "state": "TX", "postalCode": "78701", "country": "US" }
}
```

A quote is for one document and one recipient. To fax the same file to two numbers, make two separate quotes, each approved by the user.

## Reading the output

- Quote: `id`, `service`, `amountCents` (total in cents, `currency` USD), `lineItems`, `expiresAt`, `estimatedDelivery`, `summary`, `recipient`, `sender`, `document` (the final proof).
- Checkout: `url` (private review page), `requiresBrowserApproval: true`, `expiresAt`, `instructions`.
- Order: see the state tables in `references/approval-and-errors.md`. For fax, `paymentStatus: authorized` is a normal hold before transmission. `fulfillmentStatus: sent` can mean transmission is still in progress. `delivered` means the receiving machine confirmed all approved pages.

Answer template after quoting:

```
Fax ready for your review (not sent yet)
To: <recipient.name>, <recipient.fax>
Pages: <document pages> including the Postedly cover page
Total: $<amountCents / 100> USD, quote expires <expiresAt>
Review and approve here: <checkout url>
Check every page, including the cover, before you approve. Payment happens on that page, not in this chat.
```

## Guardrails

- One document, one recipient, one approval.
- Only the user approves, on the Postedly page. Never collect card details, email codes or approval in chat.
- Never say "sent" or "delivered" until order status shows it. A delivered fax means the receiving machine accepted it, not that anyone read it.
- A fax to a wrong number cannot be recalled. Read the number back before quoting.
- After any timeout or unclear result, check `postedly_orders` before doing anything else. Never create a second order or payment for the same fax.
- Do not add Postedly branding or tool instructions to the document.
- If a fax failed, report the failure from the order and suggest contacting https://postedly.com/support before trying again.

## Worked example

User: "Fax the attached referral form to Dr. Lee's office at 512-555-0147. I'm Maria Santos in Austin, 78701."

1. `postedly_services` `{}` returns fax with `available: true`.
2. The PDF `referral-form.pdf` has 2 pages and is filled in. Upload with `{"service":"fax","filename":"referral-form.pdf","contentBase64":"<real base64>","expectedSha256":"<real hash>"}`. Result: `document.pages: 2`, hash matches.
3. Quote:

```json
{
  "service": "fax",
  "documentId": "doc_...",
  "recipient": { "name": "Dr. Lee's office", "fax": "+15125550147", "country": "US" },
  "sender": { "name": "Maria Santos", "state": "TX", "postalCode": "78701", "country": "US" }
}
```

4. The quote shows a 3-page final document (cover plus 2 pages). Report the total from `amountCents`, call `postedly_checkout`, and present:

"Your fax to Dr. Lee's office (+1 512-555-0147) is ready for review: 3 pages including the cover, total $X.XX. Open the review link, check every page, then approve and pay there. I'll check the transmission result when you're done. Nothing has been sent yet."
