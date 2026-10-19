# Question bank

Pick what fits. Two or three questions per message is plenty.

## Inventory

- What tasks does your team repeat every day or week that feel like copy and paste?
- What do people complain about doing? What gets put off until Friday?
- Where do things wait on someone retyping, checking, or forwarding information?
- Which tasks would you hand to a new hire on day one because they are rule-based?
- If you could get one recurring task off your plate, which would it be?

## Walking one workflow

- What starts it? (an email arrives, a form is submitted, a date comes up, a customer calls)
- Walk me through the steps the person takes, in order.
- Where does the information come from, and where does it end up? (Each distinct app, inbox, spreadsheet, portal, or paper form counts once toward `systemsCount`.)
- How many times does this happen per day or week?
- What usually goes wrong? How often do you hit an exception?
- Who checks the work, if anyone?

## Hours

- Who does this, and how many people?
- About how long does one item take, start to finish?
- Roughly how many hours a week does that add up to, per person and for the whole team?
- If you are not sure, would you be willing to time it for a week? Or give a rough number we label as rough?

Conversion read-back pattern: "You said about 15 minutes per invoice and about 40 invoices a week. That is 10 hours a week for the team. Use 10?"

## Ratings rubric (user chooses)

**Predictability (`predictability`)**
- high: same input format and steps almost every time; exceptions rare.
- medium: mostly standard with regular exceptions handled by habit.
- low: inputs or steps vary case by case.

**Judgment required (`judgmentRequired`)**
- low: decisions follow written rules.
- medium: a trained person decides with guidelines; most cases routine.
- high: expertise, negotiation, approvals, policy interpretation.

**Error cost (`errorCost`)**
- low: internal, easy to spot and fix.
- medium: rework, delays, or an annoyed customer.
- high: money moves wrongly, harm to a customer or patient, legal, safety, or regulatory exposure, or hard to undo.

**Data sensitivity (`dataSensitivity`)**
- low: public or non-confidential internal data.
- medium: customer contact details, order history, internal financial summaries.
- high: health, payment card, bank, government ID, HR, legal, or other regulated records.

If the user is torn between two ratings for error cost or data sensitivity, suggest they choose the higher one; it only makes the result more cautious.

## Value questions (only if they want ROI)

- How many people do this work? (`people`)
- How many hours a week does each spend on it? (`weeklyHoursPerPerson`)
- What is the loaded hourly cost, meaning wages plus taxes and benefits, and in what currency? (`loadedHourlyCost`, 10 to 500)
- Do you have a view on what share of that time could be automated? If not, the tool uses 60%. (`automatableShare`)
- How many weeks a year does the team work? If not given, the tool uses 48. (`workingWeeks`)
- Do you have a quote or budget for building it? Without one, the tool skips payback. (`implementationCost`)

## Questions to avoid

- Anything asking for passwords, API keys, account numbers, or customer or employee personal details.
- Leading questions that push a rating ("This is pretty predictable, right?"). Ask open, then offer the rubric.
