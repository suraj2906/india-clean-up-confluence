/**
 * Every piece of copy, every image reference, every link on the site lives here.
 *
 * The page tells one story in order: the beach clean-up movement we started →
 * how that turned into ICUC → 1.0 → 2.0 → 3.0. If you reorder anything, keep
 * that chronology intact.
 *
 * To add a photo: drop the file into the matching folder under `public/images/`
 * and add an entry to the relevant array below. No component needs to change —
 * until a file exists at the given path, <SmartImage> renders a themed placeholder.
 */

export type Img = {
  src: string;
  alt: string;
  /** Intrinsic pixel size. Used to reserve space so nothing shifts as photos load. */
  width: number;
  height: number;
};

/**
 * One film in an edition's recap. See the `editions` comment below for what a
 * `src` may be — a local file plays inline, anything else is an embed URL.
 */
export type RecapVideo = {
  src: string;
  title: string;
  poster: Img;
  /** Frame a vertical (9:16) film instead of the default 16:9. */
  portrait?: boolean;
};

export const site = {
  name: "ICUC",
  fullName: "India Clean-Up Confluence",
  /**
   * The LLP exactly as it is registered, capitalisation and all. It is not the
   * name the site calls itself — `fullName` is — and it belongs only where the
   * legal entity has to be identified: the privacy policy's "Contact us" block
   * and anything else a regulator or a platform reviewer reads. Don't reach for
   * it in ordinary copy.
   */
  legalName: "INDIA CLEANUP CONFLUENCE (ICUC) LLP",
  tagline: "One Nation, Many Missions",
  description:
    "India's national platform uniting clean-up movements, grassroots changemakers, corporates and policymakers behind scalable environmental action.",
  /** The live domain. Read by `metadataBase`, every canonical, robots.txt and the sitemap. */
  url: "https://icuc.co.in",
  /**
   * ICUC 3.0, fixed: Saturday 19th and Sunday 20th September 2026, at India
   * Habitat, New Delhi. Every place the dates or the venue are printed reads
   * them from here, so there is one line to change if either ever moves and
   * neither can drift between two screens.
   */
  dates: "19th & 20th September 2026",
  datesLong: "Saturday 19th – Sunday 20th September 2026",
  /**
   * Confirmed, and printed straight after the dates wherever they appear — the
   * ICUC 3.0 edition entry and the privacy policy read this rather than
   * repeating it.
   */
  venue: "India Habitat, New Delhi",
} as const;

/**
 * Rendered by both `Header` and `Footer`, so one entry here appears in three
 * places: the desktop bar, the mobile drawer and the footer's "Explore" list.
 * Every other item is a hash link into the landing page; Carter Clean Up is the
 * one entry that is a route of its own.
 */
export const nav = [
  { label: "Movement", href: "/#movement" },
  { label: "Carter Clean Up", href: "/carter-clean-up" },
  { label: "Editions", href: "/#editions" },
  { label: "Impact", href: "/#impact" },
  // { label: "Changemakers", href: "/#changemakers" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Support", href: "/support" },
] as const;

/**
 * The title card that holds the screen for a moment before the page walks itself
 * down to the hero. `Cover` renders it whole — no crop, no scrim — which is the
 * only place the key art reads the way it was designed to.
 *
 * The slide carries its own wording, so `alt` has to repeat it rather than
 * describe the picture.
 */
export const cover = {
  image: {
    src: "/images/hero/hero-icuc-3.png",
    alt: "ICUC 3.0 — India Clean-Up Confluence 2026. One nation, many missions — September 2026. A Carter Clean Up initiative.",
    width: 1920,
    height: 1080,
  } satisfies Img,
  /**
   * The same card restacked for portrait screens, shown instead of the wide one
   * below `landscape`. The slide puts the wordmark left and the illustration
   * right, so cropping it to a phone keeps the blank gutter between the two and
   * slices both — this cut stacks them, type over illustration.
   */
  imagePortrait: {
    src: "/images/hero/hero-icuc-3-portrait.png",
    alt: "ICUC 3.0 — India Clean-Up Confluence 2026. One nation, many missions — September 2026. A Carter Clean Up initiative.",
    width: 1080,
    height: 1920,
  } satisfies Img,
  /** The way past the wait, and the only way down for reduced-motion readers. */
  skip: "Enter",
};

export const hero = {
  eyebrow: "ICUC 3.0 — India Clean-Up Confluence",
  title: "One nation,\nmany missions",
  subtitle:
    "It started with one beach. It became a national confluence of everyone cleaning up India — coastlines, lakes, hills, streets. Bringing Cleanup Movements Under One roof.",
  /** The page's main action. ICUC 3.0 has happened and registration is closed,
      so "Get involved" means "write to us". */
  primaryCta: { label: "Get involved", href: "/contact" },
  secondaryCta: { label: "How it started", href: "/#movement" },
  /** The key art cropped to the illustration. Deliberately text-free: the H1 and
      the eyebrow are laid over it, and the full title card already ran above. */
  image: {
    src: "/images/hero/hero.jpg",
    alt: "Illustrated Delhi skyline — India Gate and the Qutub Minar ringed in green — with volunteers collecting waste along the riverbank",
    width: 2400,
    height: 1600,
  } satisfies Img,
};

/** Chapter one: the clean-up movement that everything else grew out of. */
export const movement = {
  eyebrow: "Where it began",
  title: "Our beach clean-up movement",
  lead: "Carter Clean Up — 3.5 km of Carter Road, Bandra, cleaned every Saturday since 2021.",
  body: [
    "Before there was a confluence, there was a beach. During the lockdown, Harold Fernandes started clearing plastic off the Carter Road shoreline and its mangroves almost every day. Inspired by that, five of us — Harold, Ashwin Malwade, Nupur Agarwal, Freishia B and Maansi Desai — founded Carter Clean Up on 24 June 2021 to take on the full 3.5-kilometre stretch.",
    "What started as a handful of people became a Saturday ritual that more than ten thousand volunteers have shown up for — 160,000 kilos of marine waste and illegal construction debris pulled off the beach and out of the mangroves. But years of it taught us something no amount of collected waste could: a single shoreline can be held by a single community, a coastline cannot. Willingness was never the bottleneck — every clean-up movement in the country was just solving the same problems alone.",
  ],
  /** Out to `/carter-clean-up`. This section is chapter one of the ICUC story and
      has to stay short; the movement's own page is where it runs at full length. */
  more: { label: "The full Carter Clean Up story", href: "/carter-clean-up" },
  /** Carter Clean Up's own mark — the collective that started this, not a confluence partner. */
  logo: {
    src: "/images/movement/carter-logo.png",
    alt: "Carter Clean Up logo",
    width: 980,
    height: 980,
  } satisfies Img,
  facts: [
    { value: "Est. 2021", label: "Carter Road, Bandra" },
    { value: "3.5 km", label: "Cleaned every Saturday" },
    { value: "10,000+", label: "Volunteers, and counting" },
  ],
  /** Photos from Carter Clean Up's own drives — add or remove freely. The main visual for this section. */
  carousel: [
    {
      src: "/images/movement/carousel/01.jpg",
      alt: "Carter Clean Up volunteers gathered for a group photo along Carter Road, Bandra, with the mangroves and sea behind them",
      width: 1600,
      height: 1200,
    },
    {
      src: "/images/movement/carousel/02.jpg",
      alt: "Carter Clean Up volunteers posing together on the Carter Road promenade under an overcast sky",
      width: 1200,
      height: 1600,
    },
    {
      src: "/images/movement/carousel/03.jpg",
      alt: "Before and after photos of a Carter Road shoreline clean-up, marking 710 kilograms of marine waste collected in a single week",
      caption: "Week 236 — 710 kg of marine waste collected",
      width: 1170,
      height: 1464,
    },
    {
      src: "/images/movement/carousel/04.jpg",
      alt: "A Carter Clean Up group photo including volunteers wearing Safai Yatra t-shirts, on the promenade beside the sea",
      width: 1200,
      height: 1600,
    },
    {
      src: "/images/movement/carousel/05.jpg",
      alt: "Sacks of waste collected during a Carter Clean Up drive, stacked on the promenade under palm trees",
      width: 1200,
      height: 1600,
    },
    {
      src: "/images/movement/carousel/06.jpg",
      alt: "Five Carter Clean Up volunteers in branded t-shirts posing together on Carter Road",
      width: 1200,
      height: 1600,
    },
  ] satisfies Array<Img & { caption?: string }>,
};

/**
 * `/carter-clean-up` — the whole of chapter one, at the length the landing page
 * can't give it. `movement` above is the teaser inside the ICUC chronology and
 * must stay short; everything that would have bloated it lives here instead.
 *
 * The two overlap deliberately (both name the founding five and the 24 June 2021
 * date) — a reader may arrive at either one first. Keep the facts in step.
 *
 * Everything factual here — the Saturday cadence, the figures, the awards, what
 * happens to the collected waste — comes from Carter Clean Up's own partnership
 * deck (May 2025) rather than from press coverage. The founder bios do not; see
 * the TODOs on each one.
 */
