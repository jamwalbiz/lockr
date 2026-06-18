// Live prediction-market "movers" layer. Pulls the most active markets right
// now from Polymarket and Kalshi (both public, no key needed) and normalizes
// them into one shape. This powers /markets: an auto-updating, on-brand surface
// that shows the kinds of markets Lockr plays, and feeds search/answer engines
// fresh content without anyone writing a word.
//
// Server-only (uses fetch with Next revalidation). Both sources are best-effort:
// any failure returns [] so the page always renders.

export type Mover = {
  source: "Polymarket" | "Kalshi";
  question: string;
  yesLabel: string; // what "yes" means here ("Yes", a team, an outcome)
  yesPercent: number; // implied probability, 0-100, rounded
  volume24h: number; // USD traded in the last 24h
  endsLabel: string | null; // human "ends" hint, when known
};

const TIMEOUT_MS = 6500;
const REVALIDATE = 1800; // 30 min: fresh enough to feel live, easy on the APIs

function fmtEnds(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return null;
  return new Date(t).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function safeJsonArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

/** Polymarket Gamma: clean human questions, real 24h volume ordering. */
async function getPolymarketMovers(limit: number): Promise<Mover[]> {
  try {
    const url =
      "https://gamma-api.polymarket.com/markets" +
      "?closed=false&active=true&order=volume24hr&ascending=false&limit=60";
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return [];
    const rows = (await res.json()) as Array<Record<string, unknown>>;
    if (!Array.isArray(rows)) return [];

    const out: Mover[] = [];
    for (const m of rows) {
      const question = String(m.question ?? "").trim();
      const outcomes = safeJsonArray(m.outcomes).map(String);
      const prices = safeJsonArray(m.outcomePrices).map((p) => Number(p));
      const vol = Number(m.volume24hr ?? 0);
      if (!question || prices.length < 1 || !Number.isFinite(prices[0])) continue;

      const yes = prices[0];
      // Skip essentially-decided markets; they read as stale, not live.
      if (yes < 0.02 || yes > 0.98) continue;
      if (!(vol > 2000)) continue;

      out.push({
        source: "Polymarket",
        question,
        yesLabel: outcomes[0] ?? "Yes",
        yesPercent: Math.round(yes * 100),
        volume24h: vol,
        endsLabel: fmtEnds(String(m.endDate ?? "")),
      });
    }
    return out.slice(0, limit);
  } catch {
    return [];
  }
}

/** Kalshi: best-effort. Events carry clean titles; nested markets carry price
 *  and volume. The raw market feed is full of multi-leg parlay noise, so we pull
 *  events and keep only clean single-outcome markets that are actually trading. */
async function getKalshiMovers(limit: number): Promise<Mover[]> {
  try {
    // limit=100 keeps the payload under Next's 2MB data-cache ceiling so the
    // fetch actually caches between revalidations; still ~90 clean markets.
    const url =
      "https://api.elections.kalshi.com/trade-api/v2/events" +
      "?limit=100&status=open&with_nested_markets=true";
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      events?: Array<Record<string, unknown>>;
    };
    const events = Array.isArray(data.events) ? data.events : [];

    // One card per event: an event like "2028 election winner" has a nested
    // market per candidate; we keep only its most-traded leg so the feed stays
    // varied instead of repeating the same question eight times.
    const out: Mover[] = [];
    for (const ev of events) {
      const evTitle = String(ev.title ?? "").trim();
      const ticker = String(ev.event_ticker ?? "");
      if (ticker.startsWith("KXMVE")) continue; // multi-leg parlay collections
      if (evTitle.includes(",yes ")) continue;
      const markets = Array.isArray(ev.markets)
        ? (ev.markets as Array<Record<string, unknown>>)
        : [];

      let best: Mover | null = null;
      for (const mk of markets) {
        const vol = Number(mk.volume_24h_fp ?? 0);
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
            endsLabel: fmtEnds(String(mk.close_time ?? "")),
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

/**
 * Combined movers, interleaved so both venues show up top-of-page when both
 * return data (prediction markets are co-equal at Lockr), then by volume.
 */
export async function getMovers(): Promise<Mover[]> {
  const [poly, kalshi] = await Promise.all([
    getPolymarketMovers(14),
    getKalshiMovers(8),
  ]);

  const merged: Mover[] = [];
  const max = Math.max(poly.length, kalshi.length);
  for (let i = 0; i < max; i++) {
    if (poly[i]) merged.push(poly[i]);
    if (kalshi[i]) merged.push(kalshi[i]);
  }
  return merged.slice(0, 18);
}
