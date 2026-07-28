import Image from "next/image";
import Link from "next/link";

import { site } from "@/content/site";

/** The confluence mark — a leaf and a summit with the wave breaking in front of them. */
export function Logo({ tone = "light" }: { tone?: "light" | "dark" }) {
  const text = tone === "dark" ? "text-white" : "text-ink";
  const sub = tone === "dark" ? "text-white/60" : "text-muted";

  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label={`${site.fullName} — home`}>
      <Image
        src="/images/icuc-icon.png"
        alt=""
        aria-hidden
        width={510}
        height={424}
        className="h-9 w-auto shrink-0"
      />
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
