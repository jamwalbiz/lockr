import { ImageResponse } from "next/og";
import sharp from "sharp";

// Branded "ticker" news-card generator for the @joinlockr feed. Renders a clean,
// screenshot-able NEWS card as a 1080x1350 (IG portrait, exactly 4:5) image, served
// as JPEG. (Instagram's publish API accepts JPEG ONLY; next/og emits PNG, so we
// transcode with sharp — which needs the Node runtime, not edge. ?fmt=png returns PNG.)
//
// FORMAT (the "data is the image" model — no stock photos, no abstract AI art):
// a sentence-case curiosity-gap HEADLINE is the hero, a clean labeled DATA GRID is
// the visual proof, a small source lockup + @joinlockr byline frame it. Everything
// is generated from data the engine already pulls, so it's fully auto + rights-clean.
// Params: type, headline, source, sub, date, and up to 4 facts: stat/statLabel,
// stat2/stat2Label, stat3/stat3Label, stat4/stat4Label.
export const runtime = "nodejs";

// Two colors only — off-white + Lockr green. No gray text.
const ACCENT = "#00ff85";
const INK = "#f7f6f3";
const LABEL = "#cdcdc7"; // light off-white for small labels (high contrast on dark, not low-contrast gray)
const TILE = "#16161b";
const BORDER = "rgba(247,246,243,0.09)";

