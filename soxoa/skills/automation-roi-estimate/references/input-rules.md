# Input rules for estimate_automation_roi

## people (required, integer 1 to 500)

- Count the people who actually do this task, not the whole department.
- If the user gives a range ("3 or 4 people"), ask which number to use. Do not average it yourself.
- More than 500 people is out of range. Tell the user the tool caps at 500 and ask whether to estimate one site, team, or role group at a time.

## weeklyHoursPerPerson (required, number 0.5 to 60)

- This is per person, per week, for this one workflow.
- If the user gives a team total ("the team spends 30 hours a week"), you can divide by `people` only after showing the arithmetic and getting a yes ("30 hours across 5 people is 6 hours each. Use 6?").
- If the user gives a daily or monthly figure, show the conversion using their own working pattern and confirm it before calling. Ask how many days a week they work rather than assuming 5.
- If people spend very different amounts of time, offer two options: one call with the average they confirm, or one call per role group with each group's own numbers. Add the results only if the user asks, and say they were added.
- Under 0.5 hours is out of range; tell the user the task is probably too small to estimate this way.

## loadedHourlyCost (required, number 10 to 500)

- Loaded cost means wages plus employer taxes, benefits, and overhead per paid hour.
- If the user only knows a salary or a base wage, ask whether they want to give a loaded figure. Do not apply a burden multiplier you chose. If they say "just use the base wage", use it and label it "base wage, not loaded" in the answer.
- Keep the user's currency. Never convert to another currency unless the user asks and gives the rate.
- If the user's currency makes the hourly figure fall outside 10 to 500 (for example large-denomination currencies), say the tool cannot accept it and ask how they want to proceed. Do not rescale silently.

## automatableShare (optional, number 0.05 to 0.95)

- Omit when the user gives nothing. The server applies 0.6.
- Convert a percentage to a fraction ("45%" becomes 0.45). Keep their exact value otherwise.
- If the user says "most of it" or "about half", ask for a number. "About half" can become 0.5 only if they confirm.
- Values of 0 or 100% are out of range. Explain that the tool requires 5% to 95%.

## workingWeeks (optional, integer 1 to 52)

- Omit when the user gives nothing. The server applies 48.
- Never substitute 52 calendar weeks for an unstated value.
- If the user says "we close two weeks in summer and one at year end", you may compute 52 minus 3 = 49 and confirm it.

## implementationCost (optional, number 0 to 10,000,000)

- Pass only a figure the user gave or approved. Do not estimate build cost, license fees, or vendor pricing.
- Same currency as `loadedHourlyCost`.
- If the user gives a range ("10 to 15 thousand"), ask which figure to use, or offer to run both as separate calls if they want both.
- 0 is allowed and returns `estimatedPaybackMonths: 0`. Do not send 0 as a placeholder for "unknown"; omit the field instead.

## Things the tool does not take

Workflow name, currency code, ongoing subscription cost, error rate, volume per week, or revenue impact. If the user gives these, keep them for the narrative and say they were not part of the calculation.
