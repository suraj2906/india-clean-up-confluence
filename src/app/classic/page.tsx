import type { Metadata } from "next";

// import { Changemakers } from "@/components/sections/Changemakers";
import { Confluence } from "@/components/sections/Confluence";
import { CtaBand } from "@/components/sections/CtaBand";
import { Editions } from "@/components/sections/Editions";
import { Gallery } from "@/components/sections/Gallery";
import { HeroSplit } from "@/components/sections/HeroSplit";
import { Movement } from "@/components/sections/Movement";
import { Stats } from "@/components/sections/Stats";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Split-hero preview",
  description: `A preview of ${site.fullName} with the two-column hero instead of the full-bleed banner.`,
  alternates: { canonical: "/classic" },
  robots: { index: false, follow: false },
};

/**
 * The homepage with the two-column hero (`HeroSplit`) in place of the banner
 * (`Hero`). Everything below the fold is the same component in the same order
 * as `src/app/page.tsx` — the hero is the only variable.
 */
export default function ClassicPage() {
  return (
    <>
      <HeroSplit />
      <Movement />
      <Confluence />
      <Editions />
      <Stats />
      {/* <Changemakers /> */}
      <Gallery />
      <CtaBand />
    </>
  );
}
