"use client";

import { track } from "@vercel/analytics";
import Link from "next/link";
import { useState } from "react";
import { useCadence } from "@/components/CadenceContext";
import { TiltCard } from "@/components/TiltCard";
import { feedbackClick } from "@/lib/sound";
import {
  PRICING,
  SUBSCRIPTION_FEATURES,
  INNERCIRCLE_FEATURES,
  IC_STATUS,
} from "@/lib/copy";

type IcKey = "monthly" | "annual";

export function PricingCards() {
  // Subscription cadence lives in shared context — MobileCta reads from it
  // to show the matching price in the sticky bar.
  const { subscription: subCadence, setSubscription: setSubCadence } = useCadence();
  const [icCadence, setIcCadence] = useState<IcKey>("annual");

  const sub = PRICING.subscription[subCadence];
  const ic = PRICING.innercircle[icCadence];

  return (
    <div className="pricing-grid">
      {/* Lockr Subscription card */}
      <TiltCard className="pricing-card instant" maxTilt={4} scale={1.008}>
        <div className="price-tier">Lockr Subscription</div>
        <div className="cadence-toggle">
          <CadenceButton
            active={subCadence === "weekly"}
            onClick={() => {
              setSubCadence("weekly");
              track("cadence_change", { tier: "subscription", cadence: "weekly" });
            }}
          >
            Weekly
          </CadenceButton>
          <CadenceButton
            active={subCadence === "monthly"}
            onClick={() => {
              setSubCadence("monthly");
              track("cadence_change", { tier: "subscription", cadence: "monthly" });
            }}
          >
            Monthly
          </CadenceButton>
          <CadenceButton
            active={subCadence === "annual"}
            onClick={() => {
              setSubCadence("annual");
              track("cadence_change", { tier: "subscription", cadence: "annual" });
            }}
          >
            Annual
            <span className="cadence-save">SAVE 50%</span>
          </CadenceButton>
        </div>
        <div key={subCadence} className="price-block">
          <div className="price-amount">{sub.price}</div>
          <div className="price-period">{sub.period}</div>
          {sub.equiv && <div className="price-period-equiv">{sub.equiv}</div>}
        </div>
        <ul className="price-features">
          {SUBSCRIPTION_FEATURES.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <Link
          href={`/checkout?tier=subscription&cadence=${subCadence}`}
          className="price-cta primary text-center"
          onClick={() => {
            feedbackClick();
            track("cta_click", {
              cta: "subscribe",
              tier: "subscription",
              cadence: subCadence,
              location: "pricing_card",
            });
          }}
        >
          Subscribe →
        </Link>
      </TiltCard>

      {/* Inner Circle card */}
      <TiltCard className="pricing-card gold" maxTilt={4} scale={1.008}>
        <div className="price-tier">Inner Circle</div>
        <div className="cadence-toggle two-col">
          <CadenceButton
            active={icCadence === "monthly"}
            onClick={() => {
              setIcCadence("monthly");
              track("cadence_change", { tier: "innercircle", cadence: "monthly" });
            }}
          >
            Monthly
          </CadenceButton>
          <CadenceButton
            active={icCadence === "annual"}
            onClick={() => {
              setIcCadence("annual");
              track("cadence_change", { tier: "innercircle", cadence: "annual" });
            }}
          >
            Annual
            <span className="cadence-save">SAVE 17%</span>
          </CadenceButton>
        </div>
        <div key={icCadence} className="price-block">
          <div className="price-amount">{ic.price}</div>
          <div className="price-period">{ic.period}</div>
          {ic.equiv && <div className="price-period-equiv">{ic.equiv}</div>}
        </div>
        <ul className="price-features">
          {INNERCIRCLE_FEATURES.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <div className="ic-mini">
          <div className="ic-mini-line1">
            <span className="ic-mini-dot"></span>
            {IC_STATUS.label}
          </div>
          <div className="ic-mini-line2">By application only</div>
        </div>
        <Link
          href="/apply"
          className="price-cta primary text-center"
          onClick={() => {
            feedbackClick();
            track("cta_click", {
              cta: "apply_ic",
              tier: "innercircle",
              cadence: icCadence,
              location: "pricing_card",
            });
          }}
        >
          Apply for Inner Circle
        </Link>
      </TiltCard>
    </div>
  );
}

function CadenceButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={`cadence-btn ${active ? "active" : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