export const carter = {
  hero: {
    eyebrow: "The movement behind ICUC",
    title: "Carter Clean Up",
    lead: "A citizens' clean-up movement on Carter Road, Bandra. 3.5 km of beach and mangroves, every Saturday since June 2021. 10,000 volunteers. 160,000 kg of waste off the shore.",
    cta: { label: "Join a clean-up", href: "/contact" },
    instagram: { label: "Follow on Instagram", href: "https://www.instagram.com/cartercleanup/" },
  },

  story: {
    eyebrow: "How it started",
    title: "Started by one person during lockdown",
    body: [
      "Harold Fernandes cleaned the Carter Road beach and its adjoining mangroves nearly every day through the lockdown. On 24 June 2021 four others joined him and Carter Clean Up was founded: Ashwin Malwade, Nupur Agarwal, Freishia B and Maansi Desai.",
      "The stretch is 3.5 km of beach and mangroves in Bandra. No single authority maintains it. Plastic and illegally dumped construction debris collect on the sand, and the mangroves choke on it until trees start dying back.",
      "Four years on: 10,000 volunteers, 160,000 kg removed, and a clean-up every Saturday. Waste is segregated on site. Plastic that cannot be recycled goes to cement factories as refuse-derived fuel. Idols left on the beach go to a recycling unit every two months. Seven Bandra churches host dry-waste bins emptied weekly, and around 75 residents bring their recyclables to Carter Road each Saturday.",
      "The limit showed up early. One community can hold one shoreline, not a coastline. Carter Clean Up started the India Clean-Up Confluence in 2024 to put every clean-up movement in the country in one room.",
    ],
    /** From the deck's own awards slide. */
    recognitionLabel: "Recognition",
    recognition: [
      "Recognised by the Indian Coast Guard on their 48th Raising Day",
      "Spotlightee 2023 at the Sanctuary Wildlife Awards, Sanctuary Asia",
    ],
  },

  numbers: {
    eyebrow: "By the numbers",
    title: "What one beach adds up to",
    intro:
      "Carter Road, Bandra — cumulative since the movement was founded on 24 June 2021.",
    /**
     * A numeric `value` is counted up from zero by <CountUp>; a string is printed
     * as-is. `CountUp` rounds to whole numbers and formats with `toLocaleString`,
     * so anything fractional (3.5) or that must not be grouped (a year: "2,021")
     * has to be a string. The founding date is in the story and the hero anyway.
     */
    facts: [
      { value: "3.5 km", suffix: "", label: "Shoreline", detail: "beach and mangroves, every Saturday" },
      { value: 10000, suffix: "+", label: "Volunteers", detail: "and counting" },
      { value: 160000, suffix: " kg", label: "Waste collected", detail: "marine waste and construction debris" },
      { value: 7, suffix: "", label: "Waste banks", detail: "Bandra churches hosting dry-waste bins" },
    ] satisfies Array<{ value: number | string; suffix?: string; label: string; detail: string }>,
  },

  founders: {
    eyebrow: "The founders",
    title: "The people who started it",
    intro:
      "Carter Clean Up was founded by five citizens on 24 June 2021. Two of them tell the story of how it runs.",
    /** Three of the founding five aren't profiled above — this names two of them,
        so the page doesn't read as though there were only ever two. Harold
        Fernandes is the third, and is credited in `story.body` instead, which is
        where the movement actually starts. */
    others: "Carter Clean Up was co-founded with Ashwin Malwade and Nupur Agarwal.",
    people: [
      {
        name: "Freishia Bomanbehram",
        role: "Co-founder",
        // TODO: confirm with Freishia. Drafted from public profiles — the WWF-India
        // ambassadorship and the awards are as reported; check they are current.
        bio: [
          "Freishia co-founded Carter Clean Up in 2021 and has carried its public voice ever since. She is the one who puts a Saturday morning on a beach in front of an audience that was never going to come looking for it.",
          "She is an actor, emcee and event specialist with more than a decade of work behind her, Earth Hour Water Ambassador for Maharashtra with WWF-India, EEMA Best Emcee (Gold), and a two-time Power Women Award winner as a Champion of Change in Events.",
        ],
        image: {
          src: "/images/carter/founders/freishia.jpg",
          alt: "Portrait of Freishia Bomanbehram, co-founder of Carter Clean Up",
          // The real file: 447x447. The frame caps at 28rem so it never upscales.
          width: 447,
          height: 447,
        } satisfies Img,
      },
      {
        name: "Maansi Desai",
        role: "Co-founder",
        // TODO: this one most of all — beyond her name in the founding five there
        // is almost nothing on the record, so the paragraphs below are thin and
        // generic by necessity. Replace them with her own words.
        // NOTE: surname taken from Carter's own May 2025 deck, which lists the five
        // core members as Maansi Desai. Some coverage (and this site, previously)
        // says "Maansi Ahuja" — the deck wins, but worth a second confirmation.
        bio: [
          "Maansi co-founded Carter Clean Up on 24 June 2021, and was part of turning one person's daily walk into a weekly operation across the full 3.5-kilometre stretch.",
          "Holding a clean-up every single Saturday for years is mostly logistics: volunteers, equipment, and somewhere for the waste to actually go. That machinery is the reason the movement outlasted its first summer.",
        ],
        image: {
          src: "/images/carter/founders/maansi.jpeg",
          alt: "Portrait of Maansi Desai, co-founder of Carter Clean Up",
          // The real file: 408x378 — not square like the other two, so the
          // square frame crops a little off the top and bottom.
          width: 408,
          height: 378,
        } satisfies Img,
      },
    ],
  },

  /** Headings only — the photos themselves are `movement.carousel`, so a new
      picture dropped in there appears on both the landing page and here. */
  photos: {
    eyebrow: "From the drives",
    title: "Saturday mornings on Carter Road",
  },

  /**
   * Headings only — `/carter-clean-up` runs the landing page's `Partners` row
   * with the same `partners.items` list, so a logo added there shows up on both
   * pages. Only the framing changes: on this page the organisations are read as
   * backers of the movement rather than of the confluence.
   */
  partners: {
    eyebrow: "Who backs the movement",
    title: "The people who showed up with us",
    intro:
      "Carter Clean Up started the India Clean-Up Confluence, and these are the organisations that have funded and supported it since — the same names behind both editions.",
  },

  cta: {
    title: "The next clean-up is this Saturday.",
    body: "No experience, no equipment and no commitment needed — turn up once and see. Tell us you're coming and we'll send you the time and the meeting point.",
    button: { label: "Get in touch", href: "/contact" },
  },
};

/** Chapter two: the single line explaining how ICUC came to be, plus what it does. */
export const confluence = {
  eyebrow: "How ICUC came about",
  statement:
    "So in 2024 we stopped adding beaches and started adding people — Carter Clean Up invited every clean-up movement in India into one room for one day, to build together what none of us could build alone. That room is the India Clean-Up Confluence.",
  pillars: [
    {
      icon: "users",
      title: "Convene",
      body: "Bring clean-up leaders, funders and policymakers into one room, with an agenda they set jointly rather than separately.",
    },
    {
      icon: "sprout",
      title: "Amplify",
      body: "Give grassroots changemakers a national stage — and the visibility that turns a local drive into a replicable model.",
    },
    {
      icon: "recycle",
      title: "Scale",
      body: "Move from one-off drives to measured, repeatable systems for waste management and shoreline restoration.",
    },
  ],
};

export const editionsSection = {
  eyebrow: "The editions",
  title: "Three confluences, in order",
  intro:
    "Each edition picks up where the last one stopped. Read them top to bottom — that is how they happened.",
  statusLabels: { past: "Past edition", latest: "Latest edition", upcoming: "Next up" } as const,
  recap: {
    label: "Recap",
    photosLabel: "Photos from the day",
    playLabel: "Play the recap film",
    videoPending: "Recap film coming soon",
    /** Sits beside the films when an edition has no photo strip yet. */
    filmsIntro: "Press play to relive the day.",
  },
};

/**
 * Chapter three: the editions, oldest first. Order here is the order on the page.
 *
 * Each past edition carries a `recap` — its films and a strip of photos.
 *
 *   • Films — `videos` is a list, rendered left to right in source order, so the
 *     first entry is the one that reads as *the* after-movie. One is the normal
 *     case; ICUC 2.0 has two because the after-movie and the speakers' testimonial
 *     reel were cut and posted separately.
 *
 *     Set `src` on each. A local path ending in a video extension (e.g.
 *     `/videos/icuc-2024-recap.mp4`) plays inline in a native <video>; anything
 *     else is treated as an embed URL and loaded in an <iframe> — for YouTube use
 *     `https://www.youtube-nocookie.com/embed/<VIDEO_ID>`, for Vimeo
 *     `https://player.vimeo.com/video/<VIDEO_ID>`. Either way the player is only
 *     mounted once someone presses play. An empty `src` renders a labelled
 *     placeholder instead of a broken player, so it is safe to ship before the
 *     cut is ready. `portrait: true` frames a vertical (9:16) film.
 *
 *     An empty `videos: []` renders no film at all — use it, not a blank `src`,
 *     when an edition simply has no footage.
 *   • Photos — drop files into `public/images/editions/<id>/` and list them here
 *     with their real `width`/`height`. Any number works; they open in a lightbox.
 *
 * An edition that hasn't happened yet has `recap: null`.
 */
