# Prompt library

Pick 5 to 12 prompts with the user, fill the placeholders, then freeze the wording. Write prompts the way a real customer would type or say them. Avoid prompts that name the business unless they are in the branded group.

Placeholders: `<service>`, `<city>`, `<region>`, `<category>`, `<business>`, `<need>`, `<competitor>`.

## Unbranded discovery (the core of the set, about 60%)

These show whether the business comes up when a buyer does not know it yet.

- best `<service>` in `<city>`
- who is the most reliable `<service>` near `<city>`
- `<service>` in `<city>` open on weekends
- I need `<need>` in `<city>`, who should I call
- affordable `<service>` in `<region>`
- top rated `<category>` in `<city>` for families
- `<service>` in `<city>` that offers free estimates

For brands and online businesses, swap location for audience or use case:

- best `<category>` for `<audience>`
- what `<category>` do experts recommend for `<use case>`
- alternatives to `<competitor>` for `<use case>`

## Comparison (about 20%)

These show how the business is described next to others.

- `<business>` vs `<competitor>`, which is better for `<need>`
- compare `<service>` companies in `<city>`
- is `<business>` a good choice for `<need>`

## Branded (about 20%)

These show what assistants believe about the business itself. Check the facts in the answer against the site.

- what do you know about `<business>` in `<city>`
- what services does `<business>` offer and where
- is `<business>` licensed and how long have they been in business

## Tips

- Keep city names consistent ("Sacramento" not sometimes "Sac").
- Include at least one prompt with a real buying constraint (emergency, weekend, insurance, budget).
- Do not include personal details about the user or their customers in prompts.
- If a prompt reliably makes an assistant refuse, keep it in the set and log the refusal as `error` with a reason; the pattern is useful.
- Changing a prompt starts a new series. If the user wants to change one, add the new version and retire the old one with a note, rather than editing it in place.
