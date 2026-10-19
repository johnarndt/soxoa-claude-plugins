# Export troubleshooting

| Situation | What happened | What to do |
| --- | --- | --- |
| The user says the link does not work | Download links expire after about five minutes (`expiresAt`). | Call `export_reviewed_estimate` again with the same `project_id` and share the new link. |
| The link stopped working right after the user disconnected Portravo | Disconnecting invalidates export links. | Ask the user to reconnect, then request a new link. |
| `status` is `priced` but the export returns `review_required` | Some lines are still pending or some assemblies are not mapped. | Call `get_takeoff`, count pending and unmapped lines, and send the user to the project's `reviewUrl`. |
| `reviewRequired` is false but the export returns `review_required` | No line is pending, but mapping or pricing is not finished. `reviewRequired` only tracks pending lines. | Say the lines are reviewed but the estimate still needs assembly mapping or pricing in Portravo, with the `reviewUrl`. |
| `not_found` | The id is wrong or the project is in another Portravo account. | Call `list_projects` and let the user choose. If it is missing, they may be signed in with a different login. |
| `invalid_token` | Connection expired or revoked. | Ask the user to reconnect and sign in, then retry. |
| Several projects share the name | Ambiguous request. | List them with status and `updatedAt` and ask which one. Only `priced` or `final` projects can export. |
| The user wants a PDF or CSV | The connection exports XLSX only. | Offer the XLSX link; they can convert it, or check Portravo for other formats. |
| The user asks Claude to open the workbook and summarize it | The link points to Portravo; Claude has not read the file. | Offer `review-takeoff` for a summary of the reviewed lines instead. Do not describe workbook contents you have not seen. |

## Readiness pre-check from `get_takeoff`

Export is likely to succeed when all of these are true:

- `project.status` is `priced` or `final`
- `reviewRequired` is `false` (no `pending` lines)
- every non-rejected line has an `assemblyId`

Even then, the export call is the final word. If it returns `review_required`, trust it and send the user to Portravo.
