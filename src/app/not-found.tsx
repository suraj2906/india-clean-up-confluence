import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex min-h-[70svh] items-center bg-skywash py-32">
      <div className="container-page text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">404</p>
        <h1 className="text-section mt-3">This wave didn&apos;t reach the shore</h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted">
          The page you were looking for doesn&apos;t exist — or has moved somewhere cleaner.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/">Back to home</ButtonLink>
          <ButtonLink href="/contact" variant="ghost">
            Contact us
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
