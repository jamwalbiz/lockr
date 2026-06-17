"use client";

import { useEffect } from "react";

// Renderless: a single delegated pointermove listener that feeds the cursor
// position into --mx/--my on whatever feature card is under the pointer, so
// the CSS spotlight glow (.pillar / .sport-card ::before) tracks the cursor.
// One listener for the whole page; cheap (closest + setProperty).
export function SpotlightObserver() {
  useEffect(() => {
    const SEL = ".pillar, .sport-card, .step";
    const onMove = (e: PointerEvent) => {
      const card = (e.target as HTMLElement | null)?.closest?.(SEL) as HTMLElement | null;
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return null;
}
