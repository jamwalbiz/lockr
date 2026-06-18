import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbsLd } from "@/components/BreadcrumbsLd";
import { getMovers, type Mover } from "@/lib/markets";

const BASE = "https://joinlockr.com";

// ISR: rebuild this page at most every 30 minutes. Fresh enough to feel live,
// light on the upstream APIs, and it gives crawlers a reason to keep coming back.
export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Live prediction markets — what's moving on Kalshi & Polymarket | Lockr",
  description:
    "The most active prediction markets right now on Polymarket and Kalshi: World Cup, politics, economics and more, with live implied odds. The kinds of markets Lockr plays every day.",
  alternates: { canonical: `${BASE}/markets` },
  openGraph: {
    type: "website",
    url: `${BASE}/markets`,
    title: "Live prediction markets — Kalshi & Polymarket movers",
    description:
      "The most active prediction markets right now, with live implied odds. The kinds of markets Lockr plays every day.",
  },
};

function compact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}K`;
  return `${Math.round(n)}`;
}

// Honest, source-aware volume label. Polymarket reports USD; Kalshi reports
// contracts, so we never slap a "$" on Kalshi.
function volumeLabel(m: Mover): string {
  return m.source === "Polymarket"
    ? `$${compact(m.volume24h)} · 24h`
    : `${compact(m.volume24h)} contracts · 24h`;
}

export default async function MarketsPage() {
  const movers = await getMovers();

  return (
    <div className="shell markets-shell">
      <BreadcrumbsLd
        trail={[
          { name: "Home", url: `${BASE}/` },
          { name: "Live markets", url: `${BASE}/markets` },
        ]}
      />

      <header className="section-head head-wide">
        <div className="section-label">
          <span className="markets-pulse" aria-hidden="true" />
          Live markets
        </div>
        <h1 className="section-title">Where the money is moving right now.</h1>
        <p className="section-sub">
          The most active prediction markets on Polymarket and Kalshi this hour,
          with live implied odds. Prediction markets sit level with the
          sportsbooks at Lockr, and these are the boards we read before posting
          plays. Refreshed automatically.
        </p>
      </header>

      {movers.length === 0 ? (
        <div className="markets-empty">
          <p>
            The live feed is catching its breath. Check back in a few minutes, or
            see what JT is tailing inside Lockr.
          </p>
          <Link href="/checkout" className="btn btn-primary btn-lg">
            See today&apos;s plays · $29/wk
          </Link>
        </div>
      ) : (
        <ul className="markets-grid">
          {movers.map((m, i) => (
            <li key={`${m.source}-${i}-${m.question.slice(0, 24)}`}>
              <article className="market-card">
                <div className="market-top">
                  <span className={`market-src src-${m.source.toLowerCase()}`}>
                    <span className="market-src-dot" aria-hidden="true" />
                    {m.source}
                  </span>
                  <span className="market-vol">{volumeLabel(m)}</span>
                </div>

                <h2 className="market-q">{m.question}</h2>

                <div className="market-odds">
                  <div className="market-bar" aria-hidden="true">
                    <span
                      className="market-bar-fill"
                      style={{ width: `${m.yesPercent}%` }}
                    />
                  </div>
                  <div className="market-odds-row">
                    <span className="market-leg">{m.yesLabel}</span>
                    <span className="market-pct">{m.yesPercent}%</span>
                  </div>
                </div>

                {m.endsLabel && (
                  <div className="market-ends">Resolves {m.endsLabel}</div>
                )}
              </article>
            </li>
          ))}
        </ul>
      )}

      <aside className="markets-cta">
        <div className="markets-cta-label">
          Reading the board is step one. Playing it is the edge.
        </div>
        <p>
          Lockr posts the day&apos;s best plays across sports and prediction
          markets before the line moves. You just tail.
        </p>
        <Link href="/checkout" className="btn btn-primary btn-lg">
          Start tailing · $29/wk
        </Link>
        <p className="markets-fine">
          Live data from Polymarket and Kalshi, shown for information only and may
          be delayed. Implied odds are not predictions. Lockr is education and
          entertainment, not financial or wagering advice. Bet only what you can
          afford to lose. 21+ where applicable. 1-800-GAMBLER.
        </p>
      </aside>
    </div>
  );
}
