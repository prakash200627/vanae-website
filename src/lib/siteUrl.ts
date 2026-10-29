/**
 * Configured public origin for canonical / sitemap / robots absolute URLs.
 *
 * PRODUCTION DOMAIN TO CONFIRM — currently the Vercel preview host from the
 * prior audit. Replace with the client’s final domain before launch; do not
 * invent a custom domain here.
 */
export const SITE_ORIGIN = "https://vanae-website.vercel.app";

/** True when SITE_ORIGIN is still the provisional hosting URL. */
export const SITE_ORIGIN_IS_PROVISIONAL = true;

export function absoluteUrl(pathname = "/"): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (path === "/") {
    return SITE_ORIGIN;
  }
  return `${SITE_ORIGIN}${path}`;
}
