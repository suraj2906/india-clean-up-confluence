import type { Metadata } from "next";

// import { Changemakers } from "@/components/sections/Changemakers";
import { Confluence } from "@/components/sections/Confluence";
import { Cover } from "@/components/sections/Cover";
import { CtaBand } from "@/components/sections/CtaBand";
import { Editions } from "@/components/sections/Editions";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { Movement } from "@/components/sections/Movement";
import { Stats } from "@/components/sections/Stats";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Proposal preview",
  description: `A preview of ${site.fullName} restyled to the ICUC 3.0 pitch deck's palette — same content, sponsor-facing theme.`,
  alternates: { canonical: "/proposal" },
  robots: { index: false, follow: false },
};

/**
 * Same story, same data as the homepage (`src/app/page.tsx`) — this route
 * only exists to reskin it to the ICUC 3.0 pitch deck's palette for sponsor
 * review. The `.theme-deck` class (globals.css) is what does the reskinning:
 * every section below is the exact component the homepage uses, unchanged.
 */
export default function ProposalPage() {
  // `bg-shell` resolves to the deck's cyan wash inside `.theme-deck`, so the
  // wrapper carries it — <body> sits outside and keeps the site's white.
  return (
    <div className="theme-deck bg-shell">
      <Cover />
      <Hero />
      <Movement />
      <Confluence />
      <Editions />
      <Stats />
      {/* <Changemakers /> */}
      <Gallery />
      <CtaBand />
    </div>
  );
}
