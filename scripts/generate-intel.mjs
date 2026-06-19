// Auto-feed generator for @joinlockr (Lockr's betting / prediction-market news page).
//
// Each run: Claude (with live web search) finds the day's most surprising, real,
// "somebody's wrong" angles from public data (Kalshi/Polymarket odds, sportsbook
// line moves, public-betting splits, big results), writes 1-3 on-brand news cards
// + captions as strict JSON, renders each as a branded image via /api/intel-card,
// and drops a ready-to-post DRAFT into a Discord content-queue channel for JT to
// approve + post. Optionally auto-posts to Instagram (off by default).
//
// Run by .github/workflows/auto-intel.yml (GitHub Actions cron). Also locally:
//   ANTHROPIC_API_KEY=sk-... DISCORD_WEBHOOK_CONTENT=https://discord.com/api/webhooks/... \
//     node scripts/generate-intel.mjs
//
// ENV:
//   ANTHROPIC_API_KEY        (required) Anthropic key.
//   DISCORD_WEBHOOK_CONTENT  (required) webhook for the #content-queue channel
//                            (falls back to DISCORD_WEBHOOK_URL).
//   SITE_BASE                (optional) default https://joinlockr.com — where the
//                            public /api/intel-card image is served from.
//   INTEL_MODEL              (optional) default claude-sonnet-4-6.
//   INTEL_COUNT              (optional) how many posts to draft, default 2 (max 3).
//   INTEL_AUTOPOST           (optional) "1" = also auto-post to Instagram.
//   IG_USER_ID, IG_ACCESS_TOKEN (only if INTEL_AUTOPOST=1) IG Graph API creds.
//
// SAFETY: default mode only drafts to Discord (human approves + posts). A built-in
// compliance brief + a banned-phrase filter keep it honest (no fabricated numbers,
// no guarantees, no income claims, 21+/responsible-gambling).

import { buildSourceBrief } from "./intel-sources.mjs";

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error("Missing ANTHROPIC_API_KEY");
  process.exit(1);
}
const WEBHOOK = process.env.DISCORD_WEBHOOK_CONTENT || process.env.DISCORD_WEBHOOK_URL;
if (!WEBHOOK) {
  console.error("Missing DISCORD_WEBHOOK_CONTENT (or DISCORD_WEBHOOK_URL)");
  process.exit(1);
}

const MODEL = process.env.INTEL_MODEL || "claude-sonnet-4-6";
const BASE = (process.env.SITE_BASE || "https://joinlockr.com").replace(/\/$/, "");
const COUNT = Math.max(1, Math.min(3, Number(process.env.INTEL_COUNT) || 2));
const AUTOPOST = process.env.INTEL_AUTOPOST === "1";
const today = new Date().toISOString().slice(0, 10);

