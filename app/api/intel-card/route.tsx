import { ImageResponse } from "next/og";

// Branded "Lockr Intel" card generator for the @joinlockr news/data feed. Renders
// a viral, screenshot-able news card as a 1080x1350 (IG portrait) PNG from query
// params. One flexible layout covers the daily formats:
//   - Receipt Card     : a single public-data number with a punchy headline
//   - Heart vs Market   : two numbers compared (public vs market / your country vs odds)
//   - Odds Shift / Fade : before/after or bets%/money% comparison
//   - Glossary slide    : headline + sub, no stat (carousel slides)
// No secrets. The data is public (Kalshi/Polymarket odds, line moves); the card
// just packages it on-brand. Generated + posted by scripts/generate-intel.mjs.
export const runtime = "edge";

const ACCENT = "#00ff85";
const BLUE = "#4a9eff";
const INK = "#f5f4f1";
const MUTE = "#8b8b85";
const DIM = "#5c5c58";

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const kicker = (sp.get("kicker") || "MARKET READ").toUpperCase().slice(0, 30);
  const headline = (sp.get("headline") || "Somebody's wrong.").slice(0, 130);
  const source = (sp.get("source") || "").slice(0, 26);
  const stat = (sp.get("stat") || "").slice(0, 14);
  const statLabel = (sp.get("statLabel") || "").slice(0, 30);
  const stat2 = (sp.get("stat2") || "").slice(0, 14);
  const stat2Label = (sp.get("stat2Label") || "").slice(0, 30);
  const sub = (sp.get("sub") || "").slice(0, 180);
  const isBlue = sp.get("tone") === "blue";
  const tone = isBlue ? BLUE : ACCENT;
  const glow = isBlue ? "rgba(74,158,255,0.18)" : "rgba(0,255,133,0.16)";
  const watermark = (sp.get("watermark") || source || "INTEL").toUpperCase().slice(0, 16);
  const hasCompare = Boolean(stat && stat2);
  const hasStat = Boolean(stat);
  // Headline scales down as it gets longer so it always fits the column.
  const hlFont = headline.length > 86 ? 58 : headline.length > 54 ? 70 : 84;

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
          backgroundImage: `radial-gradient(circle at 86% 8%, ${glow}, rgba(0,0,0,0) 50%), repeating-linear-gradient(0deg, rgba(245,244,241,0.045) 0px, rgba(245,244,241,0.045) 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 60px), repeating-linear-gradient(90deg, rgba(245,244,241,0.045) 0px, rgba(245,244,241,0.045) 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 60px), linear-gradient(150deg, #16161b 0%, #0a0a0c 60%)`,
        }}
      >
        {/* giant faded source watermark, bottom-right */}
        <div
          style={{
            position: "absolute",
            right: -12,
            bottom: -36,
            display: "flex",
            fontSize: 240,
            fontWeight: 800,
            color: tone,
            opacity: 0.05,
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
            border: "1px solid rgba(245,244,241,0.09)",
          }}
        />

        {/* header: brand mark + kicker chip */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: ACCENT }} />
            <div style={{ display: "flex", fontSize: 34, fontWeight: 800, color: INK, letterSpacing: 2 }}>
              LOCKR
            </div>
            <div style={{ display: "flex", fontSize: 34, fontWeight: 800, color: tone, letterSpacing: 2 }}>
              INTEL
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 11,
              border: `1px solid ${tone}`,
              borderRadius: 999,
              padding: "9px 20px",
            }}
          >
            <div style={{ width: 11, height: 11, borderRadius: 6, background: tone }} />
            <div style={{ display: "flex", fontSize: 22, fontWeight: 700, color: tone, letterSpacing: 2 }}>
              {kicker}
            </div>
          </div>
        </div>

        {/* headline (the hook) */}
        <div
          style={{
            display: "flex",
            marginTop: 70,
            fontSize: hlFont,
            fontWeight: 800,
            color: INK,
            letterSpacing: -2,
            lineHeight: 1.04,
          }}
        >
          {headline}
        </div>

        {/* stat block: comparison (two numbers) or single big number */}
        {hasCompare ? (
          <div style={{ display: "flex", alignItems: "flex-end", marginTop: 64, gap: 28 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 22, color: DIM, letterSpacing: 1, textTransform: "uppercase" }}>
                {stat2Label || "the public"}
              </div>
              <div style={{ display: "flex", fontSize: 116, fontWeight: 800, color: MUTE, letterSpacing: -4, lineHeight: 1 }}>
                {stat2}
              </div>
            </div>
            <div style={{ display: "flex", fontSize: 40, color: DIM, fontWeight: 700, marginBottom: 22 }}>vs</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 22, color: tone, letterSpacing: 1, textTransform: "uppercase" }}>
                {statLabel || "the market"}
              </div>
              <div style={{ display: "flex", fontSize: 116, fontWeight: 800, color: tone, letterSpacing: -4, lineHeight: 1 }}>
                {stat}
              </div>
            </div>
          </div>
        ) : hasStat ? (
          <div style={{ display: "flex", flexDirection: "column", marginTop: 64 }}>
            <div style={{ display: "flex", fontSize: 24, color: tone, letterSpacing: 1, textTransform: "uppercase" }}>
              {statLabel || source || "the market"}
            </div>
            <div style={{ display: "flex", fontSize: 150, fontWeight: 800, color: tone, letterSpacing: -6, lineHeight: 1 }}>
              {stat}
            </div>
          </div>
        ) : null}

        <div style={{ flex: 1, display: "flex" }} />

        {/* the "so what" line */}
        {sub ? (
          <div
            style={{
              display: "flex",
              fontSize: 34,
              color: MUTE,
              lineHeight: 1.34,
              marginBottom: 34,
            }}
          >
            {sub}
          </div>
        ) : null}

        {/* footer: hairline, then handle + site */}
        <div style={{ display: "flex", height: 1, background: "rgba(245,244,241,0.1)", marginBottom: 26 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 28, color: MUTE, fontWeight: 600 }}>@joinlockr</div>
          <div style={{ display: "flex", fontSize: 28, color: tone, fontWeight: 700 }}>joinlockr.com</div>
        </div>
      </div>
    ),
    { width: 1080, height: 1350 },
  );
}
