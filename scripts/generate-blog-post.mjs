// Auto-feed generator for The Edge (Lockr's blog).
//
// Generates ONE high-quality, compliance-reviewed post about a current sports
// or prediction-market topic and writes it to content/blog/<slug>.md. Run by
// the .github/workflows/auto-blog.yml schedule (GitHub Actions), which commits
// + pushes the result so Vercel redeploys. Can also be run locally:
//
//   ANTHROPIC_API_KEY=sk-... node scripts/generate-blog-post.mjs
//
// Needs only ANTHROPIC_API_KEY. Uses the web_search tool so posts are grounded
// in real, current sources. A strict brand + compliance brief plus a built-in
// self-review keep it honest (no fabricated stats, no guarantees, brand voice).
// It auto-publishes; to require human review first, have the Action open a PR
// instead of pushing to main (see the workflow file).
import fs from "node:fs";
import path from "node:path";

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error("Missing ANTHROPIC_API_KEY");
  process.exit(1);
}

const MODEL = process.env.BLOG_MODEL || "claude-sonnet-4-6";
const BLOG_DIR = path.join(process.cwd(), "content/blog");

const existingFiles = fs.existsSync(BLOG_DIR)
  ? fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"))
  : [];
const existingSlugs = existingFiles.map((f) => f.replace(/\.md$/, ""));

// Pull the human title + category of every existing post so the model can see
// what's already been covered. Slugs alone read as cryptic; titles make the
// "don't repeat a topic" instruction actually bite, which matters now that we
// publish several times a day.
const existingPosts = existingFiles.map((f) => {
  const raw = fs.readFileSync(path.join(BLOG_DIR, f), "utf8");
  const title = (raw.match(/^title:\s*["']?(.+?)["']?\s*$/m) || [])[1] || f;
  const category = (raw.match(/^category:\s*["']?(.+?)["']?\s*$/m) || [])[1] || "";
  return { title, category };
});
const existingTitles = existingPosts.map((p) => p.title);

const today = new Date().toISOString().slice(0, 10);

const BRAND = `
BRAND: Lockr (joinlockr.com). This is "The Edge", Lockr's blog: a general sports + prediction-market publication (news, analysis, strategy). Members of Lockr tail (copy) the daily plays founder JT posts across sports and prediction markets like Kalshi and Polymarket, which are treated as equal to traditional sports betting.

VOICE: confident, plain-spoken, premium. A winning teammate. Never cheesy, hype-spammy, or jargony.

HARD WRITING RULES (non-negotiable):
- NO em dashes anywhere. Use periods or commas.
- Never say "guaranteed" or "risk-free". Never call Lockr a "picks service", "capper", "handicapper", "tout", or use "grinder".
- Plain English, short punchy sentences. Treat sports and prediction markets as equal.

COMPLIANCE / HONESTY (YMYL gambling content):
- Education and entertainment only. Opinions, not financial or wagering advice.
- DO NOT fabricate stats, odds, prices, volumes, market share, win rates, or profit. Any number or current fact MUST come from a real source you found via web search, cited inline as a markdown link. If you cannot verify it, keep the point qualitative.
- No "you will win" framing. Weave in responsible-gambling framing where natural (bet only what you can afford to lose, 21+ and jurisdiction-dependent, 1-800-GAMBLER).
`;

const prompt = `${BRAND}

Write ONE complete blog post for The Edge, today (${today}).

Pick a fresh, genuinely useful sports-betting or prediction-market topic that is timely or evergreen. Use web search to ground anything factual.

We publish several posts a day, so VARIETY MATTERS. Do NOT repeat, paraphrase, or closely overlap any of these already-published titles, and pick a different angle and category from the most recent ones:
${existingTitles.map((t) => `- ${t}`).join("\n") || "- (none yet)"}

Lean toward whatever is genuinely in the news right now (a specific game, matchup, election market, economic print, or league storyline) so multiple posts in the same day stay distinct. If you cover an evergreen concept, take an angle none of the above already takes.

Requirements:
- 700 to 1300 words. Lead with a direct, quotable answer in the first 2-3 sentences (so AI search engines can cite it).
- Question-led H2 headings. Include exactly one sharp pull-quote as a "> " blockquote.
- Cite real sources inline as markdown links wherever you state a fact or number.
- Brand voice. No em dashes. No fabricated data.
- Before you finalize, self-review against every hard rule and compliance point above and fix any violation.

Output ONLY the complete markdown file, nothing else. It must start with YAML frontmatter in exactly this shape, then a blank line, then the body:

---
title: "..."
description: "... (<=155 chars)"
date: "${today}"
category: "Strategy"  # one of Strategy, Prediction Markets, Sports, Markets, Explainer
author: "JT, founder of Lockr"
readMinutes: 7
keywords: ["...", "..."]
slug: "kebab-case-slug"
faq:
  - q: "..."
    a: "..."
  - q: "..."
    a: "..."
---

(body markdown here)`;

const body = {
  model: MODEL,
  max_tokens: 5000,
  tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 6 }],
  messages: [{ role: "user", content: prompt }],
};

const res = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "x-api-key": API_KEY,
    "anthropic-version": "2023-06-01",
    "content-type": "application/json",
  },
  body: JSON.stringify(body),
});

if (!res.ok) {
  console.error("Anthropic API error", res.status, await res.text());
  process.exit(1);
}

const data = await res.json();
const md = (data.content || [])
  .filter((b) => b.type === "text")
  .map((b) => b.text)
  .join("")
  .trim();

if (!md.startsWith("---")) {
  console.error("Model did not return frontmatter. Got:\n", md.slice(0, 400));
  process.exit(1);
}

const fm = md.slice(3, md.indexOf("\n---", 3));
const slugMatch = fm.match(/^slug:\s*["']?([a-z0-9-]+)["']?\s*$/m);
let slug = slugMatch ? slugMatch[1] : "";
if (!slug) {
  const titleMatch = fm.match(/^title:\s*["']?(.+?)["']?\s*$/m);
  slug = (titleMatch ? titleMatch[1] : `post-${today}`)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

if (existingSlugs.includes(slug)) {
  slug = `${slug}-${today}`;
}

fs.mkdirSync(BLOG_DIR, { recursive: true });
const outPath = path.join(BLOG_DIR, `${slug}.md`);
fs.writeFileSync(outPath, md.endsWith("\n") ? md : md + "\n");

// Expose the slug to the GitHub Action for the commit message.
if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `slug=${slug}\n`);
}
console.log(`Wrote content/blog/${slug}.md (${md.length} chars)`);
