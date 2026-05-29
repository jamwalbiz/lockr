#!/usr/bin/env node
// Generates a sample play slip PNG, on-brand, for posting in Discord (or
// X / IG) as the visual signature of a Lockr pick. Inspired by the
// PrizePicks / DraftKings share-card aesthetic but reskinned in Lockr's
// recipe — neon-green accent, dark surface, no fabricated trademarks.
//
// Brand recipe (matches app/globals.css + gen-brand-assets.mjs):
//   bg:      #0a0a0b
//   surface: #141416
//   text:    #f5f4f1
//   mute:    #a1a1a6
//   accent:  #00ff85
//
// Run:   node scripts/gen-sample-slip.mjs
// Out:   public/brand/sample-slip-1080x1350.png  (4:5 portrait)
//
// To repurpose: edit the PICK constant below + re-run.

import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..", "public", "brand");

const BG = "#0a0a0b";
const BG_DEEP = "#06060a";
const SURFACE = "#141416";
const SURFACE_2 = "#1a1a1d";
const SURFACE_3 = "#222226";
const TEXT = "#f5f4f1";
const MUTE = "#a1a1a6";
const DIM = "#6b6b70";
const ACCENT = "#00ff85";
const ACCENT_DIM = "#00b560";
const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, system-ui, sans-serif";
const MONO = "ui-monospace, 'SF Mono', 'Menlo', 'Consolas', monospace";

const PICK = {
  league: "NHL",
  awayAbbrev: "CAR",
  awayFull: "Carolina Hurricanes",
  homeAbbrev: "MTL",
  homeFull: "Montreal Canadiens",
  market: "TOTAL GOALS",
  direction: "over",
  line: "5.5",
  units: 2,
  label: "TONIGHT'S PLAY",
};

const W = 1080;
const H = 1350;

function inlineMark({ centerX, centerY, fontSize, leftAlign = false }) {
  const dotSize = Math.round(fontSize * 0.55);
  const dotRadius = Math.max(1, Math.round(dotSize * 0.14));
  const gap = Math.round(fontSize * 0.44);
  const letterSpacing = +(fontSize * -0.025).toFixed(2);
  const capHeight = fontSize * 0.72;
  const lockrWidth = Math.round(5 * fontSize * 0.69 + 4 * letterSpacing);
  const totalWidth = dotSize + gap + lockrWidth;

  const startX = leftAlign ? centerX : Math.round(centerX - totalWidth / 2);
  const dotY = Math.round(centerY - dotSize / 2);
  const textX = startX + dotSize + gap;
  const textBaselineY = Math.round(centerY + capHeight / 2);

  return `
  <rect x="${startX}" y="${dotY}" width="${dotSize}" height="${dotSize}" rx="${dotRadius}" fill="${ACCENT}"/>
  <text x="${textX}" y="${textBaselineY}"
        font-family="${FONT}"
        font-size="${fontSize}"
        font-weight="800"
        letter-spacing="${letterSpacing}"
        fill="${TEXT}">LOCKR</text>`;
}

// Deterministic sparkle field for the top header.
function sparkles({ x, y, w, h, count, seed }) {
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const dots = [];
  for (let i = 0; i < count; i++) {
    const px = x + rand() * w;
    const py = y + Math.pow(rand(), 1.6) * h;
    const r = 0.6 + rand() * 2.2;
    const opacity = 0.18 + rand() * 0.55;
    dots.push(
      `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${r.toFixed(2)}" fill="${ACCENT}" opacity="${opacity.toFixed(2)}"/>`,
    );
  }
  return dots.join("\n");
}

// Fine grain noise overlay — kills the "flat dark" feel that made the
// earlier versions read as elementary. Tiny semi-transparent dots
// scattered uniformly across the whole canvas at very low opacity.
function grain({ x, y, w, h, density, seed }) {
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const count = Math.round((w * h) / density);
  const dots = [];
  for (let i = 0; i < count; i++) {
    const px = x + rand() * w;
    const py = y + rand() * h;
    const opacity = 0.02 + rand() * 0.04;
    const fill = rand() > 0.85 ? ACCENT : TEXT;
    dots.push(
      `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="0.6" fill="${fill}" opacity="${opacity.toFixed(3)}"/>`,
    );
  }
  return dots.join("\n");
}

const arrow = PICK.direction === "over" ? "▲" : "▼";
const directionWord = PICK.direction.toUpperCase();
const fullMatchup = `${PICK.awayFull}  vs  ${PICK.homeFull}`;

