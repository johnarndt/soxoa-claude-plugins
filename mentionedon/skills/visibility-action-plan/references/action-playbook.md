# Action playbook

Concrete tasks for each signal, to sit under the tool's `action` and `verification` text. Use only the tasks that fit the user's site and skills. Everything here is a recommendation for the user to review; nothing is applied automatically.

Effort below is a rough guide for a small business site. The tool's own `effort` field wins when they differ.

## business_identity

- Pick one canonical name (match the legal or trading name the business uses on its signage and profiles).
- Put it in the title tag of the home page, the main heading, the footer, and the JSON-LD `name`.
- Update profiles the owner controls to the same spelling.
- Done when: a reader and a parser see the same name everywhere.

## service_location

- Add one plain sentence near the top of the home page: what you do, for whom, and where. Example shape: "<Name> provides <services> for <customers> in <cities or region>."
- Create or fix one page per main service, and a service-area page that names the real towns served. Do not create near-duplicate pages for towns you do not serve.
- Done when: someone who only reads the page text can say what you do and where.

## page_description

- Rewrite the first paragraph on the home and about pages as factual statements: services, customer type, area, years operating (if true), what is different.
- Keep slogans, but not instead of facts.
- Done when: the description makes sense with images turned off.

## contact_details

- Show phone, email or form, and address or service area as text (not only in an image) in the header or footer and on a contact page.
- Match them exactly to the owner's profiles.
- Done when: the contact facts on the site and on each profile agree.

## structured_data

- Draft Organization or LocalBusiness JSON-LD (or a specific subtype such as `Plumber`, `RoofingContractor`, `Dentist`) using only facts the user confirms: `name`, `url`, `telephone`, `address` or `areaServed`, `sameAs` links to profiles they control, `openingHours` if published.
- Add it to the page whose content it describes.
- Validate with a structured-data testing tool of the user's choice, then compare each property with the visible page.
- Done when: it validates and every value matches the page.

## corroborating_profiles

- List the profiles the owner controls and the ones that matter for the category (map listings, review sites, licensing boards, trade associations).
- Correct name, phone, address, hours, and services on each to match the site.
- Link the important ones from the site and in JSON-LD `sameAs`.
- Done when: core facts agree everywhere the user checked.

## crawlability

- Check `/robots.txt` for `Disallow` rules that block the whole site or key pages.
- Check key pages for `noindex` and for a canonical tag that points to the right URL.
- Make sure the main text is in the HTML, not only loaded by JavaScript after the page opens.
- Blocking particular AI crawlers can be a deliberate choice. Present the trade-off; the owner decides.
- Done when: key pages return normally, are indexable, and show their text without scripts.

## buyer_faq

- Collect 5 to 10 questions customers really ask (from calls, emails, reviews).
- Answer each in two to four sentences with facts specific to the business: price ranges or how pricing works, timing, area, licensing, guarantees, what happens on a visit.
- Put answers on the relevant service page or an FAQ page as visible text.
- Done when: each answer is visible, specific, and current.

## first_party_evidence

- For each claim on the site ("licensed", "insured", "since 2009", "5-star"), add the supporting detail: license number and issuer, policy summary, a dated project write-up, named staff with roles.
- Remove superlatives the business cannot support.
- Done when: every material claim traces to a current fact on the site.

## machine_summary

- Publish a short plain-text summary at `/llms.txt` or a simple facts page: name, what you do, area, hours, how pricing works, key page links.
- Keep it in sync with the site; out-of-date summaries are worse than none.
- Done when: the summary agrees with the rendered site and current terms.

## Unknown findings

Actions that begin "Verify before changing the site:" mean the status was `unknown`. Turn them into a check the user (or you, if they ask and you can view the page) performs first. After the check, update the finding's status and evidence and re-run the plan.
