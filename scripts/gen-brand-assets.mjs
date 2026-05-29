#!/usr/bin/env node
// Generates Lockr brand assets from SVG sources using sharp.
//
// Brand recipe (matches app/globals.css):
//   bg:      #0a0a0b
//   surface: #141416
//   text:    #f5f4f1
//   mute:    #a1a1a6
//   accent:  #00ff85
//   gold:    #C9A76A   (Inner Circle)
//   danger:  #ff4d4d
//
// Logo lockup matches the on-site brand mark exactly — see components/Nav.tsx
// (.logo + .logo-dot in globals.css) and app/opengraph-image.tsx. It's an
// inline `[•] LOCKR` arrangement: a small rounded-square accent dot to the
// left of the LOCKR wordmark, vertically centered. The `inlineMark()` helper
// below scales those proportions to whatever font size each surface needs.
//
// IMPORTANT: emoji glyphs are SVG paths, NOT <text>. The SVG (rendered by
// the browser) and the PNG (rendered by sharp+pango) come out identical
// because there's no font lookup. Don't switch them back to <text>.
//
// Run:   node scripts/gen-brand-assets.mjs
// Out:   public/brand/
//
// Re-run after changing anything below.

import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..", "public", "brand");

const BG = "#0a0a0b";
const SURFACE = "#141416";
const TEXT = "#f5f4f1";
const MUTE = "#a1a1a6";
const ACCENT = "#00ff85";
const GOLD = "#C9A76A";
const DANGER = "#ff4d4d";
const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, system-ui, sans-serif";

