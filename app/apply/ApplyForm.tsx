"use client";

import { track } from "@vercel/analytics";
import { useState } from "react";
import { feedbackSuccess } from "@/lib/sound";

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

  function toggleSport(s: string) {
    setSelectedSports((curr) =>
      curr.includes(s) ? curr.filter((x) => x !== s) : [...curr, s],
    );
  }

  if (submitted) {
    return (
      <div className="checkout-card">
        <h2>Application received.</h2>
        <p style={{ color: "var(--text-mute)", marginBottom: 16 }}>
          JT will personally review your application. Expect a response at the email you
          provided within 48 hours.
        </p>
        <p style={{ color: "var(--text-mute)", marginBottom: 0, fontSize: 14 }}>
          In the meantime, follow{" "}
          <a href="https://x.com/joinlockr" style={{ color: "var(--accent)" }}>
            @joinlockr
          </a>{" "}
          for daily picks and pre-decision context.
        </p>
      </div>
    );
  }

  return (
    <form
      className="checkout-card"
      onSubmit={(e) => {
        e.preventDefault();
        // Honeypot — bots fill hidden fields; humans don't. If filled, silently
        // pretend success and bail. No tracking noise from bots.
        if (honeypot) {
          setSubmitted(true);
          return;
        }
        // TODO: wire to JT's intake — Formspree / direct mail / Notion DB
        // pending Phase 0 launch checklist
        track("apply_submit", { sports_count: selectedSports.length });
        feedbackSuccess();
        setSubmitted(true);
      }}
    >
      {/* Honeypot: hidden from humans (off-screen + aria-hidden + autocomplete=off + tabIndex=-1).
          Bots blindly fill every input including this one — filled = bot. */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}
      >
        <label htmlFor="ap-website">Website (leave blank)</label>
        <input
          id="ap-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>
      <div className="form-row">
        <label htmlFor="ap-name">Full name</label>
        <input id="ap-name" type="text" required placeholder="First Last" />
      </div>
      <div className="form-row">
        <label htmlFor="ap-email">Email</label>
        <input id="ap-email" type="email" required placeholder="you@example.com" />
      </div>
      <div className="form-row">
        <label htmlFor="ap-age">Age</label>
        <input id="ap-age" type="number" min={18} max={120} required placeholder="35" />
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
        <select id="ap-bankroll" required defaultValue="">
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
          rows={3}
          placeholder="Tail every pick? Selective on certain sports? Use the prop model for your own research?"
          style={{ resize: "vertical" }}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-lg"
        style={{
          width: "100%",
          marginTop: 16,
          justifyContent: "center",
          background: "var(--gold)",
          borderColor: "var(--gold)",
        }}
      >
        Submit application →
      </button>
      <div
        style={{
          marginTop: 12,
          fontSize: 11,
          color: "var(--text-dim)",
          textAlign: "center",
        }}
      >
        JT reviews every application personally. Average response time: 48 hours.
      </div>
    </form>
  );
}
