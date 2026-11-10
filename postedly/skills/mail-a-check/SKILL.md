---
name: mail-a-check
description: Use when the user wants Postedly to print and mail a paper check from their own checking account, for example "mail a $250 check to my landlord", "send a check to the city for the permit fee", "pay this invoice by paper check", or "which bank accounts can I write checks from?". Drafts one check and returns the owner's private review link; only the account owner signs and pays, in their browser.
---

# Mail a paper check

Postedly charges only a service fee per mailed check ($6.99 before tax at the time of writing; the quote is authoritative). The check amount is paid from the owner's own bank when the payee deposits it.

## Flow

1. Call `postedly_services` with `{}` and confirm the `check` service is available. If not, say so and stop.
2. Call `postedly_bank_accounts`. If no account is ready, give the user the `setupUrl` it returns: the owner connects and verifies their own checking account there, in their browser. Stop until they come back.
3. Collect, in the user's words: which ready account (`bankRef`), the payee (`kind` `person` or `organization`, exact `name`, `address1`, optional `address2`, `city`, 2-letter `state`, 5- or 9-digit `postalCode`), the amount, and an optional memo (up to 40 characters).
4. Read it back exactly, with the amount in dollars and cents and the masked account, and ask: "Draft this check?" Wait for a clear yes.
5. Call `postedly_check_draft` with `bankRef`, `payee`, `amountCents` (the face value in cents, for example 25000 for $250.00) and `memo`. Report the masked account, the allocated check number, the face value, the fee quote and the `reviewUrl`.
6. Tell the user the owner must open the review link, check the full proof, sign and pay the fee there. Nothing is sent until then.

## Rules

- One check, one payee, one approval. Never batch.
- Never ask for, accept or repeat account numbers, routing numbers, bank passwords, passkeys or signature images in chat. If the user pastes them, tell them not to and do not use them.
- Never sign, approve, pay or send. Do not use document upload or `postedly_quote` for checks.
- Mailed is not cleared. Track the order with `track-postedly-orders`; never say the payee was paid.
- Do not decide whom to pay or how much; use only what the user gives.
