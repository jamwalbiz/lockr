# Lockr VSL (Remotion)

Self-hosted motion-graphic sales video for the homepage `#intro` section.
Source lives here; the rendered file ships from `../public/lockr-vsl.mp4`.

- **Composition:** `src/LockrVSL.tsx` — 6 scenes, 50s, 30fps, 1920×1080.
  Hook → "line already moved" → 3 LOCKED pick cards → sportsbooks = prediction
  markets → honest win/lose ledger → "Stop guessing. Start winning." + CTA.
- Brand: bg gradient `#16161b → #0a0a0c`, accent `#00ff85`, white ink.

## Develop / preview

```bash
cd video
npm install            # first time only
npm run studio         # interactive Remotion Studio at localhost:3000
npm run still -- --frame=560                # quick still -> out/frame.png
# explicit output path / scene check:
npx remotion still src/index.ts LockrVSL out/scene.png --frame=560
```

## Render + publish to the site

```bash
npm run render                              # -> out/lockr-vsl.mp4
cp out/lockr-vsl.mp4 ../public/lockr-vsl.mp4
# optional: refresh the poster (any representative frame)
npx remotion still src/index.ts LockrVSL ../public/brand/lockr-vsl-poster.png --frame=560
```

Then commit `public/lockr-vsl.mp4` (the `video/` deps + `out/` are gitignored).

## Adding the voiceover (the one remaining layer)

The current cut is **silent** — the kinetic text carries the message, and the
site plays it muted with a "Tap for sound" affordance. To add the
"confident, calm, premium" VO:

1. Generate narration in ElevenLabs from the scene script (see scene text in
   `LockrVSL.tsx`). Aim for ~48–50s so it lands on the CTA card.
2. Drop the file at `public/vo.mp3` (in this project), then in `LockrVSL.tsx`:
   ```tsx
   import { Audio, staticFile } from "remotion";
   // inside <LockrVSL>, before </AbsoluteFill>:
   <Audio src={staticFile("vo.mp3")} />
   ```
   Optionally add a low music bed the same way.
3. `npm run render`, copy to `../public/lockr-vsl.mp4`, and flip the player to
   sound-on-by-default if desired (`components/VslPlayer.tsx`).

Alternatively, host a VO cut on Vimeo/YouTube/Mux and set `NEXT_PUBLIC_VSL_URL`
in Vercel — the homepage iframe override takes over with zero code changes.