// Hockey puck glyph as an SVG path — sits next to the NHL badge to add
// visual interest beyond pure typography. Drawn as a side-profile ellipse
// (the "puck on its edge" silhouette) with subtle highlight.
function hockeyPuck({ cx, cy, size }) {
  const w = size;
  const h = size * 0.42;
  return `
  <g transform="translate(${cx}, ${cy})">
    <ellipse cx="0" cy="0" rx="${w / 2}" ry="${h / 2}" fill="${TEXT}"/>
    <ellipse cx="0" cy="${-h * 0.18}" rx="${w / 2 - 2}" ry="${h * 0.06}" fill="${SURFACE_3}"/>
    <ellipse cx="0" cy="${-h * 0.32}" rx="${w / 2 - 2}" ry="${h * 0.06}" fill="${SURFACE_2}"/>
  </g>`;
}

// ─── Layout map (v6 — polished pass) ───────────────────────────
//
//   y 0    – 220   header strip (Lockr mark + sparkle + label)
//   y 280  – 1180  PLAY CARD container (rounded, layered, inset bg)
//     inside:
//       y 320 – 410   badge row (NHL + puck LEFT, units RIGHT)
//       y 490 – 540   matchup
//       y 600 – 920   hero (▲ + line, glow halo behind line)
//       y 970 – 1040  direction word
//       y 1080 – 1140 market subtitle
//   y 1220 – 1310  bottom strip (URL + tagline)

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <!-- Page-level deep gradient — slight shift cool→deep so the canvas
         doesn't read as one flat color. -->
    <linearGradient id="pageBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${BG}"/>
      <stop offset="60%" stop-color="${BG}"/>
      <stop offset="100%" stop-color="${BG_DEEP}"/>
    </linearGradient>

    <!-- Top-right radial glow (carryover from earlier versions). -->
    <radialGradient id="headerGlow" cx="78%" cy="20%" r="85%">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.32"/>
      <stop offset="45%" stop-color="${ACCENT}" stop-opacity="0.06"/>
      <stop offset="80%" stop-color="${BG}" stop-opacity="0"/>
    </radialGradient>

    <!-- Play-card fill: subtle vertical gradient on the surface color so
         the card has internal depth, not just a flat rectangle. -->
    <linearGradient id="cardBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${SURFACE_2}"/>
      <stop offset="100%" stop-color="${SURFACE}"/>
    </linearGradient>

    <!-- Card border gradient — full accent at top fading to subtle at
         bottom. Gives the card a sense of light direction. -->
    <linearGradient id="cardStroke" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.65"/>
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0.18"/>
    </linearGradient>

    <!-- Halo behind the line number — a soft radial green glow that
         makes the 5.5 feel substantial and energized, not flat. -->
    <radialGradient id="lineGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.30"/>
      <stop offset="50%" stop-color="${ACCENT}" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>

    <!-- Drop-shadow filter for the line number — soft green-tinted
         shadow that anchors the hero glyph. -->
    <filter id="lineShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="6"/>
      <feOffset dx="0" dy="4" result="offsetblur"/>
      <feFlood flood-color="${ACCENT}" flood-opacity="0.25"/>
      <feComposite in2="offsetblur" operator="in"/>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Page background -->
  <rect width="${W}" height="${H}" fill="url(#pageBg)"/>

  <!-- Fine grain noise (kills flat-dark feel) -->
  ${grain({ x: 0, y: 0, w: W, h: H, density: 700, seed: 5151 })}

  <!-- ═══════════════════ TOP HEADER STRIP ═══════════════════ -->
  <rect x="0" y="0" width="${W}" height="220" fill="url(#headerGlow)"/>
  ${sparkles({ x: 0, y: 0, w: W, h: 220, count: 180, seed: 4242 })}

  ${inlineMark({ centerX: 80, centerY: 110, fontSize: 60, leftAlign: true })}

  <text x="${W - 80}" y="118"
        font-family="${MONO}"
        font-size="22"
        font-weight="600"
        letter-spacing="4"
        text-anchor="end"
        fill="${MUTE}">${PICK.label}</text>

  <!-- Hairline below header -->
  <rect x="80" y="218" width="${W - 160}" height="1" fill="${SURFACE_2}"/>

  <!-- ═══════════════════ PLAY CARD ═══════════════════════════
       The contained surface that holds the play info. Without it the
       earlier versions read as floating text on a black background;
       this gives the slip real structural language. -->
  <rect x="60" y="280" width="${W - 120}" height="900" rx="28"
        fill="url(#cardBg)"/>
  <!-- Stroke drawn separately so we can use a gradient stroke at full
       opacity without bleeding into the fill. -->
  <rect x="60.5" y="280.5" width="${W - 121}" height="899" rx="27.5"
        fill="none"
        stroke="url(#cardStroke)"
        stroke-width="2"/>

  <!-- Subtle inset highlight along the top edge of the card (1px white
       at low opacity) sells the layered depth. -->
  <rect x="80" y="282" width="${W - 160}" height="1" fill="${TEXT}" opacity="0.06"/>

  <!-- ─── BADGE ROW inside card ─────────────────────────── -->

  <!-- NHL badge with hockey puck glyph -->
  <rect x="100" y="324" width="240" height="84" rx="14"
        fill="${BG}"
        stroke="${ACCENT}"
        stroke-width="2"/>
  ${hockeyPuck({ cx: 142, cy: 366, size: 40 })}
  <text x="190" y="380"
        font-family="${MONO}"
        font-size="40"
        font-weight="800"
        letter-spacing="6"
        fill="${ACCENT}">${PICK.league}</text>

  <!-- Units badge — right side -->
  <rect x="${W - 100 - 240}" y="324" width="240" height="84" rx="14"
        fill="${BG}"
        stroke="${ACCENT}"
        stroke-width="2"/>
  <text x="${W - 100 - 120}" y="380"
        font-family="${MONO}"
        font-size="36"
        font-weight="800"
        letter-spacing="5"
        text-anchor="middle"
        fill="${ACCENT}">${PICK.units}U PLAY</text>

  <!-- ─── MATCHUP ──────────────────────────────────────────
       32pt + tight letter-spacing keeps the line well inside the
       card's 960px inner width — earlier 38pt + ls=2 was hitting
       the card edges with no margin. -->
  <text x="${W / 2}" y="520"
        font-family="${FONT}"
        font-size="32"
        font-weight="700"
        letter-spacing="1"
        text-anchor="middle"
        fill="${TEXT}">${fullMatchup.toUpperCase()}</text>

  <!-- Subtle separator (single dot of accent rather than a full rule —
       less elementary than a flat line) -->
  <circle cx="${W / 2}" cy="568" r="4" fill="${ACCENT}"/>

  <!-- ─── HERO: arrow + line, side-by-side, with halo + shadow ─── -->

  <!-- Radial halo behind the line number — sits behind everything
       else in the hero block. -->
  <ellipse cx="${W / 2 + 40}" cy="770" rx="380" ry="200" fill="url(#lineGlow)"/>

  <!-- Arrow + line as one centered <text>; tspan handles centering. -->
  <text x="${W / 2}" y="800" font-family="${FONT}" text-anchor="middle" filter="url(#lineShadow)">
    <tspan font-size="130" font-weight="900" fill="${ACCENT}" dy="-40">${arrow}</tspan><tspan font-size="280" font-weight="900" letter-spacing="-10" fill="${TEXT}" dx="40" dy="40">${PICK.line}</tspan>
  </text>

  <!-- ─── DIRECTION WORD ───────────────────────────────── -->
  <text x="${W / 2}" y="970"
        font-family="${MONO}"
        font-size="58"
        font-weight="800"
        letter-spacing="14"
        text-anchor="middle"
        fill="${ACCENT}">${directionWord}</text>

  <!-- ─── MARKET SUBTITLE ──────────────────────────────── -->
  <text x="${W / 2}" y="1090"
        font-family="${FONT}"
        font-size="38"
        font-weight="700"
        letter-spacing="6"
        text-anchor="middle"
        fill="${TEXT}">${PICK.market}</text>

  <!-- Tiny tag inside card bottom — fills empty space honestly,
       no fabricated data. Just "RESULT PENDING" status. -->
  <text x="${W / 2}" y="1148"
        font-family="${MONO}"
        font-size="16"
        font-weight="500"
        letter-spacing="4"
        text-anchor="middle"
        fill="${DIM}">● RESULT PENDING</text>

  <!-- ═══════════════════ BOTTOM STRIP ═══════════════════════ -->
  <text x="80" y="${H - 38}"
        font-family="${MONO}"
        font-size="26"
        font-weight="600"
        letter-spacing="3"
        fill="${MUTE}">joinlockr.com</text>

  <text x="${W - 80}" y="${H - 38}"
        font-family="${MONO}"
        font-size="20"
        font-weight="500"
        letter-spacing="4"
        text-anchor="end"
        fill="${DIM}">WHERE THE EDGE LIVES</text>
</svg>`;

await mkdir(outDir, { recursive: true });
const outPath = join(outDir, "sample-slip-1080x1350.png");
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(outPath);
console.log(`Wrote ${outPath}`);
