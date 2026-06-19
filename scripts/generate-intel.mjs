// Auto-feed generator for @joinlockr (Lockr's betting / prediction-market news page).
//
// Each run: Claude (with live web search, grounded on a live Polymarket/Kalshi
// volume signal) finds the day's most share-worthy real prediction-market /
// betting stories, writes 1-3 on-brand news cards + captions as strict JSON,
// renders each as a branded image via /api/intel-card, and SHIPS it. When IG
// creds are set (the default), it auto-posts straight to Instagram; a Discord
// webhook, when present, becomes the audit log / review queue of what shipped.
//
// Run by .github/workflows/auto-intel.yml (GitHub Actions cron). Also locally:
//   ANTHROPIC_API_KEY=sk-... DISCORD_WEBHOOK_CONTENT=https://discord.com/api/webhooks/... \
//     node scripts/generate-intel.mjs
//
// ENV:
//   ANTHROPIC_API_KEY        (required) Anthropic key.
//   IG_USER_ID, IG_ACCESS_TOKEN  IG Graph API creds. When BOTH are set, posts
//                            auto-publish straight to Instagram (the default).
//   DISCORD_WEBHOOK_CONTENT  webhook for the #content-queue channel (falls back to
//                            DISCORD_WEBHOOK_URL). Optional once IG creds are set —
//                            it then logs what auto-posted. You need IG creds and/or
//                            this webhook (at least one destination).
//   INTEL_AUTOPOST           (optional) "0" = force drafts-only (skip IG) even with
//                            creds set; anything else / unset = auto-post on.
//   SITE_BASE                (optional) default https://joinlockr.com — where the
//                            public /api/intel-card image is served from.
//   INTEL_MODEL              (optional) default claude-sonnet-4-6.
//   INTEL_COUNT              (optional) how many posts, default 2 (max 3).
//
// SAFETY: a built-in compliance brief + a banned-phrase filter keep it honest (no
// fabricated numbers, guarantees, or income claims; 21+/responsible-gambling). Set
// INTEL_AUTOPOST=0 to run review-first (drafts to Discord, a human posts) until the
// feed is proven, then flip it back on for fully hands-off Instagram posting.

import { buildSourceBrief } from "./intel-sources.mjs";

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error("Missing ANTHROPIC_API_KEY");
  process.exit(1);
}
const WEBHOOK = process.env.DISCORD_WEBHOOK_CONTENT || process.env.DISCORD_WEBHOOK_URL;

const MODEL = process.env.INTEL_MODEL || "claude-sonnet-4-6";
const BASE = (process.env.SITE_BASE || "https://joinlockr.com").replace(/\/$/, "");
const COUNT = Math.max(1, Math.min(3, Number(process.env.INTEL_COUNT) || 2));
// Optional per-run angle (set by the cron per time-slot) so multiple posts/day
// favor different lanes and don't all surface the same hot story.
const FOCUS = (process.env.INTEL_FOCUS || "").trim().slice(0, 240);
// Instagram auto-post is ON by default; set INTEL_AUTOPOST=0 to force drafts-only.
const AUTOPOST = process.env.INTEL_AUTOPOST !== "0";
const HAS_IG = Boolean(process.env.IG_USER_ID && process.env.IG_ACCESS_TOKEN);
const IG_LIVE = AUTOPOST && HAS_IG; // actually publishing to Instagram this run
const today = new Date().toISOString().slice(0, 10);

// Need at least one destination: auto-post to Instagram, and/or a Discord queue.
// (Discord is optional once IG auto-post is live; it becomes the audit log.)
if (!WEBHOOK && !IG_LIVE) {
  console.error(
    "No destination configured. Set IG_USER_ID + IG_ACCESS_TOKEN to auto-post to " +
      "Instagram, and/or DISCORD_WEBHOOK_CONTENT for the review/log queue.",
  );
  process.exit(1);
}

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
  const focus = FOCUS
    ? `THIS RUN'S FOCUS: lead with these angles so the day's posts (this account posts a few times a day) stay varied across slots — ${FOCUS}. Still only use REAL, verified stories; if a focus angle has nothing real today, pick the best real story regardless of lane.\n\n`
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
      messages: [{ role: "user", content: signal + focus + PROMPT }],
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
  const posted = Boolean(ig && ig.posted);
  const failed = Boolean(ig && !ig.posted);
  const tag = (p.type || p.kicker || "").toString();
  const igLine = posted
    ? "\n\n:white_check_mark: Auto-posted to Instagram."
    : failed
      ? `\n\n:warning: IG auto-post FAILED — post this one manually: ${ig.reason}`
      : "";
  const heading = posted
    ? `:rocket:  Auto-posted to @joinlockr  ·  ${tag}`
    : failed
      ? `:warning:  @joinlockr post needs you  ·  ${tag}`
      : `:newspaper:  New @joinlockr draft  ·  ${tag}`;
  const desc =
    `**Caption** (${posted ? "what went out" : "copy this"}):\n` +
    "```\n" +
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
      content: heading,
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

// Instagram content-publishing (Instagram Login path). The token is an Instagram
// user token, so it authenticates against graph.instagram.com (NOT graph.facebook.com).
// Version is pinned + overridable: if Meta retires it and calls 404, set the
// IG_API_VERSION repo secret to the current version (no code change needed).
const IG_HOST = "https://graph.instagram.com";
const IG_VER = process.env.IG_API_VERSION || "v23.0";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const igFetch = (u, init) => fetch(u, { ...init, signal: AbortSignal.timeout(30000) });

