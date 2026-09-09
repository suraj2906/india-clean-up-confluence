import type { Metadata } from "next";

import { privacy, site } from "@/content/site";
import type { PrivacyBlock } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: `How ${site.fullName} collects, uses and deletes personal data — including where our WhatsApp outreach gets phone numbers from, and how to stop it.`,
  alternates: { canonical: "/privacy" },
};

/**
 * The privacy policy. A server component with no client JavaScript in it at
 * all, deliberately: Meta fetches this URL automatically before it will publish
 * a WhatsApp Business app, and a page whose text only appears after hydration
 * reads as an empty page to a fetcher. Everything below is in the prerendered
 * HTML. Don't add `"use client"` here, and don't move the copy into a component
 * that needs one.
 *
 * The wording lives in `privacy` in `site.ts`, like every other line on the
 * site. This file is layout only.
 *
 * There is no `#cover-wordmark` on this route, so the header keeps its logo —
 * same as `/contact` and `/register`.
 */
export default function PrivacyPage() {
  return (
    <>
      {/* Padded for the fixed header, which is transparent at scroll position 0. */}
      <section className="bg-skywash pb-20 pt-36 sm:pt-44">
        <div className="container-page">
          <Reveal>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
              {privacy.eyebrow}
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="text-section max-w-2xl">{privacy.title}</h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              {privacy.lead}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-6 text-sm font-medium text-sky-700">{privacy.effective}</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-shell pb-24 pt-16 sm:pb-32">
        <div className="container-page mx-auto max-w-3xl">
          {/* One list of anchors, so a reviewer — or someone who arrived from a
              message and wants one answer — can jump rather than read. */}
          <Reveal>
            <nav aria-label="On this page" className="rounded-3xl border border-summit p-6 sm:p-8">
              <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                On this page
              </h2>
              <ul className="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
                {privacy.sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="text-sky-700 underline underline-offset-2 transition-colors hover:text-deep"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>

          {privacy.sections.map((section, i) => (
            <Reveal key={section.id}>
              <section
                id={section.id}
                // `scroll-mt` clears the fixed header when an anchor is followed.
                // Each section sits in its own `Reveal` wrapper, so the rule
                // between them is drawn from the index rather than `first-of-type`.
                className={`scroll-mt-28 ${i === 0 ? "mt-10" : "mt-12 border-t border-summit pt-10"}`}
              >
                <h2 className="text-2xl">{section.title}</h2>
                <div className="mt-5 space-y-5">
                  {section.blocks.map((block, i) => (
                    <Block key={i} block={block} />
                  ))}
                </div>
              </section>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

function Block({ block }: { block: PrivacyBlock }) {
  if ("list" in block) {
    return (
      <ul className="space-y-3 pl-5">
        {block.list.map((item) => (
          <li key={item} className="list-disc text-base leading-relaxed text-muted">
            {withLinks(item)}
          </li>
        ))}
      </ul>
    );
  }

  // `whitespace-pre-line` is here for one block — the registered office in
  // "Contact us", which is set as an address over several lines. Every other
  // paragraph is a single line of copy and is unaffected by it.
  return (
    <p className="whitespace-pre-line text-base leading-relaxed text-muted">{withLinks(block.p)}</p>
  );
}

/**
 * The one piece of markup the copy is allowed to carry: `[label](href)`.
 *
 * A privacy policy links out mid-sentence half a dozen times — to WhatsApp's
 * policy, to Google's, to our own inbox — and the before/link/after triples
 * used elsewhere in `site.ts` (see `contact.note`) get unreadable at that
 * count. Splitting on a two-group regex yields plain text at every third index,
 * then the label, then its href.
 */
const LINK = /\[([^\]]+)\]\(([^)]+)\)/g;

function withLinks(text: string) {
  const parts = text.split(LINK);

  return parts.map((part, i) => {
    // Every third part is literal text; the two after it are one link's label
    // and href, and the href is consumed by the label rather than rendered.
    if (i % 3 === 0) return part;
    if (i % 3 === 2) return null;

    const href = parts[i + 1];
    const external = href.startsWith("http");

    return (
      <a
        key={i}
        href={href}
        {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
        className="font-medium text-sky-700 underline underline-offset-2 transition-colors hover:text-deep"
      >
        {part}
      </a>
    );
  });
}
