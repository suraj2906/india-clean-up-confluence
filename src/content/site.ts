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
  tagline: "One Nation, Many Missions",
  description:
    "India's national platform uniting clean-up movements, grassroots changemakers, corporates and policymakers behind scalable environmental action.",
  url: "https://indiacleanupconfluence.org",
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
   * registration page, the success message and the ICUC 3.0 edition entry all
   * read this rather than repeating it.
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
  { label: "Register", href: "/register" },
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
  /** The page's main action. Registration is the thing with a date on it, so
      "Get involved" means "register" — not "write to us". */
  primaryCta: { label: "Get involved", href: "/register" },
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
  statusLabels: { past: "Past edition", upcoming: "Next up" } as const,
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
  status: "past" | "upcoming";
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
    status: "upcoming",
    body: "The next edition takes the confluence past the coastline. Mangroves, lakes, rivers, hills, wards and streets are different missions with different tools — but one nation's waste problem. 3.0 is about making those missions legible to each other, to funders and to policy.",
    highlights: [
      "Missions beyond the shoreline — inland, urban and upland",
      "A national map of who is cleaning what, and where",
      "Registration is open to everyone — volunteers, NGOs, corporates and press",
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

/**
 * Headings and control labels for the gallery section. The component renders
 * them and holds no strings of its own.
 */
export const gallerySection = {
  eyebrow: "Gallery",
  title: "Moments from the confluence",
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
  body: "Whether you run a collective, lead a CSR programme, or simply want to show up on a Sunday morning — there is a place for you at the confluence. Registration for ICUC 3.0 is open to everyone.",
  /**
   * Two asks, and the order is the point: registering is the thing with a date
   * on it, so it leads. Writing to us is the fallback for anyone whose question
   * a form can't take, which is why it stays and why it is the quieter button.
   */
  button: { label: "Register for ICUC 3.0", href: "/register" },
  secondaryButton: { label: "Contact us", href: "/contact" },
};

/** The 404 page. Leans on the clean-up rather than apologising for the URL. */
export const notFound = {
  eyebrow: "404 — page not found",
  title: "This one washed away",
  body: "The page you're looking for isn't on this shore. It may have moved, or it may have been picked up and cleared away. Either way, there's plenty left to do.",
  primaryCta: { label: "Back to home", href: "/" },
  secondaryCta: { label: "Get in touch", href: "/contact" },
};

/**
 * One question on the registration form's NGO track. The form renders this list
 * in order, so adding a question is a `site.ts` edit and nothing else.
 *
 * `name` is what the answer is labelled as in the inbox — it goes straight into
 * the Web3Forms payload. Pick it once and don't rename it later, or two months
 * of submissions stop lining up with each other.
 */
export type RegistrationQuestion = {
  name: string;
  label: string;
  hint?: string;
  placeholder?: string;
  /** Defaults to a single-line text input. */
  type?: "text" | "textarea" | "url" | "number";
  /** Defaults to required — an application form with optional questions isn't one. */
  optional?: boolean;
};

/**
 * The registration page (`/register`), which is open to everyone: volunteers,
 * NGOs, corporates, students, press. One form, one inbox.
 *
 * It carries a second track inside it. `oneMentor` is the "One Mentor, Many
 * Missions" pitch session — NGOs that want to scale into a business apply here,
 * ten are selected to pitch to a panel of mentors at ICUC 3.0, and five of those
 * ten come away with mentorship from the panel.
 *
 * All of that copy is read *inside the form*: choosing `ngoType` in the "I'm
 * registering as" dropdown opens the explanation right there, next to the tick
 * box it is explaining. It used to sit in a section under the form, where nobody
 * reaching it would ever have scrolled past the thing they came to fill in.
 */
export const registration = {
  eyebrow: `ICUC 3.0 — ${site.dates} — ${site.venue}`,
  title: "Register for the confluence",
  body: `ICUC 3.0 is on ${site.datesLong}, at ${site.venue}. It's time to come together for a better tomorrow — register for the confluence here.`,
  /** The first dropdown. Order is roughly most to least common. */
  attendeeTypes: [
    "Individual volunteer",
    "NGO or clean-up movement",
    "Corporate or CSR team",
    "Student or college group",
    "Government or civic body",
    "Speaker or panellist",
    "Press and media",
    "Something else",
  ],
  /**
   * Must match one of `attendeeTypes` exactly. Selecting it is what opens the
   * One Mentor, Many Missions explanation inside the form, so a typo here silently
   * means the pitch session never explains itself to the people it is for.
   */
  ngoType: "NGO or clean-up movement",
  oneMentor: {
    eyebrow: "One Mentor, Many Missions",
    title: "Ten NGOs pitch. Five leave with a mentor.",
    body: [
      "A clean-up movement that wants to outlast its founders has to work like a business — revenue, a model, people who are paid to stay. Most never get in a room with anyone who has built one.",
      "One Mentor, Many Missions puts ten of them in that room. Apply through this form; ten are selected from everyone who applies; those ten give an elevator pitch to a panel of mentors on how they would scale their NGO into a business. Five of the ten are then chosen by that panel and carry on with them as mentors afterwards.",
    ],
    /**
     * How it runs, in three beats. Rendered as a numbered row inside the form —
     * the component supplies one icon per step in this order, so adding a fourth
     * means adding a fourth icon too.
     */
    steps: [
      {
        title: "Everyone applies here",
        body: "Tick the box below. NGOs of any size are welcome to — this is not a shortlist you have to already be on.",
      },
      {
        title: "Ten are selected",
        body: "The applications are read and ten NGOs are picked to take the stage at ICUC 3.0.",
      },
      {
        title: "Ten pitches, one panel",
        body: "Each of the ten gives an elevator pitch to a panel of mentors: how they would scale their NGO into a business.",
      },
      {
        title: "Five win a mentor",
        body: "Five of the ten are chosen by the panel and keep working with them afterwards — mentorship on turning the pitch into a business.",
      },
    ],
    /**
     * The gate on the form: ticking it opens the explanation above and the
     * application below. The hint has to carry that, because a bare tick box is
     * a decision asked before the information that would inform it — anyone who
     * has not chosen NGO in the dropdown is reading this line with no idea what
     * One Mentor, Many Missions is, and won't tick a box to find out unless told
     * that ticking is how they find out.
     */
    question: "I run an NGO and would like to pitch at One Mentor, Many Missions",
    hint: "Ten NGOs will be selected to pitch to a panel of mentors on how they would scale their NGO into a business, and five of the ten win mentorship from that panel. Tick this to read how it works and to open the application — nothing is submitted until you press Register, and you can untick it if it turns out not to be for you.",
    /**
     * The application, in four movements: who you are, where you are now, the
     * pitch, and the logistics.
     *
     * Only the third block is what the ten are *chosen* on. The first two are
     * there to keep it honest — a strong `pitch_model` from an organisation with
     * no work behind it should not outrank a real one — and the fourth is
     * housekeeping. If this ever has to get shorter, cut from the bottom and
     * from `ngo_founded`/`ngo_registered`, never from the pitch block.
     *
     * A `name` is what labels the answer in the inbox, so it is fixed the moment
     * the first application arrives. Renaming one later means two months of
     * submissions that no longer line up — add a new question instead.
     *
     * TODO (2026-08-28): drafted here so the form is usable, but the wording is
     * Freishia's call — she is the one who knows what the mentor panel needs in
     * order to pick ten out of the pile. Review with her before this goes out
     * anywhere, and settle it *before* applications start coming in, for the
     * renaming reason above.
     */
    questions: [
      // A. Who you are. Verification rather than scoring — "not registered yet"
      // must not disqualify anyone, since a two-year-old unregistered movement
      // scaling into a business is exactly who this session is for.
      {
        name: "ngo_name",
        label: "Name of your NGO or movement",
        placeholder: "Carter Clean Up",
      },
      {
        name: "ngo_link",
        label: "Website or Instagram",
        hint: "Wherever your work is visible",
        type: "url",
        placeholder: "https://instagram.com/…",
      },
      { name: "ngo_founded", label: "What year did you start?", placeholder: "2021" },
      {
        name: "ngo_city",
        label: "Which city or region do you work in?",
        placeholder: "Mumbai, Maharashtra",
      },
      {
        name: "ngo_registered",
        label: "Are you formally registered?",
        hint: "Section 8, Trust, Society, 12A, 80G — or not yet, which is fine",
        placeholder: "Section 8 company, 12A and 80G",
      },

      // B. Where you are now. `ngo_team` is the sharpest question here: "twelve
      // people, none paid" and "twelve people, four paid" are different
      // organisations, and it is the fastest read on whether scaling is a real
      // prospect or an aspiration.
      {
        name: "ngo_work",
        label: "In one or two sentences, what does your NGO actually do?",
        type: "textarea",
      },
      {
        name: "ngo_scale",
        label: "Your work in numbers",
        hint: "Volunteers, drives, waste collected, people reached — whatever you count",
        type: "textarea",
      },
      {
        name: "ngo_team",
        label: "How many people work on this, and how many are paid?",
        placeholder: "12 core volunteers, 2 paid full-time",
      },
      {
        name: "ngo_funding",
        label: "How is it funded today?",
        hint: "Grants, CSR, donations, your own pocket",
        type: "textarea",
      },

      // C. The pitch. This is what the ten are picked on. `pitch_blocker` is the
      // tiebreaker — an applicant who names a real constraint ("we can't
      // invoice, so corporates can't pay us") is a better bet than one who
      // writes "funding".
      {
        name: "pitch_model",
        label: "How would your NGO make money?",
        hint: "What would you sell, to whom, and why would they pay? About 150 words",
        type: "textarea",
      },
      {
        name: "pitch_five_year",
        label: "What is your 5 year plan?",
        hint: "Where you want the organisation to be by 2031, and what has to happen to get there",
        type: "textarea",
      },
      {
        name: "pitch_blocker",
        label: "What is the single biggest thing stopping you from scaling right now?",
        type: "textarea",
      },
      {
        name: "pitch_ask",
        label: "What do you want out of this room?",
        hint: "Be specific — capital, a customer, a distribution partner, an operator to hire",
        type: "textarea",
      },
      {
        name: "pitch_expectations",
        label: "What are your expectations from the mentorship?",
        hint: "Five of the ten carry on with the panel afterwards — what would you want a mentor to actually do with you?",
        type: "textarea",
      },

      // D. Logistics, and only what cannot wait. Attendance is deliberately not
      // asked here — the ten who are selected will be asked directly, and making
      // every applicant commit to a date before they know whether they are
      // pitching only costs applications. The deck is optional for the same kind
      // of reason: requiring one filters for NGOs that already have polish,
      // which is the opposite of who this is for.
      {
        name: "pitch_who",
        label: "Who will give the pitch from your organization?",
        optional: true,
      },
      {
        name: "pitch_deck",
        label: "Link to a deck or one-pager, if you have one",
        type: "url",
        optional: true,
      },
    ] satisfies RegistrationQuestion[],
    /** Stands in for the questions until they exist. Delete nothing when they do — this stays as the fallback. */
    pending: "The application questions are being finalised. Tick the box and submit, and we will email you the full application as soon as it opens — your place in the queue is already recorded.",
  },
  /**
   * The second tick box on the form, and a much smaller thing than the one
   * above it: a head count for the Red Fort clean-up, not an application.
   * Nobody is selected and nothing is asked beyond yes or no, so it gets one
   * question and a line of context rather than an explainer block — a second
   * unfolding panel next to `oneMentor` would make the form read as two
   * applications stacked on top of each other.
   *
   * Ticking it also routes a copy of the row onto its own tab of the
   * registrations sheet, so whoever runs the clean-up opens one tab and reads a
   * list of people who said yes. See `scripts/registrations.gs`.
   *
   * TODO (2026-09-02): the date, start time and meeting point aren't settled
   * yet, so `hint` says only what is true today. Put them in this line the
   * moment they are — a head count nobody can plan around is worth less than
   * one that comes with a place to be.
   */
  redFort: {
    question: "I'd like to join the Red Fort clean-up",
    hint: "A clean-up at the Red Fort, run alongside ICUC 3.0. Ticking this is a head count rather than a commitment — we'll email you the date, the start time and where to meet before anything is expected of you.",
  },
  /** Shown in place of the form once a registration goes through. */
  success: {
    title: "You're registered",
    body: `Thank you — your registration has reached the ICUC team. Keep ${site.dates} free — we are at ${site.venue} — and we will be in touch with the schedule as it is confirmed.`,
    again: "Register someone else",
  },
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
