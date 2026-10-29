import type { MetadataRoute } from "next";
import { SITE_ORIGIN, absoluteUrl } from "@/lib/siteUrl";

/**
 * Crawl guidance only — not an authentication boundary.
 * Middleware remains the security control for /admin and /api/admin.
 * Host / sitemap URLs use SITE_ORIGIN (production domain TO CONFIRM).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_ORIGIN,
  };
}
