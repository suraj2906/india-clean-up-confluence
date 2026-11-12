import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * `/privacy` is the real page. `/privacy-policy` is the other path people
   * type, and the one that may already have been written down somewhere, so it
   * lands on the same document rather than a 404 — permanent, one hop, no chain.
   */
  async redirects() {
    return [
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      /**
       * `/register` was ICUC 3.0's sign-up form, and its URL is on flyers and in
       * old posts. The event is over, so it goes home — temporary, because a
       * future edition may want the path back.
       */
      { source: "/register", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
