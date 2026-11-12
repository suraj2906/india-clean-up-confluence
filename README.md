# ICUC — India Clean-Up Confluence

Marketing site for the India Clean-Up Confluence and the Carter Clean Up movement
it grew out of. Everything is statically prerendered — no database, no auth.

Built with Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4
and Motion.

> Working on the code? Read [`AGENTS.md`](AGENTS.md) first. It holds the rules this
> README only summarises, and the reasons behind them.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npx next build     # typechecks and prerenders every route
npx eslint         # must be silent
```

Both of the last two are expected to pass clean before a change ships. There is no
test suite.

## Routes

| Route              | What it is                                                              |
| ------------------ | ----------------------------------------------------------------------- |
| `/`                | The landing page — a chronology, from the movement to ICUC 3.0          |
| `/carter-clean-up` | The Carter Clean Up movement at full length                              |
| `/contact`         | General enquiries                                                        |
| `/privacy`         | The privacy policy                                                       |
| `/feedback`        | Post-event feedback, reached by QR code — `noindex`, not in nav or sitemap |
| `/proposal`        | The homepage at the URL shared with sponsors — `noindex`                 |
| `/classic`         | The homepage with the split hero — `noindex`                             |

`/`, `/proposal` and `/classic` render the same section list, so a section added to
one almost always belongs in all three.

There are no API routes.

`/register`, the ICUC 3.0 sign-up form, was removed once the event was over, along
with its confirmation-email route and templates; it is in git history if a future
edition wants it back. The path now redirects to `/` (see `next.config.ts`).

## Editing content

**All copy, stats, names and image references live in one file:
[`src/content/site.ts`](src/content/site.ts).** You should not need to touch a
component to change what the site says.

| What you want to change                          | Edit                                   |
| ------------------------------------------------ | -------------------------------------- |
| Event dates, venue, site URL                     | `site`                                 |
| Nav links (header, mobile drawer, footer)        | `nav`                                  |
| Opening key art, hero copy                       | `cover`, `hero`                        |
| The movement on the landing page + its carousel  | `movement`                             |
| The `/carter-clean-up` page                      | `carter`                               |
| How the movement became ICUC                     | `confluence`                           |
| Editions 1.0 → 3.0, recaps and films             | `editionsSection`, `editions`          |
| The ICUC 3.0 section and its photos             | `icuc3`                                |
| Impact numbers                                   | `statsSection`, `stats`                |
| Photo gallery                                    | `gallerySection`, `gallery`            |
| Partner logos                                    | `partners`                             |
| Closing call to action                           | `cta`                                  |
| Contact details and the form's subject dropdown  | `contact`                              |
| Feedback questions                               | `feedback`                             |
| Privacy policy                                   | `privacy`                              |
| 404 page                                         | `notFound`                             |

`changemakers` exists but is commented out of the pages and `nav` until the real
names and portraits arrive.

A question's `name` in `feedback` becomes a column header in the
Google Sheet, so it is frozen once the first answer arrives — add a new question
rather than renaming one.

## Adding photos and films

Drop the file into the matching folder under `public/`, then add or update its
entry in `site.ts` with the real `width`/`height` in pixels and an `alt` that
describes only what is plainly visible.

```
public/images/movement/      the carousel shared by / and /carter-clean-up
public/images/carter/        founder portraits
public/images/editions/<id>/ recap posters and photos for a past edition
public/images/gallery/       the gallery grid
public/images/partners/      logos
public/images/changemakers/  portraits (section currently hidden)
public/images/og.jpg         social share card, 1200×630 — still missing
public/videos/               self-hosted films, 720p H.264 with +faststart
public/pdfs/                 the ICUC 3.0 schedule (no longer linked; old mails point at it)
```

Until a file exists at a given path, `SmartImage` renders a themed gradient
placeholder instead of a broken image, so adding the real photo later causes zero
layout shift. Gallery photos are processed with `sharp` — auto-rotate first, then
longest edge 2000px, JPEG q80 — and `AGENTS.md` has the film encoding settings.

## Environment

Copy `.env.local.example` to `.env.local` (not committed) and fill it in. Set the
same variables in Vercel under **Project → Settings → Environment Variables**, then
redeploy — `NEXT_PUBLIC_*` values are baked in at build time.

| Variable                         | Used by                                                     |
| -------------------------------- | ----------------------------------------------------------- |
| `NEXT_PUBLIC_WEB3FORMS_KEY`      | `/contact` — mail to IndiaCleanupConfluence@gmail.com       |
| `NEXT_PUBLIC_FEEDBACK_ENDPOINT`  | `/feedback` — the feedback Google Sheet                     |

Every form degrades without its variable: it says it isn't connected rather than
failing silently. Feedback goes to its sheet only.

Test the forms in a browser, never with `curl` — Web3Forms rejects non-browser
posts on the free plan.

The two Google Sheets are written by Apps Script Web Apps in `scripts/`. Deploy
steps, tab layout and what the scripts refuse are in
[`scripts/README.md`](scripts/README.md).

## Structure

```
src/
├─ app/                 routes, plus 404, sitemap, robots, icons
├─ components/
│  ├─ layout/           Header, Footer, Logo
│  ├─ sections/         the landing page, one file per section
│  │  └─ carter/        the /carter-clean-up sections
│  ├─ ui/               SmartImage, Reveal, Carousel, PhotoGrid, Lightbox, WaveField, ShoreField …
│  ├─ contact/          ContactForm
│  └─ feedback/         FeedbackForm
├─ content/site.ts      ← all content
└─ lib/
   ├─ motion.ts         shared animation variants, EASE / SPRING / DRIFT
   └─ waves.ts          the one set of curves every water drawing uses
scripts/
├─ registrations.gs     Apps Script for the ICUC 3.0 registrations sheet (form retired)
└─ feedback.gs          Apps Script for the feedback sheet
```

**Theme.** Tokens live in the `@theme` block of `src/app/globals.css`. The site runs
on the ICUC 3.0 pitch deck's palette via `.theme-deck` on `<body>`, which reassigns
those same tokens — read the comment above that class before changing a colour.

**Motion.** Everything goes through `src/lib/motion.ts` and the `Reveal` wrapper, and
respects `prefers-reduced-motion`.

## Still to do

- [ ] Add `public/images/og.jpg` (1200×630) for link previews.
- [ ] Fill in real changemakers and their portraits, then uncomment the section.
- [ ] Replace the drafted founder bios in `carter` with the founders' own words.

## Deploying

Hosted on [Vercel](https://vercel.com) — push to GitHub and it builds with no extra
configuration. Set the environment variables above in the project settings.
