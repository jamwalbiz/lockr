"use client";

import { track } from "@vercel/analytics";
import Link from "next/link";
import { useCadence } from "@/components/CadenceContext";
import { PRICING } from "@/lib/copy";

const CADENCE_SUFFIX = {
  weekly: "/wk",
  monthly: "/mo",
  annual: "/yr",
} as const;

export function MobileCta() {
  // Mirror the cadence the user toggled on the pricing card.
  // Default ("monthly") shows $99/mo before any toggle happens.
  const { subscription: cadence } = useCadence();
  const entry = PRICING.subscription[cadence];
  const priceLabel = `${entry.price}${CADENCE_SUFFIX[cadence]}`;

  return (
    <div className="mobile-cta">
      <div className="mobile-cta-inner">
        <div className="mobile-cta-text">
          <div className="mobile-cta-line1">★ 4.9 rating · cancel any time</div>
          <div className="mobile-cta-line2">Subscribe · {priceLabel}</div>
        </div>
        <Link
          href={`/checkout?tier=subscription&cadence=${cadence}`}
          className="mobile-cta-btn"
          onClick={() =>
            track("cta_click", {
              cta: "join",
              location: "mobile_sticky",
              cadence,
            })
          }
        >
          Join Lockr →
        </Link>
      </div>
    </div>
  );
}
