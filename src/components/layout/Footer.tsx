import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

import { contact, nav, site } from "@/content/site";
import { Logo } from "./Logo";

export function Footer() {
  // The deck palette used to be switched on here for `/proposal` only. It is on
  // <body> for every route now, so there is nothing route-specific left and this
  // is a plain server component again.
  return (
    <footer className="bg-deep text-white/70">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1.2fr] md:py-20">
        <div>
          <Logo tone="dark" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed">{site.description}</p>
          <p className="mt-5 text-sm text-white/50">
            {contact.note.before}
            <Link
              href={contact.note.link.href}
              className="text-white/70 underline underline-offset-2 transition-colors hover:text-sky-300"
            >
              {contact.note.link.label}
            </Link>
            {contact.note.after}
          </p>
        </div>

        <nav aria-label="Footer">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-white">
            Explore
          </h3>
          <ul className="space-y-2.5 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-sky-300">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contact" className="transition-colors hover:text-sky-300">
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-white">
            Reach us
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-sky-300" aria-hidden />
              <a href={`mailto:${contact.email}`} className="transition-colors hover:text-sky-300">
                {contact.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-sky-300" aria-hidden />
              <a
                href={`tel:${contact.phone.replace(/\s/g, "")}`}
                className="transition-colors hover:text-sky-300"
              >
                {contact.phone}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-sky-300" aria-hidden />
              <span>{contact.location}</span>
            </li>
          </ul>

          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {contact.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="transition-colors hover:text-sky-300"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.fullName}. All rights reserved.
          </p>
          <p>{site.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
