"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export function NewsletterForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading" || status === "success") return;
    setStatus("loading");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Subscription failed. Try again.");
      }
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Try again.");
    }
  }

  const buttonLabel =
    status === "loading"
      ? "Subscribing…"
      : status === "success"
      ? "✓ Subscribed"
      : "Subscribe";

  return (
    <div>
      <form className="footer-capture-form" onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="you@example.com"
          required
          aria-label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading" || status === "success"}
        />
        <button type="submit" disabled={status === "loading" || status === "success"}>
          {buttonLabel}
        </button>
      </form>
      {status === "error" && errorMsg && (
        <div
          role="alert"
          style={{
            fontSize: 12,
            color: "var(--danger)",
            marginTop: 8,
            fontFamily: "var(--font-jetbrains), monospace",
          }}
        >
          {errorMsg}
        </div>
      )}
      {status === "success" && (
        <div
          style={{
            fontSize: 12,
            color: "var(--text-mute)",
            marginTop: 8,
          }}
        >
          You&apos;re on the list. Watch for the welcome email.
        </div>
      )}
    </div>
  );
}
