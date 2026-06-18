"use client";

import { track } from "@vercel/analytics";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { feedbackClick } from "@/lib/sound";
import { PRICING } from "@/lib/copy";

// Routes where the sticky "Join Lockr" bar would compete with the page's
// own primary action. /checkout has the Whop embed submit button right
// there; a sticky "join" bar would physically cover the submit on
// mobile and create two competing CTAs.
const HIDE_ON = ["/checkout"];

export function MobileCta() {
  const pathname = usePathname();
  const [shown, setShown] = useState(false);
  const hidden = HIDE_ON.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  // Stay hidden on the first screen and slide up only once the hero's own CTA
  // has scrolled out of view, so it never competes with the in-hero buttons or
  // eat into the hero's vertical space on landing. On pages without a hero CTA,
  // reveal after a short scroll. Hooks must run unconditionally, so this lives
  // above the early return.
  useEffect(() => {
    if (hidden) return;
    const heroCta = document.querySelector(".hero-cta-row");
    if (heroCta) {
      const io = new IntersectionObserver(
        ([entry]) => setShown(!entry.isIntersecting),
        { threshold: 0 },
      );
      io.observe(heroCta);
      return () => io.disconnect();
    }
    const onScroll = () => setShown(window.scrollY > 220);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hidden, pathname]);

  if (hidden) return null;

  // Always anchor to the lowest entry price ($29/wk), matching the hero CTA.
  const price = `${PRICING.subscription.weekly.price}/wk`;

  return (
    <div className={`mobile-cta${shown ? " shown" : ""}`}>
      <div className="mobile-cta-inner">
        <div className="mobile-cta-text">
          <div className="mobile-cta-line1">★ 4.9 rating · cancel any time</div>
          <div className="mobile-cta-line2">Join from {price}</div>
        </div>
        <Link
          href="/checkout?tier=subscription&cadence=weekly"
          className="mobile-cta-btn"
          onClick={() => {
            feedbackClick();
            track("cta_click", {
              cta: "join",
              location: "mobile_sticky",
              cadence: "weekly",
            });
          }}
        >
          Join Lockr →
        </Link>
      </div>
    </div>
  );
}
