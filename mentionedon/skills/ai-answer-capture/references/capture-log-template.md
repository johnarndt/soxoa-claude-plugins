# Capture log template

Give this to the user as a spreadsheet (CSV) or Markdown table. Column names match the `summarize_scan_evidence` observation fields so the rows convert directly.

## Header block (top of the log)

```
Business: <name>            Variants counted as a mention: <list>
Own domain: <domain>        Profiles counted as business citations: <URLs>
Prompt set version: v1 (frozen <date>)
Assistants and labels: ChatGPT app | Claude app | Gemini app | Perplexity web | Grok app | Copilot app
Account state: <signed out / signed in, memory off>
Location setting: <city or "not set">
Next session: <date>
```

## CSV columns

```
sourceLabel,surfaceType,prompt,observedAt,status,businessMentioned,businessCitationUrls,position,sentiment,reason,notes
```

- `businessCitationUrls`: separate multiple URLs with a space; at most 10.
- `position`, `sentiment`: leave blank when not applicable.
- `reason`: only for `error` or `skipped` rows.
- `notes`: for the user only (for example "listed under 'other options'"). Not sent to the tool.

## Example rows

```
ChatGPT app,consumer_app_capture,best family dentist in Boise,2026-10-18T10:05:00-06:00,completed,true,https://brightsmile.example/,3,positive,,
Perplexity web,search_ai_capture,best family dentist in Boise,2026-10-18T10:09:00-06:00,completed,false,,,,,named 6 other dentists
Gemini app,consumer_app_capture,best family dentist in Boise,2026-10-18T10:12:00-06:00,skipped,,,,,Sign-in required on this device,
```

## Converting rows to tool input

- Completed row: include `sourceLabel`, `surfaceType`, `prompt`, `observedAt`, `status` ("completed"), `businessMentioned` (true or false), and `businessCitationUrls` (array), `position` (integer), `sentiment` only when filled.
- Error or skipped row: include only `sourceLabel`, `surfaceType`, `prompt`, `observedAt`, `status`, `reason`. Any extra field makes the call fail.
- Drop the `notes` column.
- Check every `observedAt` has a timezone (`Z` or `+hh:mm` / `-hh:mm`).
