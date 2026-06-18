"use client";

import { track } from "@vercel/analytics";
import { useState } from "react";

// On-brand email capture for the free "Prediction Markets 101" lead magnet.
// Posts to /api/lead (Kit). The picks stay paid; this trades free education for
// an owned email. `location` tags where the signup happened for analytics.
export function EmailCapture({
  location,
  variant = "band",
}: {
  location: string;
  variant?: "band" | "inline";
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState("");
  const [website, setWebsite] = useState(""); // honeypot

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "loading") return;
    setState("loading");
    setError("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        setState("done");
        track("lead_capture", { location });
      } else {
        setState("error");
        setError(data.error || "Something went wrong. Try again.");
      }
    } catch {
      setState("error");
      setError("Network error. Try again.");
    }
  }

  if (state === "done") {
    return (
      <div className={`email-capture ec-${variant} ec-done`}>
        <div className="ec-done-mark" aria-hidden="true">
          ✓
        </div>
        <div className="ec-done-text">
          <strong>You&apos;re in.</strong> Check your inbox for the guide. New
          edges land there first.
        </div>
      </div>
    );
  }

  return (
    <form className={`email-capture ec-${variant}`} onSubmit={onSubmit} noValidate>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="ec-hp"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        aria-hidden="true"
      />
      <input
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="you@email.com"
        className="ec-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Your email"
        data-allow-select
        required
      />
      <button
        type="submit"
        className="btn btn-primary ec-btn"
        disabled={state === "loading"}
      >
        {state === "loading" ? "Sending..." : "Get the free guide"}
      </button>
      {state === "error" && (
        <p className="ec-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