// Phrases that must never reach a caption/card. Defensive net on top of the brief.
const BANNED = /\b(guaranteed|guarantee|risk[-\s]?free|can'?t lose|sure thing|lock of the (day|week|night)|easy money|free money|you will (win|profit)|get rich)\b/i;

const PROMPT = `You write @joinlockr: a fast, premium NEWS feed for the sports-betting + prediction-market world. Lockr (joinlockr.com) is a daily picks membership, but @joinlockr is NOT a sales page and NOT an opinionated analyst. Lockr is the CURATOR / intermediary that sits on top and surfaces the exciting stuff so people want to get in (and do it through Lockr). Think a viral sports/markets NEWS page (the energy of @overtime or a fintech news page), positive and share-worthy. The news is the hero; Lockr is a subtle byline.

Today is ${today}. The FIFA World Cup 2026 is live (US/Canada/Mexico) — favor a great World Cup angle when there is one.

A LIVE SIGNAL block of real current data (Polymarket + Kalshi 24h volume + odds, recent news headlines) may appear ABOVE this prompt. Treat it as your PRIMARY read on what is hot right now: the highest 24h volume markets are literally the most "viral" markets at this moment, and those numbers are already verified, so you may use them directly and cite the platform as the source without re-searching. Then USE WEB SEARCH to (a) add color to and verify the signal, (b) find BIG WIN / longshot / record-payout stories the signal cannot contain, and (c) confirm any number not already in the signal. If no signal block appears, rely on web search alone.

ROTATE the lanes below so the feed is varied (do NOT make most posts "market odds" posts):
- BIG WIN / record payout: someone just won $X (a single account, a record cashout). The giant number is the hero.
- LONGSHOT THAT HIT: a small stake turned into a huge payout. The gap IS the visual (stat = the payout, statLabel describes the stake).
- WILD BET PLACED: someone put $X on one match or market. The stake size is the hero; spectacle framing, no outcome promise.
- MARKET / VOLUME RECORD: a Polymarket/Kalshi volume record or all-time-high single day. One jaw-drop number.
- PLATFORM MILESTONE: a big round number a platform just crossed (total volume, users).
- HEAD-TO-HEAD: a category race (e.g. Kalshi vs Polymarket volumes) -> use the stat2 fields.
- INDUSTRY / REGULATORY: a launch, funding, partnership, legal win, or new-market-live, framed as a tailwind ("here's what you can get in on now").
- SPORTS / ODDS SHIFT: a result that moved a market, a World Cup title-odds shift, an upset's market impact.
- WILD MEASURABLE STAT: one shocking sports/culture number that doubles as prop context (brand-safe, evergreen).
- HEART VS MARKET: fans/public % vs market % (great for "bet on your country") -> use the stat2 fields.
- WORLD CUP TENTPOLE: event volume, a favorite's implied odds, or a final countdown.

Lean on a GIANT hero number. Use full magnitude for shock ($50,000,000,000 can hit harder than $50B on a milestone). Show raw odds in full when the length is the point. Contrast pairs (e.g. a $427K stake to a $4.7M payout) are the highest-performing layout.

Pick the ${COUNT} best, most varied stories. Frame everything POSITIVELY and excitingly to make people want to participate, but stay honest and non-predatory: celebrate wins, records, and drama; do not glorify someone's ruin or imply the reader is guaranteed anything.

For each, set a content "type" tag and (when there is a real number) a supporting stat.

HARD RULES (non-negotiable):
- NO em dashes. NO "guaranteed" / "risk-free" / income or "you will win" claims. Never call Lockr a "picks service", "capper", "handicapper", or "tout". Plain English, confident, exciting, not hype-spam.
- DO NOT fabricate any number, name, odds, price, %, payout, or volume. Every stat AND the core fact of every story MUST come from a real source you found via web search, listed in "sources". If you cannot verify it, pick a different story. No invented "a trader won $2M" stories.
- Education and entertainment only, not advice. Keep responsible-gambling sensibility (no predatory framing). The CTA lives in the caption, never on the card.
VIRAL COPY (write the way the top sports/markets/betting news pages actually write — Overtime, House of Highlights, B/R Betting, Polymarket, Kalshi — punchy, breaking, "tweetable not polished", built for comments and shares; NOT corporate):
- HEADLINE (on the card) = 4 to 9 words, sports-desk CHYRON energy. Lead with the single most shocking element (the giant number or the absurdity). Short staccato fragments are great; present tense / "just". You MAY use ALL CAPS or hard fragments for impact. Cadence to match: "ONE TRADER. ONE DAY. $9.24M." / "A $20 bet just hit for $1.2M." / "Nobody saw this coming." / "Spain just took over the World Cup." Make someone stop scrolling in under half a second.
- Use the type tag "BREAKING" or "JUST IN" when a story is genuinely fresh.
- sub = one short, plain-English context line (what / where).
- CAPTION (this is the reach engine, 3 to 4 short lines):
   (1) HOOK: restate the shock, punchy and casual ("$20 into $1.2M. On ONE slip. 🤯").
   (2) CONTEXT: one quick line (what happened + the source).
   (3) ENGAGEMENT BAIT: a question that makes people comment / tag a friend ("Would you have tailed this?" / "Tailing or fading?" / "Who's cashing this one?" / "Tag someone who needs to see this.").
   (4) SOFT CTA: "We tail the edges across sports + markets. Link in bio." or "Plays drop daily on Lockr."
  Casual, confident, a little irreverent. 0 to 2 tasteful emoji max. No corporate voice, no hype-spam, no income promises.
- hashtags = 6 to 10 (broad + niche; World Cup tags like #WeAre26 when relevant), placed last. For World Cup posts, name the countries in the caption.

Output ONLY a JSON object (no prose, no markdown fences) in EXACTLY this shape:
{
  "posts": [
    {
      "type": "BIG WIN | MARKET NEWS | INDUSTRY | SPORTS | ODDS | WORLD CUP | HEART VS MARKET",
      "headline": "the 5-12 word exciting news",
      "source": "Polymarket | Kalshi | ESPN | etc (where the story is from)",
      "stat": "a REAL supporting number if the story has one, e.g. $2.3M or 71% or $500M, else empty string",
      "statLabel": "short label/context for the stat, e.g. on a single Kalshi contract, else empty string",
      "stat2": "second REAL number for HEART VS MARKET or HEAD-TO-HEAD, else empty string",
      "stat2Label": "label for stat2, e.g. fans back them / Polymarket, else empty string",
      "sub": "one plain-English context sentence",
      "caption": "the 2-4 line IG caption (CTA goes here, not on the card)",
      "hashtags": "#tag1 #tag2 ...",
      "sources": ["https://real-source-url"]
    }
  ]
}`;

async function callClaude(brief) {
  const signal =
    brief && brief.text
      ? `LIVE SIGNAL (real data pulled seconds ago, straight from the platforms — VERIFIED, the highest 24h volume = the most viral markets right now). Use these numbers directly and cite the platform; you do NOT need to re-verify a number that appears here:\n\n${brief.text}\n\n---\n\n`
      : "";
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 3500,
      tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 8 }],
      messages: [{ role: "user", content: signal + PROMPT }],
    }),
  });
  if (!res.ok) {
    console.error("Anthropic API error", res.status, await res.text());
    process.exit(1);
  }
  const data = await res.json();
  return (data.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
}

