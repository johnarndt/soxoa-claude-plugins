# Field guide: writing Intakra evidence

All limits below come from the live tool schema. Both Intakra tools (`score_buying_signal_evidence` and `prepare_why_now_review`) take the same input. Unknown fields are rejected (`additionalProperties: false`), so send only these.

## Top level

| Field | Required | Type and limits |
|---|---|---|
| `account.name` | yes | string, 1 to 200 chars |
| `vendor.offer` | yes | string, 1 to 1000 chars |
| `vendor.idealCustomerProfile` | yes | string, 1 to 1000 chars |
| `fitCriteria` | yes | array, 1 to 8 items |
| `signals` | yes | array, 1 to 10 items |
| `asOfDate` | no | `YYYY-MM-DD`; defaults to the current California date |

## fitCriteria item

| Field | Required | Rule |
|---|---|---|
| `criterion` | yes | 1 to 240 chars. One trait, phrased as a test: "Fleet of 50 to 500 trucks" |
| `assessment` | yes | `match`, `mismatch`, or `unknown` |
| `evidence` | yes | 1 to 600 chars. The fact behind the assessment. For `unknown`, say what is missing |
| `sourceUrl` | no | up to 2048 chars, credential-free `https://` only. Not opened or verified |

## signals item

| Field | Required | Rule |
|---|---|---|
| `kind` | yes | one enum value, see below |
| `evidence` | yes | 1 to 600 chars. The observed event, stated plainly |
| `observedAt` | no | `YYYY-MM-DD`. Missing or stale dates reduce the signal's weight |
| `sourceUrl` | no | up to 2048 chars, credential-free `https://` only. `http://` is rejected |
| `relevanceToOffer` | yes | 1 to 600 chars. Specific and hedged: why it may matter for this offer |
| `confidence` | yes | `high`, `medium`, `low`. The user's confidence in the observation, not verification |

## Choosing `kind`

| Event in the user's material | `kind` |
|---|---|
| New executive, team lead, or owner; departure of one | `leadership_change` |
| Job posts, a hiring push, a new team being built | `hiring` |
| Funding round, debt facility, acquisition by an investor | `funding` |
| New product, service line, or major feature released | `product_launch` |
| New office, location, market, region, or facility | `expansion` |
| Switching, adopting, or retiring a system or vendor | `technology_change` |
| New partner, reseller, integration, or alliance | `partnership` |
| New rule, deadline, audit, license, or compliance event | `regulatory_event` |
| Anything else that is a concrete, observable event | `other` |

If an item is not an event at all (for example "they seem frustrated" or "they probably have budget"), it is not a signal. Leave it out and mention it under "Left out".

## Writing `relevanceToOffer`

Good, hedged, specific:
- "A new operations leader may review dispatch and routing tools in the first months."
- "The new state rule could prompt a review of intake forms, which this offer replaces."

Rejected or weak:
- "They have budget and are ready to buy." The server excludes the signal and adds an `unsupportedClaims` entry ("contains an unsupported budget, authority, or buying-intent assertion").
- "Growth." Too vague to explain the link to the offer.

## Dates

- Use the date the material states for the event, not the date the user read it.
- If only a month is known, ask the user. Do not pick a day on their behalf. If they cannot say, leave `observedAt` out.
- Set `asOfDate` when the user wants a reproducible result (for example re-running a review later). Otherwise omit it.

## What to keep out

- People's personal data (home addresses, personal emails, phone numbers, health or family details).
- Private CRM notes, deal sizes, pricing quotes, internal forecasts, anything marked confidential.
- Credentials, signed or tokenized URLs, login pages.
