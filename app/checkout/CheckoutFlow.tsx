"use client";

import Link from "next/link";
import { useState } from "react";
import { feedbackClick, feedbackSuccess } from "@/lib/sound";
import { PRICING, whopCheckoutUrl, isValidEmail } from "@/lib/copy";

type Tier = "subscription" | "innercircle";
type Cadence = "weekly" | "monthly" | "annual";
// Two-step wizard: Tier → Account → (redirect to Whop). Whop runs the
// payment + post-purchase community access; we don't render either step.
type Step = 1 | 2;

const STEP_LABELS: Record<Step, string> = {
  1: "Tier",
  2: "Account",
};

export function CheckoutFlow({
  initialTier,
  initialCadence,
}: {
  initialTier: Tier | undefined;
  initialCadence: Cadence | undefined;
}) {
  // If they came from the pricing card (params present), they've already
  // picked — skip to step 2. Otherwise start at step 1 (tier picker).
  const cameInPrePicked = !!(initialTier && initialCadence);
  const [step, setStep] = useState<Step>(cameInPrePicked ? 2 : 1);
  const [tier, setTier] = useState<Tier>(initialTier ?? "subscription");
  const [cadence, setCadence] = useState<Cadence>(
    // Inner Circle has no weekly cadence.
    initialTier === "innercircle" && initialCadence === "weekly"
      ? "monthly"
      : (initialCadence ?? "monthly"),
  );
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Resolve the price entry for the current tier+cadence combo.
  const priceEntry =
    tier === "subscription"
      ? PRICING.subscription[cadence as keyof typeof PRICING.subscription]
      : PRICING.innercircle[cadence as keyof typeof PRICING.innercircle];

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
    // Back is a retreat, not a commit — intentionally silent. Going forward
    // (next()) keeps the chime as a positive-progress signal.
    if (step > 1) {
      setStep((step - 1) as Step);
    }
  }

  /**
   * Step 2 commit — hand off to Whop's hosted checkout. We fire the success
   * chime (this is the conversion moment) and then redirect. Whop handles
   * payment, confirmation, and granting community access; we don't need our
   * old stub Step 3 / Step 4 for that. If no plan exists for the chosen
   * tier+cadence (currently only IC annual, deferred until Whop's $2,500
   * cap lifts), fall back to /apply so the user can still get to JT.
   */
  function proceedToWhop() {
    feedbackSuccess();
    // Pass the email so Whop's hosted checkout pre-fills it for buyers
    // who don't already have a Whop account. Logged-in Whop users keep
    // their own account email — Whop ignores the param in that case.
    const url = whopCheckoutUrl(tier, cadence, email);
    window.location.href = url ?? "/apply";
  }

  // Sub cadence valid: weekly, monthly, annual. IC: monthly, annual.
  const validSubCadences: Cadence[] = ["weekly", "monthly", "annual"];

  return (
    <div className="checkout-page">
      <div className="checkout-progress">
        <div className="checkout-progress-meta">
          <span className="checkout-progress-label">
            Step {step} of 2 · {step === 1 ? "Pick your plan" : "Almost there"}
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
            <div className="checkout-step-num">{s < step ? "✓" : s}</div>
            <span>{STEP_LABELS[s]}</span>
            {idx < 1 && <div className="checkout-step-line" style={{ minWidth: 16 }}></div>}
          </div>
        ))}
      </div>

      <div className="checkout-card">
        {/* Step 1 — Tier + cadence picker */}
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
              <Link href="/apply" style={{ color: "var(--accent)" }}>
                Apply here →
              </Link>{" "}
              · application only, 200-member cap
            </div>
          </>
        )}

        {/* Step 2 — Account + payment method */}
        {step === 2 && (
          <>
            <h2>Your details</h2>
            <div className="form-row">
              <label htmlFor="co-email">Email</label>
              <input
                id="co-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="form-row">
                <label htmlFor="co-first">First name</label>
                <input
                  id="co-first"
                  type="text"
                  placeholder="First"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="form-row">
                <label htmlFor="co-last">Last name</label>
                <input
                  id="co-last"
                  type="text"
                  placeholder="Last"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            {/* Discord username isn't collected here — Whop captures it
                post-payment in their Connected Accounts flow, and the bot
                auto-assigns the role from there. Asking twice = friction.
                Whop's hosted checkout also owns the payment-method picker
                (Card / Cash App / Bank transfer). */}

            <div className="checkout-summary">
              <div className="checkout-summary-row">
                <span>
                  {tierLabel} · {cadenceLabel}
                </span>
                <span className="mono">{priceEntry.price}</span>
              </div>
              <div className="checkout-summary-row total">
                <span>Due today</span>
                <span className="mono">{priceEntry.price}</span>
              </div>
              <div style={{ fontSize: 11, color: "var(--text-mute)", marginTop: 12 }}>
                {cadence === "weekly"
                  ? "Recurring weekly."
                  : cadence === "monthly"
                  ? "Recurring monthly."
                  : "Recurring annually."}{" "}
                Cancel any time from your account — keep access through your billing
                period.
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-lg"
              style={{ width: "100%", marginTop: 24, justifyContent: "center" }}
              onClick={proceedToWhop}
              disabled={!isValidEmail(email)}
            >
              Continue to secure checkout →
            </button>

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

      </div>

      {step > 1 && (
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <button type="button" className="btn btn-ghost" onClick={back}>
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}
