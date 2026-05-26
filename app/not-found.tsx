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
        Either it never existed or it&apos;s been retired. Try one of the links below —
        the picks haven&apos;t moved.
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
        <Link href="/pricing" className="btn btn-secondary btn-lg">
          See pricing
        </Link>
      </div>
    </div>
  );
}
