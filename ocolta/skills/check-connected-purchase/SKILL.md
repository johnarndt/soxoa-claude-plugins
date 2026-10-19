---
name: check-connected-purchase
description: Use when the user wants to know which Ocolta purchase is connected to Claude, how many Deep Reviews it has left, or whether the Ocolta connection works, for example "which Ocolta purchase is connected", "how many reviews do I have left", "is Ocolta connected", "am I on the reviewer test account", or "why can't Claude see my Ocolta reviews". Reads the connected purchase's label, synthetic flag and unused review count. It never buys reviews, starts a review or spends a credit.
---

# Check the connected Ocolta purchase

This skill calls `get_connected_purchase` and tells the user, in one or two lines, which purchase Claude is reading from and how many unused Deep Reviews it still holds. It is also the first check when anything else about the connection seems wrong. It is read-only and spends nothing.

## When not to use this skill

- The user wants to see their completed reviews: use `find-recoverable-reviews`.
- The user wants a specific review explained: use `explain-review-summary`.
- The user wants to buy reviews, upload a document or run a new review. None of that is possible through the connection. Point them to the Ocolta workspace at https://app.ocolta.com/workspace, in the browser where they bought their reviews.

## If the Ocolta tools are not available

Say the Ocolta connection is not active in this conversation, and explain how to add it:

- Claude apps: Customize > Connectors, add Ocolta (or install this plugin), then approve the connection in the browser where the Ocolta purchase was made.
- Claude Code: `claude mcp add --transport http ocolta https://app.ocolta.com/mcp`, then `/mcp` to authenticate.

Do not guess a review count or a purchase label. Without the tool you can only explain what the connection would show.

## Inputs to gather

None. `get_connected_purchase` takes no arguments; call it with `{}`. Do not pass any field, not even a purchase name: the server rejects arguments with "This tool takes no arguments."

The purchase was fixed when the user approved the connection. To read a different purchase, the user must disconnect and reconnect, choosing the other purchase on Ocolta's consent page.

## Workflow

1. Call `get_connected_purchase` with `{}`.
2. If it succeeds, read the fields below and answer with the template.
3. If the call fails with an authorization error (the client asks to sign in again, or reports HTTP 401): the connection expired (connections last up to 30 days), was revoked, or the purchase is no longer active (for example after a refund). Ask the user to reconnect Ocolta and approve it in their purchasing browser. Do not retry in a loop.
4. If the result says "Connection request limit reached. Try again in a minute.", wait and try once more only if the user asks.

## Reading the output

| Field | Meaning |
| --- | --- |
| `label` | "Ocolta existing review purchase" for a normal purchase, or "Ocolta synthetic reviewer fixture" for the app-review test purchase. |
| `synthetic` | `true` only for the reviewer fixture. Its reviews are labeled test data, not customer documents. |
| `availableReviews` | Unused Deep Reviews left on this purchase. Completed reviews are not counted here. |
| `access` | Always "Categorical summaries from recoverable completed reviews". It describes what the connection can read. |

No payment details, receipt, email or account identifier is returned. If the user asks for those, say the connection does not expose them and that purchase support is at hello@ocolta.com (with the Stripe receipt, never the document).

## Output template

```
Connected: <label><" (synthetic test data)" if synthetic>
Unused Deep Reviews: <availableReviews>
Claude can read categorical summaries from completed reviews that are still within 24 hours of completion. New reviews and purchases happen in the Ocolta workspace.
```

If `availableReviews` is 0, say so plainly. It does not mean the connection is broken; completed reviews may still be readable. Offer `find-recoverable-reviews`.

## Guardrails

- Never imply Claude can buy reviews, top up credits or start a review.
- Do not present the label as an account name or the count as a balance in dollars.
- If `synthetic` is true, say every summary from this connection is synthetic, so nobody mistakes it for a real applicant's result.

## Worked example

User: "Is Ocolta hooked up? How many reviews do I have?"

1. Call `get_connected_purchase` with `{}`.
2. Result: `{ "label": "Ocolta existing review purchase", "synthetic": false, "availableReviews": 3, "access": "Categorical summaries from recoverable completed reviews" }`.
3. Reply:

```
Connected: Ocolta existing review purchase
Unused Deep Reviews: 3
Claude can read categorical summaries from completed reviews that are still within 24 hours of completion. New reviews and purchases happen in the Ocolta workspace.
```

Then offer: "Want me to list the reviews you can still read?"
