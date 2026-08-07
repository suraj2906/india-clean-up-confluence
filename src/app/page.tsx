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

/**
 * `Cover` is a title card, not a chapter — it holds the ICUC 3.0 key art for a
 * beat and then hands over. The chronology starts at `Hero` and should stay one:
 * the beach clean-up we started, how that became ICUC, then 1.0 → 2.0 → 3.0.
 * Everything after Editions is supporting material.
 */
export default function HomePage() {
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
