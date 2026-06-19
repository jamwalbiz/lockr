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

const PROMPT = `You write the @joinlockr Instagram/TikTok news feed for Lockr (joinlockr.com), a daily sports-betting + prediction-market picks membership where members "tail" founder JT's plays across sports and prediction markets (Kalshi, Polymarket) treated as equal.

Run @joinlockr like a sharp, fast NEWS / DATA page (think a betting-and-prediction-market version of a markets-tracker page), NOT a sales page. Every post is a "receipt": take ONE real, public, current data point and turn it into one screenshot-able card with a punchy plain-English headline. The data IS the content. Never a promise, always a result.

Today is ${today}. The FIFA World Cup 2026 is live (US/Canada/Mexico) — strongly favor a World Cup angle when there's a genuinely interesting one.

USE WEB SEARCH to ground EVERY number in a real, current source. Find the day's most surprising, real "somebody's wrong" / "sharp vs public" / "heart vs market" angles from: Polymarket & Kalshi implied-probability odds and big movers, sportsbook line moves, public-betting % splits, notable results / bad beats, celebrity or viral bets, and prediction-market vs poll/expert gaps.

Pick the ${COUNT} best angles. For each, choose a FORMAT:
- "receipt": one striking market number + a headline (single stat).
- "vs": two numbers compared — the public/heart vs the market (e.g., "57% of bettors back Portugal, the market gives them 12%"). Great for World Cup "bet on your country".
- "shift": an odds move before -> after a result (single stat = the new number, sub explains the move).
- "fade": bets% vs money% revealing reverse line movement.

HARD RULES (non-negotiable):
- NO em dashes. NO "guaranteed" / "risk-free" / income or "you will win" claims. Never call Lockr a "picks service", "capper", "handicapper", or "tout". Plain English, confident, anti-hype.
- DO NOT fabricate any number, odds, price, %, or volume. Every stat MUST come from a source you actually found via web search, and you MUST list that source URL. If you cannot verify a number, do not use it — pick a different angle.
- Education and entertainment only, not advice. Keep it directional, never a promise of profit.
- Headline = 5 to 11 words, the hook. "sub" = one plain-English "so what" sentence. caption = 2 to 4 short lines (hook, the so-what, then a soft CTA "Full breakdown + today's plays in bio." or "We tail the edges. joinlockr.com."). hashtags = 6 to 10 relevant tags (mix broad + niche; include "FIFA World Cup" tags like #WeAre26 when relevant). For World Cup posts, include the country names in the caption.

Output ONLY a JSON object (no prose, no markdown fences) in EXACTLY this shape:
{
  "posts": [
    {
      "format": "receipt|vs|shift|fade",
      "kicker": "2-3 word card label, e.g. MARKET READ, HEART VS MARKET, ODDS SHIFT, FADE THE PUBLIC",
      "headline": "the 5-11 word hook",
      "source": "Polymarket | Kalshi | Sportsbooks | etc",
      "stat": "the primary REAL number, e.g. 71% or +6c or -130",
      "statLabel": "short label, e.g. market says",
      "stat2": "optional second REAL number for vs/fade, else empty string",
      "stat2Label": "optional label, e.g. public says, else empty string",
      "sub": "one plain-English so-what sentence",
      "tone": "blue for prediction-market (Kalshi/Polymarket) posts, green otherwise",
      "caption": "the 2-4 line IG caption",
      "hashtags": "#tag1 #tag2 ...",
      "sources": ["https://real-source-url"]
    }
  ]
}`;

async function callClaude() {
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
      messages: [{ role: "user", content: PROMPT }],
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

function cardUrl(p) {
  const qs = new URLSearchParams();
  const set = (k, v) => {
    if (v != null && String(v).trim()) qs.set(k, String(v));
  };
  set("kicker", p.kicker);
  set("headline", p.headline);
  set("source", p.source);
  set("stat", p.stat);
  set("statLabel", p.statLabel);
  set("stat2", p.stat2);
  set("stat2Label", p.stat2Label);
  set("sub", p.sub);
  set("tone", p.tone === "blue" ? "blue" : "green");
  set("watermark", p.source);
  return `${BASE}/api/intel-card?${qs.toString()}`;
}

async function postDraft(p, url, ig) {
  const tone = p.tone === "blue" ? 0x4a9eff : 0x00ff85;
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
      content: `:newspaper:  New @joinlockr draft  ·  ${(p.kicker || "").toString()}`,
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

const text = await callClaude();
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
