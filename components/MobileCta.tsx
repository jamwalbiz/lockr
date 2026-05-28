"use client";

import { track } from "@vercel/analytics";
import Link from "next/link";

export function MobileCta() {
  return (
    <div className="mobile-cta">
      <div className="mobile-cta-inner">
        <div className="mobile-cta-text">
          <div className="mobile-cta-line1">★ 4.9 rating · cancel any time</div>
          <div className="mobile-cta-line2">Subscribe from $29/wk</div>
        </div>
        <Link
          href="/checkout"
          className="mobile-cta-btn"
          onClick={() => track("cta_click", { cta: "join", location: "mobile_sticky" })}
        >
          Join Lockr →
        </Link>
      </div>
    </div>
  );
}
