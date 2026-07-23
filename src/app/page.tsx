import { About } from "@/components/sections/About";
import { Changemakers } from "@/components/sections/Changemakers";
import { CtaBand } from "@/components/sections/CtaBand";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { Partners } from "@/components/sections/Partners";
import { Stats } from "@/components/sections/Stats";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Stats />
      <Changemakers />
      <Gallery />
      <Partners />
      <CtaBand />
    </>
  );
}