export const editions: Array<{
  id: string;
  name: string;
  theme: string;
  blurb: string;
  date: string;
  venue: string;
  /** `latest` is the most recent edition that has happened; it renders like `past`, labelled differently. */
  status: "past" | "latest" | "upcoming";
  body: string;
  highlights: string[];
  recap: {
    videos: RecapVideo[];
    photos: Array<Img & { caption?: string }>;
  } | null;
  /** The edition's own event mark, when one was designed for it. */
  logo?: Img;
}> = [
  {
    id: "1-0",
    name: "ICUC 1.0",
    theme: "First time in India",
    blurb: "An initiative to foster collaboration for a cleaner future.",
    date: "Sunday, 20 October 2024",
    venue: "G5A Warehouse, Mahalaxmi, Mumbai",
    status: "past",
    body: "The first edition was simply a test of the premise: would India's clean-up movements actually show up for each other? They did. Collectives who had never met spent a day comparing methods, disposal routes and volunteer retention — and left with each other's numbers.",
    highlights: [
      "The first national gathering of Indian clean-up collectives",
      "A full day of open sessions, 10:00 AM to 6:00 PM",
      "Grassroots organisers, corporates and civic bodies in one room",
    ],
    recap: {
      // Sourced from @greenmyna's "ICUC24 Compliments" reel and self-hosted with
      // their permission — it is the only cut of the first edition there is, and
      // it is not ours, so check before re-cutting or re-captioning it.
      videos: [
        {
          src: "/videos/icuc-2024-recap.mp4",
          title: "ICUC 1.0 — what people said",
          portrait: true,
          poster: {
            src: "/images/editions/1-0/recap-poster.jpg",
            alt: "A speaker addressing the room from the stage at ICUC 1.0",
            width: 720,
            height: 1280,
          },
        },
      ],
      // Drop real event photos into public/images/editions/1-0/ and list them
      // here to add a photo strip beside the film. Empty = film only.
      photos: [],
    },
    logo: {
      src: "/images/icuc-icon.png",
      alt: "India Clean Up Confluence emblem",
      width: 510,
      height: 424,
    } satisfies Img,
  },
  {
    id: "2-0",
    name: "ICUC 2.0",
    theme: "From Ripples to Waves",
    blurb: "Turning scattered drives into shared, measurable method.",
    date: "September 2025",
    venue: "Mumbai",
    status: "past",
    body: "The second edition scaled the room and sharpened the question — from 'who else is doing this' to 'what actually works, and how do we prove it'. Sessions moved onto measurement, funding and the unglamorous machinery that lets a drive repeat itself every week for a decade.",
    highlights: [
      "350+ participants and 60+ organisations",
      "The ICUC Changemaker Awards, honouring grassroots leaders",
      "Run on solar power instead of diesel generators",
    ],
    recap: {
      // Two cuts, both @cartercleanup's own. The after-movie leads because it is
      // the edition itself; the testimonial reel is the room talking about it
      // afterwards, which only means anything once you've seen the day.
      videos: [
        {
          src: "/videos/icuc-2025-recap.mp4",
          title: "ICUC 2.0 after-movie",
          portrait: true,
          poster: {
            src: "/images/editions/2-0/recap-poster.jpg",
            alt: "The ICUC 2.0 team gathered on stage in front of the sponsor backdrop",
            width: 720,
            height: 1280,
          },
        },
        {
          src: "/videos/icuc-2025-voices.mp4",
          title: "ICUC 2.0 — voices from the day",
          portrait: true,
          poster: {
            src: "/images/editions/2-0/voices-poster.jpg",
            alt: "Sahir Doshi raising a hand in salute to camera in front of the ICUC 2.0 sponsor backdrop",
            width: 720,
            height: 1280,
          },
        },
      ],
      // Drop real event photos into public/images/editions/2-0/ and list them
      // here to add a photo strip beside the film. Empty = film only.
      photos: [],
    },
  },
  {
    id: "3-0",
    name: "ICUC 3.0",
    theme: "One Nation, Many Missions",
    blurb: "Every mission, mapped — and pointed in the same direction.",
    date: site.datesLong,
    venue: site.venue,
    status: "latest",
    body: "The third edition took the confluence past the coastline, to New Delhi. Mangroves, lakes, rivers, hills, wards and streets are different missions with different tools — but one nation's waste problem. 3.0 was about making those missions legible to each other, to funders and to policy.",
    highlights: [
      "Missions beyond the shoreline — inland, urban and upland",
      "A national map of who is cleaning what, and where",
    ],
    // The photos live in their own section, `icuc3`, rather than in a strip
    // here. Add a film to `videos` once there is an after-movie.
    recap: { videos: [], photos: [] },
  },
];

/**
 * ICUC 3.0's own section, straight after the editions: the edition the site
 * was built for, now that it has happened. `photos` renders as the same uniform
 * grid as the gallery, and opens the same lightbox.
 *
 * Drop the files into `public/images/editions/3-0/` and list them in `photos`
 * with their real `width`/`height` and an `alt` that describes only what is
 * plainly visible — no captions until someone who was there writes them (see
 * AGENTS.md). Until the list has anything in it, `pending` shows instead.
 *
 * TODO: `intro` is a draft written from what the site already knew. Have the
 * team confirm or replace it, and add real numbers to it once they exist.
 */
