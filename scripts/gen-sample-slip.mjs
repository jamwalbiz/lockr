#!/usr/bin/env node
// Generates a sample play slip PNG, on-brand, for posting in Discord (or
// X / IG) as the visual signature of a Lockr pick. Modeled on the
// PrizePicks share-card aesthetic (top brand strip with sparkle backdrop
// → game card → bottom brand strip) but reskinned to Lockr's recipe.
//
// Brand recipe (matches app/globals.css + gen-brand-assets.mjs):
//   bg:      #0a0a0b
//   surface: #141416
//   text:    #f5f4f1
//   mute:    #a1a1a6
//   accent:  #00ff85
//   gold:    #C9A76A
//   danger:  #ff4d4d
//
// Pick rendered:
//   NHL · Hurricanes vs Canadiens · OVER 5.5 total goals · 2 units
//
// Run:   node scripts/gen-sample-slip.mjs
// Out:   public/brand/sample-slip-1080x1350.png  (Instagram-friendly 4:5)
//
// To repurpose for a new pick: just edit the PICK constant below and
// re-run. The whole script is parameter-driven.

import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..", "public", "brand");

const BG = "#0a0a0b";
const SURFACE = "#141416";
const SURFACE_2 = "#1a1a1d";
const TEXT = "#f5f4f1";
const MUTE = "#a1a1a6";
const DIM = "#6b6b70";
const ACCENT = "#00ff85";
const ACCENT_DIM = "#00b560";
const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, system-ui, sans-serif";
const MONO = "ui-monospace, 'SF Mono', 'Menlo', 'Consolas', monospace";

// The pick to render. Swap these to generate a slip for a different play.
const PICK = {
  league: "NHL",
  awayAbbrev: "CAR",
  awayFull: "Carolina Hurricanes",
  homeAbbrev: "MTL",
  homeFull: "Montreal Canadiens",
  market: "TOTAL GOALS",
  direction: "over", // "over" | "under"
  line: "5.5",
  units: 2,
  label: "TONIGHT'S PLAY", // header text top-right
};

const W = 1080;
const H = 1350;

// Inline `[•] LOCKR` mark — matches gen-brand-assets.mjs proportions.
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

// Sparkle field for the top header strip. Deterministic seed so the same
// pick renders identically every run (no flicker between iterations).
function sparkles({ x, y, w, h, count, seed }) {
  // tiny LCG for repeatable randomness
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const dots = [];
  for (let i = 0; i < count; i++) {
    const px = x + rand() * w;
    // bias toward the top of the band (matches PrizePicks "exploding from
    // top edge" particle feel)
    const py = y + Math.pow(rand(), 1.6) * h;
    const r = 0.6 + rand() * 2.2;
    const opacity = 0.18 + rand() * 0.55;
    dots.push(
      `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${r.toFixed(2)}" fill="${ACCENT}" opacity="${opacity.toFixed(2)}"/>`,
    );
  }
  return dots.join("\n");
}

