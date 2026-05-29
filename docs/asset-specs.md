# Lockr — outstanding asset specs

The two visible placeholders on the site that need real assets before the brand-trust ceiling lifts. Both are wired so the swap-in is low-friction.

---

## 1. Founder portrait (about page)

**Where it goes:** `/public/brand/jt-portrait.jpg`
**Code location:** `app/about/page.tsx` — `<div className="about-img">` block (see code comment for exact swap instructions)
**Container aspect ratio:** **4:5 portrait** (e.g. 1600×2000)

### Visual direction

- **Style:** Whoop founder portrait — high-contrast, low-light, serious. Tight crop on face/shoulders, dark background, single key light.
- **Avoid:** Tate-style yacht / luxury-flex / stock-business-headshot. Lockr is a one-trader operation, not a flex brand.
- **Subject:** JT, looking past camera or slightly off-axis. Not a smiling LinkedIn shot.
- **Background:** Pure dark (matches `--bg: #0a0a0b`) or low-key textured (concrete, dark fabric).
- **Wardrobe:** Plain. Black t-shirt, dark hoodie, dark button-down. No logos. No watches/jewelry in frame.

### Technical

- **File:** `jt-portrait.jpg`, ~85 quality, sRGB color space.
- **Dimensions:** 1600×2000 minimum (4:5 portrait). Next.js will resize for each viewport.
- **File size:** target under 350KB after compression.
- **Format note:** JPG is fine (Next.js auto-converts to WebP/AVIF on serve). If you have RAW + a high-quality JPG export from the photographer, use that.

### Swap process

1. Save photo as `/public/brand/jt-portrait.jpg` at exact filename.
2. Open `app/about/page.tsx` — replace the placeholder `<div className="about-img">` block with the `<Image>` snippet documented in the code comment there.
3. Drop the `.about-img::before` pseudo-element from `app/globals.css` (it centers "JAIRO TOVAR · JT" text — the real photo covers it).
4. Commit + push.

### Cost reference

$200–500 for 1–2 hour shoot with a local portrait photographer. 5–10 final selects is plenty.

---

## 2. Founder VSL (home page)

**Where it goes:** External video host (Vimeo, YouTube, Wistia, or Mux). Embed URL goes in the `NEXT_PUBLIC_VSL_URL` env var on Vercel.
**Code location:** `app/page.tsx` — VSL `<section id="intro">` (conditional render on env var; see code comment)
**Container aspect ratio:** **16:9** (the site CSS already locks this)

### Length + structure

- **Length:** 2–4 minutes (per original launch brief).
- **Format:** Direct-to-camera, scripted but conversational.
- **Outline:**
  1. Hook (10–15s) — open with the "I lost $40K" line that's already on the About page. Same line, different delivery.
  2. The problem (30–45s) — what's broken about every other picks Discord.
  3. The system (60–90s) — how JT actually finds edges. Model → Price → Size (matches the three methodology cards on About).
  4. The product (30–45s) — Lockr's tier structure in one breath, what you get day 1.
  5. CTA (10–15s) — "Join below" / "Subscribe link is below this video."

### Visual direction

- **Lighting:** Same low-key palette as the portrait. Single soft key + slight rim. Dark background.
- **Framing:** Medium close-up (chest up). Eyes-level camera.
- **Cuts:** Tight. Cut out every "uh," every dead beat. Aim for 1 cut every 4–6 seconds.
- **B-roll:** Optional but valuable — bet slip screenshots, line movement screenshots, Discord channel screenshots, JT working at a laptop. Cut over the voice for visual variety.
- **Captions:** Burn in subtitles or use the host's caption track (Wistia/Vimeo both support this). 60%+ of social-driven traffic watches muted.

### Technical

- **Recording:** 4K is overkill; 1080p at 24fps is fine for an embed.
- **Audio:** Lavalier or shotgun mic, not laptop mic. Audio matters more than video.
- **Host:** Vimeo Pro ($20/mo) is the cleanest brand-control option — no related-videos, no ads, customizable player. Wistia ($25/mo) gives the deepest engagement analytics. YouTube is free but adds YouTube branding + "watch on YouTube" buttons.

### Swap process

1. Upload the cut video to your host of choice. Note the embed URL (Vimeo: `https://player.vimeo.com/video/<id>`; YouTube: `https://www.youtube.com/embed/<id>`; Wistia: `https://fast.wistia.com/embed/iframe/<id>`).
2. In the Vercel dashboard → Project → Settings → Environment Variables, add:

   ```
   Name:  NEXT_PUBLIC_VSL_URL
   Value: <embed URL>
   ```

3. Redeploy. The placeholder card on `/` becomes the live video automatically.

### Cost reference

DIY recording (you + a tripod + decent lav mic) is free and ships faster than waiting for a videographer. Pro-grade recording session $500–1500 day rate. Editor on Upwork to cut your raw footage: $200–500 for a one-shot 3-minute video.
