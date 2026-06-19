import { ImageResponse } from "next/og";

// Branded "intel" news-card generator for the @joinlockr feed. Renders a viral,
// screenshot-able NEWS card as a 1080x1350 (IG portrait) PNG from query params.
// The news is the hero; Lockr is a subtle handle, not a banner (reads like a
// news page, not an ad — the CTA lives in the caption, not on the image).
//
// One flexible layout covers the content types via ?type= (a small tag) and the
// optional stat fields:
//   - news      : a headline + a supporting figure (big win, record, market news)
//   - vs        : two numbers compared (heart vs market, public vs market)
//   - plain     : headline + context only (no number)
// No secrets. Public data only. Generated + posted by scripts/generate-intel.mjs.
export const runtime = "edge";

const ACCENT = "#00ff85";
const BLUE = "#4a9eff";
const INK = "#f5f4f1";
const MUTE = "#8b8b85";
const DIM = "#5c5c58";

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const type = (sp.get("type") || sp.get("kicker") || "MARKETS").toUpperCase().slice(0, 22);
  const headline = (sp.get("headline") || "Something just happened.").slice(0, 150);
  const source = (sp.get("source") || "").slice(0, 28);
  const stat = (sp.get("stat") || "").slice(0, 14);
  const statLabel = (sp.get("statLabel") || "").slice(0, 46);
  const stat2 = (sp.get("stat2") || "").slice(0, 14);
  const stat2Label = (sp.get("stat2Label") || "").slice(0, 30);
  const sub = (sp.get("sub") || "").slice(0, 190);
  const date = (sp.get("date") || "").slice(0, 24);
  const isBlue = sp.get("tone") === "blue";
  const tone = isBlue ? BLUE : ACCENT;
  const glow = isBlue ? "rgba(74,158,255,0.16)" : "rgba(0,255,133,0.15)";
  const watermark = (sp.get("watermark") || source || type).toUpperCase().slice(0, 16);
  const hasCompare = Boolean(stat && stat2);
  const hasStat = Boolean(stat);
  // Headline dominates and scales with length; bigger when there's no number to share space with.
  const hlMax = hasStat ? 96 : 116;
  const hlFont = headline.length > 92 ? hlMax - 36 : headline.length > 58 ? hlMax - 22 : hlMax;
  const statFont = stat.length > 6 ? 116 : 150;

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: 76,
          fontFamily: "sans-serif",
          backgroundColor: "#0a0a0c",
          backgroundImage: `radial-gradient(circle at 86% 8%, ${glow}, rgba(0,0,0,0) 50%), repeating-linear-gradient(0deg, rgba(245,244,241,0.04) 0px, rgba(245,244,241,0.04) 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 62px), repeating-linear-gradient(90deg, rgba(245,244,241,0.04) 0px, rgba(245,244,241,0.04) 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 62px), linear-gradient(150deg, #16161b 0%, #0a0a0c 60%)`,
        }}
      >
        {/* faded source watermark, bottom-right */}
        <div
          style={{
            position: "absolute",
            right: -12,
            bottom: -34,
            display: "flex",
            fontSize: 240,
            fontWeight: 800,
            color: tone,
            opacity: 0.045,
            letterSpacing: -8,
          }}
        >
          {watermark}
        </div>
        {/* hairline inset frame */}
        <div
          style={{
            position: "absolute",
            top: 26,
            left: 26,
            right: 26,
            bottom: 26,
            borderRadius: 26,
            border: "1px solid rgba(245,244,241,0.08)",
          }}
        />

        {/* top row: subtle handle (left) + content-type tag (right) */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
            <div style={{ width: 17, height: 17, borderRadius: 5, background: ACCENT }} />
            <div style={{ display: "flex", fontSize: 27, fontWeight: 600, color: MUTE, letterSpacing: 0.3 }}>
              @joinlockr
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              border: `1px solid ${tone}`,
              borderRadius: 999,
              padding: "8px 18px",
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: 5, background: tone }} />
            <div style={{ display: "flex", fontSize: 20, fontWeight: 700, color: tone, letterSpacing: 1.5 }}>
              {type}
            </div>
          </div>
        </div>

        {/* headline — the hero */}
        <div
          style={{
            display: "flex",
            marginTop: 66,
            fontSize: hlFont,
            fontWeight: 800,
            color: INK,
            letterSpacing: -2.5,
            lineHeight: 1.02,
          }}
        >
          {headline}
        </div>

        {/* supporting number(s) */}
        {hasCompare ? (
          <div style={{ display: "flex", alignItems: "flex-end", marginTop: 56, gap: 28 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 21, color: DIM, letterSpacing: 1, textTransform: "uppercase" }}>
                {stat2Label || "the public"}
              </div>
              <div style={{ display: "flex", fontSize: 110, fontWeight: 800, color: MUTE, letterSpacing: -4, lineHeight: 1 }}>
                {stat2}
              </div>
            </div>
            <div style={{ display: "flex", fontSize: 38, color: DIM, fontWeight: 700, marginBottom: 20 }}>vs</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 21, color: tone, letterSpacing: 1, textTransform: "uppercase" }}>
                {statLabel || "the market"}
              </div>
              <div style={{ display: "flex", fontSize: 110, fontWeight: 800, color: tone, letterSpacing: -4, lineHeight: 1 }}>
                {stat}
              </div>
            </div>
          </div>
        ) : hasStat ? (
          <div style={{ display: "flex", alignItems: "flex-end", marginTop: 52, gap: 22 }}>
            <div style={{ display: "flex", fontSize: statFont, fontWeight: 800, color: tone, letterSpacing: -6, lineHeight: 0.9 }}>
              {stat}
            </div>
            {statLabel ? (
              <div style={{ display: "flex", fontSize: 26, color: MUTE, marginBottom: 18, maxWidth: 370, lineHeight: 1.25 }}>
                {statLabel}
              </div>
            ) : null}
          </div>
        ) : null}

        <div style={{ flex: 1, display: "flex" }} />

        {/* the context / "so what" line */}
        {sub ? (
          <div style={{ display: "flex", fontSize: 33, color: MUTE, lineHeight: 1.34, marginBottom: 32 }}>
            {sub}
          </div>
        ) : null}

        {/* news byline: source attribution (left) + date (right). No CTA on-image. */}
        <div style={{ display: "flex", height: 1, background: "rgba(245,244,241,0.1)", marginBottom: 24 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 25, color: DIM }}>{source ? `via ${source}` : "@joinlockr"}</div>
          {date ? <div style={{ display: "flex", fontSize: 25, color: DIM }}>{date}</div> : null}
        </div>
      </div>
    ),
    { width: 1080, height: 1350 },
  );
}
