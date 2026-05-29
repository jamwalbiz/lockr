"use client";

import { track } from "@vercel/analytics";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCadence } from "@/components/CadenceContext";
import { feedbackClick } from "@/lib/sound";
import { PRICING } from "@/lib/copy";

const CADENCE_SUFFIX = {
  weekly: "/wk",
  monthly: "/mo",
  annual: "/yr",
} as const;

// Routes where the sticky "Join Lockr" bar would compete with the page's
// own primary action. /checkout has the Whop embed submit button right
// there — a sticky "join" bar would physically cover the submit on
// mobile and create two competing CTAs.
const HIDE_ON = ["/checkout"];

export function MobileCta() {
  const pathname = usePathname();
  // Mirror the cadence the user toggled on the pricing card.
  // Default ("monthly") shows $99/mo before any toggle happens.
  const { subscription: cadence } = useCadence();
  const entry = PRICING.subscription[cadence];
  const priceLabel = `${entry.price}${CADENCE_SUFFIX[cadence]}`;

  if (HIDE_ON.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return null;
  }

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
          onClick={() => {
            feedbackClick();
            track("cta_click", {
              cta: "join",
              location: "mobile_sticky",
              cadence,
            });
          }}
        >
          Join Lockr →
        </Link>
      </div>
    </div>
  );
}
