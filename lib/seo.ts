import type { Metadata } from "next";

export const SITE_URL = "https://joinlockr.com";

type PageMetaInput = {
  /** Full <title> for the browser tab. */
  title: string;
  description: string;
  /** Absolute path from the site root, e.g. "/blog". Used for canonical + og:url. */
  path: string;
  /** Social-card title. Defaults to `title`. Use a tighter line for unfurls. */
  ogTitle?: string;
  /** Social-card description. Defaults to `description`. */
  ogDescription?: string;
  noindex?: boolean;
  /** RSS feed URL to advertise via <link rel="alternate">. */
  rss?: string;
};

/**
 * Per-page metadata that actually unfurls AS the page.
 *
 * The root layout sets openGraph/twitter, so any page that defines only
 * `title`/`description` inherits the root's social card and every link previews
 * identically ("Lockr: Where serious bettors get serious edges"). This stamps
 * page-specific og:/twitter: title + description + canonical so each share
 * reflects its own page. The OG *image* intentionally stays the brand card
 * (file-based app/opengraph-image.png) for consistent branding.
 */
export function pageMeta({
  title,
  description,
  path,
  ogTitle,
  ogDescription,
  noindex,
  rss,
}: PageMetaInput): Metadata {
  const url = `${SITE_URL}${path}`;
  const ot = ogTitle ?? title;
  const od = ogDescription ?? description;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      ...(rss ? { types: { "application/rss+xml": rss } } : {}),
    },
    openGraph: { type: "website", url, siteName: "Lockr", title: ot, description: od },
    twitter: { card: "summary_large_image", title: ot, description: od },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