function extractJson(text) {
  // Prefer a fenced block; otherwise take the outermost { ... }.
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  let raw = fence ? fence[1] : text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  raw = raw.slice(start, end + 1);
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Background library: content category -> available /public image paths. All are
// AI-generated / owned abstract scenes (NO real people, teams, or logos) so the
// feed is legal to run unattended. The generator auto-picks one per post by the
// story's type/keywords; add files here as the library grows (drop them in
// /public/intel-bg/<category>/ and list the path).
const BG_LIBRARY = {
  markets: ["/intel-bg/markets/01.png"],
  sports: ["/intel-bg/sports/01.jpg"],
  worldcup: ["/intel-bg/worldcup/01.jpg"],
  money: ["/intel-bg/money/01.jpg"],
};

// Map a post to a background category from its type tag + a few keyword hints.
function bgCategory(p) {
  const tag = (p.type || p.kicker || "").toUpperCase();
  const hay = `${p.type} ${p.headline} ${p.sub}`.toLowerCase();
  if (/world\s?cup|fifa|\bgroup stage\b|knockout/.test(hay) || tag.includes("WORLD")) return "worldcup";
  if (tag.includes("HEART")) return "worldcup"; // heart-vs-market = bet on your country
  if (/payout|cashout|cashed out|parlay|jackpot|won \$|\bwin(s|ner)?\b/.test(hay) || tag.includes("WIN")) return "money";
  if (tag.includes("SPORT") || tag.includes("ODDS") || /\bnba\b|\bnfl\b|\bmlb\b|\bufc\b|soccer|match|game\b/.test(hay)) return "sports";
  // everything else (markets, industry, wild stats, head-to-head, default) -> the
  // abstract candlestick/markets scene, which is also the safe fallback.
  return "markets";
}

// Pick a background path for a post. Rotation is deterministic per-headline so the
// feed varies but a given story always renders the same. Falls back to markets.
function pickBg(p) {
  const cat = bgCategory(p);
  const list = (BG_LIBRARY[cat] && BG_LIBRARY[cat].length ? BG_LIBRARY[cat] : BG_LIBRARY.markets) || [];
  if (!list.length) return "";
  let h = 0;
  for (const ch of String(p.headline || "")) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return list[h % list.length];
}

function cardUrl(p) {
  const qs = new URLSearchParams();
  const set = (k, v) => {
    if (v != null && String(v).trim()) qs.set(k, String(v));
  };
  set("type", p.type || p.kicker);
  set("headline", p.headline);
  set("source", p.source);
  set("stat", p.stat);
  set("statLabel", p.statLabel);
  set("stat2", p.stat2);
  set("stat2Label", p.stat2Label);
  set("sub", p.sub);
  set("watermark", p.source);
  set("bg", pickBg(p));
  return `${BASE}/api/intel-card?${qs.toString()}`;
}

async function postDraft(p, url, ig) {
  const tone = 0x00ff85;
  const sources = Array.isArray(p.sources) ? p.sources.filter(Boolean) : [];
  const igLine = ig
    ? ig.posted
      ? "\n\n:white_check_mark: Auto-posted to Instagram."
      : `\n\n:warning: IG auto-post skipped: ${ig.reason}`
    : "";
  const desc =
    "**Caption** (copy this):\n```\n" +
    `${p.caption}\n\n${p.hashtags}` +
    "\n```" +
    (sources.length ? `\nSources: ${sources.join("  ")}` : "") +
    `\n[Card image](${url})` +
    igLine;
  const res = await fetch(WEBHOOK, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      username: "Lockr Intel",
      content: `:newspaper:  New @joinlockr draft  ·  ${(p.type || p.kicker || "").toString()}`,
      embeds: [{ color: tone, title: p.headline, description: desc, image: { url } }],
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) {
    console.error("Discord error", res.status, (await res.text()).slice(0, 200));
    return false;
  }
  return true;
}

async function igPost(url, caption, hashtags) {
  const uid = process.env.IG_USER_ID;
  const tok = process.env.IG_ACCESS_TOKEN;
  if (!uid || !tok) return { posted: false, reason: "IG_USER_ID / IG_ACCESS_TOKEN not set" };
  const v = "v21.0";
  const fullCaption = `${caption}\n\n${hashtags}`;
  try {
    const create = await fetch(`https://graph.facebook.com/${v}/${uid}/media`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ image_url: url, caption: fullCaption, access_token: tok }),
    });
    const cj = await create.json();
    if (!create.ok || !cj.id) return { posted: false, reason: JSON.stringify(cj).slice(0, 180) };
    await new Promise((r) => setTimeout(r, 5000));
    const pub = await fetch(`https://graph.facebook.com/${v}/${uid}/media_publish`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ creation_id: cj.id, access_token: tok }),
    });
    const pj = await pub.json();
    return pub.ok && pj.id ? { posted: true, id: pj.id } : { posted: false, reason: JSON.stringify(pj).slice(0, 180) };
  } catch (err) {
    return { posted: false, reason: String(err).slice(0, 180) };
  }
}

