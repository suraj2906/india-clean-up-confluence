// import { Changemakers } from "@/components/sections/Changemakers";
import { Confluence } from "@/components/sections/Confluence";
import { CtaBand } from "@/components/sections/CtaBand";
import { Editions } from "@/components/sections/Editions";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { Movement } from "@/components/sections/Movement";
import { Stats } from "@/components/sections/Stats";

/**
 * The page is a chronology and should stay one: the beach clean-up we started,
 * how that became ICUC, then 1.0 → 2.0 → 3.0. Everything after Editions is
 * supporting material.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
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
