import { ImageResponse } from "next/og";

export const alt = "Lockr — Where serious bettors get serious edges";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// 1200×630 OG card. Used by Twitter too unless app/twitter-image.* exists.
// Notes on next/og (Satori) constraints: no z-index, no animations, no custom
// fonts beyond what we explicitly load. Stick to characters Noto Sans covers.
export default function OpenGraph() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0b",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: 80,
          fontFamily: "Inter, sans-serif",
          color: "#f5f4f1",
          position: "relative",
        }}
      >
        {/* Wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 64,
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              background: "#00ff85",
              borderRadius: 3,
            }}
          />
          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            LOCKR
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 84,
            fontWeight: 800,
            lineHeight: 1.02,
            letterSpacing: "-0.04em",
            marginBottom: 12,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>Where serious bettors</span>
          <span style={{ display: "flex", alignItems: "center", gap: 14 }}>
            get serious{" "}
            <span
              style={{
                background: "#00ff85",
                color: "#000",
                padding: "2px 22px 14px",
                borderRadius: 12,
                lineHeight: 1,
              }}
            >
              edges
            </span>
            .
          </span>
        </div>

        {/* Sub */}
        <div
          style={{
            fontSize: 28,
            color: "#8b8b85",
            lineHeight: 1.4,
            maxWidth: 900,
            marginTop: 24,
          }}
        >
          Daily picks across every sport, plus prediction-market plays on Kalshi and
          Polymarket.
        </div>

        {/* Stats footer — absolute so it pins to bottom */}
        <div
          style={{
            position: "absolute",
            left: 80,
            right: 80,
            bottom: 64,
            display: "flex",
            gap: 64,
            borderTop: "1px solid rgba(245,244,241,0.1)",
            paddingTop: 24,
          }}
        >
          <Stat num="+147u" label="12-MO UNITS WON" positive />
          <Stat num="60%+" label="WIN RATE" />
          <Stat num="4.9" label="MEMBER RATING" positive />
          <Stat num="10+" label="SPORTS + MARKETS" />
        </div>
      </div>
    ),
    { ...size },
  );
}

function Stat({
  num,
  label,
  positive,
}: {
  num: string;
  label: string;
  positive?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          fontSize: 44,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: positive ? "#00ff85" : "#f5f4f1",
        }}
      >
        {num}
      </div>
      <div
        style={{
          fontSize: 14,
          color: "#8b8b85",
          marginTop: 4,
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </div>
    </div>
  );
}
