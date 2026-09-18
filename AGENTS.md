<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# ICUC website

Marketing site for the India Clean-Up Confluence. Everything is statically
prerendered — there is no database and no auth, and exactly one API route:
`/api/register/confirm`, which emails registrants their confirmation. That route
is currently dormant: the form's call to it is commented out (see Confirmation
emails below).

Six routes plus a 404. `/` is the long landing page, `/carter-clean-up` is the
movement's own page, `/register` takes sign-ups for ICUC 3.0 and `/contact` is
the general enquiry form. The last two are `noindex` previews
kept alive on purpose: `/proposal` (the homepage at the URL already shared with
sponsors) and `/classic` (the homepage with `HeroSplit` in place of `Hero`).
Those three homepage-shaped routes render the *same* section list in the same
order, so a section added to `page.tsx` almost always has to be added to
`/proposal` and `/classic` as well.

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
`/proposal` leads with the same card. Since nothing opens on the dark banner any
more, `Header` no longer inverts to white nav text anywhere — pale key art would
swallow it, and by the time the banner is in view the page has scrolled and the
header is solid. Bring the inversion back if a route ever opens on `Hero` again.

The header's own logo is faded out for as long as the key art's "ICUC 3.0"
wordmark sits below the header: the artwork carries the mark there, so a second
copy in the header prints it twice. `Cover` marks that wordmark's height with the
empty `#cover-wordmark` line — mid-frame on the wide cut, near the top on the
portrait one — and `Header` measures it against its own 80px strip on every
scroll, cross-fading the mark in and out in both directions. Routes with no
`#cover-wordmark` (contact, `/classic`, 404) simply always show it. The
percentages are eyeballed against the artwork, since `object-cover` crops per
viewport; move them if the handover lands early or late, and keep the id.
There is no call-to-action button in the header; `CtaBand` and the footer are the
route to `/contact`.

The key art appears exactly once, on `Cover`. `Hero` sits on `WaveField` instead —
a crop of the same illustration behind copy that already says the same words was
the third telling in two screens. `hero.image` still exists in `site.ts` because
`HeroSplit` on `/classic` boxes it beside the copy, where it works.

`Changemakers` is currently commented out of all three homepage routes and of
`nav`. Three of its four entries are still `Changemaker One`/`Two`/`Four`
placeholders with no portrait on disk, and a wall of placeholder people read
worse than no section at all. Nothing was deleted: fill in `changemakers` in
`site.ts`, drop the portraits into `public/images/changemakers/`, and uncomment
the four lines (`page.tsx`, `/proposal`, `/classic`, `nav`) to bring it back.

**`/carter-clean-up` is chapter one at full length.** `Movement` on the landing
page has to stay short — it is one beat of the ICUC chronology — so the movement
gets its own route: `CarterHero` → `CarterStory` → `CarterNumbers` →
`CarterFounders` → `CarterPhotos` → `Partners` → `CarterCta`, every one of them
reading from the `carter` export in `site.ts`. Two things are shared on purpose
and should stay shared. `CarterPhotos` renders `movement.carousel` rather than a
second array, so a photo dropped in there appears in both places; and the page
runs the landing page's own `Partners` row over the same `partners.items`,
passing only its headings (`carter.partners`) — the row takes
`eyebrow`/`title`/`intro` props for exactly that reason. The founder bios carry
`TODO`s: they were drafted from public profiles and are waiting on the founders'
own words. Don't quietly promote them to fact. There is no `Cover` on this route,
so the header shows its logo throughout.

**`Carousel` is the one photo strip that moves on its own**, and it is what both
`Movement` and `CarterPhotos` render. Native scroll-snap does the moving; the
arrows and the autoplay only set the track's scroll offset, so touch swiping
comes free. The loop is seamless via cloned edges — the last photo is rendered
before the first and the first after the last — so "next" off the end scrolls
forward into a copy rather than rewinding through the whole strip. There is
deliberately **no click-and-drag**: it was tried and removed, because drag and
click compete for the same pointer on the same element, so a drag would open the
lightbox on the slide it started from. Read the component's header comment before
touching the scroll handling.