// Build the SVG.
const arrow = PICK.direction === "over" ? "▲" : "▼";
const directionWord = PICK.direction.toUpperCase();
const matchup = `${PICK.awayAbbrev}  @  ${PICK.homeAbbrev}`;
const fullMatchup = `${PICK.awayFull}  vs  ${PICK.homeFull}`;

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <!-- Page background -->
  <rect width="${W}" height="${H}" fill="${BG}"/>

  <!-- TOP HEADER STRIP — 0 → 280, sparkle field on radial green glow -->
  <defs>
    <radialGradient id="headerGlow" cx="78%" cy="20%" r="85%">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.32"/>
      <stop offset="45%" stop-color="${ACCENT}" stop-opacity="0.06"/>
      <stop offset="80%" stop-color="${BG}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="headerFade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0.06"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="${W}" height="280" fill="url(#headerGlow)"/>
  ${sparkles({ x: 0, y: 0, w: W, h: 280, count: 220, seed: 4242 })}

  <!-- Lockr mark top-left -->
  ${inlineMark({ centerX: 80, centerY: 130, fontSize: 64, leftAlign: true })}

  <!-- Header label top-right -->
  <text x="${W - 80}" y="138"
        font-family="${MONO}"
        font-size="22"
        font-weight="600"
        letter-spacing="3"
        text-anchor="end"
        fill="${MUTE}">${PICK.label}</text>

  <!-- Subtle hairline divider under header strip -->
  <rect x="80" y="278" width="${W - 160}" height="1" fill="${SURFACE_2}"/>

  <!-- ─────────────────── MAIN CARD ─────────────────── -->

  <!-- League badge -->
  <rect x="80" y="360" width="120" height="40" rx="6" fill="${SURFACE}" stroke="${SURFACE_2}" stroke-width="1"/>
  <text x="140" y="387"
        font-family="${MONO}"
        font-size="18"
        font-weight="700"
        letter-spacing="3"
        text-anchor="middle"
        fill="${TEXT}">${PICK.league}</text>

  <!-- Matchup line (short abbreviations) -->
  <text x="${W / 2}" y="500"
        font-family="${MONO}"
        font-size="56"
        font-weight="700"
        letter-spacing="-1"
        text-anchor="middle"
        fill="${TEXT}">${matchup}</text>

  <!-- Matchup line (full names) -->
  <text x="${W / 2}" y="552"
        font-family="${FONT}"
        font-size="22"
        font-weight="500"
        letter-spacing="3"
        text-anchor="middle"
        fill="${MUTE}">${fullMatchup.toUpperCase()}</text>

  <!-- Spacer ─ thin accent line -->
  <rect x="${W / 2 - 80}" y="630" width="160" height="2" fill="${ACCENT}" opacity="0.6"/>

  <!-- Direction arrow + LINE — the hero number -->
  <g transform="translate(${W / 2}, 760)">
    <!-- arrow + line number side by side, centered as a group -->
    <text x="-220" y="64"
          font-family="${FONT}"
          font-size="120"
          font-weight="900"
          text-anchor="middle"
          fill="${ACCENT}">${arrow}</text>
    <text x="80" y="64"
          font-family="${FONT}"
          font-size="200"
          font-weight="900"
          letter-spacing="-6"
          text-anchor="middle"
          fill="${TEXT}">${PICK.line}</text>
  </g>

  <!-- OVER / UNDER label -->
  <text x="${W / 2}" y="900"
        font-family="${MONO}"
        font-size="38"
        font-weight="700"
        letter-spacing="8"
        text-anchor="middle"
        fill="${ACCENT}">${directionWord}</text>

  <!-- Market type subtitle -->
  <text x="${W / 2}" y="958"
        font-family="${FONT}"
        font-size="22"
        font-weight="500"
        letter-spacing="3"
        text-anchor="middle"
        fill="${MUTE}">${PICK.market}</text>

  <!-- ─────────────────── UNITS STAMP ─────────────────── -->
  <g transform="translate(${W / 2 - 200}, 1050)">
    <rect x="0" y="0" width="400" height="92" rx="46"
          fill="${SURFACE}"
          stroke="${ACCENT}"
          stroke-width="2"/>
    <text x="200" y="60"
          font-family="${MONO}"
          font-size="32"
          font-weight="800"
          letter-spacing="5"
          text-anchor="middle"
          fill="${ACCENT}">${PICK.units} UNIT PLAY</text>
  </g>

  <!-- ─────────────────── BOTTOM STRIP ─────────────────── -->
  <rect x="80" y="${H - 138}" width="${W - 160}" height="1" fill="${SURFACE_2}"/>

  <!-- URL bottom-left -->
  <text x="80" y="${H - 75}"
        font-family="${MONO}"
        font-size="22"
        font-weight="600"
        letter-spacing="2"
        fill="${MUTE}">joinlockr.com</text>

  <!-- Tagline bottom-right -->
  <text x="${W - 80}" y="${H - 75}"
        font-family="${MONO}"
        font-size="18"
        font-weight="500"
        letter-spacing="3"
        text-anchor="end"
        fill="${DIM}">WHERE THE EDGE LIVES</text>
</svg>`;

await mkdir(outDir, { recursive: true });
const outPath = join(outDir, "sample-slip-1080x1350.png");
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(outPath);
console.log(`Wrote ${outPath}`);
