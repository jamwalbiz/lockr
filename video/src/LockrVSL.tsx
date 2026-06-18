import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Easing,
} from "remotion";

export const VSL_FPS = 30;
export const VSL_DURATION = 1500; // 50s

const ACCENT = "#00ff85";
const INK = "#f5f4f1";
const MUTE = "#8b8b85";
const DIM = "#5c5c58";
const BG = "linear-gradient(145deg, #16161b 0%, #0a0a0c 62%)";
const FONT = '"Archivo", "Helvetica Neue", Arial, sans-serif';

// ---- helpers -------------------------------------------------------------
const ease = Easing.bezier(0.16, 1, 0.3, 1);

function useRise(delay = 0, dist = 40) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  return {
    opacity: interpolate(t, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(t, [0, 1], [dist, 0])}px)`,
  };
}

function useFadeOut(start: number, dur = 16) {
  const frame = useCurrentFrame();
  return { opacity: interpolate(frame, [start, start + dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) };
}

const Center: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      background: BG,
      justifyContent: "center",
      alignItems: "center",
      fontFamily: FONT,
      padding: 120,
    }}
  >
    {children}
  </AbsoluteFill>
);

const Eyebrow: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, ...style }}>
    <div style={{ width: 14, height: 14, borderRadius: 4, background: ACCENT }} />
    <div style={{ color: ACCENT, fontSize: 30, fontWeight: 700, letterSpacing: 6, textTransform: "uppercase" }}>
      {children}
    </div>
  </div>
);

// ---- scenes --------------------------------------------------------------

const SceneHook: React.FC = () => {
  const a = useRise(4);
  const b = useRise(20);
  const frame = useCurrentFrame();
  const underline = interpolate(frame, [34, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const out = useFadeOut(130);
  return (
    <Center>
      <div style={{ textAlign: "center", ...out }}>
        <div style={{ ...a, color: INK, fontSize: 150, fontWeight: 800, letterSpacing: -4, lineHeight: 1 }}>
          Stop guessing.
        </div>
        <div style={{ ...b, position: "relative", display: "inline-block", marginTop: 12 }}>
          <div style={{ color: ACCENT, fontSize: 150, fontWeight: 800, letterSpacing: -4, lineHeight: 1 }}>
            Start winning.
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 8,
              height: 10,
              borderRadius: 4,
              background: ACCENT,
              width: `${underline * 100}%`,
              boxShadow: `0 0 22px ${ACCENT}`,
            }}
          />
        </div>
      </div>
    </Center>
  );
};

const SceneProblem: React.FC = () => {
  const a = useRise(6);
  const frame = useCurrentFrame();
  // odds tick from -110 to -118 around frame 40
  const odds = Math.round(interpolate(frame, [36, 70], [-110, -118], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const moved = frame > 70;
  const b = useRise(90);
  const out = useFadeOut(190);
  return (
    <Center>
      <div style={{ textAlign: "center", ...out }}>
        <div style={{ ...a, display: "flex", alignItems: "center", justifyContent: "center", gap: 28 }}>
          <div style={{ color: MUTE, fontSize: 44, fontWeight: 600 }}>The line</div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 96,
              fontWeight: 700,
              color: moved ? "#ff4d4d" : INK,
              transition: "color 0.2s",
              minWidth: 260,
            }}
          >
            {odds}
          </div>
        </div>
        <div style={{ ...b, color: INK, fontSize: 84, fontWeight: 800, letterSpacing: -2, marginTop: 50, lineHeight: 1.05 }}>
          already moved.
        </div>
        <div style={{ ...b, color: MUTE, fontSize: 40, marginTop: 26 }}>
          You bet late, on the worse number. Every time.
        </div>
      </div>
    </Center>
  );
};

const Card: React.FC<{ tag: string; market: string; pick: string; tone: string; delay: number; x: number; rot: number }> = ({
  tag, market, pick, tone, delay, x, rot,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 110, mass: 0.9 } });
  // lock beat: green ring + LOCKED tag fade in shortly after the card lands
  const lock = interpolate(frame - delay, [22, 36], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        width: 470,
        left: "50%",
        top: "50%",
        opacity: interpolate(t, [0, 0.6], [0, 1], { extrapolateRight: "clamp" }),
        transform: `translate(-50%, -50%) translate(${x}px, ${interpolate(t, [0, 1], [120, -30])}px) rotate(${interpolate(t, [0, 1], [rot * 3, rot])}deg) scale(${interpolate(t, [0, 1], [0.86, 1])})`,
        background: "linear-gradient(158deg, rgba(32,32,38,0.98), rgba(17,17,21,0.98))",
        border: `1px solid rgba(0,255,133,${lock * 0.55 + 0.08})`,
        borderRadius: 24,
        padding: "30px 34px",
        boxShadow: `0 40px 80px -30px rgba(0,0,0,0.9), 0 0 ${lock * 26}px rgba(0,255,133,${lock * 0.22})`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <div style={{ width: 11, height: 11, borderRadius: 6, background: tone }} />
          <div style={{ color: INK, fontSize: 24, fontWeight: 700, letterSpacing: 2 }}>{tag}</div>
        </div>
        <div style={{ color: ACCENT, fontSize: 22, fontWeight: 700, opacity: lock, letterSpacing: 1 }}>LOCKED</div>
      </div>
      <div style={{ color: MUTE, fontSize: 25, marginTop: 22 }}>{market}</div>
      <div style={{ color: tone, fontSize: 52, fontWeight: 800, letterSpacing: -1, marginTop: 4 }}>{pick}</div>
    </div>
  );
};

const SceneMechanism: React.FC = () => {
  const head = useRise(150, 30);
  const out = useFadeOut(310);
  return (
    <AbsoluteFill style={{ background: BG, fontFamily: FONT }}>
      <AbsoluteFill style={out}>
        <Card tag="NBA" market="Game total" pick="Over 224.5" tone={ACCENT} delay={6} x={-510} rot={-3} />
        <Card tag="KALSHI" market="Prediction market" pick="Yes · 61¢" tone="#4a9eff" delay={24} x={0} rot={0} />
        <Card tag="UFC" market="Method of victory" pick="KO / TKO" tone={ACCENT} delay={42} x={510} rot={3} />
        <div style={{ position: "absolute", bottom: 120, width: "100%", textAlign: "center", ...head }}>
          <div style={{ color: INK, fontSize: 60, fontWeight: 800, letterSpacing: -1 }}>
            The day&apos;s best plays. Before the line moves.
          </div>
          <div style={{ color: ACCENT, fontSize: 38, fontWeight: 700, marginTop: 16 }}>You just copy the play.</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SceneWedge: React.FC = () => {
  const a = useRise(6);
  const frame = useCurrentFrame();
  const pulse = 1 + 0.12 * Math.sin((frame / 12));
  const b = useRise(60);
  const out = useFadeOut(180);
  return (
    <Center>
      <div style={{ textAlign: "center", ...out }}>
        <div style={{ ...a, display: "flex", alignItems: "center", justifyContent: "center", gap: 50 }}>
          <div style={{ color: INK, fontSize: 60, fontWeight: 800 }}>Sportsbooks</div>
          <div style={{ color: ACCENT, fontSize: 80, fontWeight: 800, transform: `scale(${pulse})` }}>=</div>
          <div style={{ color: INK, fontSize: 60, fontWeight: 800 }}>Prediction markets</div>
        </div>
        <div style={{ ...b, color: MUTE, fontSize: 42, marginTop: 50, lineHeight: 1.3 }}>
          Kalshi and Polymarket, worked like the books.
          <br />
          That is where the numbers are still soft.
        </div>
      </div>
    </Center>
  );
};

const LedgerRow: React.FC<{ d: string; t: string; r: string; won: boolean; delay: number }> = ({ d, t, r, won, delay }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame - delay, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const x = interpolate(frame - delay, [0, 10], [-30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 4px", borderBottom: "1px solid rgba(245,244,241,0.08)", opacity: o, transform: `translateX(${x}px)` }}>
      <div style={{ display: "flex", gap: 22, alignItems: "baseline" }}>
        <div style={{ fontFamily: "monospace", color: DIM, fontSize: 26 }}>{d}</div>
        <div style={{ color: INK, fontSize: 32, fontWeight: 600 }}>{t}</div>
      </div>
      <div style={{ fontFamily: "monospace", fontSize: 30, fontWeight: 700, color: won ? ACCENT : "#ff4d4d" }}>{r}</div>
    </div>
  );
};

const SceneProof: React.FC = () => {
  const head = useRise(4);
  const out = useFadeOut(220);
  return (
    <Center>
      <div style={{ width: 1100, ...out }}>
        <Eyebrow style={head}>The receipts</Eyebrow>
        <div style={{ marginTop: 36 }}>
          <LedgerRow d="JUN 17" t="NBA · Over 224.5" r="+1.8u" won delay={30} />
          <LedgerRow d="JUN 16" t="MLB · Run line" r="-2.0u" won={false} delay={48} />
          <LedgerRow d="JUN 15" t="UFC · KO / TKO" r="+1.6u" won delay={66} />
          <LedgerRow d="JUN 14" t="Kalshi · Rate hold" r="+0.9u" won delay={84} />
        </div>
        <div style={{ color: INK, fontSize: 56, fontWeight: 800, marginTop: 46, letterSpacing: -1, ...useRise(110, 24) }}>
          Logged in the open. Win or lose. Nothing deleted.
        </div>
      </div>
    </Center>
  );
};

const SceneCTA: React.FC = () => {
  const a = useRise(6);
  const b = useRise(34);
  const frame = useCurrentFrame();
  const glow = 0.5 + 0.5 * Math.sin(frame / 14);
  return (
    <Center>
      <div style={{ textAlign: "center" }}>
        <div style={{ ...a, color: INK, fontSize: 110, fontWeight: 800, letterSpacing: -3, lineHeight: 1 }}>
          Stop guessing.
        </div>
        <div style={{ ...a, color: ACCENT, fontSize: 110, fontWeight: 800, letterSpacing: -3, lineHeight: 1 }}>
          Start winning.
        </div>
        <div
          style={{
            ...b,
            display: "inline-block",
            marginTop: 56,
            background: ACCENT,
            color: "#000",
            fontSize: 44,
            fontWeight: 800,
            padding: "26px 56px",
            borderRadius: 16,
            boxShadow: `0 0 ${30 + glow * 40}px rgba(0,255,133,${0.3 + glow * 0.3})`,
          }}
        >
          joinlockr.com
        </div>
        <div style={{ ...b, color: MUTE, fontSize: 34, marginTop: 30 }}>From $29/wk · cancel any time</div>
        <div style={{ ...useRise(70), color: DIM, fontSize: 22, marginTop: 60, maxWidth: 1000, lineHeight: 1.4 }}>
          Education and entertainment. Picks are opinions, not advice. 21+ where applicable. 1-800-GAMBLER.
        </div>
      </div>
    </Center>
  );
};

// ---- timeline ------------------------------------------------------------
export const LockrVSL = () => (
  <AbsoluteFill style={{ background: "#0a0a0c" }}>
    <Sequence durationInFrames={150}><SceneHook /></Sequence>
    <Sequence from={150} durationInFrames={210}><SceneProblem /></Sequence>
    <Sequence from={360} durationInFrames={330}><SceneMechanism /></Sequence>
    <Sequence from={690} durationInFrames={210}><SceneWedge /></Sequence>
    <Sequence from={900} durationInFrames={240}><SceneProof /></Sequence>
    <Sequence from={1140} durationInFrames={360}><SceneCTA /></Sequence>
  </AbsoluteFill>
);