// Flatten a Graph API error into one readable line (code / subcode / fbtrace_id).
function igErr(stage, status, body) {
  const e = body && body.error ? body.error : null;
  const parts = [`${stage} HTTP ${status}`];
  if (e) {
    if (e.code != null) parts.push(`code ${e.code}`);
    if (e.error_subcode != null) parts.push(`subcode ${e.error_subcode}`);
    if (e.message) parts.push(e.message);
    if (e.fbtrace_id) parts.push(`fbtrace ${e.fbtrace_id}`);
  } else {
    parts.push(JSON.stringify(body).slice(0, 200));
  }
  return parts.join(" | ");
}

// IG caption limit is 2,200 chars and max 30 hashtags. Clamp defensively so a long
// caption can never 4xx the /media call.
function buildIgCaption(caption, hashtags) {
  const tags = String(hashtags || "")
    .split(/\s+/)
    .filter((tag) => tag.startsWith("#"))
    .slice(0, 30)
    .join(" ");
  let full = `${caption}\n\n${tags}`.trim();
  if (full.length > 2200) full = `${full.slice(0, 2197).trimEnd()}...`;
  return full;
}

// Meta fetches image_url server-side, so it must publicly return real image/jpeg.
// Verify (and warm the function) before asking Meta to fetch it.
async function precheckImage(url) {
  try {
    const r = await igFetch(url, { method: "GET" });
    if (!r.ok) return { ok: false, reason: `card URL returned ${r.status}` };
    const ct = r.headers.get("content-type") || "";
    if (!ct.includes("image/jpeg")) return { ok: false, reason: `card URL is "${ct || "unknown"}", need image/jpeg` };
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: `card URL fetch failed: ${String(err).slice(0, 120)}` };
  }
}

async function igPost(url, caption, hashtags) {
  const uid = process.env.IG_USER_ID;
  const tok = process.env.IG_ACCESS_TOKEN;
  if (!uid || !tok) return { posted: false, reason: "IG_USER_ID / IG_ACCESS_TOKEN not set" };

  // 0) make sure Meta will be able to fetch a real JPEG from the card URL.
  const pre = await precheckImage(url);
  if (!pre.ok) return { posted: false, reason: pre.reason };

  const igCaption = buildIgCaption(caption, hashtags);
  try {
    // 1) create the media container.
    const create = await igFetch(`${IG_HOST}/${IG_VER}/${uid}/media`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ image_url: url, caption: igCaption, access_token: tok }),
    });
    const cj = await create.json().catch(() => ({}));
    if (!create.ok || !cj.id) return { posted: false, reason: igErr("create", create.status, cj) };
    const containerId = cj.id;

    // 2) poll the container until FINISHED (a blind sleep is the #1 cause of the
    //    "media not ready" 9007 error). Images finish in seconds; cap ~60s.
    let ready = false;
    for (let i = 0; i < 12; i++) {
      await sleep(5000);
      const st = await igFetch(
        `${IG_HOST}/${IG_VER}/${containerId}?fields=status_code,status&access_token=${encodeURIComponent(tok)}`,
        { method: "GET" },
      );
      const sj = await st.json().catch(() => ({}));
      if (sj.status_code === "FINISHED") {
        ready = true;
        break;
      }
      if (sj.status_code === "ERROR" || sj.status_code === "EXPIRED") {
        return { posted: false, reason: `container ${sj.status_code}: ${sj.status || ""}`.trim() };
      }
      // IN_PROGRESS / transient -> keep polling
    }
    if (!ready) return { posted: false, reason: "container not FINISHED after ~60s" };

    // 3) publish exactly once. Never re-create/re-publish in one run (avoids any
    //    chance of a retry storm multiplying live posts against the 100/24h cap).
    const pub = await igFetch(`${IG_HOST}/${IG_VER}/${uid}/media_publish`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ creation_id: containerId, access_token: tok }),
    });
    const pj = await pub.json().catch(() => ({}));
    if (pub.ok && pj.id) return { posted: true, id: pj.id };
    return { posted: false, reason: igErr("publish", pub.status, pj) };
  } catch (err) {
    return { posted: false, reason: `IG request failed: ${String(err).slice(0, 160)}` };
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

let shipped = 0;
let igPosted = 0;
let igFailed = false;
for (const p of parsed.posts.slice(0, COUNT)) {
  if (!p || !p.headline) continue;
  const blob = `${p.headline} ${p.sub} ${p.caption}`;
  if (BANNED.test(blob)) {
    console.warn("Skipped a post (compliance filter):", p.headline);
    continue;
  }
  const url = cardUrl(p);
  const ig = IG_LIVE ? await igPost(url, p.caption, p.hashtags) : null;
  if (ig && ig.posted) igPosted++;
  if (ig && !ig.posted) {
    console.error("IG auto-post FAILED:", ig.reason);
    igFailed = true;
  }
  // Discord (when configured) is the review queue / audit log of what shipped —
  // and the recovery copy for any post that failed to auto-publish.
  const logged = WEBHOOK ? await postDraft(p, url, ig) : false;
  // Shipped if it auto-posted to IG OR was queued to Discord for a human.
  if ((ig && ig.posted) || logged) shipped++;
}

if (shipped === 0) {
  console.error("Nothing shipped (IG post and Discord queue both failed).");
  process.exit(1);
}
const mode = IG_LIVE
  ? `auto-posted ${igPosted}/${shipped} to Instagram${WEBHOOK ? " + logged to Discord" : ""}`
  : "drafted to Discord for review";
console.log(`Shipped ${shipped} @joinlockr post(s): ${mode}.`);

// If auto-post is on and any post failed to publish, exit non-zero so the GitHub
// Actions run goes RED and emails JT. Otherwise a broken token / image would let
// @joinlockr silently stop posting. The drafts still reached Discord for recovery.
if (IG_LIVE && igFailed) {
  console.error("One or more Instagram auto-posts failed (see above) — flagging the run.");
  process.exit(1);
}
