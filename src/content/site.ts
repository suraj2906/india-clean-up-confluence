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

export const site = {
  name: "ICUC",
  fullName: "India Clean-Up Confluence",
  tagline: "One Nation, Many Missions",
  description:
    "India's national platform uniting clean-up movements, grassroots changemakers, corporates and policymakers behind scalable environmental action.",
  url: "https://indiacleanupconfluence.org",
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
  statusLabels: { past: "Past edition", upcoming: "Next up" } as const,
  recap: {
    label: "Recap",
    photosLabel: "Photos from the day",
    playLabel: "Play the recap film",
    videoPending: "Recap film coming soon",
  },
};

/**
 * Chapter three: the editions, oldest first. Order here is the order on the page.
 *
 * Each past edition carries a `recap` — one film and a strip of photos.
 *
 *   • Film — set `src`. A local path ending in a video extension (e.g.
 *     `/videos/icuc-2024-recap.mp4`) plays inline in a native <video>; anything
 *     else is treated as an embed URL and loaded in an <iframe> — for YouTube use
 *     `https://www.youtube-nocookie.com/embed/<VIDEO_ID>`, for Vimeo
 *     `https://player.vimeo.com/video/<VIDEO_ID>`. Either way the player is only
 *     mounted once someone presses play. An empty `src` renders a labelled
 *     placeholder instead of a broken player, so it is safe to ship before the
 *     cut is ready. `portrait: true` frames a vertical (9:16) film.
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
  status: "past" | "upcoming";
  body: string;
  highlights: string[];
  recap: {
    video: { src: string; title: string; poster: Img; portrait?: boolean };
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
      video: {
        src: "/videos/icuc-2024-recap.mp4",
        title: "ICUC 1.0 after-movie",
        portrait: true,
        poster: {
          src: "/images/editions/1-0/recap-poster.jpg",
          alt: "A panel session at ICUC 1.0, beneath footage of plastic waste washed up on a beach",
          width: 720,
          height: 1280,
        },
      },
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
      video: {
        src: "/videos/icuc-2025-recap.mp4",
        title: "ICUC 2.0 after-movie",
        portrait: true,
        poster: {
          src: "/images/editions/2-0/recap-poster.jpg",
          alt: "A grassroots leader receiving their ICUC Changemaker Award on stage at ICUC 2.0",
          width: 720,
          height: 1280,
        },
      },
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
    date: "Dates to be announced",
    venue: "To be announced",
    status: "upcoming",
    body: "The next edition takes the confluence past the coastline. Mangroves, lakes, rivers, hills, wards and streets are different missions with different tools — but one nation's waste problem. 3.0 is about making those missions legible to each other, to funders and to policy.",
    highlights: [
      "Missions beyond the shoreline — inland, urban and upland",
      "A national map of who is cleaning what, and where",
      "Registration opens closer to the date",
    ],
    recap: null,
  },
];

export const statsSection = {
  eyebrow: "Impact",
  title: "What the last confluence added up to",
  intro:
    "ICUC 2.0, Mumbai, September 2025 — the most recent edition, and the baseline 3.0 builds on.",
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

/** Add or remove freely — the gallery grid and lightbox adapt to any count. */
export const gallery: Array<(Img & { caption?: string }) | GalleryVideo> = [
  {
    src: "/images/gallery/01.jpg",
    alt: "Six panellists standing together on stage with ICUC tote bags, in front of a screen showing the India Clean Up Confluence backdrop",
    caption: "Panel",
    width: 873,
    height: 701,
  },
  {
    src: "/images/gallery/02.jpg",
    alt: "Malhar Kalambe, founder of Beach Please, speaking on stage at ICUC 2.0",
    caption: "Malhar Kalambe on stage at ICUC 2.0",
    width: 1600,
    height: 2400,
  },
  {
    src: "/images/gallery/03.jpg",
    alt: "The Mangrove Marshalls receiving their ICUC Changemaker Award on stage, holding the framed certificate",
    caption: "ICUC Changemaker Awards",
    width: 1600,
    height: 1067,
  },
  {
    src: "/images/gallery/04.jpg",
    alt: "Delegates in conversation between sessions",
    caption: "Between sessions",
    width: 1600,
    height: 1067,
  },
  {
    src: "/images/gallery/05.jpg",
    alt: "Segregated waste sorted into labelled collection bags",
    caption: "Sorting and segregation",
    width: 1600,
    height: 1067,
  },
  {
    src: "/images/gallery/06.jpg",
    alt: "Group photograph of ICUC participants and volunteers",
    caption: "The confluence, together",
    width: 1600,
    height: 1067,
  },
  {
    type: "video",
    src: "/videos/djembe-jitesh.mp4",
    poster: {
      src: "/images/gallery/07.jpg",
      alt: "Jitesh Jain leading a djembe drum circle performance with the audience on stage at ICUC 2.0",
      width: 1280,
      height: 720,
    },
    caption: "Djembe performance with Jitesh Jain",
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
    "Two editions have been put together with the organisations below — the sponsors who funded them and the foundations that backed them.",
  /**
   * One flat list, because the section renders as a single scrolling row and a
   * row cannot carry two headings. Whether an organisation sponsored or supported
   * is therefore part of its own `note` — dropping that would lose the only place
   * the distinction still lives.
   */
  items: [
    {
      name: "Listenlights",
      note: "Sponsor · ICUC 1.0 & 2.0",
      image: {
        src: "/images/partners/listenlights.png",
        alt: "Listenlights logo",
        width: 900,
        height: 262,
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
  ],
};

export const cta = {
  title: "One nation. Many missions. Room for yours.",
  body: "Whether you run a collective, lead a CSR programme, or simply want to show up on a Sunday morning — there is a place for you at the confluence.",
  button: { label: "Contact us", href: "/contact" },
};

export const contact = {
  eyebrow: "Get in touch",
  title: "Bring your mission to the confluence",
  body: "Tell us how you'd like to be involved and the right person from the ICUC team will get back to you.",
  email: "indiacleanupconfluence@gmail.com",
  phone: "+91 00000 00000",
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
