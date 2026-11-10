---
name: prioritize-tracked-accounts
description: Use when the user wants to know which companies on their Intakra list to target, for example "who should I target from my list?", "are any of these companies showing buying signals?", "rank my accounts", "is acme.com on my list?", or "what do we know about acme.com?". Ranks tracked accounts by their best open lead from saved records. Needs a connected Intakra workspace. For accounts the user describes by pasting evidence, use account-list-triage instead.
---

# Prioritize tracked accounts

## Flow

1. If the user names domains, call `list_accounts` with `domains` to see which are tracked and which are not. Report the domains not on the list; offer to add them only through `manage-account-list` (it asks first).
2. Call `prioritize_accounts`, with `domains` when the user named some, otherwise without, and `limit` if they asked for a number. Show each ranked account with its best open lead, dated proof, links and rough time frame, and the account score (0 to 100) only when the tool returns one.
3. List the accounts with no open lead separately. Keep "pending checks" (not checked yet) apart from "no eligible signals" (checked, nothing found).
4. For "what do we know about X?", call `get_account` with the domain, company name or account id and show its dated findings and open leads.
5. For more than one page of `list_accounts`, follow `next_offset` as `offset`.

## Rules

- Saved, dated evidence only. Do not describe it as new research, live data or confirmed intent. No findings is not proof of no activity.
- Never invent a score, lead or date that the tools did not return.
- No tool sends outreach. Do not claim anything was sent, pushed to a CRM or marked.
- Not connected? Tell the user to run `/mcp` in Claude Code and sign in to `intakra` (https://intakra.com/agents).