**The ICUC 3.0 dates and venue are fixed and live in one place.** `site.dates`
("19th & 20th September 2026"), `site.datesLong` ("Saturday 19th – Sunday 20th
September 2026") and `site.venue` ("India Habitat, New Delhi") are read by the
edition entry and by the registration page's copy, so neither can drift between
two screens. The venue is confirmed and prints straight after the dates wherever
they appear — it is no longer "to be announced" anywhere, including on the ICUC
3.0 edition entry. The key art's `alt` text still says only "September 2026"
because it transcribes what the artwork itself prints; re-cut the artwork before
changing that line.

There is no phone number on the site. `contact.phone` held a `+91 00000 00000`
placeholder that read as a real number, so the field and both rows that rendered
it (the contact page, the footer) are gone. Email is the only published route in.
Add the field and the rows back the day there is a number worth printing.

**Copy lives in `src/content/site.ts`, never in a component.** Headlines, stats,
edition details, changemaker names, gallery entries, partner logos, nav links,
contact details and the form's subject dropdown are all keyed objects in that one
file. If a change is "what the site says", it is a `site.ts` edit and nothing else.
Components read from it; they do not hardcode strings.

**The site runs on the ICUC 3.0 pitch deck's palette.** `.theme-deck` in
`globals.css` — originally a `/proposal`-only reskin — now sits on `<body>` in
`layout.tsx`, so every route inherits it and `/proposal` is just the homepage at a
second, unindexed URL. The class redefines the same `--color-*` tokens the
`@theme` block below declares, and it swaps *roles*, not hues: `sky-*` is the
deck's green, `leaf-*` its blue, `shell`/`mist` a pale cyan rather than white.
Read the comment above the class before touching a colour. Removing that one class
from `<body>` reverts the whole site to the identity palette.

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
`--animate-swell`; it is weather rather than an entrance, which is why it is
linear and not on `EASE`.

The site draws its water rather than photographing it, and every drawing comes
off one set of curves in `src/lib/waves.ts` — several components tracing subtly
different seas would read as a mistake. `WaveField` is the deep-water version,
for white copy on a dark band (`Hero`). `ShoreField` is its daylight twin for
`ink` copy on `bg-skywash` — headland, sea, pale beach, mangroves at both edges —
and carries `CarterHero` and the 404; its front layer is `shell`, so the picture
runs out into whatever sits below instead of ending on a line. Both are plain
markup, so the scenery costs no client JavaScript. `DriftingLitter` on the 404 is
the one exception: three sweepable pieces of litter that ride `ShoreField`'s
`sea` band, deriving their bob from the same constants rather than eyeballing the
curve — so moving a wave moves the litter with it.

**Images may not exist on disk.** The photo set arrives in batches, so at any
moment some paths in `site.ts` point at nothing. As of the last pass the gallery
(nineteen photos plus a video poster), the partner wall (fifteen logos),
`movement/carousel` (six), the edition recap posters, the key art and two founder
portraits are all real files on disk; `changemakers/{one,two,four}.jpg` and the
OG image (`/images/og.jpg`, referenced from `layout.tsx`) are still missing. That
list will keep changing — the rule below is what does not. Always render photos
through `src/components/ui/SmartImage.tsx`, which falls back to a themed gradient
on error — never bare `next/image`. Real `width`/`height` are required on every
entry so the fallback reserves identical space and dropping the file in later
causes zero layout shift.

**Edition recaps degrade the same way.** Each past edition in `site.ts` carries a
`recap` with a list of films and an (optionally empty) photo strip. The films are
self-hosted vertical clips in `public/videos/` — the poster frames are pulled from
those. `VideoEmbed` reads each `src`: a local file (`/videos/*.mp4`) plays inline
in a native `<video>`, anything else is treated as an embed URL and loaded in an
`<iframe>` — either way nothing mounts until a click, so no player (and no embed
cookie) loads for anyone who doesn't press play, and an empty `src` renders a
labelled placeholder. `portrait: true` frames a 9:16 film. Photos live in
`public/images/editions/<id>/`; an empty `photos: []` renders the films alone. An
edition that hasn't happened yet has `recap: null`.

`recap.videos` is a **list**, rendered in source order, and the first entry is the
one that reads as *the* after-movie — so don't reorder it to put a shorter cut
first. ICUC 2.0 carries two (the after-movie and a separate testimonial reel);
ICUC 1.0 carries one. Every tile prints its own title underneath, which is what
distinguishes two cuts of the same edition — keep the titles doing real work.
An edition with no footage gets `videos: []`, not a film with a blank `src`.

All three films came off Instagram and are **re-hosted, not embedded** — an embed
would load Meta's player and its cookies, and would break the day a post is
archived. Provenance matters when re-cutting them: the ICUC 2.0 pair are
[@cartercleanup](https://www.instagram.com/cartercleanup/)'s own, but the ICUC 1.0
film is **@greenmyna's** "ICUC24 Compliments" reel, used with permission. It is
not ours to re-caption.

Films are transcoded to 720p H.264 with `+faststart` (`scale=720:-2`, `-crf 27`)
and kept in the ~10–15 MB range. Two rules learned the hard way: check the output
is actually *smaller* than the input — CRF 23 on high-motion footage came out
larger than the source — and if a source is already 720p H.264 at a sane bitrate,
remux with `-c copy -movflags +faststart` rather than re-encoding it into a second
generation of artefacts. Don't commit multi-hundred-MB masters.

**The gallery is a uniform grid, and that is a decision, not a default.** It once
used CSS `column-count`, which fills column one top-to-bottom before starting
column two — fine at six photos, incoherent at twenty, because item 2 lands under
item 1 and the reading order stops matching `site.ts`. It is now
`grid-cols-2 / sm:3 / lg:4` with every tile in an `aspect-4/3` cell. Equal cells
are what make a large set read as curated: the ragged rhythm of masonry is what
looks like clutter, not the number of photos. Tiles crop, and that is the trade —
every tile opens `Lightbox`, which shows the photo whole.

Twelve tiles show, the rest sit behind a "Show more" button, and the batch is
keyed so newly revealed tiles run their own stagger. Two things to keep true if
you touch it: `Lightbox` receives the **whole** array rather than the visible
slice, so arrow keys and swipe walk all of it and indices survive expansion; and
`sizes` tracks the column count — the old `100vw` on a two-column phone grid
fetched images twice as wide as any slot they could land in. Use `Stagger` /
`StaggerItem` from `Reveal.tsx`, never a hand-computed `delay={i * 0.0x}`.

**One tile in that grid is a film, and the array is typed for it.** `gallery` is
`Array<(Img & { caption?: string }) | GalleryVideo>`; an entry carrying
`type: "video"` renders `HoverVideo` instead of a photo button — a muted, looping
preview on hover or focus that hands off to `Lightbox`, with sound and controls,
on click. That is the same click-to-expand contract every photo tile has, which
is the point: the tile is not a second kind of thing to the reader. `Lightbox`
takes both kinds. Two traps worth knowing: a film's alt text lives on
`poster.alt` rather than on the item itself, and `HoverVideo` must be passed
`h-full` and never `absolute inset-0` — its button is already `relative`,
Tailwind emits `.relative` after `.absolute`, and the tile collapses to nothing.

Gallery photos are processed from the original camera JPEGs with `sharp`:
**`.rotate()` first**, then longest edge 2000px, JPEG q80 `mozjpeg`, metadata
dropped. The order matters — six of the nineteen carried `orientation=8`, and
stripping EXIF without auto-rotating first publishes them silently sideways. That
run took ~150 MB of originals to 4.4 MB. The originals are not committed.

`alt` is mandatory on every entry — it replaces the picture entirely for a screen
reader — and it should describe only what is plainly visible. **`caption` is
optional, and the photographs deliberately have none.** A first pass was written
by reading thumbnails and misidentified what was happening in them; a confidently
wrong label on a photo of real people is worse than no label. Both the grid and
`Lightbox` handle a missing caption, so leave them off until someone who was in
the room writes them. Don't infer captions from the images.

**Animation goes through `src/lib/motion.ts`.** Shared `riseIn` / `fadeIn` /
`stagger` variants, one `EASE` curve, one `VIEWPORT` config. Scroll reveals use the
`Reveal` wrapper, which already handles `prefers-reduced-motion`. Don't hand-roll
per-component transitions or a second easing curve.

There are exactly two sanctioned escapes from `EASE`, both in that same file.
`SPRING` is for anything a scroll or a pointer drives, where the end point keeps
moving and a fixed duration would fight it. `DRIFT` is the linear infinite loop
for ambient motion — the same category as the `swell`, `marquee` and `float`
keyframes in `globals.css`, and linear for the same reason: those keyframes
already carry the shape of the cycle, and `EASE` is a decelerating *arrival*
curve, which reads wrong on something that never arrives. Anything that does
arrive still takes `EASE`.

Two scroll-driven hairlines exist, and both are transform-only. `ScrollProgress`
sits under the header — how far down the document you are, since phones show no
scrollbar and the landing page is long — and springs the raw progress value,
because a trackpad flick moves it in visible steps. It renders nothing at all
under reduced motion. `TimelineRail` draws the editions chronology in as you read
down it, over a static low-opacity track so the list never looks truncated; under
reduced motion it simply renders complete. `TimelineRail` is also why `Editions`
can stay a server component — the scroll-driven part is pushed into a client
leaf. Copy that arrangement.

**Client components are the exception.** Only things that genuinely need state or
effects carry `"use client"`: `SmartImage`, `Lightbox`, `PhotoStrip`, `Carousel`,
`VideoEmbed`, `HoverVideo`, `CountUp`, `Reveal`, `ScrollProgress`, `TimelineRail`,
`DriftingLitter`, `ContactForm`, `Header` (mobile nav), and the interactive
sections `Cover`, `Hero`, `HeroSplit` and `Gallery`. Every other section —
`Movement`, `Confluence`, `Editions`, `Stats`, `Changemakers`, `Partners`,
`CtaBand` and all six `carter/*` sections — is a server component that composes
client leaves.

Note what is *not* a client component even though it moves: `Partners`' marquee,
`WaveField` and `ShoreField` are markup plus a CSS animation and nothing else.
Reach for `"use client"` when there is state or an effect, not when there is
motion. Keep it that way when adding a section.

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

## Registration

`/register` is the sign-up form for ICUC 3.0 and it is **one form for everyone** —
volunteers, NGOs, corporates, students, civic bodies, press.

**It posts to two destinations at once, and that is on purpose.** The Google
Sheet is the record: an Apps Script Web App (`scripts/registrations.gs`, deployed
per `scripts/README.md`, URL in `NEXT_PUBLIC_SHEETS_ENDPOINT`) appends one row per
registration. Web3Forms is kept alongside it on the same key and therefore the
same inbox as `ContactForm`, as the copy that survives a revoked or broken
deployment. A registration counts as captured if **either** accepted it — that is
the whole reason both are there — so a half failure is a `console.warn` and only
losing both is an error the registrant sees. Don't collapse this to one
destination without deciding which failure you are willing to lose people to.
Everything in the contact-form section above still applies, including testing in
a browser rather than with `curl` — and the Apps Script leg has the same property
for its own reason: it is posted as `text/plain` so the browser treats it as a
CORS simple request, because an Apps Script Web App redirects to a second origin
before `doPost` runs and cannot answer a preflight. Don't 'fix' that content type.

**The sheet has three tabs and the split happens at write time.** The payload's
`sheet` field is a *list*, and every name in it gets the same row. `one_mentor`
and `general` are the primary pair — a registration lands on exactly one of them:
pitch applicants and their answers on the One Mentor, Many Missions tab (the programme is now called Mentor Matchmaker on the site, but the tab and `TABS` in `registrations.gs` keep the old name on purpose so the live sheet keeps writing to the same tab), everyone
else on the general one. `red_fort` is added *alongside* whichever of those two
applies, so a Red Fort clean-up tick writes a copy rather than diverting the row.
The two questions are unrelated — an NGO can apply to pitch and also turn up to
the clean-up — and neither list is complete if one tick can take somebody off the
other. Each panel then opens one tab and reads nothing else, and general
registrations are not diluted by a column per application question. The script
aligns each row to the header row and appends a column the first time it meets a
key it has no header for, so adding a question is still a `site.ts` edit and
nothing else — but never reorder or rename a header by hand once rows exist.
Adding a *tab* is the exception: tab names live in `TABS` in `registrations.gs`,
so that one needs a script edit and a redeploy.

**Applications to Mentor Matchmaker are closed** (`oneMentor.open: false`). The
tick box, explainer and questions are gone from the form; choosing the NGO type
shows `oneMentor.closed` in their place, and the route refuses to send the pitch
email. Everything described below is still in the code and the copy, so flipping
that one flag reopens it exactly as it was.

It carries a second form inside it. **Mentor Matchmaker** is a pitch
session: NGOs that want to scale into a business apply through this same form, five
are selected from everyone who applies, those five give an elevator pitch to a panel
of seven mentors at the event, and **each of the five NGOs is paired one-on-one with
a mentor who keeps working with them afterwards**, while the other two, both design
mentors, work with all five. The pairing is the outcome
the whole track is for, so it gets its own beat in `oneMentor.steps` rather than a clause inside
the pitch step — buried, it is the thing applicants miss. There is deliberately no
second application form and no separate page — a shortlist people can apply to
twice is a shortlist somebody has to de-duplicate by hand.

**That track reveals itself in two stages, and both are inside the form.**
Choosing `registration.ngoType` ("NGO or clean-up movement") in the "I'm
registering as" dropdown unfolds the explanation — what the session is, and the
four steps from applying to being mentored — directly above the tick box it
explains. Ticking the box opens the application questions, and also unfolds that
same explanation if the dropdown never said NGO: someone who ticks first and
reads later is precisely the person who needs telling what they just applied to.
The explainer was originally a section *under* the form and was moved for a plain reason: nobody
scrolls past a form they came to fill in, so an explainer below it is an
explainer nobody reads. Don't put a second copy back on the page. Two things to
keep true: `ngoType` has to match one of `attendeeTypes` character for character
or the pitch session silently stops explaining itself to the people it is for,
and the tick box stays visible for every other kind of registrant — someone who
runs an NGO but registers as an individual still has to be able to find it.

**The pitch questions live in `registration.oneMentor.questions`** and nowhere
else — the form renders whatever is in that list, in order, and validates every
non-`optional` one. They are grouped in four movements: who you are (verification
only), where you are now (the honesty check), the pitch itself, and logistics.
Only the third group is what the five are chosen on, so if the application ever
has to get shorter, cut from the bottom, never from the pitch block. The pitch
block now closes on `pitch_expectations` — what the applicant wants from the
mentorship — because every one of the five leaves with a mentor, which makes that part
of what the panel is picking on rather than an afterthought.

**A question's `name` is frozen the moment the first application arrives.** It is
what labels the answer in the inbox *and* the column heading in the sheet, so
renaming one later leaves two batches of submissions that no longer line up, and
an orphaned column beside a new one — add a new question instead. Settle the
wording before the form is shared anywhere.

**The second tick box is the Red Fort clean-up, and it is a head count rather
than an application.** `registration.redFort` is two lines of copy — a question
and a hint — and that is the whole feature: nobody is selected, nothing further
opens, and the answer rides along as the `red_fort_clean_up` column on whichever
primary tab the row lands on as well as on its own tab. It is deliberately flat
where Mentor Matchmaker unfolds; a second expanding panel beside it would make the form
read as two applications stacked on each other. Its `hint` carries the date
and the 7:15am start; the location, nearest metro and meeting point go out in the
confirmation email instead, from `registration.emails.confirmation.redFort`, and
only to people who ticked the box.

If the list is ever emptied, the revealed block falls back to `oneMentor.pending`
and the registration still submits, flagged in the subject line, in the
`one_mentor_many_missions` field and by landing on the pitch tab. Leave `pending`
in place: it is the fallback for an empty list, not a temporary notice.

TODO: the current questions are a draft written to make the form usable. The
wording is Freishia's call — she is the one who knows what the mentor panel needs
in order to pick five out of the pile, and to pair each with a mentor. Review with
her before this is shared.

`CtaBand` at the foot of the landing page now leads with `/register` and keeps
`/contact` as the quieter second button, and `Register` is an entry in `nav`, so
it appears in the desktop bar, the mobile drawer and the footer. That is a nav
*link*, not a button — the header still has no call-to-action button in it.

## Feedback

`/feedback` is the ICUC 3.0 feedback form for people who were there. Attendees
reach it by scanning a QR code for `https://www.icuc.co.in/feedback`, so it is
built phone-first (every tap target is at least 44px), it is `noindex, nofollow`,
and it is deliberately in neither `nav` nor the sitemap. Name and email are both
optional: feedback can be anonymous.

**The questions live in `feedback.questions` in `site.ts`** and nowhere else.
`FeedbackForm` renders the list in order and validates every non-`optional`
entry; `FeedbackQuestion` supports `text`, `textarea`, `rating` (five buttons, 1
to 5, with optional `lowLabel`/`highLabel`), `choice` (one of `options`) and
`multi` (any of `options`). The three questions there now are placeholders
marked `TODO`: replace them before the QR code goes anywhere.

**A question's `name` is frozen once the first answer arrives**, for the same
reason as registration: it is the sheet's column header and the inbox label.
Settle the names before sharing; afterwards, add a question rather than rename
one. Rewording a `choice`/`multi` option splits its answers in the sheet too.

It posts to **two destinations, like registration**, and counts as captured if
either accepts: an Apps Script Web App writing the feedback sheet (URL in
`NEXT_PUBLIC_FEEDBACK_ENDPOINT`, a separate deployment from registrations,
posted as `text/plain` for the same CORS reason), and Web3Forms on the shared
key with the subject `ICUC 3.0 feedback`. Unset endpoint means skipped, not
failed. A honeypot hit shows success and posts nowhere.

**The payload is a contract with the Apps Script** and must not drift: a flat
JSON object of strings, `submitted_at` (ISO timestamp), `name`, `email` (empty
string if not given), then one key per question, keyed by its `name`. `rating`
is `"1"` to `"5"`, `choice` the chosen option's text, `multi` the chosen options
joined with `", "`, and an unanswered optional question `""`. No nesting, no
arrays, no other keys (`botcheck` is never sent). Web3Forms gets the same
fields plus its own `access_key`, `subject`, `from_name` and `replyto`.

## Confirmation emails

**Automatic emails are switched off.** The `sendConfirmation` call in
`RegistrationForm` is commented out, so a registration now reaches the sheet and
Web3Forms and nothing else: ICUC 3.0 is under way, everyone registered has the
schedule, and a late registrant does not need a "see you there" mail about an
event running today. The route, the templates and the copy are all still here,
so uncommenting that one line turns them back on. Everything below describes how
it works when it is on.

After a registration is captured, `RegistrationForm` fires (and does not await)
a POST to `src/app/api/register/confirm/route.ts`, which sends mail over plain
SMTP with a Gmail app password via `nodemailer` — deliberately no third-party
mail service. Credentials are server-only `SMTP_*` variables; see
`.env.local.example`, and never give them a `NEXT_PUBLIC_` prefix. Unset means
no email, not a failed registration.

Everyone gets the confirmation, with a clear download button for
`registration.emails.schedule` (the ICUC 3.0 schedule in `public/pdfs/`). Pitch applicants also get a **separate**
Mentor Matchmaker email whose headline block says it is a mentorship
with no promise of capital. That line is the reason the second email exists —
keep it in its highlighted block near the top, never in the small print.

Copy lives in `registration.emails` in `site.ts`; markup lives in
`src/lib/email/templates.ts`, the one file allowed table layouts, inline styles
and raw hex (mirrored from `.theme-deck`, because mail clients have no CSS
variables).

**The first sends went to spam, and the mail is shaped by that.** Nothing is
attached: the schedule is a download button linking to the PDF on the site,
because a multi-megabyte attachment from a sender Gmail doesn't yet trust is one
of the strongest spam signals. There are no icons or emoji (images-to-text ratio
counts against you, and emoji rendered badly anyway), and links are written out
in full rather than through shorteners like maps.app.goo.gl, which filters
distrust. Keep it that way. The real fix for deliverability is sending from an
address on icuc.co.in with SPF, DKIM and DMARC set up in DNS; a free @gmail.com
account sending automated mail will always be treated with some suspicion.

The schedule was re-encoded from 18 MB to 4.75 MB (JPEG q92, 4:4:4 chroma, native
resolution, transparency masks left lossless; every page renders at 48-50 dB PSNR
against the original) and a new export should get the same treatment, since
registrants now download it. The route only sends its own fixed templates,
rejects cross-origin posts and rate-limits in memory, which slows abuse on
serverless rather than preventing it.

`scripts/send-countdown.ts` is the one-off "2 days to go" send, run by hand from
a machine with `.env.local`: `--test <email>` for a single copy, or `--list
people.csv --log sent.txt` to walk a list one message at a time. It appends every
address it sends to, and skips anything already in that log, so a run stopped by
a dropped connection resumes without double-sending. The list and the log are
registrants' data: keep both out of the repo.

## Before you call it done

```bash
npx next build     # typechecks and prerenders all routes
npx eslint         # must be silent
```

Both are expected to pass clean. There is no test suite.

**Do not drive the browser to check your work.** Claude in Chrome is off limits
unless the maintainer explicitly asks for it in that message. Run the two commands
above, then say what you changed and ask them to look at it — they have the site
open already, and a browser session that has to be driven blind is slower and less
reliable than the person who can just see it. Screenshots taken through a
backgrounded window are worse than useless: `requestAnimationFrame` stops, CSS
animations freeze at their first frame, and every "it isn't animating" reading you
take is a lie about the code.
