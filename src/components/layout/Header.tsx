"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { nav } from "@/content/site";
import { EASE } from "@/lib/motion";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { Logo } from "./Logo";

/** The header strip's own height — `h-20` on the bar below. */
const HEADER_H = 80;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  // True while the key art's own "ICUC 3.0" wordmark is still below the header.
  // The artwork carries the mark for those moments, so a second copy in the
  // header would print it twice; the header's mark fades back in as soon as the
  // wordmark reaches the header strip — which on the portrait cut, where the
  // wordmark sits right under the header already, is straight away.
  const [wordmarkBelow, setWordmarkBelow] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const pathname = usePathname();

  // Transparent over the hero, solid once the user starts scrolling.
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      // Measured off the marker `Cover` puts on the wordmark rather than off a
      // scroll offset, so routes with no title card (contact, /classic, 404)
      // simply never hide the logo, the two cuts of the key art each get the
      // handover in the right place, and `h-svh` changing with the mobile URL bar
      // can't shift it. Re-read every scroll: cheap, and the rect is the only
      // thing that stays right through the intro's own animated scroll.
      const wordmark = document.getElementById("cover-wordmark");
      setWordmarkBelow(!!wordmark && wordmark.getBoundingClientRect().top > HEADER_H);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
    // The cover element belongs to the page, so re-measure when the route swaps.
  }, [pathname]);

  // The header used to invert to white text while it sat transparent over the
  // dark `Hero` banner. Nothing opens on that banner any more — `/` and
  // `/proposal` both lead with `Cover`, whose pale key art would swallow white
  // text, and `/classic`, `/contact` and 404 were always light. By the time the
  // banner is in view the page has scrolled, so the header is solid anyway.
  // Bring the inversion back if a route ever opens on `Hero` again.

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "border-b border-summit/60 bg-shell/85 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <div className="container-page flex h-20 items-center justify-between">
        {/* Kept mounted and only faded, so the header's layout never shifts and
            the mark can cross-fade with the artwork in both directions. Hidden
            from the tab order and from screen readers while it is invisible. */}
        <div
          className={`transition-opacity duration-500 ${
            wordmarkBelow ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
          aria-hidden={wordmarkBelow}
          inert={wordmarkBelow}
        >
          <Logo />
        </div>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-ink/75 transition-colors hover:bg-sky-50 hover:text-sky-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* No call-to-action button up here any more — the footer and `CtaBand`
            carry the route to /contact. */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="rounded-full p-2.5 text-ink transition hover:bg-sky-50 lg:hidden"
          >
            {open ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
          </button>
        </div>
      </div>

      {/* Pinned to the bottom of the `h-20` strip rather than the header's own
          bottom edge, so opening the mobile drawer doesn't drag it down the page. */}
      <ScrollProgress className="top-20" />

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            className="overflow-hidden border-t border-summit/60 bg-shell lg:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0.15 : 0.35, ease: EASE }}
          >
            {/* Delegated: any link inside dismisses the drawer. Covers same-page
                hash links too, which wouldn't trigger a route change. */}
            <ul
              onClick={() => setOpen(false)}
              className="container-page flex flex-col gap-1 py-5"
            >
              {nav.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: reduced ? 0 : -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, ease: EASE }}
                >
                  <Link
                    href={item.href}
                    className="block rounded-xl px-4 py-3 font-display text-xl text-ink transition hover:bg-sky-50"
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
