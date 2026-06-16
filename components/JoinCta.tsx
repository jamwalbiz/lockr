"use client";

import { track } from "@vercel/analytics";
import Link from "next/link";
import type { ReactNode } from "react";
import { feedbackClick } from "@/lib/sound";

/**
 * Wrapper for any CTA Link that should fire the brand chime + analytics.
 * Use this for every primary "Join Lockr / Get picks / Subscribe" button
 * that routes to /checkout. Secondary navigation (footer, anchor jumps,
 * FAQ toggles) should NOT use this. Keep the chime as a brand signal
 * tied to conversion intent.
 */
export function JoinCta({
  href,
  className = "btn btn-primary btn-lg",
  location,
  children,
  style,
}: {
  href: string;
  className?: string;
  location: string; // analytics: hero, step3-inline, sports-inline, final-cta, etc.
  children: ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <Link
      href={href}
      className={className}
      style={style}
      onMouseMove={(e) => {
        // Drive the .btn-primary cursor-glow (CSS reads --mx/--my).
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      onClick={() => {
        feedbackClick();
        track("cta_click", { cta: "join", location });
      }}
    >
      {children}
    </Link>
  );
}
