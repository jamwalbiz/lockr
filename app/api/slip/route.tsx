import { ImageResponse } from "next/og";

// Branded slip-card image generator. Renders a play as a PNG from query params,
// matching the hero pick-card look. Used for the live preview in /studio and as
// the embedded image in the Discord post. No secrets; the value is the curation
// and timing, and the URLs are only shared into the members channel.
export const runtime = "edge";

const ACCENT = "#00ff85";
const BLUE = "#4a9eff";
const INK = "#f5f4f1";
const MUTE = "#8b8b85";

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const league = (sp.get("league") || "NBA").toUpperCase().slice(0, 18);
  const market = (sp.get("market") || "Game total").slice(0, 40);
  const pick = (sp.get("pick") || "Over 224.5").slice(0, 32);
  const odds = (sp.get("odds") || "-110").slice(0, 12);
  const units = (sp.get("units") || "2").slice(0, 5);
  const time = (sp.get("time") || "").slice(0, 16);
  const conf = Math.max(1, Math.min(3, Number(sp.get("conf")) || 2));
  const tone = sp.get("tone") === "blue" ? BLUE : ACCENT;
  const pips = [12, 19, 26];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(140deg, #16161b 0%, #0a0a0c 60%)",
          padding: 64,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{ width: 18, height: 18, borderRadius: 5, background: ACCENT }}
            />
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: INK,
                letterSpacing: 2,
              }}
            >
              LOCKR
            </div>
          </div>
          <div style={{ fontSize: 26, color: MUTE }}>{time}</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 76 }}>
          <div style={{ width: 13, height: 13, borderRadius: 7, background: tone }} />
          <div
            style={{ fontSize: 27, fontWeight: 700, color: INK, letterSpacing: 3 }}
          >
            {league}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 31, color: MUTE, marginTop: 20 }}>
          {market}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 100,
            fontWeight: 800,
            color: tone,
            marginTop: 10,
            letterSpacing: -3,
            lineHeight: 1,
          }}
        >
          {pick}
        </div>

        <div style={{ flex: 1, display: "flex" }} />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
            {pips.map((h, i) => (
              <div
                key={i}
                style={{
                  width: 9,
                  height: h,
                  borderRadius: 3,
                  background: tone,
                  opacity: i + 1 <= conf ? 0.95 : 0.22,
                }}
              />
            ))}
            <div style={{ fontSize: 26, color: MUTE, marginLeft: 18 }}>
              {`${units}u`}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <div style={{ fontSize: 32, color: INK, fontWeight: 700 }}>{odds}</div>
            <div
              style={{ fontSize: 24, color: MUTE, fontWeight: 700, letterSpacing: 2 }}
            >
              TAIL
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1000, height: 600 },
  );
}