let _fonts: { name: string; data: ArrayBuffer; weight: 600 | 800; style: "normal" }[] | null | undefined;
async function loadFonts(reqUrl: string) {
  if (_fonts !== undefined) return _fonts;
  try {
    const fetchFont = (p: string) =>
      fetch(new URL(p, reqUrl), { signal: AbortSignal.timeout(4000) }).then((r) => r.arrayBuffer());
    const [b8, b6] = await Promise.all([fetchFont("/fonts/archivo-800.ttf"), fetchFont("/fonts/archivo-600.ttf")]);
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
  const headline = (sp.get("headline") || "Something just happened.").slice(0, 160);
  const source = (sp.get("source") || "").slice(0, 28);
  const sub = (sp.get("sub") || "").slice(0, 190);
  const date = (sp.get("date") || "").slice(0, 24);

  // Up to 4 labeled facts → the data grid (the "image"). Drop empties.
  const facts = [
    [sp.get("stat"), sp.get("statLabel")],
    [sp.get("stat2"), sp.get("stat2Label")],
    [sp.get("stat3"), sp.get("stat3Label")],
    [sp.get("stat4"), sp.get("stat4Label")],
  ]
    .map(([v, l]) => ({ val: (v || "").trim().slice(0, 18), label: (l || "").trim().slice(0, 28) }))
    .filter((f) => f.val);
  const rows: { val: string; label: string }[][] = [];
  for (let i = 0; i < facts.length; i += 2) rows.push(facts.slice(i, i + 2));

  // Headline is the hero; scale by length so it never overflows.
  const hl = headline.length > 92 ? 56 : headline.length > 64 ? 66 : headline.length > 40 ? 78 : 90;
  // Per-tile value scales by its own length.
  const valFont = (s: string) => (s.length <= 4 ? 62 : s.length <= 6 ? 54 : s.length <= 8 ? 46 : s.length <= 11 ? 38 : 32);
  const chip = source.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase() || "LK";

  const fonts = await loadFonts(req.url);
  const family = fonts ? "Archivo" : "sans-serif";

  const image = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: 72,
          fontFamily: family,
          color: INK,
          backgroundColor: "#0a0a0c",
          backgroundImage:
            "radial-gradient(circle at 82% 8%, rgba(0,255,133,0.13), rgba(0,0,0,0) 46%), linear-gradient(160deg, #111116 0%, #0a0a0c 58%)",
        }}
      >
        {/* top row: category pill (left) + handle (right) */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, border: `1px solid ${ACCENT}`, borderRadius: 999, padding: "9px 20px" }}>
            <div style={{ width: 11, height: 11, borderRadius: 6, background: ACCENT }} />
            <div style={{ display: "flex", fontSize: 21, fontWeight: 600, color: ACCENT, letterSpacing: 1.5 }}>{type}</div>
          </div>
          <div style={{ display: "flex", fontSize: 24, fontWeight: 600, color: LABEL }}>@joinlockr</div>
        </div>

        {/* source lockup (the recognizable anchor) */}
        {source ? (
          <div style={{ display: "flex", alignItems: "center", gap: 15, marginTop: 56 }}>
            <div style={{ width: 60, height: 60, borderRadius: 15, background: "#1f1f26", border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color: ACCENT }}>{chip}</div>
            <div style={{ display: "flex", fontSize: 27, fontWeight: 600, color: LABEL }}>{source}</div>
          </div>
        ) : null}

        {/* headline — the hero */}
        <div style={{ display: "flex", fontSize: hl, fontWeight: 800, color: INK, letterSpacing: -2, lineHeight: 1.04, marginTop: source ? 24 : 56, maxWidth: 940 }}>
          {headline}
        </div>

        {/* sub / standfirst */}
        {sub ? (
          <div style={{ display: "flex", fontSize: 29, fontWeight: 600, color: LABEL, lineHeight: 1.32, marginTop: 22, maxWidth: 900 }}>
            {sub}
          </div>
        ) : null}

        <div style={{ flex: 1, display: "flex" }} />

        {/* the data grid — the "image" */}
        {facts.length ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {rows.map((row, ri) => (
              <div key={ri} style={{ display: "flex", gap: 16 }}>
                {row.map((f, ci) => (
                  <div key={ci} style={{ display: "flex", flexDirection: "column", flex: 1, background: TILE, border: `1px solid ${BORDER}`, borderRadius: 18, padding: "24px 28px" }}>
                    {f.label ? (
                      <div style={{ display: "flex", fontSize: 19, fontWeight: 600, color: LABEL, letterSpacing: 1, textTransform: "uppercase" }}>{f.label}</div>
                    ) : null}
                    <div style={{ display: "flex", fontSize: valFont(f.val), fontWeight: 800, color: ACCENT, letterSpacing: -1, marginTop: f.label ? 8 : 0 }}>{f.val}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : null}

        {/* footer byline */}
        <div style={{ display: "flex", height: 1, background: "rgba(247,246,243,0.1)", marginTop: 34, marginBottom: 22 }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div style={{ width: 14, height: 14, borderRadius: 4, background: ACCENT }} />
            <div style={{ display: "flex", fontSize: 23, fontWeight: 600, color: LABEL }}>@joinlockr</div>
          </div>
          <div style={{ display: "flex", fontSize: 22, fontWeight: 600, color: LABEL }}>
            {source ? `via ${source}` : "lockr"}
            {date ? ` · ${date}` : ""}
          </div>
        </div>
      </div>
    ),
    { width: 1080, height: 1350, fonts: fonts || undefined },
  );

  // next/og emits PNG; Instagram's publish API accepts JPEG only. Transcode with sharp.
  const pngBytes = new Uint8Array(await image.arrayBuffer());
  if (sp.get("fmt") === "png") {
    return new Response(pngBytes, { headers: { "content-type": "image/png", "cache-control": "public, max-age=300, s-maxage=300" } });
  }
  try {
    const jpg = await sharp(pngBytes).jpeg({ quality: 90, chromaSubsampling: "4:4:4" }).toBuffer();
    return new Response(new Uint8Array(jpg), { headers: { "content-type": "image/jpeg", "cache-control": "public, max-age=300, s-maxage=300" } });
  } catch (err) {
    console.error("intel-card: JPEG transcode failed, serving PNG", err);
    return new Response(pngBytes, { headers: { "content-type": "image/png" } });
  }
}
