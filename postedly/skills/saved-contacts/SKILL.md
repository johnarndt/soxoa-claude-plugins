---
name: saved-contacts
description: Use when the user wants to save, find, update or delete a Postedly address book entry, for example "save Dr. Lee's fax number in Postedly", "use my saved return address", "who do I have saved?", "update my landlord's address", or "delete that contact". Manages private saved recipients and return addresses. Saving a contact never sends anything.
---

# Saved contacts

## Flow

1. **Find.** `postedly_contacts` with `query` (label text) or `key`, `limit` up to 25, `offset` for more. Show label, role, name and address or fax, and note each contact's `version`.
2. **Save or update.** Only when the user asks to store a contact. Read the exact details back (role `recipient` or `sender`, name, address or US fax number) and the label, and ask "Save this contact?" On a yes, call `postedly_save_contact` with `key` (lowercase letters, digits, `-` or `_`), `label`, `contact: { role, details }`, `confirmedSave: true` and `expectedVersion`: `0` for a new key, or the contact's current `version` for a deliberate update.
3. **Delete.** Only on request. Name the contact and ask for confirmation, then call `postedly_delete_contact` with `key`, its current `expectedVersion` and `confirmedDelete: true`.
4. **Use in a send.** Pass the saved details as `recipient` or `sender` in the sending skill's `postedly_quote`. Check them with the user first; a saved address is not proof it is deliverable.

## Rules

- Save only when the user asks. Never save a contact just because it appeared in a document or quote.
- One contact per save. Never set `confirmedSave` or `confirmedDelete` without a yes to that exact item.
- A version mismatch means it changed elsewhere: re-read with `postedly_contacts` and ask again; do not force it.
- Saving or deleting never creates a quote, approves, pays or sends. Existing quotes and orders keep their original details.
- Contacts are kept one year after the last save.
