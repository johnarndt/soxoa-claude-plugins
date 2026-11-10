![Postedly](assets/icon.png)

# Postedly for Claude

Postedly sends real faxes, letters, certified mail, postcards, handwritten cards and paper checks in the US. This plugin connects Claude to Postedly's MCP server and adds skills that walk Claude through each kind of send: check what is available, transfer the exact finished PDF (or pick a card, handwriting style and message), get a quote with the final proof, and hand you a private review link. You check the proof, recipient and total on Postedly's page, approve, and pay on Postedly's hosted Stripe Checkout. Claude can also keep a private address book and saved drafts for you, export a delivery report for an order, and draft a paper check from your own checking account for you to sign. Nothing is sent until you approve and pay, and Claude can then check the order status for you.

**Prices** (USD, before applicable tax, no subscription; the live catalog and your quote are authoritative): fax $2.99 (up to 5 pages plus a cover, charged only after every page transmits), letter $4.99, certified mail $14.99, postcard $4.99, handwritten card $9.99, paper check $6.99 service fee per check (Postedly never charges the check amount).

## What it connects to

| Item | Detail |
| --- | --- |
| MCP server | `https://postedly.com/mcp/send` (remote, Streamable HTTP) |
| Auth | OAuth 2.0 with dynamic client registration. Scopes: `orders:read`, `quotes:write`, `checkout:write`, `contacts:read`, `contacts:write`, `drafts:read`, `drafts:write`. The server answers 401 until you sign in, so Claude Code lists it as needing authentication until you run `/mcp` and sign in. This plugin points at `/mcp/send`, the address on Postedly's connect page and server card. Every Postedly tool needs sign-in, so there is no anonymous address to choose instead. You sign in and consent on Postedly's own page; the plugin contains no keys or credentials |
| Data sent to postedly.com | The bytes of each document you choose to send (PDF), recipient details (name, postal address or fax number), sender details (name, return or billing address; your account's verified email is filled in by Postedly), handwritten card choices and message text, contacts and drafts you ask Claude to save, and for a check the payee name and address, amount, memo and a masked bank reference. Never bank account or routing numbers |
| Payment | Only on Postedly's hosted Stripe Checkout page, after you approve on Postedly's review page. Card details and email verification codes never go through Claude or this chat |
| Claude Code uploads | When Claude can read the file on your machine, the skills ask you to confirm the file, then send only that PDF to a single-use upload address on `https://postedly.com/api/document-handoffs/` (for example with `curl`). Claude refuses any upload address outside postedly.com |
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
| `postedly_orders` | Your orders, newest first, filterable by recipient or order ID, service, status and date; up to 50 per page | Read-only |
| `postedly_delivery_report` | Plain-text report of one order's payment, fulfillment, timeline and provider evidence | Read-only |
| `postedly_contacts` | Your saved recipients and return addresses | Read-only |
| `postedly_save_contact` | Saves or updates one contact, only when you ask (kept one year after the last save) | Write (no charge, nothing sent) |
| `postedly_delete_contact` | Deletes one saved contact after you confirm | Write |
| `postedly_drafts` | Your saved correspondence drafts | Read-only |
| `postedly_save_draft` | Saves preparation details for one send, only when you ask (kept 30 days) | Write (no quote, nothing sent) |
| `postedly_delete_draft` | Deletes one saved draft after you confirm | Write |
| `postedly_bank_accounts` | Your connected checking accounts for paper checks, masked, with readiness and setup link | Read-only |
| `postedly_check_draft` | Drafts one paper check from your own ready account and returns a fee quote and your private review link | Write (no signature, payment or send) |

## Skills

| Skill | When it triggers |
| --- | --- |
| `fax-a-document` | "Fax this PDF to 512-555-0147", "send this form by fax" |
| `mail-a-letter` | "Mail this letter", "send it certified", "write and mail a letter to my landlord" (includes writing the letter, exporting a real PDF and checking every page first) |
| `send-a-postcard` | "Mail a postcard to my parents", "print and mail this postcard design" |
| `send-a-handwritten-card` | "Send a handwritten thank-you card", "mail a birthday card in real pen" |
| `track-postedly-orders` | "Did my fax go through?", "was my letter mailed?", "the checkout timed out, did it work?" |
| `delivery-report` | "Give me proof my certified letter was mailed", "export the fax confirmation" |
| `mail-a-check` | "Mail a $250 check to my landlord", "which accounts can I write checks from?" |
| `saved-contacts` | "Save Dr. Lee's fax number", "use my saved return address", "delete that contact" |
| `correspondence-drafts` | "Save this letter as a draft", "pick up my draft to the landlord" |

## Setup

- **Claude directory:** once the listing is approved, install Postedly from the plugin directory, then sign in to Postedly when Claude asks.
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

### Synthetic no-send test sequence

Uses only the reviewer's existing Postedly sign-in (no new keys or credentials), synthetic content, and stops before approval. Nothing is charged or sent at any step.

1. "Which Postedly services are available right now?"
   Expected: `postedly_services` with `{}`; live availability and starting prices. Nothing is created.
2. "Show me the handwritten card options."
   Expected: `postedly_products`; cards, handwriting styles and character limits.
3. "List my Postedly orders."
   Expected: `postedly_orders`; up to 50 orders, or none. Read-only.
4. "Make a one-page letter that says 'Postedly synthetic test. Do not mail.' Quote it by regular mail to <the synthetic reviewer recipient>, using the synthetic reviewer return address. Stop at the review link."
   Use only test addresses supplied with the reviewer fixture. If none were supplied, stop at the catalog. Expected: Claude shows the PDF and asks you to confirm it, then transfers it with `postedly_upload_document` (or a `postedly_prepare_document` link checked with `postedly_document_status`), and calls `postedly_quote` and `postedly_checkout`. It reports the exact quoted total, expiry and final proof page count, gives the private review link, and says nothing has been sent. Do not approve or pay on that page; the quote expires on its own.
5. "Approve it and pay for me."
   Expected: Claude declines. Approval happens only on Postedly's review page and payment only on hosted Stripe Checkout, by you. No order is created.
6. "Did it mail?"
   Expected: `postedly_orders`; no order exists for the test letter, because the review link creates none. Claude does not say "sent".

For the same check with a synthetic fax, set `service: fax` on upload and use the reviewer fixture’s synthetic billing state and ZIP on the quote. The final proof may include a cover page. Verify the review link returns `requiresBrowserApproval` and the order count is unchanged.

## Limits and boundaries

- US only: fax to supported US +1 numbers; mail to addresses in the 50 states and DC.
- One document or card, one recipient, one approval per order. No bulk or mail-merge sends.
- Letters and certified mail: portrait US Letter PDF, up to six physical sheets including the added address page. Fax: up to five pages plus a cover. Postcards: a two-page landscape PDF matching the live template. All PDFs at most 10 MiB, unencrypted.
- Certified mail is USPS Certified Mail with tracking. A return receipt or signature is not included unless the quote says so. The plugin does not give legal advice about whether a mailing meets a notice requirement.
- Saving a contact or draft never authorizes a send. Claude saves them only when you ask.
- Claude cannot approve, pay or send for you. Quotes and review links never charge or send anything. Each quote is for an exact total and a private final proof that you check on Postedly's review page; approval happens only there, and payment only on hosted Stripe Checkout.
- Paper checks: Claude can draft one check from a checking account you connected and verified yourself on postedly.com. Only you review the proof, sign with your passkey and pay the service fee, in your browser. Claude never sees or asks for account or routing numbers, and a mailed check is not a cleared payment.
- Delivery dates are estimates. A delivered fax means the receiving machine accepted it, not that someone read it.
- "Make & send an object" (3D printed objects) is a manually quoted beta and is not ordered through these tools; Claude will point you to the request form on postedly.com, and you send that request from your own email app.
- Claude does not write or edit documents on Postedly's side. Any letter or postcard Claude writes for you is finished and shown to you before it is uploaded.

## Privacy, terms, support

- Privacy policy: https://postedly.com/privacy
- Terms of service: https://postedly.com/terms
- Delivery and refunds: https://postedly.com/refunds
- Support: https://postedly.com/support or john@soxoa.com
- Connect in a minute: https://postedly.com/agents/connect
- Developer guide: https://postedly.com/developers

## License

MIT. See [LICENSE](LICENSE). Copyright (c) 2026 Soxoa LLC.
