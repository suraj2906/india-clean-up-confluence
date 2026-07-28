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

export const nav = [
  { label: "Movement", href: "/#movement" },
  { label: "Editions", href: "/#editions" },
  { label: "Impact", href: "/#impact" },
  // { label: "Changemakers", href: "/#changemakers" },
  { label: "Gallery", href: "/#gallery" },
] as const;

export const hero = {
  eyebrow: "ICUC 3.0 — India Clean-Up Confluence",
  title: "One nation,\nmany missions",
  subtitle:
    "It started with one beach. It became a national confluence of everyone cleaning up India — coastlines, lakes, hills, streets. Bringing Cleanup Movements Under One roof.",
  primaryCta: { label: "Get involved", href: "/contact" },
  secondaryCta: { label: "How it started", href: "/#movement" },
  image: {
    src: "/images/hero/hero.jpg",
    alt: "Volunteers gathered on an Indian coastline during a community clean-up drive",
    width: 2400,
    height: 1600,
  } satisfies Img,
};

/** Chapter one: the clean-up movement that everything else grew out of. */
export const movement = {
  eyebrow: "Where it began",
  title: "Our beach clean-up movement",
  lead: "Carter Clean Up — 3.5 km of Carter Road, Bandra, cleaned every week since 2021.",
  body: [
    "Before there was a confluence, there was a beach. During the lockdown, Harold Fernandes started clearing plastic off the Carter Road shoreline and its mangroves almost every day. Inspired by that, five of us — Harold, Ashwin Malwade, Nupur Agarwal, Freishia B and Maansi Ahuja — founded Carter Clean Up on 24 June 2021 to take on the full 3.5-kilometre stretch, together with the Ek Saath Foundation.",
    "What started as a handful of people became a weekly ritual that more than a thousand volunteers have shown up for — tens of thousands of kilos of marine waste and illegal construction debris pulled off the beach and out of the mangroves. But years of it taught us something no amount of collected waste could: a single shoreline can be held by a single community, a coastline cannot. Willingness was never the bottleneck — every clean-up movement in the country was just solving the same problems alone.",
  ],
  /** Carter Clean Up's own mark — the collective that started this, not a confluence partner. */
  logo: {
    src: "/images/movement/carter-logo.png",
    alt: "Carter Clean Up logo",
    width: 980,
    height: 980,
  } satisfies Img,
  facts: [
    { value: "Est. 2021", label: "Carter Road, Bandra" },
    { value: "3.5 km", label: "Cleaned every week" },
    { value: "1,000+", label: "Volunteers, and counting" },
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

export const cta = {
  title: "One nation. Many missions. Room for yours.",
  body: "Whether you run a collective, lead a CSR programme, or simply want to show up on a Sunday morning — there is a place for you at the confluence.",
  button: { label: "Contact us", href: "/contact" },
};

export const contact = {
  eyebrow: "Get in touch",
  title: "Bring your mission to the confluence",
  body: "Tell us how you'd like to be involved and the right person from the ICUC team will get back to you.",
  email: "hello@indiacleanupconfluence.org",
  phone: "+91 00000 00000",
  location: "Mumbai, Maharashtra, India",
  note: "ICUC grew out of Carter Clean Up, the beach clean-up movement on Carter Road, Bandra, founded in 2021.",
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
