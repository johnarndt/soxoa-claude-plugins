---
name: scope-gap-checklist
description: Use when the user wants to find what a Portravo takeoff might be missing or what to ask the architect or GC, for example "what scope is missing from this takeoff", "write RFIs from my Portravo project", "what assumptions did the takeoff make", "give me a scope gap checklist", "what should I clarify before I bid", or "which sheets did it skip". Builds a checklist of assumptions, omitted or unshown scope, skipped sheets and unmapped lines from the takeoff's own notes, with draft RFI questions for the estimator to send.
---

# Scope gap and RFI checklist from a Portravo takeoff

This skill reads a takeoff and turns its own evidence (line notes, low-confidence lines, unmapped lines, scope notes, skipped sheets) into a checklist of things to verify, plus draft RFI (request for information) questions. It helps the estimator decide what to clarify before pricing in Portravo.

It does not decide scope. Portravo's extractor only lists items it found evidence for on the sheets and deliberately leaves out standard items the plans do not show. A gap on this list is a question to ask, not a missing line to add.

## When not to use this skill

- The user only wants quantities: use `review-takeoff`.
- No takeoff exists yet: use `start-plan-takeoff`.
- The user wants Claude to add lines, change quantities, or price scope. That happens in Portravo, by the estimator.

## If the Portravo tools are not available

Tell the user the Portravo connection is not active and how to add it:

- Claude apps: Customize > Connectors, add Portravo (or install this plugin), then sign in.
- Claude Code: `claude mcp add --transport http portravo https://portravo.com/mcp`, then `/mcp` to authenticate.

If the user pastes takeoff lines or Portravo's scope notes, build the checklist from that text and say so. Without either, you can offer a generic pre-bid checklist for their trade, clearly labeled as general guidance and not based on their plans.

## Inputs

| Need | Tool argument | Rules |
| --- | --- | --- |
| Which project | `get_takeoff.project_id` | Required. 1 to 128 characters, letters, digits, `_` and `-` only. Resolve a name with `list_projects`. |
| Scope notes (if available) | none | `scopeNotes` is returned only by `run_takeoff`. Use it if the run happened in this conversation, or if the user pastes it. Do not re-run a takeoff to get it. |
| Trades the user bids (optional) | none | Ask "which trades are you pricing?" only if it changes the list. Use it to filter. |
| Recipient (optional) | none | Architect, engineer, GC, or owner. Used only to phrase the RFIs. |

## Workflow

1. Resolve the project id (`list_projects`, paging with `nextOffset`, if the user gave a name).
2. Call `get_takeoff` with `{ "project_id": "<id>" }`. If `project.status` is `draft`, `extracting`, or `failed`, there is nothing to check yet; say so.
3. Collect evidence, ignoring lines with `status: "rejected"`:
   - **Assumptions:** lines whose `notes` say a value was assumed, inferred, or not applied.
   - **Low confidence:** lines with `confidence` below 0.60 (or the user's cutoff).
   - **Unmapped:** lines with `assemblyId` null.
   - **Scope notes:** sentences in `scopeNotes` (if available) about skipped sheets or scope left out because the plans did not show it.
   - **Trades with no lines:** only for trades the user says they bid. "No electrical lines" is a question, not a finding of missing work.
   - **Coverage:** compare `files[].pageCount` with the `page` values that appear on lines; pages with no lines may be title, notes, or detail sheets, or may be unread.
4. Turn each item into a checklist entry and, where a document answer is needed, a draft RFI. Use `references/rfi-patterns.md` for wording.
5. Present with the template below and end with `reviewUrl`.

## Output template

```
Scope check: <project name>  (<lines> lines, <files> plan file(s), <pageCount> pages)
Based only on Portravo's takeoff notes and confidence. Verify against the plans.

Assumptions to confirm
- [ ] <description> (<qty> <unit>, p.<page>): <quoted note>. Confirm <the assumed value>.

Low confidence
- [ ] <description> (<qty> <unit>, <confidence>%): <why, from notes>.

Not mapped to an assembly (cannot be priced yet)
- [ ] <description>

Scope Portravo did not take off
- [ ] <quoted or closely paraphrased scope note>

Pages with no takeoff lines
- [ ] p.<n>: check whether this sheet carries scope.

Draft RFIs
1. RFI: <subject>
   Reference: sheet/page <n>
   Question: <one specific question>
   Why it matters: <what quantity or price depends on it>

Review and update lines in Portravo: <reviewUrl>
```

Leave out empty sections. Keep each RFI to one question.

## Guardrails

- Every item must trace to a field in the tool output or text the user supplied. Do not invent code requirements, typical scope, or quantities.
- Do not state that scope is missing from the project. Say the takeoff does not include it and the plans should be checked.
- Do not draft RFIs that claim errors in the drawings. Ask; do not accuse.
- Do not send RFIs or contact anyone. Draft them for the user.
- No legal, code-compliance, or engineering conclusions.

## Worked example

User: "Make me an RFI list for the Riverside workshop takeoff. I'm the GC."

1. `get_takeoff` with `{ "project_id": "prj_7k2m9q" }` returns `status: "review"`, 1 file with 4 pages, and lines including:
   - drywall "Gypsum board, interior walls", 2032 sf, confidence 0.4, notes "254 lf x 8 ft, ceiling height assumed", `assemblyId` null
   - roofing "Asphalt shingles", 1450 sf, confidence 0.65, notes "plan area, pitch and overhang not applied"
   - lines on pages 1 to 3, none on page 4
2. Earlier in the conversation `run_takeoff` returned `scopeNotes`: "Sheet A0 is a title block, skipped. No insulation or paint shown on wall types; not taken off."
3. Reply:

```
Scope check: Riverside workshop  (18 lines, 1 plan file, 4 pages)
Based only on Portravo's takeoff notes and confidence. Verify against the plans.

Assumptions to confirm
- [ ] Gypsum board, interior walls (2032 sf, p.2): "254 lf x 8 ft, ceiling height assumed". Confirm ceiling height.
- [ ] Asphalt shingles (1450 sf, p.3): "plan area, pitch and overhang not applied". Confirm pitch and overhang.

Not mapped to an assembly
- [ ] Gypsum board, interior walls

Scope Portravo did not take off
- [ ] No insulation or paint shown on wall types, so none was taken off.
- [ ] Sheet A0 skipped as a title block.

Pages with no takeoff lines
- [ ] p.4: check whether this sheet carries scope.

Draft RFIs
1. RFI: Interior ceiling height
   Reference: p.2
   Question: What is the finished ceiling height for the interior partitions?
   Why it matters: drywall area is calculated from it.
2. RFI: Roof pitch and overhang
   Reference: p.3
   Question: Please confirm roof pitch and eave and rake overhang dimensions.
   Why it matters: roofing area was taken from plan area only.
3. RFI: Wall insulation and finishes
   Reference: wall types
   Question: Are insulation and paint required at the interior partitions? None are shown on the wall types.
   Why it matters: neither is in the current takeoff.

Review and update lines in Portravo: https://portravo.com/projects/prj_7k2m9q
```
