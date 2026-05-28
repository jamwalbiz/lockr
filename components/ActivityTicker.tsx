"use client";

import { useEffect, useState } from "react";
import { generateTickerItems, type TickerItem } from "@/lib/copy";

// Empty on SSR (avoids hydration mismatch from Math.random), populated on
// mount with a freshly generated set so every page visit is different. The
// 30px fixed-height bar in CSS means no layout shift while we wait for JS.
export function ActivityTicker() {
  const [items, setItems] = useState<TickerItem[] | null>(null);

  useEffect(() => {
    // Intentional one-time mount setup. Math.random must run client-side
    // only — otherwise server + client would generate different items and
    // hydrate-mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(generateTickerItems(40));
  }, []);

  if (!items) {
    return <div className="activity-bar" aria-hidden="true" />;
  }

  // Duplicate for seamless CSS marquee loop.
  const looped = [...items, ...items];

  return (
    <div className="activity-bar" aria-hidden="true">
      <div className="activity-live">
        <span className="activity-live-dot"></span>LIVE
      </div>
      <div className="activity-track">
        {looped.map((item, i) => (
          <span key={i} className="activity-item">
            <span className={`activity-dot ${item.tone}`}></span>
            {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}
