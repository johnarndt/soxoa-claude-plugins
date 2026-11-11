---
name: prerender-public-pages
description: "Use when a site built as a JavaScript app serves empty or identical HTML for its public pages and needs real content for crawlers and AI readers. Triggers include 'our pricing page is blank without JavaScript', 'crawlers only see the homepage', 'prerender our SPA routes', 'make the app's public pages static', 'every route has the same title', or 'AI assistants cannot read our pricing'. Renders chosen public routes to static HTML at build time, gives each its own head tags, and makes the build fail if a page comes out empty."
---

# Prerender public pages

A single-page app often answers every URL with the same shell and fills in the page with JavaScript. A reader that does not run scripts gets the homepage's title and an empty body on the pricing page. This skill fixes the few public routes that matter without rewriting the app.

## Inputs

- The repository, its build command and how routes reach the app shell (the rewrite or fallback rule).
- The public routes to cover. Start small: pricing, terms, privacy, about, and any page a buyer or an assistant needs to read.
- For each route: title, description, and the facts the page must show.

## Method

1. **Prove the problem.** Fetch each route with a plain HTTP client. Record the title, the canonical and the visible word count of the body with scripts ignored. Save this as the before state.
2. **Pick the routes.** Only pages whose signed-out view is the same for everyone. Anything that depends on the account, the cart or live data stays dynamic.
3. **Add a build-time render entry.** A small module that imports the real page components and renders each chosen route to static markup with the framework's server renderer, wrapped in the same providers the app uses. It must render the signed-out view: queries stay pending, effects do not run. The browser bundle never loads this file.
4. **Write one HTML file per route.** Take the built index document, replace the root element's content with the rendered markup, and replace the head tags for that route: title, description, canonical, and the social preview title, description and URL. Escape the values. Insert with a function, not a pattern replacement, so a price such as "$99" in the content is not read as a replacement token.
5. **Make the build fail on a bad page.** For each route assert, on the visible text:
   - a minimum word count, high enough that a loading state cannot pass
   - the strings that must be present
   - for pricing, a minimum number of distinct prices
   A page that rendered as "Loading" must stop the release, not ship.
6. **Keep the app working.** The client should mount over the static markup as before. Check the route in a browser with scripts on: no flash of wrong content, no console errors, links and buttons live.
7. **Check the hosting rule.** Static files must be served ahead of the fallback to the app shell. Confirm the route list in the render step matches real routes in the hosting config, and test that with a unit test so the two cannot drift.
8. **Verify after deploy.** Repeat step 1 against production and compare with the before state. Check that a route outside the list still loads.

## Rules

- The static page must show the same content a browser user sees. Serving crawlers different content is cloaking.
- Prices and legal text come from the same components or data as the live page, never a second hand-written copy.
- Keep the route list short. Each prerendered page is something to keep true.
- This removes an obstacle to being read. It does not promise rankings or citations.
- Building and testing are in scope. Deploying needs the owner's go-ahead.

## Output

The before table, the list of files added or changed, the assertions per route, test and build results, and the after table from production once it is deployed. Note any public route left as an empty shell and why.