export const icuc3 = {
  eyebrow: `ICUC 3.0 — ${site.dates} — ${site.venue}`,
  title: "One nation, many missions",
  intro:
    "Two days in New Delhi, and the first confluence held away from the coast. Clean-up movements, NGOs, mentors, corporates and civic bodies came together under one roof.",
  pending: "Photos from the weekend are being sorted.",
  // The group photo leads; the rest are in camera order. Alt text describes
  // only what is plainly visible; no captions until someone who was there
  // writes them.
  photos: [
    {
      src: "/images/editions/3-0/icuc3-28.jpg",
      alt: "A large group photo of delegates in front of the stage backdrop",
      width: 2000,
      height: 1334,
    },
    {
      src: "/images/editions/3-0/icuc3-01.jpg",
      alt: "Two men in conversation in the front row of the audience seating",
      width: 2000,
      height: 1334,
    },
    {
      src: "/images/editions/3-0/icuc3-02.jpg",
      alt: "A man in a white jacket shaking hands with a woman in a blue-and-white sari, with others looking on",
      width: 2000,
      height: 1334,
    },
    {
      src: "/images/editions/3-0/icuc3-03.jpg",
      alt: "The stage screen showing a word cloud of names under the heading \"Welcome to the Lamp Lighting ceremony\"",
      width: 2000,
      height: 1334,
    },
    {
      src: "/images/editions/3-0/icuc3-04.jpg",
      alt: "Two women with microphones opening proceedings on stage in front of the ICUC 3.0 backdrop",
      width: 2000,
      height: 1334,
    },
    {
      src: "/images/editions/3-0/icuc3-05.jpg",
      alt: "A speaker in a beige shirt talking with a microphone in front of the stage screen",
      width: 2000,
      height: 1334,
    },
    {
      src: "/images/editions/3-0/icuc3-06.jpg",
      alt: "Four people standing together on stage in front of the sponsor backdrop",
      width: 2000,
      height: 1334,
    },
    {
      src: "/images/editions/3-0/icuc3-07.jpg",
      alt: "Six panellists seated on stage under the screen title \"Session 1: Volunteer to Vocation\"",
      width: 2000,
      height: 1334,
    },
    {
      src: "/images/editions/3-0/icuc3-08.jpg",
      alt: "A panellist in a beige shirt speaking into a microphone",
      width: 1333,
      height: 2000,
    },
    {
      src: "/images/editions/3-0/icuc3-09.jpg",
      alt: "The audience watching six panellists on stage under the screen title \"Session 2: Mentor Matchmaker\"",
      width: 2000,
      height: 1334,
    },
    {
      src: "/images/editions/3-0/icuc3-10.jpg",
      alt: "A smiling panellist in a grey suit holding a microphone",
      width: 1333,
      height: 2000,
    },
    {
      src: "/images/editions/3-0/icuc3-11.jpg",
      alt: "A presenter on stage beside a slide titled \"Background: Waste Generation in Rural India\"",
      width: 2000,
      height: 1334,
    },
    {
      src: "/images/editions/3-0/icuc3-12.jpg",
      alt: "A presenter on stage beside a slide titled \"24 x 7 Free Library\"",
      width: 2000,
      height: 1334,
    },
    {
      src: "/images/editions/3-0/icuc3-13.jpg",
      alt: "A presenter on stage beside a slide titled \"Project Mathura\"",
      width: 2000,
      height: 1334,
    },
    {
      src: "/images/editions/3-0/icuc3-14.jpg",
      alt: "A presenter on stage beside a slide headed \"Our Story\" for Harit Yuva Foundation",
      width: 2000,
      height: 1334,
    },
    {
      src: "/images/editions/3-0/icuc3-15.jpg",
      alt: "A row of thirteen people standing together on stage in front of the sponsor backdrop",
      width: 2000,
      height: 1334,
    },
    {
      src: "/images/editions/3-0/icuc3-16.jpg",
      alt: "Delegates helping themselves at a lunch buffet on an outdoor terrace",
      width: 2000,
      height: 1334,
    },
    {
      src: "/images/editions/3-0/icuc3-17.jpg",
      alt: "Visitors at the My Clean City stall, by HCL Foundation",
      width: 2000,
      height: 1334,
    },
    {
      src: "/images/editions/3-0/icuc3-18.jpg",
      alt: "Handmade crafts and a number game laid out on a table at an exhibition stall",
      width: 2000,
      height: 1334,
    },
    {
      src: "/images/editions/3-0/icuc3-19.jpg",
      alt: "A small group seated in a circle of white chairs, in discussion",
      width: 2000,
      height: 1334,
    },
    {
      src: "/images/editions/3-0/icuc3-20.jpg",
      alt: "A performer singing on stage under a screen reading \"Presenting Mahi G\"",
      width: 2000,
      height: 1334,
    },
    {
      src: "/images/editions/3-0/icuc3-21.jpg",
      alt: "A host speaking on stage under a screen reading \"Mentor Matchmaker\"",
      width: 2000,
      height: 1334,
    },
    {
      src: "/images/editions/3-0/icuc3-22.jpg",
      alt: "The host speaking into a microphone in front of the screen",
      width: 2000,
      height: 1334,
    },
    {
      src: "/images/editions/3-0/icuc3-23.jpg",
      alt: "Two men receiving plants and tote bags on stage, with others beside them, under a screen reading \"Safai Yodha felicitation\"",
      width: 2000,
      height: 1334,
    },
    {
      src: "/images/editions/3-0/icuc3-24.jpg",
      alt: "Eight people standing on stage under the screen title \"Session 3: Critical Infrastructure — When Development Meets Sustainability\"",
      width: 2000,
      height: 1334,
    },
    {
      src: "/images/editions/3-0/icuc3-25.jpg",
      alt: "Five panellists seated on stage under the screen title \"Session 4: The Green Pay-Cheque\"",
      width: 2000,
      height: 1334,
    },
    {
      src: "/images/editions/3-0/icuc3-26.jpg",
      alt: "Two men holding up an ICUC 3.0 laptop bag in front of the sponsor backdrop",
      width: 2000,
      height: 1334,
    },
    {
      src: "/images/editions/3-0/icuc3-27.jpg",
      alt: "Three women posing together, two holding ICUC 3.0 laptop bags",
      width: 2000,
      height: 1334,
    },
    {
      src: "/images/editions/3-0/icuc3-29.jpg",
      alt: "A group of eleven people seated together in front of the stage",
      width: 2000,
      height: 1334,
    },
    {
      src: "/images/editions/3-0/icuc3-30.jpg",
      alt: "Close-up of a mural made from hundreds of bottle caps in greens and purples",
      width: 2000,
      height: 1333,
    },
    {
      src: "/images/editions/3-0/icuc3-31.jpg",
      alt: "A speaker on stage beneath a screen reading \"Keynote speaker\", seen over the heads of the audience",
      width: 2000,
      height: 1333,
    },
    {
      src: "/images/editions/3-0/icuc3-32.jpg",
      alt: "A smiling man in sunglasses seated in the audience with his arms folded",
      width: 1333,
      height: 2000,
    },
    {
      src: "/images/editions/3-0/icuc3-33.jpg",
      alt: "Delegates in the front row laughing during a session",
      width: 2000,
      height: 1333,
    },
    {
      src: "/images/editions/3-0/icuc3-34.jpg",
      alt: "A young man in the audience standing to speak into a microphone",
      width: 2000,
      height: 1333,
    },
    {
      src: "/images/editions/3-0/icuc3-35.jpg",
      alt: "A speaker in a blue waistcoat addressing the room from the stage",
      width: 1333,
      height: 2000,
    },
    {
      src: "/images/editions/3-0/icuc3-36.jpg",
      alt: "A selfie of a woman and a man in a blue waistcoat, with the full audience behind them",
      width: 2000,
      height: 1333,
    },
    {
      src: "/images/editions/3-0/icuc3-37.jpg",
      alt: "A man in a blue waistcoat greeting delegates on the floor of the hall",
      width: 2000,
      height: 1333,
    },
    {
      src: "/images/editions/3-0/icuc3-38.jpg",
      alt: "A man in a blue waistcoat speaking with a group of women beside the sponsor wall",
      width: 2000,
      height: 1333,
    },
    {
      src: "/images/editions/3-0/icuc3-39.jpg",
      alt: "A crowd of delegates gathered around a man in a blue waistcoat near the ICUC banner",
      width: 2000,
      height: 1333,
    },
    {
      src: "/images/editions/3-0/icuc3-40.jpg",
      alt: "Products made from recycled waste on a stall table: a pen stand, coasters and a QR code",
      width: 2000,
      height: 1333,
    },
    {
      src: "/images/editions/3-0/icuc3-41.jpg",
      alt: "Green, red and blue waste-segregation buckets and bamboo products on the My Clean City stall",
      width: 2000,
      height: 1333,
    },
  ] as Array<Img & { caption?: string }>,
};

export const statsSection = {
  eyebrow: "Impact",
  title: "What ICUC 2.0 added up to",
  intro:
    "ICUC 2.0, Mumbai, September 2025 — the baseline ICUC 3.0 built on.",
};

export const stats = [
  { value: 350, suffix: "+", label: "Participants", detail: "at ICUC 2.0, Mumbai" },
  { value: 60, suffix: "+", label: "Organisations", detail: "collectives, NGOs and corporates" },
  { value: 60, suffix: " Lakh", label: "People reached", detail: "nationwide amplification" },
  { value: 360, suffix: " kg", label: "CO₂ saved", detail: "solar power instead of diesel" },
];

/**
 * Replace `name`/`role` and drop a square-ish portrait at the `image.src` path.
 * Keep entries in the order you want them displayed.
 */
export const changemakers: Array<{
  name: string;
  role: string;
  bio: string;
  image: Img;
}> = [
  {
    name: "Changemaker One",
    role: "Coastal clean-up lead",
    bio: "Recognised at the ICUC Changemaker Awards for sustained shoreline restoration work.",
    image: {
      src: "/images/changemakers/one.jpg",
      alt: "Portrait of an ICUC Changemaker Award recipient",
      width: 800,
      height: 1000,
    },
  },
  {
    name: "Changemaker Two",
    role: "Urban waste systems",
    bio: "Building ward-level segregation programmes that other cities can copy directly.",
    image: {
      src: "/images/changemakers/two.jpg",
      alt: "Portrait of an ICUC Changemaker Award recipient",
      width: 800,
      height: 1000,
    },
  },
  {
    name: "Faye D'Souza",
    role: "Independent journalist",
    bio: "On stage at the confluence, in conversation with the ICUC team.",
    image: {
      src: "/images/changemakers/three.jpg",
      alt: "Faye D'Souza on stage at the India Clean Up Confluence, being presented with a gift",
      width: 800,
      height: 1000,
    },
  },
  {
    name: "Changemaker Four",
    role: "Youth mobilisation",
    bio: "Turning campus volunteer energy into a standing city-wide clean-up network.",
    image: {
      src: "/images/changemakers/four.jpg",
      alt: "Portrait of an ICUC Changemaker Award recipient",
      width: 800,
      height: 1000,
    },
  },
];

/** A gallery tile that plays inline on hover instead of opening the lightbox. */
export type GalleryVideo = {
  type: "video";
  src: string;
  poster: Img;
  caption?: string;
};

/**
 * Headings and control labels for the gallery section. The component renders
 * them and holds no strings of its own.
 */
export const gallerySection = {
  eyebrow: "Gallery",
  title: "Moments from ICUC 1.0 and 2.0",
  intro: "Sessions, awards and the people who showed up.",
  /** `{n}` is replaced with the number of items still hidden. */
  showMore: "Show {n} more",
  showLess: "Show fewer",
};

/**
 * The photographs run in camera sequence, which is roughly the order the day
 * happened in. Don't sort this by shape or colour.
 *
 * All nineteen are from ICUC 2.0 (the "From Ripples to Waves" backdrop is
 * visible in several), processed from the original camera JPEGs: auto-rotated,
 * longest edge 2000px, JPEG q80, and stripped of EXIF. See the gallery note in
 * AGENTS.md before adding more.
 *
 * `caption` is deliberately absent on the photographs. A first pass of them was
 * written by reading the thumbnails and got the events wrong, and a confidently
 * wrong label on a photo of real people is worse than no label — so the tiles
 * carry none until someone who was actually in the room writes them. `alt` stays
 * mandatory regardless: it is what a screen reader gets instead of the picture,
 * and it describes only what is plainly visible. The video keeps its caption,
 * which predates that pass.
 *
 * Add or remove freely — the grid and lightbox adapt to any count, and to
 * entries with or without a caption.
 */
