import type { Metadata } from "next";

// import { Changemakers } from "@/components/sections/Changemakers";
import { Confluence } from "@/components/sections/Confluence";
import { Cover } from "@/components/sections/Cover";
import { CtaBand } from "@/components/sections/CtaBand";
import { Editions } from "@/components/sections/Editions";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { Movement } from "@/components/sections/Movement";
import { Partners } from "@/components/sections/Partners";
import { Stats } from "@/components/sections/Stats";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Proposal preview",
  description: `${site.fullName} in the ICUC 3.0 pitch deck's palette — the same page as the homepage, at the URL shared with sponsors.`,
  alternates: { canonical: "/proposal" },
  robots: { index: false, follow: false },
};

/**
 * This route existed to preview the homepage in the ICUC 3.0 pitch deck's
 * palette. That palette is now the site's own — `.theme-deck` sits on <body>
 * (layout.tsx) — so this is simply the homepage at a second, unindexed URL,
 * kept alive for links already shared with sponsors.
 */
export default function ProposalPage() {
  return (
    <>
      <Cover />
      <Hero />
      <Movement />
      <Confluence />
      <Editions />
      <Stats />
      {/* <Changemakers /> */}
      <Gallery />
      <Partners />
      <CtaBand />
    </>
  );
}
