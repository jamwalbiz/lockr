import { ImageResponse } from "next/og";

// Branded "intel" news-card generator for the @joinlockr feed. Renders a viral,
// screenshot-able NEWS card as a 1080x1350 (IG portrait) PNG from query params.
// The news is the hero; Lockr is a subtle corner handle, not a banner (reads like
// a news page, not an ad — the CTA lives in the caption, not on the image).
//
// House style (one locked template = the real brand moat): dark base, ONE accent
// (Lockr green), embedded Archivo display font, a giant hero number, a small
// @joinlockr handle, and a "via {source}" news byline. ?type= sets the small tag
// (BIG WIN, MARKET NEWS, INDUSTRY, SPORTS, ODDS, WORLD CUP, HEART VS MARKET).
// No secrets. Public data only. Generated + posted by scripts/generate-intel.mjs.
export const runtime = "edge";

const ACCENT = "#00ff85";
const INK = "#f5f4f1";
const MUTE = "#8b8b85";
const DIM = "#5c5c58";

// Embedded Archivo (the site display font), cached per isolate. Falls back to the
// system sans if the fetch ever fails, so the card always renders.
let _fonts: { name: string; data: ArrayBuffer; weight: 600 | 800; style: "normal" }[] | null | undefined;
async function loadFonts(reqUrl: string) {
  if (_fonts !== undefined) return _fonts;
  try {
    const [b8, b6] = await Promise.all([
      fetch(new URL("/fonts/archivo-800.ttf", reqUrl)).then((r) => r.arrayBuffer()),
      fetch(new URL("/fonts/archivo-600.ttf", reqUrl)).then((r) => r.arrayBuffer()),
    ]);
    _fonts = [
      { name: "Archivo", data: b8, weight: 800, style: "normal" },
      { name: "Archivo", data: b6, weight: 600, style: "normal" },
    ];
  } catch {
    _fonts = null;
  }
  return _fonts;
}

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const type = (sp.get("type") || sp.get("kicker") || "MARKETS").toUpperCase().slice(0, 22);
  const headline = (sp.get("headline") || "Something just happened.").slice(0, 150);
  const source = (sp.get("source") || "").slice(0, 28);
  const stat = (sp.get("stat") || "").slice(0, 16);
  const statLabel = (sp.get("statLabel") || "").slice(0, 46);
  const stat2 = (sp.get("stat2") || "").slice(0, 16);
  const stat2Label = (sp.get("stat2Label") || "").slice(0, 30);
  const sub = (sp.get("sub") || "").slice(0, 190);
  const date = (sp.get("date") || "").slice(0, 24);
  // ONE accent only (no second color); the watermark is locked to the source word.
  const watermark = (source || type).toUpperCase().slice(0, 16);
  const hasCompare = Boolean(stat && stat2);
  const hasStat = Boolean(stat);
  // Headline scales by length; a bit smaller when it shares the card with a number.
  const hlMax = hasStat ? 92 : 112;
  const hlFont = headline.length > 92 ? hlMax - 34 : headline.length > 58 ? hlMax - 20 : hlMax;
  // The number is the hero: the single largest element on the card.
  const statFont = stat.length <= 3 ? 320 : stat.length <= 4 ? 286 : stat.length <= 5 ? 250 : stat.length <= 6 ? 212 : stat.length <= 8 ? 172 : 140;

  const fonts = await loadFonts(req.url);
  const family = fonts ? "Archivo" : "sans-serif";

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
          fontFamily: family,
          backgroundColor: "#0a0a0c",
          backgroundImage: `radial-gradient(circle at 70% 44%, rgba(0,255,133,0.16), rgba(0,0,0,0) 52%), repeating-linear-gradient(0deg, rgba(245,244,241,0.04) 0px, rgba(245,244,241,0.04) 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 62px), repeating-linear-gradient(90deg, rgba(245,244,241,0.04) 0px, rgba(245,244,241,0.04) 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 62px), linear-gradient(150deg, #16161b 0%, #0a0a0c 60%)`,
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
            color: ACCENT,
            opacity: 0.04,
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
              border: `1px solid ${ACCENT}`,
              borderRadius: 999,
              padding: "8px 18px",
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: 5, background: ACCENT }} />
            <div style={{ display: "flex", fontSize: 20, fontWeight: 600, color: ACCENT, letterSpacing: 1.5 }}>
              {type}
            </div>
          </div>
        </div>

        {/* headline */}
        <div
          style={{
            display: "flex",
            marginTop: 60,
            fontSize: hlFont,
            fontWeight: 800,
            color: INK,
            letterSpacing: -2.5,
            lineHeight: 1.0,
          }}
        >
          {headline}
        </div>

        {/* hero number(s) */}
        {hasCompare ? (
          <div style={{ display: "flex", alignItems: "flex-end", marginTop: 54, gap: 30 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 21, fontWeight: 600, color: DIM, letterSpacing: 1, textTransform: "uppercase" }}>
                {stat2Label || "the public"}
              </div>
              <div style={{ display: "flex", fontSize: 122, fontWeight: 800, color: MUTE, letterSpacing: -4, lineHeight: 0.92 }}>
                {stat2}
              </div>
            </div>
            <div style={{ display: "flex", fontSize: 32, fontWeight: 600, color: DIM, marginBottom: 20 }}>vs</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 21, fontWeight: 600, color: ACCENT, letterSpacing: 1, textTransform: "uppercase" }}>
                {statLabel || "the market"}
              </div>
              <div style={{ display: "flex", fontSize: 122, fontWeight: 800, color: ACCENT, letterSpacing: -4, lineHeight: 0.92 }}>
                {stat}
              </div>
            </div>
          </div>
        ) : hasStat ? (
          <div style={{ display: "flex", flexDirection: "column", marginTop: 40 }}>
            <div style={{ display: "flex", fontSize: statFont, fontWeight: 800, color: ACCENT, letterSpacing: -8, lineHeight: 0.86 }}>
              {stat}
            </div>
            {statLabel ? (
              <div style={{ display: "flex", fontSize: 28, fontWeight: 600, color: MUTE, marginTop: 18, maxWidth: 780, lineHeight: 1.25 }}>
                {statLabel}
              </div>
            ) : null}
          </div>
        ) : null}

        <div style={{ flex: 1, display: "flex" }} />

        {/* context / "so what" line */}
        {sub ? (
          <div style={{ display: "flex", fontSize: 33, fontWeight: 600, color: MUTE, lineHeight: 1.34, marginBottom: 32 }}>
            {sub}
          </div>
        ) : null}

        {/* news byline: source attribution (left) + date (right). No CTA on-image. */}
        <div style={{ display: "flex", height: 1, background: "rgba(245,244,241,0.1)", marginBottom: 24 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 25, fontWeight: 600, color: DIM }}>
            {source ? `via ${source}` : "@joinlockr"}
          </div>
          {date ? <div style={{ display: "flex", fontSize: 25, fontWeight: 600, color: DIM }}>{date}</div> : null}
        </div>
      </div>
    ),
    { width: 1080, height: 1350, fonts: fonts || undefined },
  );
}
