import { Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { contact, site } from "@/content/site";
import { ContactForm } from "@/components/contact/ContactForm";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with the ${site.fullName} team — volunteer, partner, speak or reach out to the press desk.`,
  alternates: { canonical: "/contact" },
};

/**
 * A row can carry more than one value, because email does: ICUC's inbox and
 * Carter Clean Up's are both live. They sit under one "Email" heading rather
 * than in two rows, since two rows both labelled Email reads as a mistake.
 */
const details: Array<{
  icon: typeof Mail;
  label: string;
  /** `href` is optional — "Based in" is a place, not something to link to. */
  items: Array<{ text: string; href?: string }>;
}> = [
  {
    icon: Mail,
    label: "Email",
    items: [
      { text: contact.email, href: `mailto:${contact.email}` },
      { text: contact.emailAlt, href: `mailto:${contact.emailAlt}` },
    ],
  },
  {
    icon: Phone,
    label: "Phone",
    items: [{ text: contact.phone, href: `tel:${contact.phone.replace(/\s/g, "")}` }],
  },
  { icon: MapPin, label: "Based in", items: [{ text: contact.location }] },
];

export default function ContactPage() {
  return (
    <>
      {/* Padded for the fixed header, which is transparent at scroll position 0. */}
      <section className="bg-skywash pb-20 pt-36 sm:pt-44">
        <div className="container-page">
          <Reveal>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
              {contact.eyebrow}
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="text-section max-w-2xl">{contact.title}</h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              {contact.body}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-shell pb-24 pt-16 sm:pb-32">
        <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <h2 className="text-2xl">Reach us directly</h2>

              <ul className="mt-8 space-y-6">
                {details.map(({ icon: Icon, label, items }) => (
                  <li key={label} className="flex items-start gap-4">
                    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                        {label}
                      </span>
                      {items.map(({ text, href }) =>
                        href ? (
                          <a
                            key={text}
                            href={href}
                            className="mt-1 block break-words font-medium text-ink transition-colors hover:text-sky-700"
                          >
                            {text}
                          </a>
                        ) : (
                          <span key={text} className="mt-1 block font-medium text-ink">
                            {text}
                          </span>
                        ),
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 border-t border-summit pt-8">
                <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                  Follow the movement
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {contact.socials.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-block rounded-full border border-summit px-4 py-2 text-sm text-ink transition-colors hover:border-sky hover:bg-sky-50"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-8 text-sm leading-relaxed text-muted">
                  {contact.note.before}
                  <Link
                    href={contact.note.link.href}
                    className="font-medium text-sky-700 underline underline-offset-2 transition-colors hover:text-deep"
                  >
                    {contact.note.link.label}
                  </Link>
                  {contact.note.after}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
