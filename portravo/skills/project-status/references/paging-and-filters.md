# Paging and filtering Portravo projects

## Paging

`list_projects` returns up to 50 projects per call.

```
call 1: list_projects {}                 -> projects[0..49],  nextOffset: 50
call 2: list_projects { "offset": 50 }   -> projects[50..99], nextOffset: 100
call 3: list_projects { "offset": 100 }  -> projects[100..123], nextOffset: null  (stop)
```

Rules:

- Always pass the exact `nextOffset` the previous call returned. Do not compute offsets yourself.
- Stop when `nextOffset` is `null`.
- `offset` must be an integer from 0 to 999999; anything else returns `invalid_offset`.
- If the user asks for "recent" projects only, one page is usually enough. Say "showing the most recent 50" only if the page order makes that true; if you are not sure of the order, sort what you fetched by `updatedAt` and say how many you looked at.
- If a later page fails, report what you have, say the list may be incomplete, and offer to retry.

## Finding one project by name

1. Page through projects until you find matches on `name` (case-insensitive, partial match is fine) or `address`.
2. One match: use it.
3. Several matches: list each with `status`, `address` or market, and `updatedAt`, and ask which one.
4. No match after the last page: say no project with that name is in this Portravo account, and offer the closest names you saw.

## Filters

| User says | Filter on |
| --- | --- |
| "in review", "needs review" | `status == "review"` |
| "ready to download", "priced" | `status` is `priced` or `final` |
| "not started", "drafts" | `status == "draft"` |
| "stuck", "failed" | `status` is `failed`, or `extracting` with an old `updatedAt` |
| "this week", "since Monday" | `updatedAt` on or after that date in the user's time zone |
| a city or market | `metroCode` (match against `list_pricing_markets` names if needed) or `address` |

An `extracting` project with an `updatedAt` many minutes old may have stalled. Say what the data shows ("still marked as running since 2:10 pm") and suggest opening it in Portravo; do not declare it failed.

## Account check

`get_profile` returns `id` (always), and `name` and `email` when available. Use it when:

- the user asks which account is connected, or
- a project they expect is missing (they may be signed in with a different login).

Do not show the account `id` unless asked.
