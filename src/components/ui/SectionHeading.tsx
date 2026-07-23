import type { ReactNode } from "react";

import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  tone = "light",
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  /** `dark` inverts the colours for use on the forest-green bands. */
  tone?: "light" | "dark";
}) {
  const centered = align === "center";

  return (
    <div className={`max-w-2xl ${centered ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <Reveal>
          <p
            className={`mb-3 text-xs font-semibold uppercase tracking-[0.18em] ${
              tone === "dark" ? "text-marigold" : "text-ocean"
            }`}
          >
            {eyebrow}
          </p>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2 className={`text-section ${tone === "dark" ? "text-white" : ""}`}>{title}</h2>
      </Reveal>
      {intro && (
        <Reveal delay={0.1}>
          <div
            className={`mt-5 text-base leading-relaxed sm:text-lg ${
              tone === "dark" ? "text-white/75" : "text-muted"
            }`}
          >
            {intro}
          </div>
        </Reveal>
      )}
    </div>
  );
}