export const gallery: Array<(Img & { caption?: string }) | GalleryVideo> = [
  {
    src: "/images/gallery/01.jpg",
    alt: "Delegates seated in the front rows of the audience, listening to a session",
    width: 2000,
    height: 1333,
  },
  {
    src: "/images/gallery/02.jpg",
    alt: "A wide view of the seated audience across several rows of the venue",
    width: 2000,
    height: 1333,
  },
  {
    src: "/images/gallery/03.jpg",
    alt: "An older delegate passing a microphone to a young boy seated beside him during a session",
    width: 2000,
    height: 1333,
  },
  {
    src: "/images/gallery/04.jpg",
    alt: "Two delegates exchanging an ICUC tote bag in front of the sponsor backdrop",
    width: 2000,
    height: 1333,
  },
  {
    src: "/images/gallery/05.jpg",
    alt: "Two delegates shaking hands over an ICUC tote bag in front of the sponsor backdrop",
    width: 2000,
    height: 1333,
  },
  {
    type: "video",
    src: "/videos/djembe-jitesh.mp4",
    poster: {
      src: "/images/gallery/djembe-poster.jpg",
      alt: "Jitesh Jain leading a djembe drum circle performance with the audience on stage at ICUC 2.0",
      width: 1280,
      height: 720,
    },
    caption: "Djembe performance with Jitesh Jain",
  },
  {
    src: "/images/gallery/06.jpg",
    alt: "A panellist seated on stage beneath a screen reading People and Policies",
    width: 1333,
    height: 2000,
  },
  {
    src: "/images/gallery/07.jpg",
    alt: "A panellist speaking on stage during the People and Policies session",
    width: 1333,
    height: 2000,
  },
  {
    src: "/images/gallery/08.jpg",
    alt: "Two panellists seated in conversation on stage under the ICUC screen",
    width: 2000,
    height: 1333,
  },
  {
    src: "/images/gallery/09.jpg",
    alt: "Two panellists mid-discussion on stage in front of the From Ripples to Waves backdrop",
    width: 2000,
    height: 1333,
  },
  {
    src: "/images/gallery/10.jpg",
    alt: "Two delegates on stage, one holding a framed award",
    width: 2000,
    height: 1333,
  },
  {
    src: "/images/gallery/11.jpg",
    alt: "An ICUC Changemaker Award being handed over on stage",
    width: 2000,
    height: 1333,
  },
  {
    src: "/images/gallery/12.jpg",
    alt: "A group of delegates standing together with ICUC tote bags in front of the sponsor backdrop",
    width: 2000,
    height: 1333,
  },
  {
    src: "/images/gallery/13.jpg",
    alt: "A panellist speaking on stage beneath a screen of speaker portraits",
    width: 1333,
    height: 2000,
  },
  {
    src: "/images/gallery/14.jpg",
    alt: "A panellist seated on stage during a session on waste and innovation",
    width: 1333,
    height: 2000,
  },
  {
    src: "/images/gallery/15.jpg",
    alt: "A speaker seated on stage in front of the session title screen",
    width: 1333,
    height: 2000,
  },
  {
    src: "/images/gallery/16.jpg",
    alt: "A five-person panel seated on stage for a session on waste handling and its challenges",
    width: 2000,
    height: 1333,
  },
  {
    src: "/images/gallery/17.jpg",
    alt: "A speaker with a microphone making a point during a panel session",
    width: 2000,
    height: 1333,
  },
  {
    src: "/images/gallery/18.jpg",
    alt: "A panellist listening during a session on solutions to waste",
    width: 2000,
    height: 1333,
  },
  {
    src: "/images/gallery/19.jpg",
    alt: "Two delegates exchanging an ICUC tote bag on stage at the close of a session",
    width: 2000,
    height: 1333,
  },
];

/**
 * Everyone who has backed an edition, taken from the sponsor banners printed for
 * ICUC 1.0 (2024) and 2.0 (2025). The two lists overlap — Listenlights, Sanctuary
 * and One India Stories came back for the second edition — so this is one wall of
 * organisations rather than a block per year, with each entry's `note` saying
 * which editions it backed and in what capacity.
 *
 * `name` is not decoration: most of these logo files are third-party assets that
 * have to be collected one at a time, so until one exists `SmartImage` renders a
 * placeholder and the name underneath is the only thing identifying the tile.
 * Never drop the caption to tidy up the grid.
 *
 * Logos belong in `public/images/partners/`, named after the `src` below. Use a
 * transparent PNG or WebP trimmed to the mark itself — the tiles letterbox with
 * `contain`, so baked-in whitespace shows up as a logo that looks too small. Not
 * SVG: `next/image` refuses to serve one unless `dangerouslyAllowSVG` is set, and
 * turning that on for a wall of third-party files is not a trade worth making.
 *
 * Every one of the ten below has its real logo on disk, each taken from the
 * organisation's own site or feed (Rossari's from Wikipedia) and eyeballed against
 * the sponsor banners to confirm it is the right mark.
 *
 * The banners also name a third tier — the space, PR, youth, NGO and stage
 * partners (IF.BE, G5A, Umanshi, Yuvaa, EK, Production Crew, Usually Unusual).
 * They are not listed here on purpose: this row is sponsors and supporters only.
 * Their logo files are still in `public/images/partners/` for whenever that tier
 * is wanted back — all but EK and Usually Unusual were sourced.
 */
export const partners = {
  eyebrow: "Who backs the confluence",
  title: "Built with people who showed up",
  intro:
    "Three editions have been put together with the organisations below — the sponsors who funded them, the foundations that backed them and the partners who helped run them.",
  /**
   * One flat list, because the section renders as a single scrolling row and a
   * row cannot carry two headings. Whether an organisation sponsored or supported
   * is therefore part of its own `note` — dropping that would lose the only place
   * the distinction still lives.
   */
  items: [
    {
      name: "Listenlights",
      note: "Sponsor · ICUC 1.0, 2.0 & 3.0",
      image: {
        src: "/images/partners/listenlights.png",
        alt: "Listenlights logo",
        width: 900,
        height: 262,
      } satisfies Img,
    },
    {
      name: "Irasva",
      note: "Sponsor · ICUC 3.0",
      image: {
        src: "/images/partners/irasva.png",
        alt: "Irasva Fine Jewellery logo",
        width: 220,
        height: 104,
      } satisfies Img,
    },
    {
      name: "Della Townships",
      note: "Sponsor · ICUC 2.0",
      image: {
        src: "/images/partners/della-townships.webp",
        alt: "Della Townships logo",
        width: 203,
        height: 140,
      } satisfies Img,
    },
    {
      name: "Flipspaces",
      note: "Sponsor · ICUC 2.0",
      image: {
        src: "/images/partners/flipspaces.png",
        alt: "Flipspaces logo",
        width: 414,
        height: 34,
      } satisfies Img,
    },
    {
      name: "Upadhyaya Foundation",
      note: "Sponsor · ICUC 2.0",
      image: {
        src: "/images/partners/upadhyaya-foundation.png",
        alt: "Upadhyaya Foundation logo",
        width: 556,
        height: 171,
      } satisfies Img,
    },
    {
      name: "Wizcraft",
      note: "Sponsor · ICUC 2.0",
      image: {
        src: "/images/partners/wizcraft.png",
        alt: "Wizcraft Entertainment Agency logo",
        width: 350,
        height: 125,
      } satisfies Img,
    },
    {
      name: "Rossari Professional",
      note: "Sponsor · ICUC 1.0",
      // The file is Rossari's corporate mark ("making you more competitive"),
      // not the "Rossari Professional" lockup printed on the 1.0 banner. Same
      // company, different sub-brand lockup — swap it if they send the exact one.
      image: {
        src: "/images/partners/rossari-professional.png",
        alt: "Rossari logo",
        width: 230,
        height: 131,
      } satisfies Img,
    },
    {
      name: "Arya Group Foundation",
      note: "Sponsor · ICUC 1.0",
      image: {
        src: "/images/partners/agf.png",
        alt: "Arya Group Foundation (AGF) logo",
        width: 274,
        height: 275,
      } satisfies Img,
    },
    {
      name: "Greener Earth",
      note: "Supported by · ICUC 3.0",
      image: {
        src: "/images/partners/greener-earth.png",
        alt: "Greener Earth logo",
        width: 891,
        height: 286,
      } satisfies Img,
    },
    {
      name: "Chintan",
      note: "Supported by · ICUC 3.0",
      image: {
        src: "/images/partners/chintan.png",
        alt: "Chintan logo — collaborating for climate and circularity",
        width: 250,
        height: 110,
      } satisfies Img,
    },
    {
      name: "One India Stories",
      note: "Supported by · ICUC 1.0 & 2.0",
      image: {
        // Their own yellow field is kept rather than knocked out: the source is
        // a JPEG, so making the yellow transparent left a fringe on every glyph
        // and filled the counters of the letters. Cropped tight instead.
        src: "/images/partners/one-india-stories.png",
        alt: "One India Stories logo",
        width: 668,
        height: 513,
      } satisfies Img,
    },
    {
      name: "Sanctuary Nature Foundation",
      note: "Supported by · ICUC 1.0 & 2.0",
      image: {
        src: "/images/partners/sanctuary-nature-foundation.png",
        alt: "Sanctuary Nature Foundation logo",
        width: 166,
        height: 81,
      } satisfies Img,
    },
    {
      name: "Emerald Sustainable Foundation",
      note: "Supported by · ICUC 2.0",
      image: {
        src: "/images/partners/emerald-sustainable-foundation.png",
        alt: "Emerald Sustainable Foundation logo",
        width: 222,
        height: 103,
      } satisfies Img,
    },
    {
      name: "Vrikshit Foundation",
      note: "Community partner · ICUC 3.0",
      image: {
        src: "/images/partners/vrikshit-foundation.png",
        alt: "Vrikshit Foundation logo",
        width: 900,
        height: 277,
      } satisfies Img,
    },
    {
      name: "Fortis Escorts, Okhla",
      note: "Associate partner · ICUC 3.0",
      // Fortis Healthcare's own mark, from fortishealthcare.com. The 3.0 banner
      // printed the "Fortis Escorts — Okhla, New Delhi" lockup; swap it in if
      // the hospital sends that file.
      image: {
        src: "/images/partners/fortis-escorts.png",
        alt: "Fortis logo",
        width: 254,
        height: 94,
      } satisfies Img,
    },
    {
      name: "Hemped India",
      note: "Gifting partner · ICUC 3.0",
      image: {
        src: "/images/partners/hemped-india.png",
        alt: "Hemped India logo",
        width: 844,
        height: 320,
      } satisfies Img,
    },
  ],
};

