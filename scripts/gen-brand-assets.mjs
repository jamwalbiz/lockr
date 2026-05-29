#!/usr/bin/env node
// Generates Lockr brand assets (Whop business icon, Discord server icon,
// product banner, social avatars) from SVG sources using sharp.
//
// Brand recipe matches app/icon.tsx + app/apple-icon.tsx + the OG image:
//   bg:     #0a0a0b
//   accent: #00ff85
//   text:   #f5f4f1
//   font:   Inter, weight 800, tight letter-spacing
//
// Run:   node scripts/gen-brand-assets.mjs
// Out:   public/brand/lockr-icon-512.png       (square — Whop icon, Discord icon, all social avatars)
//        public/brand/lockr-icon-512.svg
//        public/brand/lockr-banner-1500x500.png (landscape — Whop product page banner)
//        public/brand/lockr-banner-1500x500.svg
//
// Re-run after changing the SVG markup below.

import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..", "public", "brand");

// 512×512 square. Centered: green accent square stacked above LOCKR wordmark.
// Works as Whop business icon, Discord server icon, X/Twitter/Instagram/TikTok
// avatar. Read-tested down to 32×32 — wordmark still legible.
const ICON_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#0a0a0b"/>
  <rect x="216" y="146" width="80" height="80" rx="14" fill="#00ff85"/>
  <text x="256" y="364"
        font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, system-ui, sans-serif"
        font-size="92"
        font-weight="800"
        letter-spacing="-4"
        fill="#f5f4f1"
        text-anchor="middle">LOCKR</text>
</svg>`;

// 1500×500 banner. LOCKR wordmark left-aligned with a subtle accent block,
// tagline beneath. Right side intentionally empty so the Whop "Join now"
// CTA card doesn't fight with the type.
const BANNER_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="500" viewBox="0 0 1500 500">
  <defs>
    <radialGradient id="glow" cx="0%" cy="50%" r="80%">
      <stop offset="0%" stop-color="#00ff85" stop-opacity="0.08"/>
      <stop offset="60%" stop-color="#0a0a0b" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1500" height="500" fill="#0a0a0b"/>
  <rect width="1500" height="500" fill="url(#glow)"/>
  <rect x="120" y="184" width="44" height="44" rx="6" fill="#00ff85"/>
  <text x="190" y="222"
        font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, system-ui, sans-serif"
        font-size="84"
        font-weight="800"
        letter-spacing="-3"
        fill="#f5f4f1">LOCKR</text>
  <text x="120" y="304"
        font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, system-ui, sans-serif"
        font-size="32"
        font-weight="500"
        letter-spacing="-0.5"
        fill="#a1a1a6">Where serious bettors get serious edges.</text>
  <text x="120" y="350"
        font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, system-ui, sans-serif"
        font-size="22"
        font-weight="600"
        letter-spacing="2"
        fill="#00ff85">DAILY PICKS · SPORTS + PREDICTION MARKETS</text>
</svg>`;

async function write(name, svg, w, h) {
  await mkdir(outDir, { recursive: true });
  await writeFile(join(outDir, `${name}.svg`), svg);
  await sharp(Buffer.from(svg))
    .resize(w, h)
    .png({ compressionLevel: 9 })
    .toFile(join(outDir, `${name}.png`));
  console.log(`✓ ${name}.{svg,png} (${w}×${h})`);
}

await write("lockr-icon-512", ICON_SVG, 512, 512);
await write("lockr-banner-1500x500", BANNER_SVG, 1500, 500);

// Discord custom emojis. Square 128×128, dark bg + bright glyph. Used as
// reactions on pick posts so members can signal at-a-glance whether they
// tailed / faded / are claiming win/loss. Upload via Server Settings →
// Emoji → Upload Emoji. Name them :win:, :loss:, :tail:, :fade:, :lockr:.
const EMOJI_BG = "#0a0a0b";
function emojiSvg(glyph, color, fontSize = 84) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <rect width="128" height="128" rx="20" fill="${EMOJI_BG}"/>
  <text x="64" y="92"
        font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, system-ui, sans-serif"
        font-size="${fontSize}"
        font-weight="900"
        fill="${color}"
        text-anchor="middle">${glyph}</text>
</svg>`;
}

// :lockr: — reuses the brand accent square mark.
const LOCKR_EMOJI_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <rect width="128" height="128" rx="20" fill="${EMOJI_BG}"/>
  <rect x="30" y="30" width="68" height="68" rx="10" fill="#00ff85"/>
</svg>`;

await write("emoji-win", emojiSvg("✓", "#00ff85", 96), 128, 128);
await write("emoji-loss", emojiSvg("✕", "#ff4d4d", 96), 128, 128);
await write("emoji-tail", emojiSvg("▲", "#00ff85", 84), 128, 128);
await write("emoji-fade", emojiSvg("▼", "#ff4d4d", 84), 128, 128);
await write("emoji-lockr", LOCKR_EMOJI_SVG, 128, 128);

console.log("\nDone. Files in public/brand/:");
console.log("  lockr-icon-512.png         — Whop biz icon, Discord server icon, all social avatars");
console.log("  lockr-banner-1500x500.png  — Whop product page banner");
console.log("  emoji-win.png              — Discord :win: reaction");
console.log("  emoji-loss.png             — Discord :loss: reaction");
console.log("  emoji-tail.png             — Discord :tail: reaction (member followed the pick)");
console.log("  emoji-fade.png             — Discord :fade: reaction (member bet the other side)");
console.log("  emoji-lockr.png            — Discord :lockr: reaction (general approval)");
