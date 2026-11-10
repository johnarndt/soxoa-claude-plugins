---
name: delivery-report
description: Use when the user needs a record of a Postedly send, for example "give me proof my certified letter was mailed", "export the fax confirmation", "I need a delivery report for my records", or "save the tracking evidence for my landlord dispute". Exports the recorded payment, fulfillment, timeline and provider evidence for one order as a plain-text report.
---

# Export a delivery report

## Flow

1. Find the order: use the order ID if given; otherwise `postedly_orders` with `query`, `service` or a date range, and ask which order if several match.
2. Call `postedly_order_status` with `orderId` and tell the user its current state in a sentence, so they know what the report will show.
3. Call `postedly_delivery_report` with `orderId`. Show the report text. In Claude Code, offer to save it to a file using the returned `filename`; write it only where the user agrees.

## Rules

- The evidence is provider-reported. The report is not legal proof or independent confirmation that anyone received or read the item. A delivered fax means the receiving machine accepted it.
- Do not edit, summarize away or add to the report's evidence. If you summarize, keep the original text alongside.
- Exporting does not publish, share, charge or resend anything. Do not offer to email it from Postedly; the user shares it themselves.
- Postedly does not give legal advice about whether a mailing meets a notice requirement.
