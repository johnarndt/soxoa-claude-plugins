---
name: update-offering
description: Use when the user wants to see or change what Intakra thinks they sell, for example "what does Intakra think we sell?", "tell Intakra we sell payroll software for restaurant groups", or "update our offering". Intakra uses this description to decide which findings become leads. Needs a connected Intakra workspace.
---

# See or replace what the workspace sells

## Flow

1. Call `get_offering` and show the current description exactly as stored, or say none is on file.
2. If the user wants a change, agree the new text with them: a sentence or two, 10 to 600 characters, in their words. You may suggest edits, but the final text is theirs.
3. Show old and new side by side and ask: "Replace the current description with this?" Wait for a clear yes.
4. Call `set_offering` with `offering` set to the approved text. Confirm what was saved.

## Rules

- Always call `get_offering` before `set_offering`; the write replaces the current description.
- Never call `set_offering` without a yes to the exact text in this conversation.
- Changing the offering changes which future findings become leads. It does not rescore past leads; do not claim it does.
- Not connected? Tell the user to run `/mcp` in Claude Code and sign in to `intakra` (https://intakra.com/agents).
