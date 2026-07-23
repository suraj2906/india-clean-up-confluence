import Link from "next/link";

import { site } from "@/content/site";

/**
 * Wordmark rendered as type + a ripple glyph, so the site has an identity
 * before any logo file is supplied. Swap the <svg> for an <Image> when one is.
 */
export function Logo({ tone = "light" }: { tone?: "light" | "dark" }) {
  const text = tone === "dark" ? "text-white" : "text-forest";
  const sub = tone === "dark" ? "text-white/60" : "text-muted";

  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label={`${site.fullName} — home`}>
      <svg viewBox="0 0 32 32" className="size-8 shrink-0" aria-hidden>
        <circle cx="16" cy="16" r="4" className="fill-leaf" />
        <circle
          cx="16"
          cy="16"
          r="9"
          className="fill-none stroke-ocean/60 transition-all duration-500 group-hover:stroke-ocean"
          strokeWidth="1.5"
        />
        <circle
          cx="16"
          cy="16"
          r="14"
          className="fill-none stroke-ocean/25 transition-all duration-500 group-hover:stroke-ocean/60"
          strokeWidth="1.5"
        />
      </svg>
      <span className="leading-tight">
        <span className={`block font-display text-lg font-bold tracking-tight ${text}`}>
          {site.name}
        </span>
        <span className={`block text-[10px] uppercase tracking-[0.14em] ${sub}`}>
          India Clean-Up Confluence
        </span>
      </span>
    </Link>
  );
}
