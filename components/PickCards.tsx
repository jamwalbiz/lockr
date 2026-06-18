"use client";

import { track } from "@vercel/analytics";
import type { CSSProperties } from "react";

// Hero showcase: a fanned deck of 3 sample play cards that shows what a Lockr
// play looks like across sports AND a prediction market (co-equal). These are
// illustrative: a market type plus a sample line, with NO real game named, so
// nothing goes stale, nothing is a live actionable pick, and nothing claims a
// result. Each card carries a moving shimmer sheen, a cursor-tracked green glow
// and a 3D tilt on hover, and taps through to checkout.
const PLAYS = [
  { tag: "NBA", market: "Game total", play: "Over 224.5", time: "7:02p", tone: "green" },
  { tag: "Polymarket", market: "Prediction market", play: "Yes · 61¢", time: "Today", tone: "blue" },
  { tag: "UFC", market: "Method of victory", play: "KO / TKO", time: "8:40p", tone: "green" },
] as const;

export function PickCards() {
  function onMove(e: React.MouseEvent<HTMLElement>) {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
    el.style.setProperty("--ry", `${(px - 0.5) * 11}deg`);
    el.style.setProperty("--rx", `${(0.5 - py) * 11}deg`);
  }
  function onLeave(e: React.MouseEvent<HTMLElement>) {
    const el = e.currentTarget;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }

  return (
    <div className="play-deck">
      {PLAYS.map((p) => (
        <div className="play-slot" key={p.tag}>
          <a
            href="/checkout"
            className={`play-card tone-${p.tone}`}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            onClick={() =>
              track("cta_click", { cta: "hero_play_card", sport: p.tag })
            }
            aria-label={`${p.tag}, ${p.market}. Sample play. Join Lockr to tail the live ones.`}
          >
            <span className="play-sheen" aria-hidden="true" />
            <div className="play-top">
              <span className="play-sport">
                <span className="play-dot" aria-hidden="true" />
                {p.tag}
              </span>
              <span className="play-time">{p.time}</span>
            </div>
            <div className="play-market">{p.market}</div>
            <div className="play-line">{p.play}</div>
            <div className="play-foot">
              <span className="play-conf" aria-hidden="true">
                <i style={{ "--h": "7px" } as CSSProperties} />
                <i style={{ "--h": "10px" } as CSSProperties} />
                <i style={{ "--h": "13px" } as CSSProperties} />
              </span>
              <span className="play-tail">Tail &rarr;</span>
            </div>
          </a>
        </div>
      ))}
    </div>
  );
}
