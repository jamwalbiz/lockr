"use client";

import { useState } from "react";
import { PRICING } from "@/lib/copy";

type Tier = "subscription" | "innercircle";
type Cadence = "weekly" | "monthly" | "annual";
type Step = 1 | 2 | 3 | 4;

const STEP_LABELS: Record<Step, string> = {
  1: "Tier",
  2: "Account",
  3: "Payment",
  4: "Discord",
};

export function CheckoutFlow({
  initialTier,
  initialCadence,
}: {
  initialTier: Tier;
  initialCadence: Cadence;
}) {
  const [step, setStep] = useState<Step>(2);
  const [tier] = useState<Tier>(initialTier);
  const [cadence] = useState<Cadence>(
    // Inner Circle has no weekly cadence
    initialTier === "innercircle" && initialCadence === "weekly"
      ? "monthly"
      : initialCadence,
  );
  const [payMethod, setPayMethod] = useState<"card" | "crypto">("card");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [discordUsername, setDiscordUsername] = useState("");

  // Cadence is constrained by tier; pull the matching price entry.
  const priceEntry =
    tier === "subscription"
      ? PRICING.subscription[cadence as keyof typeof PRICING.subscription]
      : PRICING.innercircle[cadence as keyof typeof PRICING.innercircle];

  const tierLabel = tier === "subscription" ? "Lockr Subscription" : "Inner Circle";
  const cadenceLabel =
    cadence === "weekly" ? "Weekly" : cadence === "monthly" ? "Monthly" : "Annual";
  const progressPct = (step / 4) * 100;

  function next() {
    if (step < 4) setStep((step + 1) as Step);
  }

  return (
    <div className="checkout-page">
      <div className="checkout-progress">
        <div className="checkout-progress-meta">
          <span className="checkout-progress-label">
            Step {step} of 4 · {step === 4 ? "All set" : "Almost there"}
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
        {([1, 2, 3, 4] as const).map((s, idx) => (
          <div
            key={s}
            className={`checkout-step ${
              s === step ? "active" : s < step ? "done" : ""
            }`}
            style={{ flex: idx < 3 ? "0 0 auto" : "0 0 auto" }}
          >
            <div className="checkout-step-num">{s < step ? "✓" : s}</div>
            <span>{STEP_LABELS[s]}</span>
            {idx < 3 && (
              <div className="checkout-step-line" style={{ flex: "1 1 auto", minWidth: 16 }}></div>
            )}
          </div>
        ))}
      </div>

      <div className="checkout-card">
        {step === 1 && (
          <>
            <h2>Confirm your tier</h2>
            <div style={{ color: "var(--text-mute)", fontSize: 14, marginBottom: 24 }}>
              You selected <strong style={{ color: "var(--text)" }}>{tierLabel}</strong>{" "}
              · <span className="mono">{cadenceLabel}</span>. Change anything below if you
              need to.
            </div>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={next}
            >
              Continue →
            </button>
          </>
        )}

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
            <div className="form-row">
              <label htmlFor="co-discord">Discord username (optional)</label>
              <input
                id="co-discord"
                type="text"
                placeholder="username"
                value={discordUsername}
                onChange={(e) => setDiscordUsername(e.target.value)}
              />
            </div>

            <h2 style={{ marginTop: 40 }}>Payment method</h2>
            <div className="pay-options">
              <button
                type="button"
                className={`pay-option ${payMethod === "card" ? "selected" : ""}`}
                onClick={() => setPayMethod("card")}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="6" width="18" height="12" rx="2" />
                  <line x1="3" y1="11" x2="21" y2="11" />
                </svg>
                <div>
                  <div className="pay-option-name">Card / ACH</div>
                  <div className="pay-option-sub">Visa, MC, Amex, ACH</div>
                </div>
              </button>
              <button
                type="button"
                className={`pay-option ${payMethod === "crypto" ? "selected" : ""}`}
                onClick={() => setPayMethod("crypto")}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M8 12h8M12 8v8" />
                </svg>
                <div>
                  <div className="pay-option-name">Crypto</div>
                  <div className="pay-option-sub">BTC, ETH, USDC</div>
                </div>
              </button>
            </div>

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
              onClick={next}
              disabled={!email}
            >
              Complete payment →
            </button>

            <div
              style={{
                marginTop: 16,
                fontSize: 11,
                color: "var(--text-dim)",
                textAlign: "center",
              }}
            >
              Secured by PaymentCloud + Coinbase Commerce. Bank-level encryption. Cancel
              any time.
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2>Processing payment</h2>
            <p style={{ color: "var(--text-mute)", marginBottom: 24 }}>
              In production this hands off to PaymentCloud&apos;s hosted checkout (cards/ACH)
              or Coinbase Commerce (crypto). For now, advancing to the Discord step.
            </p>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={next}
            >
              Continue →
            </button>
          </>
        )}

        {step === 4 && (
          <>
            <h2>You&apos;re in.</h2>
            <p style={{ color: "var(--text-mute)", marginBottom: 16 }}>
              We&apos;ve sent a Discord invite to{" "}
              <strong style={{ color: "var(--text)" }}>{email || "your email"}</strong>.
              Your <span className="mono">{tierLabel}</span> badge will be assigned
              automatically when you join.
            </p>
            <div className="checkout-summary">
              <div className="checkout-summary-row">
                <span>Welcome email</span>
                <span className="mono" style={{ color: "var(--accent)" }}>SENT</span>
              </div>
              <div className="checkout-summary-row">
                <span>Discord invite</span>
                <span className="mono" style={{ color: "var(--accent)" }}>SENT</span>
              </div>
              <div className="checkout-summary-row">
                <span>Tier badge</span>
                <span className="mono">{tierLabel}</span>
              </div>
            </div>
            <a
              href="https://discord.gg/joinlockr"
              className="btn btn-primary btn-lg"
              style={{ width: "100%", marginTop: 24, justifyContent: "center" }}
            >
              Open Discord →
            </a>
          </>
        )}
      </div>

      {step > 1 && step < 4 && (
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setStep((step - 1) as Step)}
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}
