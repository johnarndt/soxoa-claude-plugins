---
name: correspondence-drafts
description: Use when the user wants to save a Postedly send for later, pick one back up, or clear old ones, for example "save this letter as a draft and I'll send it Friday", "what Postedly drafts do I have?", "pick up my draft to the landlord", or "delete that draft". A draft stores preparation details only; it is never a quote, approval, payment or order.
---

# Correspondence drafts

## Flow

1. **Find.** `postedly_drafts` with `query` or `key` (`limit` up to 25). Show each draft's label, service, recipient, last update, `version` and expiry.
2. **Save.** Only when the user asks to save a draft. Read back what will be stored: `service`, the owned `documentId` if a PDF was uploaded, `recipient`, `sender` and `options`. Ask "Save this draft?" On a yes, call `postedly_save_draft` with `key`, `label`, `draft`, `confirmedSave: true` and `expectedVersion` (`0` new, current `version` to update).
3. **Resume.** Load the draft, show its details and ask the user to confirm they are still right. If the draft references a PDF, its document may have expired: re-upload the exact file if the quote is refused. Then continue in the matching sending skill: `postedly_quote` for that one document or card and one recipient, then `postedly_checkout` for the private review link.
4. **Delete.** On request only: confirm, then `postedly_delete_draft` with `key`, current `expectedVersion` and `confirmedDelete: true`. This does not delete the PDF or affect any quote or order.

## Rules

- Saving a draft never authorizes a send. A later send still needs a fresh quote and the user's own approval and payment on Postedly's review page.
- One document or product, one recipient per draft.
- Drafts expire 30 days after the last save; the referenced PDF can expire sooner.
- Never call the save or delete tools without a yes to that exact draft. On a version mismatch, re-read and ask again.