export const cta = {
  title: "One nation. Many missions. Room for yours.",
  body: "Whether you run a collective, lead a CSR programme, or simply want to show up on a Sunday morning — there is a place for you at the confluence.",
  /**
   * Two asks: writing to us leads, now that ICUC 3.0 is over and there is no
   * registration to send people to; the movement's own page is the quieter one.
   */
  button: { label: "Contact us", href: "/contact" },
  secondaryButton: { label: "Join Carter Clean Up", href: "/carter-clean-up" },
};

/** The 404 page. Leans on the clean-up rather than apologising for the URL. */
export const notFound = {
  eyebrow: "404 — page not found",
  title: "This one washed away",
  body: "The page you're looking for isn't on this shore. It may have moved, or it may have been picked up and cleared away. Either way, there's plenty left to do.",
  primaryCta: { label: "Back to home", href: "/" },
  secondaryCta: { label: "Get in touch", href: "/contact" },
};

export const contact = {
  eyebrow: "Get in touch",
  title: "Bring your mission to the confluence",
  body: "Tell us how you'd like to be involved and the right person from the ICUC team will get back to you.",
  /**
   * The primary inbox, and the one the Web3Forms key delivers to. `ContactForm`
   * names this address (and only this one) when a submission fails, so it has to
   * stay in step with the key — see the contact-form note in AGENTS.md. Do not
   * point that fallback at `emailAlt`: mail sent there does not reach the same
   * place a form submission would.
   */
  email: "indiacleanupconfluence@gmail.com",
  /**
   * Carter Clean Up's own inbox, listed as a second route on the contact page and
   * in the footer. ICUC grew out of the movement and the two are staffed by the
   * same people, but this is the movement's address, not the confluence's.
   */
  emailAlt: "cartercleanupb@gmail.com",
  location: "Mumbai, Maharashtra, India",
  /** Split in three so the movement's name inside the sentence can be a link to
      its own page. Rendered by both `Footer` and the contact page. */
  note: {
    before: "ICUC grew out of ",
    link: { label: "Carter Clean Up", href: "/carter-clean-up" },
    after: ", the beach clean-up movement on Carter Road, Bandra, founded in 2021.",
  },
  /** Carter Clean Up's accounts — ICUC posts through the movement it grew out
      of rather than separate handles. There is no YouTube. */
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/indiacleanupconfluence/" },
  ],
  /** Options in the contact form's subject dropdown. */
  subjects: [
    "Volunteer with ICUC",
    "Partnership or sponsorship",
    "Speak at ICUC",
    "Press and media",
    "Something else",
  ],
};

/**
 * One question on the feedback form (`/feedback`). The form renders
 * `feedback.questions` in order and validates every question that isn't
 * `optional`, so adding, removing or rewording a question is a `site.ts` edit
 * and nothing else.
 *
 * `name` is frozen the moment the first answer arrives. It is the column header
 * in the feedback sheet and the label on the answer in the Web3Forms inbox, so
 * renaming one later leaves two batches of answers that no longer line up and
 * an orphaned column beside a new one. Add a new question instead. Use
 * snake_case, and never `name`, `phone` or `submitted_at`, which the form
 * already sends.
 *
 * How each type reaches the sheet (every value is a string):
 * - `text`, `textarea`: the answer as typed, trimmed.
 * - `rating`: "1" to "5".
 * - `choice`: the chosen option's text, exactly as written in `options`.
 * - `multi`: the chosen options joined with ", ".
 * - an unanswered optional question: "".
 */
export type FeedbackQuestion = {
  name: string;
  label: string;
  hint?: string;
  /** Only used by `text` and `textarea`. */
  placeholder?: string;
  /** Defaults to required. */
  optional?: boolean;
} & (
  | { type: "text" }
  | { type: "textarea" }
  | {
      /**
       * Five faces, from very unhappy to delighted, still stored as 1 to 5.
       * `faces` names each one, in order: it is the caption under the face and
       * what a screen reader announces.
       */
      type: "rating";
      faces: [string, string, string, string, string];
    }
  | {
      /** One answer from `options`. Changing an option's wording splits its answers in the sheet. */
      type: "choice";
      options: string[];
    }
  | {
      /** Any number of `options`. Required means at least one. */
      type: "multi";
      options: string[];
    }
);

/**
 * The feedback page (`/feedback`), for people who were at ICUC 3.0. It is not
 * in the nav or the sitemap and is `noindex`: attendees reach it by scanning a
 * QR code at the venue, so nearly everyone reading it is on a phone.
 *
 * Name and email are optional on purpose. Feedback people can give anonymously
 * is more honest than feedback they have to sign.
 */
export const feedback = {
  eyebrow: `ICUC 3.0 feedback, ${site.dates}`,
  title: "Tell us how it went",
  body: "Thank you for being at ICUC 3.0. A few quick questions, all on this page, and every answer is read by the team planning the next confluence.",
  name: {
    label: "Your name",
    placeholder: "Priya Sharma",
    error: "Please tell us your name.",
  },
  phone: {
    label: "Phone number",
    placeholder: "+91 98200 00000",
    error: "Enter a valid phone number, with 10 digits.",
  },
  /** Beside every other optional question's label. */
  optional: "Optional",
  /** Under a required question left blank. */
  required: "Please answer this one.",
  submit: "Send feedback",
  sending: "Sending…",
  /** Shown in place of the form once the feedback goes through. */
  success: {
    title: "Thank you",
    body: "Your feedback has reached the ICUC team. It goes straight into planning the next confluence.",
    again: "Send another response",
  },
  /** `{email}` is replaced with `contact.email`. */
  error: {
    notConnected: "This form isn't connected yet. Please email your feedback to {email} instead.",
    failed: "Something went wrong. Please email your feedback to {email} instead.",
  },
  /**
   * The form is deliberately short: name and phone number (both required,
   * above), then these two, and every one of them is required. The rating comes before the open question so that someone
   * who only has ten seconds still leaves a score.
   *
   * These `name`s are now the sheet's column headers. Don't rename them once
   * answers exist; add a new question instead.
   */
  questions: [
    {
      name: "overall_rating",
      label: "Overall, how was ICUC 3.0?",
      type: "rating",
      faces: ["Very poor", "Poor", "Okay", "Good", "Loved it"],
    },
    {
      name: "what_we_missed",
      label: "What did we miss? Is there anything you'd love to see at the next ICUC?",
      type: "textarea",
      placeholder: "A topic, a speaker, a kind of session, something that would have made the day better…",
    },
  ] satisfies FeedbackQuestion[] as FeedbackQuestion[],
};

/**
 * The support page (`/support`), paid by UPI straight to the LLP's bank account.
 * It says "contribute", never "donate": ICUC is an LLP, not a charity. See the Donations section
 * of AGENTS.md for how the money moves.
 *
 * TODO: `body` and `where` are a first draft written to make the page usable.
 * They say what a contribution is for, which is a promise to the person giving,
 * so the team should confirm every line before the page is shared.
 *
 * `tax` is not a draft. ICUC is an LLP, and only a registered trust, society or
 * Section 8 company can issue 80G certificates — so the page must not suggest a
 * contribution is tax-deductible, and there is deliberately no PAN field. If
 * donations are ever routed through an 80G-registered body instead, rewrite
 * `tax`, add the PAN field, and update the privacy policy to match.
 *
 * `min` and `max` are read by the order route as well as the form, so the
 * limit printed on the page is the one that is enforced.
 */
