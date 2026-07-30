<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# ICUC website

Marketing site for the India Clean-Up Confluence. Two routes: a long landing page
(`/`) and a contact page (`/contact`). Everything is statically prerendered — there
is no database, no API route and no auth.

Stack: Next.js 16 App Router (Turbopack), React 19, TypeScript, Tailwind CSS v4,
Motion (`motion/react`), `lucide-react` for icons.

## The rules that matter here

**The landing page is a chronology.** `src/app/page.tsx` runs `Cover` → `Hero` →
`Movement` (the Carter Clean Up beach clean-up we started) → `Confluence` (how that
became ICUC) → `Editions` (1.0 → 2.0 → 3.0) → everything else. That order is the
point of the page; the editions render straight out of the `editions` array in
source order, so reordering the array reorders history. Don't insert a section
between `Movement` and `Editions` that breaks the sequence.

`Cover` sits outside that chronology — it is a title card holding the ICUC 3.0 key
art full-bleed, which after about four seconds scrolls the page down to `Hero` on
its own. It is a normal section in the flow, not an overlay, so with JS off it
degrades to a picture you scroll past. The auto-scroll fires once, only from a
standing start at the top of the page, never under `prefers-reduced-motion`, and
stands down the moment the reader scrolls, taps or types — if you touch it, keep
all four of those true. While it holds, `data-intro` on `<html>` takes the header
off screen so nothing competes with the artwork; scrolling is deliberately left
unlocked, because the intro stands down on the first scroll and that has to work.
`/proposal` leads with the same card, inside `.theme-deck`. Since nothing opens on
the dark banner any more, `Header` no longer inverts to white nav text anywhere —
pale key art would swallow it, and by the time the banner is in view the page has
scrolled and the header is solid. Bring the inversion back if a route ever opens
on `Hero` again.

The key art appears exactly once, on `Cover`. `Hero` sits on `WaveField` instead —
a crop of the same illustration behind copy that already says the same words was
the third telling in two screens. `hero.image` still exists in `site.ts` because
`HeroSplit` on `/classic` boxes it beside the copy, where it works.

**Copy lives in `src/content/site.ts`, never in a component.** Headlines, stats,
edition details, changemaker names, gallery entries, partner logos, nav links,
contact details and the form's subject dropdown are all keyed objects in that one
file. If a change is "what the site says", it is a `site.ts` edit and nothing else.
Components read from it; they do not hardcode strings.

**Design tokens live in the `@theme` block of `src/app/globals.css`.** Tailwind v4
has no `tailwind.config.js` here. The palette is taken from the ICUC identity —
the sky-blue wave, the pale summit behind it, the green leaf: `sky` (with `-700`
`-600` `-300` `-100` `-50`), `deep`, `leaf`, `summit`, `mist`, `shell`, `ink`,
`muted`, plus `alert` for form validation. Each is a normal Tailwind color
(`bg-sky-100`, `text-sky-700`). Use these; do not introduce raw hex values or stock
Tailwind colors like `blue-600`.

`sky` and `sky-300` are bright fills — legible as text only on the `deep` bands.
Anything that has to be read on white or `mist` uses `sky-700`. `summit` is a
border and illustration colour, never a text colour.

Headings automatically get the display font and `ink` via a base-layer rule, so
don't re-apply `font-display` or a colour to an `h1`–`h4`. `.bg-skywash` is the
poster's cloudy sky gradient — it belongs to page tops (`Cover`, `/contact`, 404).
`.bg-deepwater` is its dark twin and belongs under white copy; it is the base of
`WaveField`, which draws the identity — deep water, a pale summit, the sky-blue
wave — as the `Hero` backdrop instead of a photograph. The swell loops off
`--animate-swell`, the one ambient keyframe here; it is weather rather than an
entrance, which is why it is linear and not on `EASE`.

**Images may not exist on disk.** The photo set is delivered after launch, so
`public/images/{hero,movement,editions,changemakers,gallery,partners}/` are
currently empty. Always render photos through `src/components/ui/SmartImage.tsx`,
which falls back to a themed gradient on error — never bare `next/image`. Real
`width`/`height` are required on every entry so the fallback reserves identical
space and dropping the file in later causes zero layout shift.

**Edition recaps degrade the same way.** Each past edition in `site.ts` carries a
`recap` with one film and an (optionally empty) photo strip. The after-movies are
self-hosted vertical clips in `public/videos/` — the source poster and any real
event photos come from those. `VideoEmbed` reads `recap.video.src`: a local file
(`/videos/*.mp4`) plays inline in a native `<video>`, anything else is treated as
an embed URL and loaded in an `<iframe>` — either way nothing mounts until a click,
so no player (and no embed cookie) loads for anyone who doesn't press play, and an
empty `src` renders a labelled placeholder. `portrait: true` frames a 9:16 film.
Photos live in `public/images/editions/<id>/`; an empty `photos: []` renders the
film alone. An edition that hasn't happened yet has `recap: null`.

The 2024/2025 after-movies were transcoded to 720p H.264 with `+faststart` (the
2024 original was 193 MB — far too big to serve statically). If you add a new film,
keep it web-sized the same way and don't commit multi-hundred-MB masters.

**Animation goes through `src/lib/motion.ts`.** Shared `riseIn` / `fadeIn` /
`stagger` variants, one `EASE` curve, one `VIEWPORT` config. Scroll reveals use the
`Reveal` wrapper, which already handles `prefers-reduced-motion`. Don't hand-roll
per-component transitions or a second easing curve.

**Client components are the exception.** Only things that genuinely need state or
effects carry `"use client"`: `SmartImage`, `Lightbox`, `PhotoStrip`, `VideoEmbed`,
`CountUp`, `Reveal`, `ContactForm`, `Header` (mobile nav), and the three interactive
sections `Cover`, `Hero` and `Gallery`. Every other section — `Movement`, `Confluence`,
`Editions`, `Stats`, `Changemakers`, `Partners`, `CtaBand` — is a server component
that composes client leaves. Keep it that way when adding a section.

## Contact form

Posts directly to [Web3Forms](https://web3forms.com) from the browser; there is no
server-side handler. The key comes from `NEXT_PUBLIC_WEB3FORMS_KEY`. It is a public
key by design — but that also means it must stay the *only* secret-shaped thing in
the client bundle. `.env.local` is not committed; see `.env.local.example`.

Submissions land in **IndiaCleanupConfluence@gmail.com**, and the only thing that
decides that is the access key — Web3Forms has no per-submission recipient field,
so the destination is a property of the key, not of this code. Changing where mail
goes means issuing a new key for the new address; there is nothing to edit here.
`replyto` is set to the sender so replying in the inbox reaches them directly.
`contact.email` in `site.ts` is the same address and is what the form's failure
messages tell people to fall back to — keep the two in step.

Test it in a browser, never with `curl`. Web3Forms rejects non-browser POSTs on the
free plan (`"This method is not allowed. Use our API in client side"`), so a failed
`curl` says nothing about whether the form works. A submission that reaches the
Web3Forms dashboard proves the key and the client path are fine; if no mail arrives
after that, the fault is in the Web3Forms account, not in this repo.

## Before you call it done

```bash
npx next build     # typechecks and prerenders all routes
npx eslint         # must be silent
```

Both are expected to pass clean. There is no test suite.
