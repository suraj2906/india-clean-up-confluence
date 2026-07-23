/**
 * Every piece of copy, every image reference, every link on the site lives here.
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
  tagline: "From Ripples to Waves",
  description:
    "India's national platform uniting clean-up movements, grassroots changemakers, corporates and policymakers behind scalable environmental action.",
  url: "https://indiacleanupconfluence.org",
} as const;

export const nav = [
  { label: "About", href: "/#about" },
  { label: "Impact", href: "/#impact" },
  { label: "Changemakers", href: "/#changemakers" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Partners", href: "/#partners" },
] as const;

export const hero = {
  eyebrow: "India Clean-Up Confluence",
  title: "From ripples\nto waves",
  subtitle:
    "One shoreline, one street, one stretch of riverbank at a time — ICUC brings India's clean-up movements together so that scattered efforts become a national tide.",
  primaryCta: { label: "Get involved", href: "/contact" },
  secondaryCta: { label: "See our impact", href: "/#impact" },
  image: {
    src: "/images/hero/hero.jpg",
    alt: "Volunteers gathered on an Indian coastline during a community clean-up drive",
    width: 2400,
    height: 1600,
  } satisfies Img,
};

export const about = {
  eyebrow: "What is ICUC",
  title: "India's first national confluence for clean-up action",
  body: [
    "Across India, thousands of people already give their weekends to beaches, lakes, hills and neighbourhood streets. They work in parallel, rarely in concert. The India Clean-Up Confluence exists to close that gap — a single table where grassroots collectives, corporates, civic bodies, sustainability experts and citizen volunteers plan together.",
    "Co-created by Carter Clean Up and Greenmyna, ICUC turns isolated drives into shared method: what gets measured, what gets funded, what actually scales. The second edition, held in Mumbai in September 2025, carried the theme From Ripples to Waves.",
  ],
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

/** Add or remove freely — the gallery grid and lightbox adapt to any count. */
export const gallery: Array<Img & { caption?: string }> = [
  {
    src: "/images/gallery/01.jpg",
    alt: "Six panellists standing together on stage with ICUC tote bags, in front of a screen showing the India Clean Up Confluence backdrop",
    caption: "Panel: scaling clean-ups beyond the weekend",
    width: 873,
    height: 701,
  },
  {
    src: "/images/gallery/02.jpg",
    alt: "Volunteers collecting waste along a beach",
    caption: "Shoreline drive",
    width: 1600,
    height: 1067,
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
];

export const partners: Array<Img & { name: string; href?: string }> = [
  {
    name: "Carter Clean Up",
    src: "/images/partners/carter.png",
    alt: "Carter Clean Up logo",
    width: 400,
    height: 160,
  },
  {
    name: "Greenmyna",
    src: "/images/partners/greenmyna.png",
    alt: "Greenmyna logo",
    width: 400,
    height: 160,
  },
  {
    name: "Partner Three",
    src: "/images/partners/three.png",
    alt: "Partner organisation logo",
    width: 400,
    height: 160,
  },
  {
    name: "Partner Four",
    src: "/images/partners/four.png",
    alt: "Partner organisation logo",
    width: 400,
    height: 160,
  },
  {
    name: "Partner Five",
    src: "/images/partners/five.png",
    alt: "Partner organisation logo",
    width: 400,
    height: 160,
  },
];

export const cta = {
  title: "Every wave starts as a ripple",
  body: "Whether you run a collective, lead a CSR programme, or simply want to show up on a Sunday morning — there is a place for you at the confluence.",
  button: { label: "Contact us", href: "/contact" },
};

export const contact = {
  eyebrow: "Get in touch",
  title: "Let's build the next wave together",
  body: "Tell us how you'd like to be involved and the right person from the ICUC team will get back to you.",
  email: "hello@indiacleanupconfluence.org",
  phone: "+91 00000 00000",
  location: "Mumbai, Maharashtra, India",
  note: "ICUC is co-created by Carter Clean Up and Greenmyna.",
  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "YouTube", href: "https://youtube.com" },
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
