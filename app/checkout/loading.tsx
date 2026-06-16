export default function Loading() {
  return (
    <div className="shell">
      <div className="checkout-page">
        <div className="checkout-progress">
          <div className="checkout-progress-meta">
            <span className="checkout-progress-label">Loading…</span>
            <span className="checkout-progress-pct">–</span>
          </div>
          <div className="checkout-progress-track">
            <div className="checkout-progress-fill" style={{ width: "10%" }}></div>
          </div>
        </div>
        <div className="checkout-card" style={{ minHeight: 320 }}>
          <div
            style={{
              height: 28,
              width: 180,
              background: "var(--bg-elevated-2)",
              borderRadius: 6,
              marginBottom: 32,
            }}
          />
          <div
            style={{
              height: 48,
              background: "var(--bg-elevated-2)",
              borderRadius: 8,
              marginBottom: 16,
            }}
          />
          <div
            style={{
              height: 48,
              background: "var(--bg-elevated-2)",
              borderRadius: 8,
              marginBottom: 16,
            }}
          />
          <div
            style={{
              height: 48,
              background: "var(--bg-elevated-2)",
              borderRadius: 8,
            }}
          />
        </div>
      </div>
    </div>
  );
}
