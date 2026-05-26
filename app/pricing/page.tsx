import type { Metadata } from "next";
import { PricingCards } from "@/components/PricingCards";

export const metadata: Metadata = {
  title: "Pricing — Lockr",
  description:
    "Lockr Subscription from $29/wk, $99/mo, or $599/yr (save ~50%). Inner Circle by application only — $499/mo or $4,999/yr. Cancel any time.",
};

export default function PricingPage() {
  return (
    <div className="shell" style={{ padding: "60px 0" }}>
      <div className="section-head">
        <div className="section-label">Pricing</div>
        <h1
          style={{
            fontSize: "clamp(36px, 5vw, 56px)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            marginBottom: 16,
          }}
        >
          Pick a tier.
        </h1>
        <p style={{ color: "var(--text-mute)", fontSize: 17 }}>
          Cancel any time. No retention department. No &quot;are you sure.&quot;
        </p>
      </div>
      <PricingCards />
      <div className="guarantee">
        <div className="guarantee-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 1 0 9-9" />
            <polyline points="3 4 3 12 11 12" />
          </svg>
        </div>
        <div>
          <div className="guarantee-title">Cancel any time. No retention call.</div>
          <div className="guarantee-sub">
            One-click cancel from your account. No &quot;are you sure&quot; friction, no
            retention department, no email gauntlet. You keep access through the end of
            your billing period — then you&apos;re done.
          </div>
        </div>
        <div className="guarantee-stat">No hidden fees →</div>
      </div>
    </div>
  );
}
