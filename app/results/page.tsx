import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbsLd } from "@/components/BreadcrumbsLd";
import {
  getSettledPlays,
  getPendingPlays,
  getTrackRecord,
  type Play,
} from "@/lib/plays";

const BASE = "https://joinlockr.com";

export const metadata: Metadata = {
  title: "Track record — every play logged, win or lose | Lockr",
  description:
    "Lockr's public record across sports and prediction markets. Every play posted before the event, settled with the result, nothing deleted. Scroll back and check.",
  alternates: { canonical: `${BASE}/results` },
};

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function signed(n: number, suffix = "u"): string {
  const v = Math.round(n * 10) / 10;
  return `${v > 0 ? "+" : ""}${v}${suffix}`;
}

function resultText(p: Play): string {
  if (p.status === "won" || p.status === "lost") return signed(p.unitsResult);
  if (p.status === "push") return "Push";
  return "Pending";
}

function PlayRow({ p }: { p: Play }) {
  return (
    <li className={`play-row status-${p.status}`}>
      <div className="play-row-main">
        <div className="play-row-meta">
          <span className="play-row-date">{formatDate(p.date)}</span>
          <span className="play-row-league">{p.league}</span>
        </div>
        <div className="play-row-pick">{p.pick}</div>
        <div className="play-row-market">
          {p.market}
          {p.note ? ` · ${p.note}` : ""}
        </div>
      </div>
      <div className="play-row-side">
        <div className="play-row-line">
          <span className="play-row-odds">{p.odds}</span>
          <span className="play-row-units">{p.units}u</span>
        </div>
        <div className={`play-row-result res-${p.status}`}>{resultText(p)}</div>
      </div>
    </li>
  );
}

export default function ResultsPage() {
  const rec = getTrackRecord();
  const settled = getSettledPlays();
  const pending = getPendingPlays();
  const recordStr = `${rec.wins}-${rec.losses}${rec.pushes ? `-${rec.pushes}` : ""}`;

  return (
    <div className="shell results-shell">
      <BreadcrumbsLd
        trail={[
          { name: "Home", url: `${BASE}/` },
          { name: "Track record", url: `${BASE}/results` },
        ]}
      />

      <header className="section-head head-wide">
        <div className="section-label">
          <span className="markets-pulse" aria-hidden="true" />
          Track record
        </div>
        <h1 className="section-title">Every play, logged. Win or lose.</h1>
        <p className="section-sub">
          Each play is posted before the event starts and settled here with the
          result. Sports and prediction markets, the same ledger. Nothing gets
          deleted, and anyone can scroll back and check.
        </p>
      </header>

      {rec.settled > 0 ? (
        <ul className="record-grid" aria-label="Track record summary">
          <li className="record-stat">
            <span className="record-fig">{recordStr}</span>
            <span className="record-label">Record (W-L-P)</span>
          </li>
          <li className="record-stat">
            <span
              className={`record-fig ${rec.netUnits >= 0 ? "pos" : "neg"}`}
            >
              {signed(rec.netUnits)}
            </span>
            <span className="record-label">Net units</span>
          </li>
          <li className="record-stat">
            <span className="record-fig">{rec.winRate}%</span>
            <span className="record-label">Win rate</span>
          </li>
          <li className="record-stat">
            <span className={`record-fig ${rec.roi >= 0 ? "pos" : "neg"}`}>
              {signed(rec.roi, "%")}
            </span>
            <span className="record-label">ROI</span>
          </li>
          <li className="record-stat">
            <span className="record-fig">{rec.settled}</span>
            <span className="record-label">Settled plays</span>
          </li>
        </ul>
      ) : (
        <div className="record-empty">
          The ledger starts now. Every play posts here before the event, win or
          lose. Check back as it fills in.
        </div>
      )}

      {pending.length > 0 && (
        <section className="play-section" aria-label="On the board now">
          <h2 className="play-section-head">
            On the board now
            <span className="play-section-note">
              posted before the event, results pending
            </span>
          </h2>
          <ul className="play-list">
            {pending.map((p, i) => (
              <PlayRow key={`pend-${i}`} p={p} />
            ))}
          </ul>
        </section>
      )}

      {settled.length > 0 && (
        <section className="play-section" aria-label="Settled plays">
          <h2 className="play-section-head">Settled</h2>
          <ul className="play-list">
            {settled.map((p, i) => (
              <PlayRow key={`set-${i}`} p={p} />
            ))}
          </ul>
        </section>
      )}

      <aside className="results-cta">
        <div className="results-cta-label">Tail the next one.</div>
        <p>
          Every play above was posted in the open before it started. Members get
          them live, before the line moves.
        </p>
        <Link href="/checkout" className="btn btn-primary btn-lg">
          Start tailing · $29/wk
        </Link>
        <p className="results-fine">
          Past results do not guarantee future outcomes. Units are a sizing
          convention, not dollars. Lockr is education and entertainment, not
          financial or wagering advice. Bet only what you can afford to lose. 21+
          where applicable. 1-800-GAMBLER.
        </p>
      </aside>
    </div>
  );
}
