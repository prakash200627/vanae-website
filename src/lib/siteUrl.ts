/**
 * Configured public origin for canonical / sitemap / robots absolute URLs.
 *
 * Configurable via NEXT_PUBLIC_SITE_URL or SITE_URL environment variable.
 * When neither is provided, safely falls back to the provisional domain.
 */
const DEFAULT_SITE_ORIGIN = "https://vanae-website.vercel.app";

function resolveSiteOrigin(): string {
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.SITE_URL?.trim();

  if (envUrl) {
    // Strip trailing slashes for uniform url concatenation
    return envUrl.replace(/\/+$/, "");
  }

  return DEFAULT_SITE_ORIGIN;
}

export const SITE_ORIGIN = resolveSiteOrigin();

/** True when SITE_ORIGIN is still using the default provisional hosting URL. */
export const SITE_ORIGIN_IS_PROVISIONAL = SITE_ORIGIN === DEFAULT_SITE_ORIGIN;

export function absoluteUrl(pathname = "/"): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (path === "/") {
    return SITE_ORIGIN;
  }
  return `${SITE_ORIGIN}${path}`;
}
