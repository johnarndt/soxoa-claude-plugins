# RFI and checklist patterns

Use these patterns to turn takeoff evidence into checklist items and draft RFIs. Fill the brackets only with values from the tool output or the user. If a value is unknown, ask the user or leave the bracket out; never invent a sheet number.

## From line notes

| Note says | Checklist item | RFI question |
| --- | --- | --- |
| ceiling height assumed | Confirm ceiling height used for [description]. | What is the finished ceiling height at [area or wall type]? |
| plan area, pitch and overhang not applied | Confirm roof pitch and overhangs. | Please confirm roof pitch and eave and rake overhang dimensions. |
| inferred from overall dimension | Confirm dimension used for [description]. | Please confirm the [dimension] at [location]; it is not dimensioned on [sheet]. |
| count from plan symbols, no schedule | Check count of [description] against any schedule. | Is there a [fixture/door/window] schedule for this project? |
| scale not stated or unclear | Confirm drawing scale on [sheet]. | Please confirm the scale for [sheet]. |

If a note does not match a row, quote the note and ask the question it implies, in one sentence.

## From low confidence

Checklist item: "[description] ([qty] [unit], [confidence]%): verify on p.[page]."
Only draft an RFI if the uncertainty needs information the drawings should provide. If the estimator can resolve it by measuring, it belongs on the checklist, not in an RFI.

## From unmapped lines (`assemblyId` null)

Checklist item: "Map [description] to an assembly in Portravo before pricing."
No RFI. This is estimator work in Portravo.

## From scope notes

Scope notes come from `run_takeoff.scopeNotes`. Typical content and how to use it:

| Scope note content | Checklist item | RFI question |
| --- | --- | --- |
| A sheet was skipped (title block, notes page, unreadable) | Confirm [sheet] carries no quantities. | Only if unreadable: please reissue [sheet] at legible resolution. |
| A finish or system is not shown (for example insulation, paint) | Takeoff does not include [item]; check specs and wall types. | Is [item] required at [location]? It is not shown on [sheet or wall types]. |
| A trade is referenced to other drawings (for example "see MEP") | Get the referenced drawings. | Please provide [discipline] drawings referenced on [sheet]. |

## From trades with no lines

Only for trades the user says they price. Checklist item: "No [trade] lines in the takeoff; confirm whether [trade] drawings are in this set." RFI only if drawings are referenced but not provided.

## RFI format

```
RFI: <short subject>
Reference: <sheet or page, if known>
Question: <one question, answerable by the design team>
Why it matters: <the quantity or price that depends on it>
```

Tone: neutral and specific. Ask, do not assert an error. One question per RFI.

## Generic pre-bid checklist (only when no takeoff is available)

Label it "General checklist, not based on your plans":

- Drawing set complete and current revision on every sheet
- Scale stated on each sheet used for measuring
- Schedules present (doors, windows, fixtures, finishes)
- Wall types and ceiling heights stated
- Roof pitch and overhangs dimensioned
- Specs or general notes for finishes, insulation, and allowances
- Scope split between trades and by owner clear
- Site work, demolition, and permits responsibility stated
