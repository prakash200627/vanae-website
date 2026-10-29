import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/siteUrl";

/**
 * Public indexable routes only. Admin, login, and API paths are excluded.
 * Absolute URLs derive from SITE_ORIGIN (production domain TO CONFIRM).
 * No invented lastModified timestamps or unsupported public paths.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
