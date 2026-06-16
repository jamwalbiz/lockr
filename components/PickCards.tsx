"use client";

// Hero visual: a small deck of "tonight's picks" cards (Betr / PrizePicks /
// Polymarket-style), replacing the old terminal panel. Each card tracks the
// cursor for a green spotlight glow; the top card carries a slow shimmer
// border. All gated under prefers-reduced-motion via CSS.
const PICKS = [
  { sport: "NBA", time: "7:02p", match: "Lakers / Nuggets", line: "Over 224.5" },
  { sport: "UFC", time: "8:40p", match: "Main event", line: "KO / TKO" },
  { sport: "NHL", time: "9:15p", match: "Canes / Habs", line: "Over 5.5" },
];

export function PickCards() {
  function onMove(e: React.MouseEvent<HTMLElement>) {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  return (
    <div className="pick-cards">
      {PICKS.map((p, i) => (
        <article
          key={p.sport}
          className={`pick-card${i === 0 ? " featured" : ""}`}
          onMouseMove={onMove}
          style={{ animationDelay: `${0.34 + i * 0.1}s` }}
        >
          <div className="pick-card-meta">
            <span className="pick-card-sport">
              <span className="pick-card-dot" aria-hidden="true"></span>
              {p.sport}
            </span>
            <span className="pick-card-time">{p.time}</span>
          </div>
          <div className="pick-card-match">{p.match}</div>
          <div className="pick-card-row">
            <span className="pick-card-line">{p.line}</span>
            <span className="pick-card-status">PENDING</span>
          </div>
        </article>
      ))}
    </div>
  );
}
