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
  // Legs: parallel ?legs= (pick) and ?legtags= (optional league per leg).
  // Falls back to ?pick= for older slip URLs.
  const legPicks = sp.getAll("legs").map((s) => s.slice(0, 46));
  const legTags = sp.getAll("legtags");
  const pickParam = (sp.get("pick") || "").slice(0, 32);
  const legSource = legPicks.length ? legPicks : pickParam ? [pickParam] : ["Over 224.5"];
  const legs = legSource
    .map((pick, i) => ({ pick, tag: (legTags[i] || "").toUpperCase().slice(0, 14) }))
    .filter((l) => l.pick);
  const isParlay = legs.length >= 2;
  // Parlay label derives from the leg tags (not a single league field): all legs
  // the same league -> that league; different leagues -> MIXED; untagged -> PARLAY.
  const legTagVals = legs.map((l) => l.tag).filter(Boolean);
  const uniqTags = Array.from(new Set(legTagVals));
  const parlayLabel =
    uniqTags.length >= 2
      ? "MIXED"
      : legTagVals.length === legs.length && uniqTags.length === 1
        ? uniqTags[0]
        : "";
  const parlayTag = parlayLabel ? `${parlayLabel} PARLAY` : "PARLAY";
  const watermark = isParlay ? parlayLabel || "PARLAY" : league;
  const legFont = legs.length <= 2 ? 50 : legs.length === 3 ? 42 : legs.length === 4 ? 36 : 30;
  const odds = (sp.get("odds") || "-110").slice(0, 12);
  const units = (sp.get("units") || "2").slice(0, 5);
  const time = (sp.get("time") || "").slice(0, 16);
  const conf = Math.max(1, Math.min(3, Number(sp.get("conf")) || 2));
  const isBlue = sp.get("tone") === "blue";
  const tone = isBlue ? BLUE : ACCENT;
  const glow = isBlue ? "rgba(74,158,255,0.16)" : "rgba(0,255,133,0.15)";
  const pips = [14, 22, 30];

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: 60,
          fontFamily: "sans-serif",
          backgroundColor: "#0a0a0c",
          // base gradient + 56px grid + tone-matched radial glow (top-right)
          backgroundImage: `radial-gradient(circle at 84% 6%, ${glow}, rgba(0,0,0,0) 52%), repeating-linear-gradient(0deg, rgba(245,244,241,0.045) 0px, rgba(245,244,241,0.045) 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 56px), repeating-linear-gradient(90deg, rgba(245,244,241,0.045) 0px, rgba(245,244,241,0.045) 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 56px), linear-gradient(140deg, #17171c 0%, #0a0a0c 62%)`,
        }}
      >
        {/* giant faded league watermark, anchored bottom-right to balance the void */}
        <div
          style={{
            position: "absolute",
            right: -10,
            bottom: -40,
            display: "flex",
            fontSize: 230,
            fontWeight: 800,
            color: tone,
            opacity: 0.06,
            letterSpacing: -8,
          }}
        >
          {watermark}
        </div>
        {/* hairline inset frame */}
        <div
          style={{
            position: "absolute",
            top: 22,
            left: 22,
            right: 22,
            bottom: 22,
            borderRadius: 22,
            border: "1px solid rgba(245,244,241,0.09)",
          }}
        />

        {/* header: brand mark + time + LOGGED proof chip */}
        <div
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 18, height: 18, borderRadius: 5, background: ACCENT }} />
            <div style={{ fontSize: 30, fontWeight: 800, color: INK, letterSpacing: 2 }}>
              LOCKR
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {time ? <div style={{ fontSize: 24, color: MUTE }}>{time}</div> : null}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                border: `1px solid ${tone}`,
                borderRadius: 999,
                padding: "7px 16px",
              }}
            >
              <div style={{ width: 9, height: 9, borderRadius: 5, background: tone }} />
              <div style={{ fontSize: 18, fontWeight: 700, color: tone, letterSpacing: 2 }}>
                LOGGED
              </div>
            </div>
          </div>
        </div>

        {/* body: parlay = stacked legs; straight = single hero pick */}
        {isParlay ? (
          <div style={{ display: "flex", flexDirection: "column", marginTop: 54 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 13, height: 13, borderRadius: 7, background: tone }} />
              <div style={{ fontSize: 26, fontWeight: 700, color: INK, letterSpacing: 3 }}>
                {parlayTag}
              </div>
              <div style={{ fontSize: 22, color: MUTE, marginLeft: 4 }}>
                {`· ${legs.length} legs`}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", marginTop: 26, gap: 18 }}>
              {legs.map((leg, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div
                    style={{
                      display: "flex",
                      width: 38,
                      height: 38,
                      borderRadius: 9,
                      border: `1px solid ${tone}`,
                      color: tone,
                      fontSize: 20,
                      fontWeight: 800,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {String(i + 1)}
                  </div>
                  {leg.tag ? (
                    <div
                      style={{
                        display: "flex",
                        fontSize: 21,
                        fontWeight: 700,
                        color: tone,
                        letterSpacing: 1,
                      }}
                    >
                      {leg.tag}
                    </div>
                  ) : null}
                  <div
                    style={{
                      display: "flex",
                      fontSize: legFont,
                      fontWeight: 800,
                      color: INK,
                      letterSpacing: -1,
                      lineHeight: 1,
                    }}
                  >
                    {leg.pick}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", marginTop: 62 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 13, height: 13, borderRadius: 7, background: tone }} />
              <div style={{ fontSize: 26, fontWeight: 700, color: INK, letterSpacing: 3 }}>
                {league}
              </div>
            </div>
            <div style={{ display: "flex", fontSize: 30, color: MUTE, marginTop: 18 }}>
              {market}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 96,
                fontWeight: 800,
                color: tone,
                marginTop: 8,
                letterSpacing: -3,
                lineHeight: 1,
              }}
            >
              {legs[0].pick}
            </div>
          </div>
        )}

        <div style={{ flex: 1, display: "flex" }} />

        {/* footer: hairline rule, then confidence/units left, odds + TAIL chip right */}
        <div
          style={{ display: "flex", height: 1, background: "rgba(245,244,241,0.1)", marginBottom: 26 }}
        />
        <div
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
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
                  opacity: i + 1 <= conf ? 0.95 : 0.2,
                }}
              />
            ))}
            <div style={{ display: "flex", fontSize: 25, color: MUTE, marginLeft: 16 }}>
              {`${units}u`}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ display: "flex", fontSize: 30, color: INK, fontWeight: 700 }}>
              {odds}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: `1px solid ${tone}`,
                borderRadius: 11,
                padding: "9px 18px",
                color: tone,
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: 2,
              }}
            >
              {`TAIL →`}
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1000, height: 600 },
  );
}