// Inline `[•] LOCKR` mark. Matches the site nav + OG card lockup so every
// surface (Whop icon, Discord server icon, banners, social avatars) reads
// as the same brand mark. Proportions derived from the OG card:
//   dot:font   = 0.55  (dot height relative to font size — emphatic display)
//   gap:font   = 0.44  (whitespace between dot and wordmark)
//   ls         = -0.025em (tighter than nav's -0.02 to match the OG card)
//   weight     = 800   (display weight; nav uses 700 for inline body)
//   dot rx     = 0.14 of dot size (matches OG card's 3/20 ratio)
//
// `centerX` / `centerY` is the visual center of the whole mark group.
// `leftAlign: true` reinterprets `centerX` as the *left edge* of the mark
// instead — used by left-anchored layouts like the Whop product banner.
function inlineMark({ centerX, centerY, fontSize, leftAlign = false }) {
  const dotSize = Math.round(fontSize * 0.55);
  const dotRadius = Math.max(1, Math.round(dotSize * 0.14));
  const gap = Math.round(fontSize * 0.44);
  const letterSpacing = +(fontSize * -0.025).toFixed(2);
  const capHeight = fontSize * 0.72;
  // LOCKR's actual rendered width depends on which font librsvg ends up
  // picking — DejaVu Sans (sharp's pango fallback) is ~12% wider than
  // Inter / SF Pro. The math here uses a midpoint estimate; for SQUARE
  // icon outputs we then run a trim+re-pad pass in `writeCentered()` to
  // snap the mark to pixel-perfect center regardless of width drift.
  // For landscape banners the slight drift is masked by the radial glow
  // and the centered tagline beneath, so they use `write()` directly.
  const lockrWidth = Math.round(5 * fontSize * 0.62 + 4 * letterSpacing);
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

function svgWrap(w, h, bg, inner) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${bg}"/>
  ${inner}
</svg>`;
}

// 512×512 — Whop business icon, Discord server icon, social avatars.
// Inline mark, centered. Discord round-crops square icons into circles,
// and our mark has enough padding to survive the crop.
const ICON_SVG = svgWrap(512, 512, BG,
  inlineMark({ centerX: 256, centerY: 256, fontSize: 96 })
);

// 1500×500 — Whop product page banner. Mark left-aligned (right side empty
// for Whop's "Join now" CTA card), tagline + ALL-CAPS sub beneath.
const BANNER_SVG = svgWrap(1500, 500, BG, `
  <defs>
    <radialGradient id="bannerGlow" cx="0%" cy="50%" r="80%">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.08"/>
      <stop offset="60%" stop-color="${BG}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1500" height="500" fill="url(#bannerGlow)"/>
  ${inlineMark({ centerX: 120, centerY: 210, fontSize: 100, leftAlign: true })}
  <text x="120" y="318"
        font-family="${FONT}"
        font-size="32"
        font-weight="500"
        letter-spacing="-0.5"
        fill="${MUTE}">Where serious bettors get serious edges.</text>
  <text x="120" y="366"
        font-family="${FONT}"
        font-size="22"
        font-weight="600"
        letter-spacing="2"
        fill="${ACCENT}">DAILY PICKS · SPORTS + PREDICTION MARKETS</text>
`);

// 1500×500 — Discord welcome banner. Attach above the pinned #welcome
// message. Centered mark + single tagline (no ALL-CAPS sub — the pinned
// text below carries the next-steps content).
const WELCOME_BANNER_SVG = svgWrap(1500, 500, BG, `
  <defs>
    <radialGradient id="welcomeGlow" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.12"/>
      <stop offset="65%" stop-color="${BG}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1500" height="500" fill="url(#welcomeGlow)"/>
  ${inlineMark({ centerX: 750, centerY: 225, fontSize: 140 })}
  <text x="750" y="360"
        font-family="${FONT}"
        font-size="32"
        font-weight="500"
        letter-spacing="-0.5"
        fill="${MUTE}"
        text-anchor="middle">Where serious bettors get serious edges.</text>
`);

// 960×540 — Discord server banner (Tier 2 boost). Sits at the top of
// the channel list; Discord crops freely across viewport widths, so we
// keep the mark in the top-left corner and the rest is brand backdrop.
const SERVER_BANNER_SVG = svgWrap(960, 540, BG, `
  <defs>
    <linearGradient id="serverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${SURFACE}"/>
      <stop offset="100%" stop-color="${BG}"/>
    </linearGradient>
    <radialGradient id="serverGlow" cx="20%" cy="80%" r="60%">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.16"/>
      <stop offset="70%" stop-color="${BG}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="960" height="540" fill="url(#serverGrad)"/>
  <rect width="960" height="540" fill="url(#serverGlow)"/>
  ${inlineMark({ centerX: 56, centerY: 80, fontSize: 40, leftAlign: true })}
`);

// 1920×1080 — Discord invite splash (Tier 1 boost). Shown when someone
// clicks an invite link before they hit "Accept Invite".
const INVITE_SPLASH_SVG = svgWrap(1920, 1080, BG, `
  <defs>
    <radialGradient id="splashGlow" cx="50%" cy="50%" r="55%">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.10"/>
      <stop offset="65%" stop-color="${BG}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#splashGlow)"/>
  ${inlineMark({ centerX: 960, centerY: 460, fontSize: 200 })}
  <text x="960" y="700"
        font-family="${FONT}"
        font-size="44"
        font-weight="500"
        letter-spacing="-0.6"
        fill="${MUTE}"
        text-anchor="middle">Where serious bettors get serious edges.</text>
  <text x="960" y="790"
        font-family="${FONT}"
        font-size="30"
        font-weight="600"
        letter-spacing="3"
        fill="${ACCENT}"
        text-anchor="middle">DAILY PICKS · SPORTS + PREDICTION MARKETS</text>
`);

// 64×64 role icon. Brand-colour rounded square in the colour of the role
// (accent green for Lockr Subscriber, brand gold for Inner Circle). Sits
// beside the member's name in the sidebar. Tier 2 boost required.
function roleIconSvg(color) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <rect x="6" y="6" width="52" height="52" rx="8" fill="${color}"/>
</svg>`;
}

// Compute the librsvg density needed to rasterise an SVG (with viewBox W)
// at `targetW` natively, so sharp doesn't have to upscale a low-res
// raster. Density 96 = 1 SVG-px → 1 raster-px; for a 4K render of a
// 512-viewBox SVG we want 768 (= 96 * 8).
function densityFor(svg, targetW) {
  const m = svg.match(/viewBox="0 0 (\d+) /);
  const viewBoxW = m ? parseInt(m[1]) : targetW;
  return Math.max(96, Math.round(96 * (targetW / viewBoxW)));
}

async function write(name, svg, w, h) {
  await mkdir(outDir, { recursive: true });
  await writeFile(join(outDir, `${name}.svg`), svg);
  await sharp(Buffer.from(svg), { density: densityFor(svg, w) })
    .resize(w, h)
    .png({ compressionLevel: 9 })
    .toFile(join(outDir, `${name}.png`));
  console.log(`✓ ${name}.{svg,png} (${w}×${h})`);
}

// Same as write() but guarantees the mark sits at the exact pixel center
// by rasterising, trimming all background-coloured borders to the mark's
// true bounding box, then re-padding symmetrically. Use this for SQUARE
// icon outputs where there's a single content blob and centering is the
// whole point — don't use it on banners, the trim would collapse the
// intentional whitespace between mark, tagline, and sub.
async function writeCentered(name, svg, w, h, bg = BG) {
  await mkdir(outDir, { recursive: true });
  await writeFile(join(outDir, `${name}.svg`), svg);

  const raw = await sharp(Buffer.from(svg), { density: densityFor(svg, w) })
    .resize(w, h)
    .png()
    .toBuffer();

  const trimmed = await sharp(raw)
    .trim({ background: bg, threshold: 10 })
    .png()
    .toBuffer();
  const { width: cw, height: ch } = await sharp(trimmed).metadata();

  const padLeft = Math.floor((w - cw) / 2);
  const padTop = Math.floor((h - ch) / 2);
  await sharp(trimmed)
    .extend({
      top: padTop,
      bottom: h - ch - padTop,
      left: padLeft,
      right: w - cw - padLeft,
      background: bg,
    })
    .png({ compressionLevel: 9 })
    .toFile(join(outDir, `${name}.png`));

  console.log(`✓ ${name}.{svg,png} (${w}×${h}) [centered]`);
}

await writeCentered("lockr-icon-512", ICON_SVG, 512, 512);
await writeCentered("lockr-icon-4k", ICON_SVG, 4096, 4096);
await write("lockr-banner-1500x500", BANNER_SVG, 1500, 500);
await write("lockr-banner-4k", BANNER_SVG, 4500, 1500);
await write("discord-welcome-banner-1500x500", WELCOME_BANNER_SVG, 1500, 500);
await write("discord-server-banner-960x540", SERVER_BANNER_SVG, 960, 540);
await write("discord-invite-splash-1920x1080", INVITE_SPLASH_SVG, 1920, 1080);
await write("role-icon-subscriber-64", roleIconSvg(ACCENT), 64, 64);
await write("role-icon-inner-circle-64", roleIconSvg(GOLD), 64, 64);

// Discord custom emojis, 128×128. Glyphs are SVG paths (NOT <text>) so
// the .svg and .png renders are byte-identical in shape. Upload via
// Server Settings → Emoji → Upload Emoji. Name them :win:, :loss:,
// :tail:, :fade:, :lockr:.
function emojiSvg(inner) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <rect width="128" height="128" rx="20" fill="${BG}"/>
  ${inner}
</svg>`;
}

// Chunky check — round caps + joins so the corner reads as a soft hook.
const WIN_GLYPH = `<path d="M 28 66 L 54 92 L 100 38" fill="none" stroke="${ACCENT}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>`;

// Two crossing strokes with round caps.
const LOSS_GLYPH = `<path d="M 36 36 L 92 92 M 92 36 L 36 92" fill="none" stroke="${DANGER}" stroke-width="16" stroke-linecap="round"/>`;

// Filled triangles. Round-joined so the points aren't visually piercing.
const TAIL_GLYPH = `<path d="M 64 26 L 102 102 L 26 102 Z" fill="${ACCENT}" stroke="${ACCENT}" stroke-width="6" stroke-linejoin="round"/>`;
const FADE_GLYPH = `<path d="M 64 102 L 102 26 L 26 26 Z" fill="${DANGER}" stroke="${DANGER}" stroke-width="6" stroke-linejoin="round"/>`;

// :lockr: — the brand accent square mark, same shape as the icon dot.
const LOCKR_GLYPH = `<rect x="30" y="30" width="68" height="68" rx="10" fill="${ACCENT}"/>`;

await write("emoji-win", emojiSvg(WIN_GLYPH), 128, 128);
await write("emoji-loss", emojiSvg(LOSS_GLYPH), 128, 128);
await write("emoji-tail", emojiSvg(TAIL_GLYPH), 128, 128);
await write("emoji-fade", emojiSvg(FADE_GLYPH), 128, 128);
await write("emoji-lockr", emojiSvg(LOCKR_GLYPH), 128, 128);

console.log("\nDone. Files in public/brand/:");
console.log("  lockr-icon-4k.png                        — 4K master icon: upload everywhere (Whop, Discord, X, IG, TikTok, decks)");
console.log("  lockr-icon-512.png                       — site-embedded use (OG, meta); platforms should get the 4K version");
console.log("  lockr-banner-4k.png                      — 4K master banner: marketing decks, partner assets, hi-DPI screens");
console.log("  lockr-banner-1500x500.png                — Whop product page banner (Whop's spec)");
console.log("  discord-welcome-banner-1500x500.png      — attach to pinned #welcome message");
console.log("  discord-server-banner-960x540.png        — Discord server banner (Tier 2 boost)");
console.log("  discord-invite-splash-1920x1080.png      — Discord invite-link preview (Tier 1 boost)");
console.log("  role-icon-subscriber-64.png              — Lockr Subscriber role icon (Tier 2 boost)");
console.log("  role-icon-inner-circle-64.png            — Inner Circle role icon (Tier 2 boost)");
console.log("  emoji-win.png                            — Discord :win: reaction");
console.log("  emoji-loss.png                           — Discord :loss: reaction");
console.log("  emoji-tail.png                           — Discord :tail: reaction (member followed the pick)");
console.log("  emoji-fade.png                           — Discord :fade: reaction (member bet the other side)");
console.log("  emoji-lockr.png                          — Discord :lockr: reaction (general approval)");
