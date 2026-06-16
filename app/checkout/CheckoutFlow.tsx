"use client";

import Link from "next/link";
import { useState } from "react";
import { track } from "@vercel/analytics";
import { WhopCheckoutEmbed } from "@whop/checkout/react";
import { feedbackClick, feedbackSuccess } from "@/lib/sound";
import { PRICING } from "@/lib/copy";

type Tier = "subscription" | "innercircle";
type Cadence = "weekly" | "monthly" | "annual";
// Two-step wizard: Tier → Pay (embedded Whop checkout, inline). Whop's
// embed runs the payment + identity capture; we stay on joinlockr.com the
// whole time. After completion the embed fires onComplete and we render
// our own success state instead of a redirect.
type Step = 1 | 2;

const STEP_LABELS: Record<Step, string> = {
  1: "Tier",
  2: "Pay",
};

export function CheckoutFlow({
  initialTier,
  initialCadence,
}: {
  initialTier: Tier | undefined;
  initialCadence: Cadence | undefined;
}) {
  // If they came from the pricing card (params present), they've already
  // picked, so skip to step 2. Otherwise start at step 1 (tier picker).
  const cameInPrePicked = !!(initialTier && initialCadence);
  const [step, setStep] = useState<Step>(cameInPrePicked ? 2 : 1);
  const [tier, setTier] = useState<Tier>(initialTier ?? "subscription");
  const [cadence, setCadence] = useState<Cadence>(
    // Inner Circle has no weekly cadence.
    initialTier === "innercircle" && initialCadence === "weekly"
      ? "monthly"
      : (initialCadence ?? "monthly"),
  );
  const [completed, setCompleted] = useState(false);

  // Resolve the price entry for the current tier+cadence combo.
  const priceEntry =
    tier === "subscription"
      ? PRICING.subscription[cadence as keyof typeof PRICING.subscription]
      : PRICING.innercircle[cadence as keyof typeof PRICING.innercircle];

  // The Whop plan ID for the current tier+cadence. IC annual is the one
  // exception: no plan ID exists yet ($2,500 Whop cap), so we render a
  // fallback that routes folks to IC monthly + offers email arrangement.
  // Every other combo embeds inline.
  const planId = (priceEntry as { whopPlanId?: string }).whopPlanId;

  const tierLabel = tier === "subscription" ? "Lockr Subscription" : "Inner Circle";
  const cadenceLabel =
    cadence === "weekly" ? "Weekly" : cadence === "monthly" ? "Monthly" : "Annual";
  const progressPct = (step / 2) * 100;

  function next() {
    if (step < 2) {
      setStep(2);
      feedbackClick();
    }
  }
  function back() {
    // Back is a retreat, not a commit, so intentionally silent. Going forward
    // (next()) keeps the chime as a positive-progress signal. Going back
    // also clears the completed flag so the embed re-mounts on a new step 2.
    if (step > 1) {
      setStep((step - 1) as Step);
      setCompleted(false);
    }
  }

  /**
   * Embed completion callback. Whop fires this on successful purchase
   * with the plan_id + receipt_id. We chime, fire analytics, and render
   * the in-page success state; no redirect, the user stays on
   * joinlockr.com so the brand experience is continuous.
   */
  function handleComplete(planIdReceived: string, receiptId?: string) {
    feedbackSuccess();
    track("checkout_complete", {
      tier,
      cadence,
      planId: planIdReceived,
      receiptId: receiptId ?? "",
    });
    setCompleted(true);
  }

  /**
   * Fired when the buyer types their email into the embed. Useful as a
   * funnel-stage signal. Most drop-off happens between picker and email,
   * so knowing email-entered helps separate "didn't engage" from "engaged
   * but bailed on payment."
   */
  function handleIdentityCaptured(data: { email?: string; user_id?: string }) {
    if (data.email) {
      track("checkout_email_entered", { tier, cadence });
    }
  }

  // Sub cadence valid: weekly, monthly, annual. IC: monthly, annual.
  const validSubCadences: Cadence[] = ["weekly", "monthly", "annual"];

  return (
    <div className="checkout-page">
      <div className="checkout-progress">
        <div className="checkout-progress-meta">
          <span className="checkout-progress-label">
            Step {step} of 2 · {step === 1 ? "Pick your plan" : completed ? "Done" : "Almost there"}
          </span>
          <span className="checkout-progress-pct">{progressPct}% complete</span>
        </div>
        <div className="checkout-progress-track">
          <div
            className="checkout-progress-fill"
            style={{ width: `${progressPct}%` }}
          ></div>
        </div>
      </div>

      <div className="checkout-steps">
        {([1, 2] as const).map((s, idx) => (
          <div
            key={s}
            className={`checkout-step ${
              s === step ? "active" : s < step ? "done" : ""
            }`}
          >
            <div className="checkout-step-num">{s < step || (s === step && completed) ? "✓" : s}</div>
            <span>{STEP_LABELS[s]}</span>
            {idx < 1 && <div className="checkout-step-line" style={{ minWidth: 16 }}></div>}
          </div>
        ))}
      </div>

      <div className="checkout-card">
        {/* Step 1: Tier + cadence picker */}
        {step === 1 && (
          <>
            <h2>Pick your plan</h2>
            <p style={{ color: "var(--text-mute)", fontSize: 14, marginBottom: 24 }}>
              Same features at every cadence. Pay weekly to try it. Pay annually to save
              ~60% vs weekly.
            </p>

            <div className="cadence-toggle" style={{ marginBottom: 24 }}>
              {validSubCadences.map((c) => {
                return (
                  <button
                    key={c}
                    type="button"
                    className={`cadence-btn ${cadence === c ? "active" : ""}`}
                    onClick={() => {
                      setTier("subscription");
                      setCadence(c);
                    }}
                  >
                    {c === "weekly" ? "Weekly" : c === "monthly" ? "Monthly" : "Annual"}
                    {c === "monthly" && <span className="cadence-save">SAVE 20%</span>}
                    {c === "annual" && <span className="cadence-save">SAVE 60%</span>}
                  </button>
                );
              })}
            </div>

            <div
              style={{
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: 20,
                marginBottom: 24,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  <div className="price-tier" style={{ marginBottom: 4 }}>
                    Lockr Subscription
                  </div>
                  <div className="price-period">{priceEntry.period}</div>
                  {priceEntry.equiv && (
                    <div className="price-period-equiv">{priceEntry.equiv}</div>
                  )}
                </div>
                <div className="price-amount" style={{ fontSize: 32 }}>
                  {priceEntry.price}
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-lg"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={next}
            >
              Continue →
            </button>

            <div
              style={{
                marginTop: 16,
                fontSize: 12,
                color: "var(--text-mute)",
                textAlign: "center",
              }}
            >
              Looking for Inner Circle?{" "}
              <Link
                href="/checkout?tier=innercircle&cadence=monthly"
                style={{ color: "var(--accent)" }}
              >
                Apply here →
              </Link>{" "}
              · application only, 200-member cap
            </div>
          </>
        )}

        {/* Step 2: Embedded Whop checkout. We intentionally don't render
            a heading or order summary above the embed: Whop's own card shows
            product + price + cadence at the top, so an extra "Complete your
            subscription" header just pushed the email input below the fold.
            Compact layout = email visible without scrolling on most viewports. */}
        {step === 2 && !completed && (
          <>
            {planId ? (
              <div className="whop-embed-wrap">
                <WhopCheckoutEmbed
                  planId={planId}
                  theme="dark"
                  themeOptions={{ accentColor: "green" }}
                  skipRedirect
                  onComplete={handleComplete}
                  onIdentityCaptured={handleIdentityCaptured}
                  fallback={
                    <div
                      style={{
                        padding: "60px 20px",
                        textAlign: "center",
                        color: "var(--text-mute)",
                        fontSize: 14,
                      }}
                    >
                      Loading secure checkout…
                    </div>
                  }
                />
              </div>
            ) : (
              // IC annual fallback: Whop's $2,500 cap blocks the annual
              // plan today, so we route folks to the monthly embed (same
              // application gate, same product) and offer email contact
              // for direct annual arrangement. When the cap lifts we'll
              // wire annual through the embed and delete this branch.
              <div
                style={{
                  padding: 24,
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  textAlign: "center",
                }}
              >
                <p style={{ marginBottom: 16, fontSize: 14, lineHeight: 1.5 }}>
                  Inner Circle annual isn&apos;t live for self-checkout yet
                  (processor cap). Two options:
                </p>
                <Link
                  href="/checkout?tier=innercircle&cadence=monthly"
                  className="btn btn-primary btn-lg"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Start with Inner Circle monthly →
                </Link>
                <div style={{ marginTop: 12, fontSize: 12, color: "var(--text-mute)" }}>
                  Or arrange annual direct:{" "}
                  <a href="mailto:hello@joinlockr.com" style={{ color: "var(--accent)" }}>
                    hello@joinlockr.com
                  </a>
                </div>
              </div>
            )}

            <div
              style={{
                marginTop: 16,
                fontSize: 11,
                color: "var(--text-dim)",
                textAlign: "center",
              }}
            >
              Secured by Whop. Bank-level encryption. Cancel any time.
            </div>
          </>
        )}

        {/* Step 2: success state (replaces the embed after onComplete fires) */}
        {step === 2 && completed && (
          <div style={{ textAlign: "center", padding: "32px 16px" }}>
            <h2 style={{ marginBottom: 12 }}>You&apos;re in.</h2>
            <p style={{ color: "var(--text-mute)", marginBottom: 24, lineHeight: 1.6 }}>
              Welcome to {tierLabel}. Two more clicks to get into Discord:
              <br />
              <strong style={{ color: "var(--text)" }}>
                In your Whop account → Connected Accounts → link Discord → hit
                &quot;Claim Access&quot; on your product.
              </strong>
              <br />
              Your tier role assigns in under a minute. No manual approval.
            </p>
            <a
              href="https://whop.com/orders"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg"
              style={{ justifyContent: "center" }}
            >
              Go to Whop →
            </a>
            <div
              style={{
                marginTop: 16,
                fontSize: 12,
                color: "var(--text-mute)",
              }}
            >
              Receipt sent to your email. Any issues:{" "}
              <a
                href="mailto:hello@joinlockr.com"
                style={{ color: "var(--accent)" }}
              >
                hello@joinlockr.com
              </a>
            </div>
          </div>
        )}
      </div>

      {step > 1 && !completed && (
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <button type="button" className="btn btn-ghost" onClick={back}>
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}
