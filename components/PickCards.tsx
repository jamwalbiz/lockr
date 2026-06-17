"use client";

import { track } from "@vercel/analytics";

// Hero visual: a small deck of "tonight's picks" cards (Betr / PrizePicks /
// Polymarket-style). The pick itself is the paid product, so it's LOCKED here:
// the matchup shows, but the line is blurred behind an "Unlock" lock and the
// whole card taps through to checkout (tease -> join). Each card tracks the
// cursor for a green spotlight glow; the top card carries a slow shimmer border.
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
        <a
          key={p.sport}
          href="/checkout"
          className="pick-card"
          onMouseMove={onMove}
          onClick={() => track("cta_click", { cta: "hero_pick_card", sport: p.sport })}
          style={{ animationDelay: `${0.34 + i * 0.1}s` }}
          aria-label={`${p.sport} ${p.match} pick — members only, join to unlock`}
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
            <span className="pick-card-line locked" aria-hidden="true">
              {p.line}
            </span>
            <span className="pick-card-lock">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                <rect x="4" y="10.5" width="16" height="10.5" rx="2" />
                <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
              </svg>
              Unlock
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}
