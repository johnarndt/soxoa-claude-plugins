![Postedly](assets/icon.png)

# Postedly for Claude

Postedly sends real faxes, letters, certified mail, postcards and handwritten cards in the US. This plugin connects Claude to Postedly's MCP server and adds skills that walk Claude through each kind of send: check what is available, transfer the exact finished PDF (or pick a card, handwriting style and message), get a quote with the final proof, and hand you a private review link. You check the proof, recipient and total on Postedly's page, approve, and pay on Postedly's hosted Stripe Checkout. Each send is priced individually with no subscription; see https://postedly.com for current prices. Nothing is sent until you approve and pay, and Claude can then check the order status for you.

## What it connects to

| Item | Detail |
| --- | --- |
| MCP server | `https://postedly.com/mcp/send` (remote, Streamable HTTP) |
| Auth | OAuth 2.0 with dynamic client registration. Scopes: `orders:read`, `quotes:write`, `checkout:write`. You sign in and consent on Postedly's own page; the plugin contains no keys or credentials |
| Data sent to postedly.com | The bytes of each document you choose to send (PDF), recipient details (name, postal address or fax number), sender details (name, return or billing address; your account's verified email is filled in by Postedly), handwritten card choices and message text, and the IDs needed to read quotes and orders |
| Payment | Only on Postedly's hosted Stripe Checkout page, after you approve on Postedly's review page. Card details and email verification codes never go through Claude or this chat |
| Anything else | Nothing. The plugin itself contacts no other service. Postedly passes what is needed to its fax, print-and-mail and handwriting providers to fulfill an order you approve, as described in its privacy policy |

## Tools

| Tool | What it does | Type |
| --- | --- | --- |
| `postedly_services` | Live availability and starting prices for each service, plus postcard size requirements | Read-only |
| `postedly_products` | Handwritten cards with handwriting styles and character limits | Read-only |
| `postedly_upload_document` | Stores the exact PDF bytes privately (up to 10 MiB) and returns a document ID, page count and SHA-256 | Write (no charge) |
| `postedly_prepare_document` | Creates a private single-use upload link (15 minutes) for files Claude cannot pass directly | Write (no charge) |
| `postedly_document_status` | Checks that upload link: waiting, uploading, complete or expired | Read-only |
| `postedly_quote` | Creates a time-limited quote for one document or card and one recipient, with the final proof and total | Write (no charge, nothing sent) |
| `postedly_checkout` | Returns the private browser review link where you approve and pay | Read-only (no order, no payment) |
| `postedly_order_status` | Payment and sending status, timeline and evidence for one order | Read-only |
| `postedly_orders` | Up to 50 of your orders, newest first | Read-only |

## Skills

| Skill | When it triggers |
| --- | --- |
| `fax-a-document` | "Fax this PDF to 512-555-0147", "send this form by fax" |
| `mail-a-letter` | "Mail this letter", "send it certified", "write and mail a letter to my landlord" (includes writing the letter, exporting a real PDF and checking every page first) |
| `send-a-postcard` | "Mail a postcard to my parents", "print and mail this postcard design" |
| `send-a-handwritten-card` | "Send a handwritten thank-you card", "mail a birthday card in real pen" |
| `track-postedly-orders` | "Did my fax go through?", "was my letter mailed?", "the checkout timed out, did it work?" |

## Setup

- **Claude directory:** install Postedly from the plugin directory, then sign in to Postedly when Claude asks.
- **Claude Code marketplace:**
  ```
  /plugin marketplace add johnarndt/soxoa-claude-plugins
  /plugin install postedly@soxoa-plugins
  ```
  Then run `/mcp` and authenticate Postedly.
- **MCP only (no skills):**
  ```
  claude mcp add --transport http postedly https://postedly.com/mcp/send
  ```
- **Claude web or desktop custom connector:** Customize > Connectors > Add custom connector, URL `https://postedly.com/mcp/send`.

First sign-in verifies your email and asks you to approve the scopes above on postedly.com.

## Example prompts

- "Fax the attached referral form to Dr. Lee's office at 512-555-0147. Show me every page and the total before I pay."
- "Write a letter to my landlord asking for my deposit back and send it certified mail. Let me read it first."
- "Mail this PDF to 410 Pine St, Suite 200, Sacramento CA 95814 by regular mail."
- "Send a handwritten thank-you card to my client Dana Kim. Show me the handwriting styles."
- "Did the fax I sent this morning go through?"

## Limits and boundaries

- US only: fax to supported US +1 numbers; mail to addresses in the 50 states and DC.
- One document or card, one recipient, one approval per order. No bulk or mail-merge sends.
- Letters and certified mail: portrait US Letter PDF, up to six physical sheets including the added address page. Fax: up to five pages plus a cover. Postcards: a two-page landscape PDF matching the live template. All PDFs at most 10 MiB, unencrypted.
- Certified mail is USPS Certified Mail with tracking. A return receipt or signature is not included unless the quote says so. The plugin does not give legal advice about whether a mailing meets a notice requirement.
- Claude cannot approve or pay for you. Quotes and review links never charge or send anything.
- Delivery dates are estimates. A delivered fax means the receiving machine accepted it, not that someone read it.
- "Make & send an object" (3D printed objects) is a manually quoted beta and is not ordered through these tools; Claude will point you to the request form on postedly.com, and you send that request from your own email app.
- Claude does not write or edit documents on Postedly's side. Any letter or postcard Claude writes for you is finished and shown to you before it is uploaded.

## Privacy, terms, support

- Privacy policy: https://postedly.com/privacy
- Terms of service: https://postedly.com/terms
- Delivery and refunds: https://postedly.com/refunds
- Support: https://postedly.com/support or john@soxoa.com
- Developer guide: https://postedly.com/developers

## License

MIT. See [LICENSE](LICENSE). Copyright (c) 2026 Soxoa LLC.
