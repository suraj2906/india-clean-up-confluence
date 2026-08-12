import type { Metadata } from "next";

import { carter } from "@/content/site";
import { CarterCta } from "@/components/sections/carter/CarterCta";
import { CarterFounders } from "@/components/sections/carter/CarterFounders";
import { CarterHero } from "@/components/sections/carter/CarterHero";
import { CarterNumbers } from "@/components/sections/carter/CarterNumbers";
import { CarterPhotos } from "@/components/sections/carter/CarterPhotos";
import { CarterStory } from "@/components/sections/carter/CarterStory";
import { Partners } from "@/components/sections/Partners";

export const metadata: Metadata = {
  title: "Carter Clean Up",
  description:
    "Carter Clean Up — the citizens' beach clean-up movement on Carter Road, Bandra, cleaning 3.5 km every week since 2021, and the movement the India Clean-Up Confluence grew out of.",
  alternates: { canonical: "/carter-clean-up" },
};

/**
 * The movement's own page. `Movement` on the landing page is chapter one of the
 * ICUC chronology and has to stay short; this is that chapter at full length —
 * how it started, what it adds up to, and the people who started it.
 *
 * There is no `Cover` here, so the header shows its logo throughout.
 */
export default function CarterCleanUpPage() {
  return (
    <>
      <CarterHero />
      <CarterStory />
      <CarterNumbers />
      <CarterFounders />
      <CarterPhotos />
      {/* The landing page's logo row, reframed for this page — same list, same
          position in the flow: the last argument before the ask. */}
      <Partners
        eyebrow={carter.partners.eyebrow}
        title={carter.partners.title}
        intro={carter.partners.intro}
      />
      <CarterCta />
    </>
  );
}
