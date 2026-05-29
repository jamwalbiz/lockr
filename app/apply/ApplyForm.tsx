"use client";

import { track } from "@vercel/analytics";
import { useState } from "react";
import { feedbackClick, feedbackSuccess } from "@/lib/sound";
import { whopCheckoutUrl } from "@/lib/copy";

const SPORTS = ["NFL", "NBA", "MLB", "NHL", "UFC", "F1", "NCAA", "Soccer", "Tennis", "Esports", "Kalshi", "Polymarket"];
const BANKROLL_RANGES = [
  "Under $5K",
  "$5K – $25K",
  "$25K – $100K",
  "$100K – $500K",
  "$500K+",
];

export function ApplyForm() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleSport(s: string) {
    setSelectedSports((curr) =>
      curr.includes(s) ? curr.filter((x) => x !== s) : [...curr, s],
    );
  }

  if (submitted) {
    // IC monthly only — annual is intentionally out-of-band (no Whop plan).
    // whopCheckoutUrl returns null if the plan doesn't exist; the fallback
    // text handles that case but in practice IC monthly always has a plan.
    const checkoutUrl = whopCheckoutUrl("innercircle", "monthly");
    return (
      <div className="checkout-card">
        <h2>You&apos;re in.</h2>
        <p style={{ color: "var(--text-mute)", marginBottom: 24 }}>
          Inner Circle approved. Lock your spot below — payment via Whop, Discord
          access is automatic the moment you finish.
        </p>
        {checkoutUrl ? (
          <a
            href={checkoutUrl}
            className="btn btn-primary btn-lg"
            style={{
              width: "100%",
              justifyContent: "center",
              background: "var(--gold)",
              borderColor: "var(--gold)",
            }}
            onClick={() => {
              feedbackClick();
              track("ic_apply_to_checkout");
            }}
          >
            Continue to checkout · $499/mo →
          </a>
        ) : (
          <p style={{ color: "var(--text-mute)", fontSize: 14 }}>
            JT will email you the checkout link shortly.
          </p>
        )}
        <p
          style={{
            color: "var(--text-dim)",
            marginTop: 16,
            fontSize: 12,
            textAlign: "center",
          }}
        >
          Prefer annual ($4,999/yr)? Reply to your confirmation email and JT will
          send you a direct payment link.
        </p>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Honeypot — bots fill hidden fields; humans don't. If filled, silently
    // pretend success and bail. No tracking noise from bots, no network call.
    if (honeypot) {
      setSubmitted(true);
      return;
    }

    if (submitting) return;
    setError(null);
    setSubmitting(true);

    // Read inputs via name attributes on the form — fewer useState hooks,
    // matches how the page already wires submit.
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      age: fd.get("age"),
      bankroll: fd.get("bankroll"),
      why: fd.get("why"),
      useCase: fd.get("useCase"),
      sports: selectedSports,
    };

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data: { ok?: boolean; error?: string } = await res
        .json()
        .catch(() => ({}));

      if (!res.ok || !data.ok) {
        setError(data.error || "Something went wrong. Try again in a minute.");
        setSubmitting(false);
        return;
      }

      track("apply_submit", { sports_count: selectedSports.length });
      feedbackSuccess();
      setSubmitted(true);
    } catch {
      setError("Network error. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <form className="checkout-card" onSubmit={onSubmit}>
      {/* Honeypot: hidden from humans (off-screen + aria-hidden + autocomplete=off + tabIndex=-1).
          Bots blindly fill every input including this one — filled = bot. */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}
      >
        <label htmlFor="ap-website">Website (leave blank)</label>
        <input
          id="ap-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>
      <div className="form-row">
        <label htmlFor="ap-name">Full name</label>
        <input id="ap-name" name="name" type="text" required placeholder="First Last" />
      </div>
      <div className="form-row">
        <label htmlFor="ap-email">Email</label>
        <input id="ap-email" name="email" type="email" required placeholder="you@example.com" />
      </div>
      <div className="form-row">
        <label htmlFor="ap-age">Age</label>
        <input id="ap-age" name="age" type="number" min={18} max={120} required placeholder="35" />
      </div>

      <div className="form-row">
        <label>Which sports / markets do you bet?</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
          {SPORTS.map((s) => {
            const on = selectedSports.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggleSport(s)}
                style={{
                  padding: "7px 13px",
                  borderRadius: 100,
                  border: `1px solid ${on ? "var(--accent)" : "var(--border-strong)"}`,
                  background: on ? "rgba(0,255,133,0.08)" : "transparent",
                  color: on ? "var(--accent)" : "var(--text-mute)",
                  fontSize: 13,
                  fontFamily: "var(--font-jetbrains), monospace",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      <div className="form-row">
        <label htmlFor="ap-bankroll">Current bankroll size</label>
        <select id="ap-bankroll" name="bankroll" required defaultValue="">
          <option value="" disabled>
            Select a range
          </option>
          {BANKROLL_RANGES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <label htmlFor="ap-why">Why do you want to join Inner Circle?</label>
        <textarea
          id="ap-why"
          name="why"
          required
          rows={4}
          placeholder="What you're hoping to get out of it — be specific."
          style={{ resize: "vertical" }}
        />
      </div>

      <div className="form-row">
        <label htmlFor="ap-use">How will you use the access?</label>
        <textarea
          id="ap-use"
          name="useCase"
          rows={3}
          placeholder="Tail every pick? Selective on certain sports? Use the prop model for your own research?"
          style={{ resize: "vertical" }}
        />
      </div>

      {error && (
        <div
          role="alert"
          style={{
            marginTop: 16,
            padding: "10px 14px",
            borderRadius: 8,
            background: "rgba(255,80,80,0.08)",
            border: "1px solid rgba(255,80,80,0.35)",
            color: "var(--text)",
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primary btn-lg"
        disabled={submitting}
        style={{
          width: "100%",
          marginTop: 16,
          justifyContent: "center",
          background: "var(--gold)",
          borderColor: "var(--gold)",
          opacity: submitting ? 0.7 : 1,
          cursor: submitting ? "wait" : "pointer",
        }}
      >
        {submitting ? "Submitting…" : "Submit application →"}
      </button>
      <div
        style={{
          marginTop: 12,
          fontSize: 11,
          color: "var(--text-dim)",
          textAlign: "center",
        }}
      >
        200-member cap · Instant approval · Cancel any time.
      </div>
    </form>
  );
}
