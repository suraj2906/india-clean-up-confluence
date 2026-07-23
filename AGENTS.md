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

**Copy lives in `src/content/site.ts`, never in a component.** Headlines, stats,
changemaker names, gallery entries, partner logos, nav links, contact details and
the form's subject dropdown are all keyed objects in that one file. If a change is
"what the site says", it is a `site.ts` edit and nothing else. Components read from
it; they do not hardcode strings.

**Design tokens live in the `@theme` block of `src/app/globals.css`.** Tailwind v4
has no `tailwind.config.js` here. The palette is "coast & canopy" — `forest`,
`leaf`, `ocean`, `marigold`, `sand`, `shell`, `ink`, `muted`, each usable as a
normal Tailwind color (`bg-leaf-100`, `text-forest`). Use these; do not introduce
raw hex values or stock Tailwind colors like `green-600`. Headings automatically
get the display font via a base-layer rule, so don't re-apply `font-display` to an
`h1`–`h4`.

**Images may not exist on disk.** The photo set is delivered after launch, so
`public/images/{hero,changemakers,gallery,partners}/` are currently empty. Always
render photos through `src/components/ui/SmartImage.tsx`, which falls back to a
themed gradient on error — never bare `next/image`. Real `width`/`height` are
required on every entry so the fallback reserves identical space and dropping the
file in later causes zero layout shift.

**Animation goes through `src/lib/motion.ts`.** Shared `riseIn` / `fadeIn` /
`stagger` variants, one `EASE` curve, one `VIEWPORT` config. Scroll reveals use the
`Reveal` wrapper, which already handles `prefers-reduced-motion`. Don't hand-roll
per-component transitions or a second easing curve.

**Client components are the exception.** Only things that genuinely need state or
effects carry `"use client"`: `SmartImage`, `Lightbox`, `CountUp`, `Reveal`,
`ContactForm`, `Header` (mobile nav), and the two interactive sections `Hero` and
`Gallery`. Every other section — `About`, `Stats`, `Changemakers`, `Partners`,
`CtaBand` — is a server component that composes client leaves. Keep it that way
when adding a section.

## Contact form

Posts directly to [Web3Forms](https://web3forms.com) from the browser; there is no
server-side handler. The key comes from `NEXT_PUBLIC_WEB3FORMS_KEY`. It is a public
key by design — but that also means it must stay the *only* secret-shaped thing in
the client bundle. `.env.local` is not committed; see `.env.local.example`.

## Before you call it done

```bash
npx next build     # typechecks and prerenders all routes
npx eslint         # must be silent
```

Both are expected to pass clean. There is no test suite.
