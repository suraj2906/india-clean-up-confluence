import { CalendarDays, Check, MapPin } from "lucide-react";

import type { RecapVideo } from "@/content/site";
import { editions, editionsSection } from "@/content/site";
import { PhotoStrip } from "@/components/ui/PhotoStrip";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";
import { TimelineRail } from "@/components/ui/TimelineRail";
import { VideoEmbed } from "@/components/ui/VideoEmbed";

/**
 * An edition's films, in source order — the first is the one that reads as *the*
 * after-movie, so the list is never sorted here.
 *
 * Each tile keeps its own title underneath. With one film that is mild
 * redundancy; with two it is the only thing telling a reader which is the recap
 * of the day and which is the room talking about it afterwards, and a caption
 * that appears only when there happen to be two would read as a glitch.
 *
 * The tiles are a `flex-wrap` row rather than a grid so a lone film sits at its
 * natural width instead of being stretched across a column it doesn't need.
 */
function RecapFilms({ videos }: { videos: RecapVideo[] }) {
  if (videos.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-5 sm:gap-6">
      {videos.map((video) => (
        <li key={video.src || video.title} className="w-40 shrink-0 sm:w-44">
          <VideoEmbed
            src={video.src}
            title={video.title}
            poster={video.poster}
            portrait={video.portrait}
            playLabel={editionsSection.recap.playLabel}
            pendingLabel={editionsSection.recap.videoPending}
            className="w-full"
          />
          <p className="mt-2.5 text-xs leading-snug text-muted">{video.title}</p>
        </li>
      ))}
    </ul>
  );
}

/**
 * Chapter three: 1.0 → 2.0 → 3.0 on a single rail. The list order in `site.ts`
 * is the chronology, so nothing here sorts or filters — it just renders it.
 */
export function Editions() {
  return (
    <section id="editions" className="scroll-mt-24 bg-shell py-24 sm:py-32">
      <div className="container-page">
        <div className="flex items-start gap-4">
          <span aria-hidden className="mt-1 font-display text-sm font-bold text-summit">
            03
          </span>
          <SectionHeading
            eyebrow={editionsSection.eyebrow}
            title={editionsSection.title}
            intro={editionsSection.intro}
          />
        </div>

        <ol className="relative mt-16">
          {/* The rail, drawn as you read down it — the chronology filling in
              rather than sitting there finished. */}
          <TimelineRail className="bottom-6 left-[15px] top-6" />

          {editions.map((edition, i) => {
            const upcoming = edition.status === "upcoming";
            return (
              <li key={edition.id} id={edition.id} className="relative scroll-mt-28 pb-10 pl-14 last:pb-0">
                <span
                  aria-hidden
                  className={`absolute left-0 top-5 grid size-8 place-items-center rounded-full border-4 border-shell ${
                    upcoming ? "bg-leaf" : "bg-sky"
                  }`}
                >
                  {!upcoming && <Check className="size-3.5 text-white" />}
                </span>

                <Reveal delay={i * 0.06}>
                  <article
                    className={`rounded-4xl p-7 transition-shadow duration-300 sm:p-10 ${
                      upcoming
                        ? "border-2 border-dashed border-leaf/40 bg-leaf-100/40"
                        : "border border-summit/60 bg-mist shadow-soft hover:shadow-lift"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-display text-sm font-bold uppercase tracking-[0.14em] text-ink">
                        {edition.name}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                          upcoming ? "bg-leaf text-white" : "bg-sky-100 text-sky-700"
                        }`}
                      >
                        {editionsSection.statusLabels[edition.status]}
                      </span>

                      {edition.logo && (
                        <SmartImage
                          src={edition.logo.src}
                          alt={edition.logo.alt}
                          width={edition.logo.width}
                          height={edition.logo.height}
                          className="ml-auto h-9 w-auto shrink-0 sm:h-10"
                        />
                      )}
                    </div>

                    <h3 className="mt-4 text-3xl font-bold sm:text-4xl">{edition.theme}</h3>
                    <p className="mt-3 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                      {edition.blurb}
                    </p>

                    <dl className="mt-7 flex flex-wrap gap-x-8 gap-y-3 text-sm">
                      <div className="flex items-center gap-2.5">
                        <dt className="sr-only">Date</dt>
                        <CalendarDays className="size-4 shrink-0 text-sky-700" aria-hidden />
                        <dd className="font-medium text-ink">{edition.date}</dd>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <dt className="sr-only">Venue</dt>
                        <MapPin className="size-4 shrink-0 text-sky-700" aria-hidden />
                        <dd className="font-medium text-ink">{edition.venue}</dd>
                      </div>
                    </dl>

                    <div className="mt-7 grid gap-7 border-t border-summit/60 pt-7 md:grid-cols-[1.25fr_1fr]">
                      <p className="text-sm leading-relaxed text-muted">{edition.body}</p>
                      <ul className="space-y-2.5">
                        {edition.highlights.map((highlight) => (
                          <li key={highlight} className="flex gap-2.5 text-sm leading-relaxed text-ink">
                            <span
                              aria-hidden
                              className="mt-1.5 size-1.5 shrink-0 rounded-full bg-leaf"
                            />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Recap: the films, plus a strip of photos once they exist.
                        An edition can carry more than one cut — ICUC 2.0 has the
                        after-movie and a separate testimonial reel — so the block
                        shows as soon as there is either a film or a photo. */}
                    {edition.recap &&
                      (edition.recap.videos.length > 0 || edition.recap.photos.length > 0) && (
                        <div className="mt-8 border-t border-summit/60 pt-8">
                          <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                            {editionsSection.recap.label}
                          </h4>

                          {edition.recap.photos.length > 0 ? (
                            <div className="mt-5 grid gap-6 sm:grid-cols-[minmax(0,15rem)_1fr] sm:items-start">
                              <RecapFilms videos={edition.recap.videos} />
                              <PhotoStrip
                                photos={edition.recap.photos}
                                label={editionsSection.recap.photosLabel}
                              />
                            </div>
                          ) : (
                            <div className="mt-5 flex flex-col items-start gap-5 sm:flex-row sm:gap-7">
                              <RecapFilms videos={edition.recap.videos} />
                              <p className="max-w-sm text-sm leading-relaxed text-muted sm:pt-2">
                                {editionsSection.recap.filmsIntro}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