// Pull live movers first (best-effort; never blocks generation), then generate.
let brief = null;
try {
  brief = await buildSourceBrief();
  const counts = `${brief.poly.length} Polymarket / ${brief.kalshi.length} Kalshi / ${brief.news.length} news`;
  console.log(brief.text ? `Live signal: ${counts}.` : "Live signal empty; falling back to web search.");
} catch (err) {
  console.warn("Live signal failed; falling back to web search:", String(err).slice(0, 160));
}

const text = await callClaude(brief);
const parsed = extractJson(text);
if (!parsed || !Array.isArray(parsed.posts) || parsed.posts.length === 0) {
  console.error("No valid posts JSON returned. Got:\n", text.slice(0, 600));
  process.exit(1);
}

let drafted = 0;
for (const p of parsed.posts.slice(0, COUNT)) {
  if (!p || !p.headline) continue;
  const blob = `${p.headline} ${p.sub} ${p.caption}`;
  if (BANNED.test(blob)) {
    console.warn("Skipped a post (compliance filter):", p.headline);
    continue;
  }
  const url = cardUrl(p);
  const ig = AUTOPOST ? await igPost(url, p.caption, p.hashtags) : null;
  if (await postDraft(p, url, ig)) drafted++;
}

if (drafted === 0) {
  console.error("Nothing drafted.");
  process.exit(1);
}
console.log(`Drafted ${drafted} @joinlockr post(s) to Discord${AUTOPOST ? " (IG auto-post attempted)" : ""}.`);
