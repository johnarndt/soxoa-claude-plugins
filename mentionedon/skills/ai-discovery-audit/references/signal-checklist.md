# Signal checklist

How to observe each of the ten `signal` values and choose a `status`. Every `present`, `partial`, or `missing` status needs a short `evidence` note (3 to 500 characters) that says where you looked and what you saw. If you did not look, the status is `unknown`.

Good evidence notes are specific and checkable:
- Good: "Home page H1 says 'Rivera Roofing'; title tag says 'Home'; footer says 'Rivera Roofing LLC'."
- Weak: "Branding looks fine." (not checkable)
- Not allowed: anything you did not observe or the user did not tell you.

When the user told you a fact you could not see yourself, say so in the evidence, for example "Per owner: Google Business Profile claimed, same phone as site."

---

## business_identity: Canonical business identity (weight 12)

Look at: the title tag, the main heading, visible name in header and footer, the name in any JSON-LD, the name on profiles the user controls.
- present: one name used consistently across those places.
- partial: name varies (LLC vs no LLC is minor; a different trading name or an old name is not), or the title tag is generic like "Home".
- missing: no clear business name on the page (logo image only, no text).

## service_location: Service and location specificity (weight 14)

Look at: the home page, service pages, service-area or location pages.
- present: the page says in plain text what the business does and where (city, region, or "online, US only").
- partial: services named but no place, place named only in the footer or address, or only some of the service area is named.
- missing: neither the services nor the place can be read from the page.

## page_description: Descriptive page copy (weight 10)

Look at: the first screen of text on the home page and the about page.
- present: a self-contained factual description (who, what, for whom, where, what makes it different) that makes sense without the images.
- partial: some facts, mostly slogans or stock phrases.
- missing: slogans or images only.

## contact_details: Accessible contact details (weight 8)

Look at: header, footer, contact page.
- present: phone, email or form, and address or service area as real text, and they match what the user says their profiles show.
- partial: contact details only inside an image, only behind a form, or different from profiles.
- missing: no way to contact the business on the page.

## structured_data: Structured business data (weight 14)

Look at: `<script type="application/ld+json">` blocks in the page source, or a structured-data test result the user pastes.
- present: Organization or LocalBusiness (or a more specific subtype) with name, URL, and contact or address facts that match the visible page.
- partial: JSON-LD exists but is the wrong type, is missing core facts, or disagrees with visible content.
- missing: no JSON-LD in the source.
- unknown: you only saw rendered text, or the site may inject JSON-LD with JavaScript and you could not see the rendered DOM. Say which in the evidence.

## corroborating_profiles: Corroborating authoritative profiles (weight 10)

Look at: profiles the user controls or that are authoritative for their category (for example a Google Business Profile, Bing Places, Apple Business Connect, Yelp, BBB, a state license lookup, industry associations, LinkedIn for B2B). Ask the user which ones they have. Do not search the web for them unless the user asks you to.
- present: at least a few authoritative profiles exist and their name, phone, address, and services agree with the site.
- partial: profiles exist but facts conflict (old phone, old address, different name).
- missing: the user confirms there are none.

## crawlability: Crawlability and indexability (weight 12)

Look at: `/robots.txt`, any `noindex` meta tag or header the user can show, the canonical tag, whether page text is present without JavaScript.
- present: page returns normally, not blocked for crawlers in robots.txt, no `noindex`, main text present in the HTML.
- partial: some AI or search crawlers blocked by name, key pages behind JavaScript only, or canonical pointing elsewhere.
- missing: site-wide `Disallow: /`, `noindex` on key pages, or content not available without login.
- Note: blocking specific AI crawlers can be a deliberate business choice. Record it, do not judge it.

## buyer_faq: Buyer-question coverage (weight 8)

Look at: FAQ page or sections, service pages.
- present: direct answers to real buyer questions (cost range, timing, coverage area, licensing, warranty, what to expect), specific to this business.
- partial: a few generic answers, or answers hidden in accordions you could not open.
- missing: no Q&A content.

## first_party_evidence: First-party evidence (weight 8)

Look at: credentials, license numbers, insurance, policies, methods, dated case studies or project write-ups, named team members.
- present: material claims ("licensed", "20 years", "award-winning") are backed by checkable details on the site.
- partial: some claims backed, others unsupported.
- missing: claims with no support, or no claims at all.

## machine_summary: Machine-readable summary (weight 4)

Look at: `/llms.txt`, a plain summary or "at a glance" page, a current facts page with services, area, hours, and pricing approach.
- present: a concise, current summary exists and agrees with the site.
- partial: exists but is outdated or thin.
- missing: none found at `/llms.txt` and no equivalent page.
- This carries the smallest weight. Do not oversell it.

---

## Common mistakes

- Marking a signal `missing` because you did not check it. Use `unknown`.
- Copying marketing copy into `evidence`. Describe what you saw instead.
- Sending the same signal twice (the server rejects duplicates). Combine notes into one item.
- Writing evidence over 500 characters. Trim to the deciding facts.
