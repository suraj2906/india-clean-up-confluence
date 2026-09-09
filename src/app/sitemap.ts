import type { MetadataRoute } from "next";

import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: site.url, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/carter-clean-up`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    // Registration is the page with a deadline on it, so it outranks contact and
    // is re-crawled more often than either of the evergreen pages.
    { url: `${site.url}/register`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/contact`, lastModified, changeFrequency: "yearly", priority: 0.8 },
    { url: `${site.url}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
