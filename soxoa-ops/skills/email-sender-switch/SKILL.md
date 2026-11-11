---
name: email-sender-switch
description: "Use when a user wants to move an app's transactional email to a new provider or a new from-address without losing or duplicating messages. Triggers include 'switch our email provider', 'send receipts from our own domain', 'move transactional email off this service', 'change the from address on verification emails', 'add a fallback email provider', or 'migrate sending to our domain'. Checks DNS and domain status, routes by sender through one transport, falls back only when the provider definitely refused, and verifies with a real message."
---

# Email sender switch

Changing who sends an app's receipts and verification codes looks like a config change. The risks are quiet ones: mail that never arrives, mail sent twice, and monitoring that keeps asking the old provider about messages it never saw. This skill makes the switch in a way that can be checked and reversed.

## Inputs

- The repository and every place it sends email.
- The new provider's documentation, read at the time of the work: how to send, error codes, limits, whether it supports idempotency and delivery lookups.
- Access to check DNS and the provider's domain status.
- The intended from-address and the current one.

## Method

1. **Inventory the sends.** Find every code path that sends mail: receipts, codes, alerts, signup sequences, digests. Note which use the provider's features beyond plain sending, such as events, templates or audiences. Those may need to stay where they are.
2. **Check the domain before any code.** The sending domain is onboarded with the new provider and shows as enabled. SPF, DKIM and DMARC records exist and align with the provider. If the DMARC policy is strict, a misaligned sender will be rejected outright.
3. **Put all sending behind one transport.** One function takes a message and returns either accepted with a provider reference, or failed with a status and a short error code. Callers stop talking to a provider directly.
4. **Route by sender, not by flag.** A message from an address on the new domain goes to the new provider. Any other sender goes to the old one, unchanged. Messages queued before the switch keep the sender they were created with and still go out.
5. **Classify the new provider's errors.**
   - Definitely refused before acceptance, for an account or sender reason: sender not verified, domain unavailable, account suspended, daily or rate limit. These are safe to retry elsewhere.
   - Recipient problems: suppressed or rejected address. Do not retry elsewhere. The answer is about the recipient.
   - Unknown outcome: timeouts, internal errors, anything unrecognized. Do not retry elsewhere. The message may have gone.
6. **Fall back once, only for the first group.** Send through the old provider from the old address, reusing the idempotency key. Log the refusal code and that a fallback happened. Never log addresses or message content.
7. **Fix what depends on the provider.** Tag the stored reference by provider. Delivery reconciliation and "unverified delivery" alerts must skip references the old provider cannot look up. Readiness checks should ask "can the configured sender send" rather than "is the old key present".
8. **Test the cases.** Routing by sender, each fallback code, no fallback on recipient or unknown errors, no fallback without a usable fallback sender, and no personal data in logs.
9. **Deploy with the owner's approval, then verify with a real message.** Trigger a real send to an inbox the owner controls. Confirm it arrived, the from-address is the new one, and no refusal was logged, so the fallback did not hide a failure.
10. **Record what is still open.** Bounce handling on the new provider, limits for a new sender, any environment left on the old path.

## Rules

- Never retry a send whose outcome is unknown through a second provider. A duplicate receipt is worse than a delayed one.
- Keys stay in the secret store. Never print or log them.
- Keep the old provider configured until the new one has carried real traffic.
- Acceptance by a provider is not delivery. Say which one was verified.

## Output

The send inventory, the DNS and domain status, the routing and fallback rules, test results, the verification evidence from the real message, and the open items.
