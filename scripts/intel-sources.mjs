// Live "what's actually moving right now" layer for the @joinlockr generator.
//
// Pulls QUANTIFIED virality straight from the platforms — Polymarket + Kalshi
// 24h volume and implied odds (the biggest-volume markets ARE the most viral
// right now) — plus a free news-coverage signal (GDELT) to cross-check and seed
// big-win / payout leads the market feed won't contain. It then formats one
// compact brief that gets injected into the generator prompt, so Claude grounds
// its picks on real current movers instead of open-ended search.
//
// No API keys. Mirrors the proven fetchers in lib/markets.ts (kept as plain JS so
// the GitHub Actions cron can import it). Every source is best-effort: any failure
// returns [] and the brief still renders (the generator falls back to web search).

const TIMEOUT_MS = 8000;
const t = () => AbortSignal.timeout(TIMEOUT_MS);

function safeJsonArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const p = JSON.parse(value);
      return Array.isArray(p) ? p : [];
    } catch {
      return [];
    }
  }
  return [];
}

function fmtUsd(n) {
  if (!Number.isFinite(n)) return "";
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${Math.round(n / 1e3)}K`;
  return `$${Math.round(n)}`;
}

/** Polymarket Gamma, ordered by 24h volume: the loudest markets first. */
export async function getPolymarketMovers(limit = 12) {
  try {
    const url =
      "https://gamma-api.polymarket.com/markets" +
      "?closed=false&active=true&order=volume24hr&ascending=false&limit=60";
    const res = await fetch(url, { signal: t() });
    if (!res.ok) return [];
    const rows = await res.json();
    if (!Array.isArray(rows)) return [];
    const out = [];
    for (const m of rows) {
      const question = String(m.question ?? "").trim();
      const outcomes = safeJsonArray(m.outcomes).map(String);
      const prices = safeJsonArray(m.outcomePrices).map(Number);
      const vol = Number(m.volume24hr ?? 0);
      if (!question || !Number.isFinite(prices[0])) continue;
      const yes = prices[0];
      if (yes < 0.02 || yes > 0.98) continue; // decided markets read as stale
      if (!(vol > 5000)) continue;
      out.push({
        source: "Polymarket",
        question,
        yesLabel: outcomes[0] ?? "Yes",
        yesPercent: Math.round(yes * 100),
        volume24h: vol,
      });
    }
    return out.slice(0, limit);
  } catch {
    return [];
  }
}

/** Kalshi events, best-effort, one clean leg per event, ordered by 24h volume. */
export async function getKalshiMovers(limit = 8) {
  try {
    const url =
      "https://api.elections.kalshi.com/trade-api/v2/events" +
      "?limit=100&status=open&with_nested_markets=true";
    const res = await fetch(url, { signal: t() });
    if (!res.ok) return [];
    const data = await res.json();
    const events = Array.isArray(data.events) ? data.events : [];
    const out = [];
    for (const ev of events) {
      const evTitle = String(ev.title ?? "").trim();
      const ticker = String(ev.event_ticker ?? "");
      if (ticker.startsWith("KXMVE")) continue; // multi-leg parlay collections
      const markets = Array.isArray(ev.markets) ? ev.markets : [];
      let best = null;
      for (const mk of markets) {
        const vol = Number(mk.volume_24h_fp ?? mk.volume_24h ?? 0);
        if (!(vol > 0)) continue;
        const last = Number(mk.last_price_dollars ?? 0);
        const ask = Number(mk.yes_ask_dollars ?? 0);
        const yes = last > 0 ? last : ask;
        if (!(yes > 0.02) || yes > 0.98) continue;
        const sub = String(mk.yes_sub_title ?? "").trim();
        if (sub.includes(",yes ")) continue;
        if (!best || vol > best.volume24h) {
          best = {
            source: "Kalshi",
            question: evTitle || sub,
            yesLabel: sub || "Yes",
            yesPercent: Math.round(yes * 100),
            volume24h: vol,
          };
        }
      }
      if (best) out.push(best);
    }
    out.sort((a, b) => b.volume24h - a.volume24h);
    return out.slice(0, limit);
  } catch {
    return [];
  }
}

/** GDELT 2.0 DOC API (free, no key): recent coverage to cross-check + seed leads. */
export async function getGdeltHeadlines(limit = 8) {
  try {
    const query =
      '(Polymarket OR Kalshi OR "prediction market" OR "sports betting" OR sportsbook OR parlay OR "World Cup") sourcelang:english';
    const url =
      "https://api.gdeltproject.org/api/v2/doc/doc" +
      `?query=${encodeURIComponent(query)}` +
      `&mode=ArtList&format=json&maxrecords=${limit}&sort=hybridrel&timespan=2d`;
    const res = await fetch(url, { signal: t() });
    if (!res.ok) return [];
    const data = await res.json();
    const arts = Array.isArray(data.articles) ? data.articles : [];
    return arts
      .map((a) => ({
        title: String(a.title ?? "").trim(),
        domain: String(a.domain ?? "").trim(),
        url: String(a.url ?? "").trim(),
      }))
      .filter((a) => a.title)
      .slice(0, limit);
  } catch {
    return [];
  }
}

/**
 * One compact brief of everything moving right now, ready to drop into the prompt.
 * Returns { text, poly, kalshi, news } — text is "" if every source failed.
 */
export async function buildSourceBrief() {
  const [poly, kalshi, news] = await Promise.all([
    getPolymarketMovers(12),
    getKalshiMovers(8),
    getGdeltHeadlines(8),
  ]);
  const lines = [];
  if (poly.length) {
    lines.push("POLYMARKET — biggest markets by 24h volume right now (volume = how viral):");
    for (const m of poly) {
      lines.push(`  - ${m.question} | ${m.yesLabel} ${m.yesPercent}% | ${fmtUsd(m.volume24h)} traded in 24h`);
    }
  }
  if (kalshi.length) {
    lines.push("KALSHI — biggest events by 24h volume right now:");
    for (const m of kalshi) {
      lines.push(`  - ${m.question} | ${m.yesLabel} ${m.yesPercent}% | ${fmtUsd(m.volume24h)} traded in 24h`);
    }
  }
  if (news.length) {
    lines.push("RECENT NEWS COVERAGE (GDELT, last 48h — story leads / cross-check):");
    for (const a of news) lines.push(`  - ${a.title} (${a.domain})`);
  }
  return { text: lines.join("\n"), poly, kalshi, news };
}
