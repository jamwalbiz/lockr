"use client";

import { track } from "@vercel/analytics";

// Hero visual: a small deck of "tonight's plays" cards (Betr / PrizePicks /
// Polymarket-style). The pick is the paid product, so it's LOCKED here. We show
// the SIGNAL (what kind of edge is live and where) and blur the SELECTION (the
// actual side / number / market). No real matchups are named, so nothing goes
// stale out of season. One card is a prediction market so sports and markets
// read co-equal. Each card tracks the cursor for a green spotlight glow; the
// top card carries a slow shimmer border, and the whole card taps to checkout.
const PICKS = [
  { tag: "NBA", type: "Game total", time: "7:02p", veil: "Over 224.5" },
  { tag: "Kalshi", type: "Prediction market", time: "Today", veil: "Yes · 61¢" },
  { tag: "UFC", type: "Method of victory", time: "8:40p", veil: "KO / TKO" },
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
          key={p.tag}
          href="/checkout"
          className="pick-card"
          onMouseMove={onMove}
          onClick={() => track("cta_click", { cta: "hero_pick_card", sport: p.tag })}
          style={{ animationDelay: `${0.34 + i * 0.1}s` }}
          aria-label={`${p.tag} ${p.type} — members only, join to unlock`}
        >
          <div className="pick-card-meta">
            <span className="pick-card-sport">
              <span className="pick-card-dot" aria-hidden="true"></span>
              {p.tag}
            </span>
            <span className="pick-card-time">{p.time}</span>
          </div>
          <div className="pick-card-match">{p.type}</div>
          <div className="pick-card-row">
            <span className="pick-card-line locked" aria-hidden="true">
              {p.veil}
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
