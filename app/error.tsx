"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // TODO: pipe to error reporting (Sentry / Highlight) once decided.
    console.error("Lockr error boundary:", error);
  }, [error]);

  return (
    <div className="shell" style={{ padding: "120px 0", textAlign: "center" }}>
      <div
        className="mono"
        style={{
          color: "var(--danger)",
          fontSize: 14,
          letterSpacing: "0.12em",
          marginBottom: 16,
          textTransform: "uppercase",
        }}
      >
        500 · server hiccup
      </div>
      <h1
        style={{
          fontSize: "clamp(40px, 6vw, 64px)",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          marginBottom: 16,
        }}
      >
        Something broke on our side.
      </h1>
      <p
        style={{
          color: "var(--text-mute)",
          fontSize: 17,
          maxWidth: 520,
          margin: "0 auto 32px",
        }}
      >
        Not your fault. The plays are still landing on schedule. Try again, or head back home.
      </p>
      {error.digest && (
        <div
          className="mono"
          style={{
            color: "var(--text-dim)",
            fontSize: 12,
            marginBottom: 24,
          }}
        >
          ref: {error.digest}
        </div>
      )}
      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <button onClick={reset} className="btn btn-primary btn-lg" type="button">
          Try again
        </button>
        <Link href="/" className="btn btn-secondary btn-lg">
          Back to picks
        </Link>
      </div>
    </div>
  );
}