export const donate = {
  eyebrow: "Support ICUC",
  title: "Help keep the clean-ups coming",
  body: "ICUC began as a handful of volunteers on one beach. Every clean-up still needs gloves, sacks and a way to move what we pick up, and every confluence needs a room to meet in. A contribution of any size helps with both.",
  where: {
    title: "Where it goes",
    items: [
      {
        title: "Clean-up supplies",
        body: "Gloves, sacks and tools for the volunteers who turn up on a Saturday morning.",
      },
      {
        title: "Moving what we collect",
        body: "Getting the waste off the shore and to where it can be handled properly.",
      },
      {
        title: "The confluence",
        body: "Bringing clean-up movements from across India into one room, once a year.",
      },
    ],
  },
  tax: `Contributions go to ${site.legalName}. As an LLP it cannot issue 80G certificates, so a contribution is not tax-deductible.`,
  form: {
    amountLabel: "Choose an amount",
    /** In rupees. The form starts on `defaultAmount`, which should be one of these. */
    presets: [50, 100, 500, 1000, 2500, 5000],
    defaultAmount: 1000,
    customLabel: "Other amount",
    customPlaceholder: "Any amount",
    min: 50,
    /** UPI caps an ordinary payment at ₹1,00,000, so a larger figure would only fail inside the app. */
    max: 100000,
    amountError: "Enter a whole amount between ₹50 and ₹1,00,000.",
    name: { label: "Your name", placeholder: "Priya Sharma", error: "Please tell us your name." },
    email: { label: "Email", placeholder: "you@example.com", error: "Enter a valid email address." },
    phone: {
      label: "Phone number",
      hint: "Optional",
      placeholder: "+91 98200 00000",
      error: "Enter a valid phone number, with 10 digits.",
    },
    /** `{amount}` is replaced with the formatted amount, e.g. ₹1,000. */
    submit: "Contribute {amount}",
    opening: "Opening Razorpay…",
    verifying: "Confirming your payment…",
    secure: "Payments are processed by Razorpay. Your card, UPI or bank details go to Razorpay and never reach us.",
  },
  /**
   * UPI, which is how the page takes money now. `id` is the LLP's UPI ID (VPA),
   * read from `NEXT_PUBLIC_UPI_ID` so a test ID never lands in the code. In
   * production it must be a business/merchant one on the LLP's current account,
   * not a personal one: GPay and PhonePe refuse or cap app-link payments to
   * personal UPI IDs. Unset, the page says contributions aren't set up yet.
   * It is public by nature — the page prints it — hence `NEXT_PUBLIC_`.
   *
   * `payee` and `note` ride inside the payment link and show in the donor's
   * app. Keep `note` short and plain — some apps reject punctuation in it.
   */
  upi: {
    id: process.env.NEXT_PUBLIC_UPI_ID?.trim() ?? "",
    payee: "India Clean-Up Confluence",
    note: "Contribution to ICUC",
    /**
     * Whether phones get the amount picker and the "open your UPI app" buttons.
     * Off while the UPI ID is a personal one: GPay refuses app-link payments to
     * personal IDs ("You've exceeded the bank limit for this payment", even at
     * ₹50), but a scanned QR code goes through. With this off, every screen gets
     * the QR code and the UPI ID instead. Turn it on once `NEXT_PUBLIC_UPI_ID`
     * is a merchant ID.
     */
    appLinks: false,
    /** Phones: one button on Android (the system lists every UPI app), one per app on iPhone. */
    pay: "Pay {amount} with a UPI app",
    payNoAmount: "Pay with a UPI app",
    iosIntro: "Choose your UPI app",
    /**
     * iOS has no UPI app chooser, so each app is opened by its own link scheme.
     * The query string is the same standard UPI one in every case.
     */
    iosApps: [
      { name: "Google Pay", scheme: "gpay://upi/pay" },
      { name: "PhonePe", scheme: "phonepe://pay" },
      { name: "Paytm", scheme: "paytmmp://pay" },
    ],
    iosOther: "Another UPI app",
    appHint: "Opens your app with everything filled in. You just confirm and enter your UPI PIN.",
    /** Computers: there is no UPI app to open, so the phone in their pocket scans the code. */
    qrTitle: "Scan with your phone",
    qrHint: "Open Google Pay, PhonePe, Paytm or your bank's app, scan this code and enter the amount.",
    /** Phones, when `appLinks` is off: the code is on the same screen, so it can't simply be scanned. */
    qrTitlePhone: "Pay by UPI",
    qrHintPhone: "Copy the UPI ID below and pay it from Google Pay, PhonePe, Paytm or your bank's app. Or screenshot this code and open it from your app's QR scanner.",
    /** Read aloud in place of the code. `{id}` is the UPI ID. */
    qrAlt: "UPI QR code for {id}",
    idLabel: "UPI ID",
    copy: "Copy",
    copied: "Copied",
    after: "Paid? We only see the name on your UPI account, so if you'd like a thank-you, write to {email} with your name and the UPI reference.",
    notConnected: "Contributions aren't set up yet. If you'd like to support ICUC, please write to {email}.",
  },
  /** The line under ICUC's name inside the Razorpay Checkout window (unused while the page is on UPI). */
  checkoutDescription: "Contribution to ICUC",
  /** `{amount}` and `{id}` are filled in. Shown in place of the form once a payment is verified. */
  success: {
    title: "Thank you",
    body: "Your contribution of {amount} has gone through. It goes straight into the next clean-up.",
    reference: "Payment reference: {id}. Keep it in case you need to reach us about this payment.",
    again: "Contribute again",
  },
  /** `{email}` is replaced with `contact.email`, `{id}` with the Razorpay payment ID. */
  error: {
    notConnected: "Contributions aren't switched on yet. If you'd like to support ICUC, please write to {email}.",
    failed: "Something went wrong before the payment started, so nothing was charged. Please try again, or write to {email}.",
    cancelled: "Payment cancelled. Nothing was charged.",
    declined: "The payment didn't go through: {reason} Nothing was charged.",
    unverified:
      "Your payment may have gone through, but we couldn't confirm it here. Please don't pay again — write to {email} with the payment reference {id} and we'll check.",
  },
};

/**
 * The privacy policy, at `/privacy`.
 *
 * It exists because Meta requires a public policy URL before a WhatsApp
 * Business app is published, and because we message organisations who never
 * gave us their number — but the page is written for the person on the
 * receiving end of one of those messages, not for the reviewer. Someone who
 * lands here cold should learn where we got their number and how to make it
 * stop within thirty seconds, which is why "Where we got your number" is the
 * second section and "How to make it stop" carries the plainest wording on the
 * page. Don't bury either behind boilerplate.
 *
 * Everything here is a claim about what ICUC actually does. Two rules: never
 * add a certification, audit or security measure we don't have, and never
 * write that data is never shared — Meta, Google, Web3Forms and the host all
 * process it, and each is named below. If a form field, a destination or a
 * retention period changes elsewhere in this file, change it here too.
 *
 * Paragraphs may carry `[label](href)` links, which the page renders as
 * anchors. That is the only markup the renderer understands.
 *
 * Nothing here is a placeholder any more: the registered name, the office
 * address and the grievance officer are all settled and printed. If the person
 * answering grievances ever changes, this page is what has to say so — a name
 * on it that has left is worse than no page at all.
 */

/** A paragraph, or a bulleted list. Nothing else — this is a document, not a page. */
export type PrivacyBlock = { p: string } | { list: string[] };

