import Link from "next/link";
import Image from "next/image";

// "Inside Lockr" — shows the daily membership experience as product mockups
// (the play dropping in Discord before the line moves, the real slip card, the
// live markets board, what's included). Counters competitors that visualize
// their product; stays on-brand (dark + green, plain English, no hype, no fake
// value-stack pricing).

type Play = {
  tag: string;
  market: string;
  pick: string;
  odds: string;
  units: string;
  time: string;
  tone: "green" | "blue";
  why: string;
  slip?: boolean;
};

const PLAYS: Play[] = [
  {
    tag: "NBA",
    market: "Player points",
    pick: "Brunson Over 26.5",
    odds: "−110",
    units: "2u",
    time: "6:54p ET",
    tone: "green",
    why: "His minutes are up and he's facing a defense that gives up points to guards. We're in before the number climbs.",
    slip: true,
  },
  {
    tag: "Kalshi",
    market: "Rate decision",
    pick: "Yes · 58¢",
    odds: "+140",
    units: "1u",
    time: "7:12p ET",
    tone: "blue",
    why: "The market is slow to catch up to what most people already expect. Small, clean spot.",
  },
];

const MOVERS = [
  { src: "Polymarket", q: "Fed cuts rates in July", pct: "31%", dir: "down" as const, d: "−6" },
  { src: "Kalshi", q: "Knicks win the East", pct: "44%", dir: "up" as const, d: "+3" },
  { src: "Polymarket", q: "GTA 6 ships in 2026", pct: "62%", dir: "up" as const, d: "+5" },
  { src: "Kalshi", q: "Jobs report beats forecast", pct: "38%", dir: "down" as const, d: "−4" },
  { src: "Polymarket", q: "Lakers make the playoffs", pct: "71%", dir: "up" as const, d: "+2" },
];

const INCLUDED = [
  "Plays across every major sport, plus Kalshi and Polymarket",
  "A timestamp before the line moves, so the price is on your side",
  "A clear reason and a recommended size on every play",
  "A members room where wins and losses both stay on the record",
  "Beginner-friendly. Start small and just copy the play.",
];

export function InsideLockr() {
  return (
    <section className="fade-in-section inside">
      <div className="shell">
        <div className="section-head">
          <div className="section-label">Inside Lockr</div>
          <h2 className="section-title">
            See exactly how
            <br />a play reaches you.
          </h2>
          <p className="section-sub">
            Every day, the plays drop in the members Discord, posted before the line
            moves. The reasoning and the size come with each one. You just copy it.
          </p>
        </div>

        <div className="inside-grid">
          {/* The drop feed */}
          <div className="inside-feed">
            <div className="inside-feed-head">
              <span className="inside-hash">#</span>
              <span className="inside-channel">todays-plays</span>
              <span className="inside-live">
                <span className="inside-dot" aria-hidden="true" />
                live
              </span>
              <span className="inside-lock">members only</span>
            </div>
            <div className="inside-msgs">
              {PLAYS.map((p) => (
                <div key={p.tag} className="inside-msg">
                  <div className={`inside-av ${p.tone}`} aria-hidden="true" />
                  <div className="inside-msg-body">
                    <div className="inside-name-row">
                      <span className="inside-name">Lockr</span>
                      <span className="inside-verified" aria-hidden="true">
                        ✓
                      </span>
                      <span className="inside-time">{p.time}</span>
                    </div>
                    <div className="inside-leg">
                      <span className={`inside-leg-dot ${p.tone}`} aria-hidden="true" />
                      {p.tag} · {p.market}
                    </div>
                    <div className={`inside-play ${p.tone}`}>{p.pick}</div>
                    <div className="inside-meta">
                      <span className="inside-chip">size {p.units}</span>
                      <span className="inside-chip">{p.odds}</span>
                      <span className="inside-chip ok">before the line moved</span>
                    </div>
                    <div className="inside-why">{p.why}</div>
                    {p.slip && (
                      <Image
                        src="/brand/inside-slip.png"
                        alt="The Lockr play card that drops with every pick"
                        width={1000}
                        height={600}
                        className="inside-slip"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Side column: live markets + what's included */}
          <div className="inside-side">
            <div className="inside-card">
              <div className="inside-card-tag">// live markets</div>
              <p className="inside-card-sub">
                Kalshi and Polymarket, the prediction markets we read right next to the
                books.
              </p>
              <div className="inside-movers">
                {MOVERS.map((m) => (
                  <div key={m.q} className="inside-mover">
                    <div className="inside-mover-q">
                      <span className="inside-mover-src">{m.src}</span>
                      <span className="inside-mover-name">{m.q}</span>
                    </div>
                    <div className="inside-mover-pct">
                      {m.pct}
                      <span className={`inside-delta ${m.dir}`}>{m.d}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="inside-card">
              <div className="inside-card-tag">// every membership includes</div>
              <ul className="inside-list">
                {INCLUDED.map((x) => (
                  <li key={x}>
                    <span className="inside-check" aria-hidden="true">
                      ✓
                    </span>
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="inside-cta">
          <Link href="/checkout" className="btn btn-primary btn-lg">
            Get today&apos;s plays
          </Link>
          <span className="inside-cta-sub">From $29/wk · cancel any time</span>
        </div>
      </div>
    </section>
  );
}
