"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { nav } from "@/content/site";
import { EASE } from "@/lib/motion";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "./Logo";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const pathname = usePathname();

  // Transparent over the hero, solid once the user starts scrolling.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Routes whose hero is the dark full-bleed banner (`Hero`). The header is
  // transparent over it, so it has to invert to light text until scrolled past.
  // `/classic` is deliberately absent — it uses `HeroSplit`, which is light,
  // as do /contact and 404.
  const bannerHero = pathname === "/" || pathname === "/proposal";
  const overHero = bannerHero && !scrolled && !open;

  // The proposal route reskins to the pitch deck's palette (see globals.css).
  const deckThemed = pathname.startsWith("/proposal");

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
        deckThemed ? "theme-deck" : ""
      } ${
        scrolled || open
          ? "border-b border-summit/60 bg-shell/85 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <div className="container-page flex h-20 items-center justify-between">
        <Logo tone={overHero ? "dark" : "light"} />

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                overHero
                  ? "text-white/85 hover:bg-white/10 hover:text-white"
                  : "text-ink/75 hover:bg-sky-50 hover:text-sky-700"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ButtonLink href="/contact" className="hidden sm:inline-flex">
            Contact us
          </ButtonLink>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className={`rounded-full p-2.5 transition lg:hidden ${
              overHero ? "text-white hover:bg-white/10" : "text-ink hover:bg-sky-50"
            }`}
          >
            {open ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
          </button>
        </div>
      </div>

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
              <li className="mt-3 px-1 sm:hidden">
                <ButtonLink href="/contact" className="w-full">
                  Contact us
                </ButtonLink>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
