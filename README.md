# ICUC — India Clean-Up Confluence

Marketing site for the India Clean-Up Confluence: a landing page and a contact page.

Built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4 and Motion.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

## Editing content

**All copy, stats, names and image references live in one file: [`src/content/site.ts`](src/content/site.ts).**
You should not need to touch a component to change what the site says.

| What you want to change | Edit |
| --- | --- |
| Headline, subtitle, hero CTAs | `hero` |
| "What is ICUC" text and the three pillars | `about` |
| Impact numbers | `stats` |
| Award winners / speakers | `changemakers` |
| Photo gallery | `gallery` |
| Partner logos | `partners` |
| Email, phone, socials, form dropdown | `contact` |
| Nav links | `nav` |

## Adding photos

1. Drop the file into the matching folder:

   ```
   public/images/hero/          hero.jpg              — full-bleed background, landscape, 2400×1600 or larger
   public/images/changemakers/  one.jpg, two.jpg …    — portraits, 4:5 (e.g. 800×1000)
   public/images/gallery/       01.jpg, 02.jpg …      — any aspect ratio, ~1600px on the long edge
   public/images/partners/      carter.png …          — logos, transparent PNG or SVG
   public/images/              og.jpg                 — social share card, exactly 1200×630
   ```

2. Add or update the matching entry in `src/content/site.ts`, including the real
   `width`/`height` in pixels and a descriptive `alt`.

Until a file exists at a given path, `SmartImage` renders a themed gradient placeholder
instead of a broken image — so the site always looks finished, and adding the real photo
causes zero layout shift. The gallery accepts any number of entries.

## Wiring up the contact form

The form posts to [Web3Forms](https://web3forms.com) — free, no backend, no database.

1. Get an access key at <https://web3forms.com> (enter the address that should receive
   submissions; the key arrives by email).
2. `cp .env.local.example .env.local` and fill it in:

   ```
   NEXT_PUBLIC_WEB3FORMS_KEY=your-access-key
   ```

3. Restart the dev server.

Without the key, the form validates normally but shows a clear "not connected yet" notice on
submit rather than silently failing. On Vercel, add the same variable under
**Project → Settings → Environment Variables**.

The form includes a honeypot field for spam and validates name, email and message client-side.

## Before going live

- [ ] Replace `site.url` in `src/content/site.ts` with the real domain (drives canonical URLs, OpenGraph and `sitemap.xml`).
- [ ] Replace the placeholder phone number and email in `contact`.
- [ ] Replace the placeholder social URLs.
- [ ] Fill in real changemaker names, roles and bios.
- [ ] Add `public/images/og.jpg` (1200×630) for link previews.
- [ ] Replace `src/app/favicon.ico`.

## Structure

```
src/
├─ app/                 routes: / and /contact, plus 404, sitemap, robots
├─ components/
│  ├─ layout/           Header (sticky, blurs on scroll), Footer, Logo
│  ├─ sections/         the landing page, one file per section
│  ├─ ui/               Reveal, SmartImage, Button, CountUp, Lightbox, SectionHeading
│  └─ contact/          ContactForm
├─ content/site.ts      ← all content
└─ lib/motion.ts        shared animation variants and easing
```

**Theme.** The palette, fonts and fluid type scale are defined in the `@theme` block at the
top of `src/app/globals.css` — change a colour there and it updates everywhere.

**Motion.** Scroll reveals fire once via `Reveal`. Everything checks
`prefers-reduced-motion` and degrades to a plain fade, with a CSS backstop at the bottom
of `globals.css`.

## Deploying

Push to GitHub and import into [Vercel](https://vercel.com) — no configuration needed. Set
`NEXT_PUBLIC_WEB3FORMS_KEY` in the project's environment variables.