export const privacy = {
  eyebrow: "Legal",
  title: "Privacy policy",
  /** Update this line whenever the copy below changes. */
  effective: "Effective 14 October 2026",
  lead:
    "This is what we know about you, where we got it, and how to make us stop. If you have just had a WhatsApp message from us and want the short answer, read the second section and then the one about stopping.",
  sections: [
    {
      id: "who-we-are",
      title: "Who we are",
      blocks: [
        {
          p: `${site.fullName} (ICUC) is a Limited Liability Partnership registered in India as ${site.legalName}. We run an annual convening that brings clean-up movements, NGOs, corporates, students and civic bodies into one room. ICUC 3.0 was held on ${site.datesLong}, at ${site.venue}.`,
        },
        {
          p: "This policy covers this website and the WhatsApp messages we send. Under India's Digital Personal Data Protection Act, 2023, ICUC is the Data Fiduciary for the personal data described here — we are the ones who decide what is collected and why, and we are the ones you complain to.",
        },
      ] satisfies PrivacyBlock[],
    },
    {
      id: "where-we-got-your-number",
      title: "Where we got your number",
      blocks: [
        {
          p: "You may have had a WhatsApp message from us without ever having given us your number. There are only two places it can have come from.",
        },
        {
          list: [
            "Publicly listed contact details — a number published on your organisation's own website, its social media profile, a public directory or a press release.",
            "Previous engagement with ICUC or Carter Clean Up — you or your organisation registered for, attended, spoke at, partnered with or volunteered at an earlier edition or clean-up.",
          ],
        },
        {
          p: "We do not buy contact lists and we do not scrape personal phone numbers. What we hold are organisational contact points, and the message was an invitation to ICUC 3.0 — it is not advertising for anyone else, and your number is not passed on.",
        },
        {
          p: "If you would rather not hear from us, one reply is enough. See “How to make it stop” below.",
        },
      ] satisfies PrivacyBlock[],
    },
    {
      id: "what-we-collect",
      title: "What we collect",
      blocks: [
        {
          p: "Contact details we sourced ourselves, for outreach: your organisation's name, a contact person's name where it is published, a phone number, and sometimes an email address.",
        },
        { p: "What you type into this website, if you choose to:" },
        {
          list: [
            "Registering for ICUC 3.0, while registration was open — your name and email, and optionally your phone number, city, organisation, your role there, the kind of delegate you are, and anything else you want to tell us.",
            "Applying to Mentor Matchmaker, while applications were open — answers about your organisation: when it started, what it does, how it is funded, how you would turn it into a business, and how to reach whoever is pitching.",
            "The Red Fort clean-up tick box on the registration form — whether you wanted to join, which is a head count and nothing more.",
            "The contact form — your name, email, what your enquiry is about and your message.",
            "Contributing — you pay from your own UPI app straight to our bank account, and our bank shows us the name on your UPI account, your UPI ID, the amount and the payment reference. Nothing about the payment is typed into this website, and your bank details and PIN never reach us.",
          ],
        },
        {
          p: "We run no analytics, no advertising pixels and no tracking on this website, and we set no cookies of our own. Our hosting provider keeps standard server logs, including the IP address a request came from, so the site can be kept running and secure.",
        },
      ] satisfies PrivacyBlock[],
    },
    {
      id: "what-we-use-it-for",
      title: "What we use it for",
      blocks: [
        {
          list: [
            "Sending WhatsApp invitations and information about ICUC 3.0.",
            "Processing registrations, and writing to delegates about the schedule, the venue and the logistics.",
            "Reading Mentor Matchmaker applications and selecting the five NGOs who pitched.",
            "Counting heads for the Red Fort clean-up and telling those people where to be.",
            "Replying to enquiries sent through the contact form.",
            "Taking contributions, keeping a record of them, and answering questions about a payment.",
          ],
        },
        {
          p: "That is the entire list. We do not sell or rent personal data, and we do not give it to anyone else to market their own things to you.",
        },
      ] satisfies PrivacyBlock[],
    },
    {
      id: "who-else-handles-it",
      title: "Who else handles it",
      blocks: [
        {
          p: "We cannot send a message or take a registration without a few service providers, so it would be untrue to tell you your data never leaves us. These are all of them.",
        },
        {
          list: [
            "Meta Platforms — every WhatsApp message we send you is delivered by WhatsApp and handled under [WhatsApp's own privacy policy](https://www.whatsapp.com/legal/privacy-policy).",
            "Google — registrations are written to a Google Sheet in an account we control, and the confirmation emails you receive are sent from our Gmail account, both covered by [Google's privacy policy](https://policies.google.com/privacy).",
            "Web3Forms — the site's forms post through Web3Forms, which emails a copy of each submission to our inbox. See [Web3Forms' privacy policy](https://web3forms.com/privacy).",
            "Vercel — this website is hosted on Vercel, which keeps the server logs described above. See [Vercel's privacy policy](https://vercel.com/legal/privacy-policy).",
            "Your UPI app and our bank — a contribution goes from the UPI app you choose (Google Pay, PhonePe, Paytm or your bank's own) to our bank account, under that app's and your bank's own privacy policies. This website only opens the app or shows the QR code; it never sees the payment.",
          ],
        },
      ] satisfies PrivacyBlock[],
    },
    {
      id: "how-to-make-it-stop",
      title: "How to make it stop",
      blocks: [
        {
          p: "You can tell us to stop contacting you, or to delete what we hold, at any time. You do not need to give a reason and you do not need to fill anything in.",
        },
        {
          list: [
            "On WhatsApp — reply STOP to any message from us, or simply block the number. Either one is enough.",
            `By email — write to [${contact.email}](mailto:${contact.email}) and say “stop contacting me” or “delete my data”.`,
          ],
        },
        {
          p: "We stop sending messages within 7 days of hearing from you, and we delete what we hold within 30 days of a deletion request. We will email you to confirm when it is done. If there is a record the law requires us to keep, we will tell you which record and why rather than quietly keeping it.",
        },
        {
          p: "Deleting your data also cancels your registration, because your registration is that data. If you have registered and then ask us to delete everything, we will check that is what you meant first.",
        },
      ] satisfies PrivacyBlock[],
    },
    {
      id: "how-long-we-keep-it",
      title: "How long we keep it",
      blocks: [
        {
          list: [
            "Contact details we sourced for outreach — kept until you ask us to remove them. Numbers that never responded to the ICUC 3.0 invitation are deleted within six months of the event.",
            "Registrations — kept for the event and for two years afterwards, so we can invite you to the next edition and keep a record of who came. Ask sooner and we delete sooner.",
            "Mentor Matchmaker applications — kept for the same two years, because the mentorship the panel awards carries on well past the event.",
            "Contact-form enquiries — kept in the ICUC inbox for two years.",
            "Contributions — kept for as long as Indian accounting and tax law requires us to keep financial records. Because the law requires it, we cannot delete a payment record sooner, even if you ask.",
          ],
        },
      ] satisfies PrivacyBlock[],
    },
    {
      id: "your-rights",
      title: "Your rights",
      blocks: [
        {
          p: "The Digital Personal Data Protection Act, 2023 gives you rights over the data we hold. The Information Technology Act, 2000 and the SPDI Rules, 2011 also apply to us.",
        },
        {
          list: [
            "Access — ask what personal data we hold about you and what we have done with it.",
            "Correction and completion — have anything wrong or out of date corrected, and anything missing filled in.",
            "Erasure — have your data deleted, as described above.",
            "Withdraw consent — as easily as you gave it. We then stop processing your details for anything except what the law requires us to keep.",
            "Nominate — name someone to exercise these rights for you if you die or become unable to exercise them yourself.",
            "Grievance redressal — complain to us, and escalate to the Data Protection Board of India if we do not resolve it.",
          ],
        },
        {
          p: `To use any of these, email [${contact.email}](mailto:${contact.email}). We respond within 30 days.`,
        },
      ] satisfies PrivacyBlock[],
    },
    {
      id: "grievances",
      title: "Grievances",
      blocks: [
        {
          p: `If you think we have done something wrong with your data, write to [${contact.email}](mailto:${contact.email}) and put “Grievance” in the subject line. We acknowledge within 7 days and respond within 30.`,
        },
        // A named person, which is what the SPDI Rules expect on the page and
        // what a reviewer looks for. The address is the shared ICUC inbox
        // rather than a personal one, so a grievance still lands somewhere read
        // if the role ever changes hands. "Grievance Officer" deliberately, not
        // "Data Protection Officer" — the DPDP Act reserves that term for
        // Significant Data Fiduciaries, which ICUC is not.
        {
          p: `Grievance Officer: Suraj Shah — [${contact.email}](mailto:${contact.email})`,
        },
        {
          p: "If our answer does not resolve it, you can take the complaint to the Data Protection Board of India under the DPDP Act.",
        },
      ] satisfies PrivacyBlock[],
    },
    {
      id: "outside-india",
      title: "If you are outside India",
      blocks: [
        {
          p: "ICUC is based in India and your data is processed here. If you are in the UK or the EEA, our basis under the GDPR is legitimate interests for the outreach messages — inviting organisations that work on environmental clean-ups to a convening about their own field — and your consent for anything you submit through this website.",
        },
        {
          p: `Your practical route is the same as everyone else's: reply STOP, or email [${contact.email}](mailto:${contact.email}). You can also object to the processing, or ask for a copy of what we hold, at that address.`,
        },
      ] satisfies PrivacyBlock[],
    },
    {
      id: "keeping-it-safe",
      title: "Keeping it safe",
      blocks: [
        {
          p: "We are a small team, so here is the honest version. The website is served over HTTPS. Registrations sit in a Google Sheet and in an email inbox, protected by the passwords and two-factor authentication on the ICUC accounts. Only the organising team members who need access have it.",
        },
        {
          p: "We hold no security certification and we have not been audited. WhatsApp messages are encrypted in transit by WhatsApp itself; we add no encryption of our own beyond what our providers give us. Nothing is completely secure, so please don't send us anything sensitive — identity documents, bank details — through this site. We will never ask you for them.",
        },
      ] satisfies PrivacyBlock[],
    },
    {
      id: "children",
      title: "Children",
      blocks: [
        {
          p: `We do not knowingly collect the data of anyone under 18 without verifiable parental consent, which is what the DPDP Act requires. School and college groups should register through a teacher, a coordinator or another adult. If you believe we hold a child's data, email [${contact.email}](mailto:${contact.email}) and we will delete it.`,
        },
      ] satisfies PrivacyBlock[],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      blocks: [
        {
          p: "We may update this policy. The effective date at the top says when it last changed, and if a change materially affects how we use data we already hold, we will say so on this page.",
        },
      ] satisfies PrivacyBlock[],
    },
    {
      id: "contact-us",
      title: "Contact us",
      blocks: [
        {
          // The registered office, set out as an address rather than run into a
          // sentence — a reviewer checking it against the LLP filing reads it a
          // line at a time. The newlines survive because the renderer's
          // paragraphs are `whitespace-pre-line`; this is the only block that
          // uses them.
          p: `${site.legalName}
302, 3rd Floor, Rustomjee's La Solita
28th Road, TPS 3, Off Turner Road
Near Gurunanak Park, Bandra (W)
Mumbai 400050, Maharashtra, India`,
        },
        { p: `Email: [${contact.email}](mailto:${contact.email})` },
      ] satisfies PrivacyBlock[],
    },
  ],
};
