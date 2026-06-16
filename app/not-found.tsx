import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell" style={{ padding: "120px 0", textAlign: "center" }}>
      <div
        className="mono"
        style={{
          color: "var(--accent)",
          fontSize: 14,
          letterSpacing: "0.12em",
          marginBottom: 16,
          textTransform: "uppercase",
        }}
      >
        404
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
        That page isn&apos;t in the channel.
      </h1>
      <p
        style={{
          color: "var(--text-mute)",
          fontSize: 17,
          maxWidth: 520,
          margin: "0 auto 32px",
        }}
      >
        Either it never existed or it&apos;s been retired. Try one of the links below.
        The picks haven&apos;t moved.
      </p>
      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Link href="/" className="btn btn-primary btn-lg">
          Back to picks
        </Link>
        <Link href="/#pricing" className="btn btn-secondary btn-lg">
          See pricing
        </Link>
      </div>

      {/* Popular links: quick recovery for mistyped URLs */}
      <div
        style={{
          marginTop: 64,
          padding: 32,
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          maxWidth: 520,
          margin: "64px auto 0",
        }}
      >
        <div
          className="mono"
          style={{
            color: "var(--text-mute)",
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          Popular links
        </div>
        <div style={{ display: "grid", gap: 4 }}>
          {[
            { href: "/", label: "Home", desc: "Daily picks + the rest" },
            { href: "/#pricing", label: "Pricing", desc: "$29/wk, $99/mo, $599/yr" },
            { href: "/#how-it-works", label: "How it works", desc: "From signup to first cashed bet" },
            { href: "/checkout?tier=innercircle&cadence=monthly", label: "Inner Circle", desc: "Application only · 33 spots open" },
            { href: "/#faq", label: "FAQ", desc: "The questions everyone asks" },
          ].map((it) => (
            <Link
              key={it.href}
              href={it.href}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 14px",
                borderRadius: 8,
                fontSize: 14,
                color: "var(--text)",
                transition: "background 0.15s",
              }}
            >
              <span style={{ fontWeight: 600 }}>{it.label}</span>
              <span style={{ fontSize: 12, color: "var(--text-mute)" }}>{it.desc}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
