# restaurant-reservations-preview

The built browser preview of the reservations front desk. **Nothing is
developed here.** The source lives in the private `restaurant-reservations`
repo; this repo exists only because GitHub Pages will not serve a private
one.

- **`gh-pages`** — the build, and the only branch that is served.
- **`main`** — this file.

## The preview

<https://akinaykenar-design.github.io/restaurant-reservations-preview/>

Sign in with PIN **1234**. The guests' booking page is at
[`/book/`](https://akinaykenar-design.github.io/restaurant-reservations-preview/book/).

It is the real app, not a mock-up: `server.js`, `db.js`, `availability.js`,
`history.js`, `search.js`, `spend.js` and `sync.js` run unchanged inside a
browser shim that stands in for `require`, the file system and Express. So
what is wrong here is wrong in the restaurant. Data lives in the browser and
goes no further; a demo service is seeded on first open.

## Deploying

From a checkout of the source repo:

```
npm run preview          # writes into a checkout of this repo
git add -A && git commit -m "Preview build" && git push origin gh-pages
```
