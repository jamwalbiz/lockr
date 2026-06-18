import type { MetadataRoute } from "next";

const BASE = "https://joinlockr.com";

// AI crawlers are explicitly welcomed (GEO). We WANT ChatGPT, Claude,
// Perplexity, and Google's AI surfaces reading and citing the education
// content, since AI-search referrals convert better than cold organic. The
// wildcard already allows them; the explicit allows signal intent and survive
// any future tightening of the "*" rule. /checkout and /api stay blocked.
const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  const blocked = ["/checkout", "/api/"];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: blocked },
      ...AI_BOTS.map((userAgent) => ({ userAgent, allow: "/", disallow: blocked })),
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
