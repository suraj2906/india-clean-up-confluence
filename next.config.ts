import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * The confirmation email attaches a PDF from `public/pdfs/` and inline icons
   * from `public/images/email/`. Files in `public/`
   * are served statically but are not part of any server bundle, so the route
   * would find nothing on disk in production without this.
   */
  outputFileTracingIncludes: {
    "/api/register/confirm": ["./public/pdfs/**/*", "./public/images/email/**/*"],
  },

  /**
   * `/privacy` is the real page. `/privacy-policy` is the other path people
   * type, and the one that may already have been written down somewhere, so it
   * lands on the same document rather than a 404 — permanent, one hop, no chain.
   */
  async redirects() {
    return [{ source: "/privacy-policy", destination: "/privacy", permanent: true }];
  },
};

export default nextConfig;
