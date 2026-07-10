import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import { BriefsChecklist, type BriefDay, type BriefItem } from "@/components/BriefsChecklist";

// Internal daily reel board for JT. Arnav drops the day's reels via Claude, which
// writes content/briefs/YYYY-MM-DD.json and pushes; Vercel redeploys. JT opens this
// on his phone and checks reels off as he films them (check-offs persist in his
// browser via localStorage — no database). Unlinked + noindex, same as /studio.
export const metadata: Metadata = {
  title: "Reel board | Lockr",
  robots: { index: false, follow: false },
};

function loadDays(): BriefDay[] {
  const dir = path.join(process.cwd(), "content/briefs");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      try {
        const raw = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as BriefDay;
        if (!raw.date || !Array.isArray(raw.items)) return null;
        // Stable per-item id (used as the localStorage check-off key). Prefer an
        // explicit id; otherwise derive one from the date + position so a reel keeps
        // its checkmark across redeploys as long as its slot doesn't change.
        const items: BriefItem[] = raw.items.map((it, i) => ({ ...it, id: it.id || `${raw.date}-${i}` }));
        return { ...raw, items };
      } catch {
        return null;
      }
    })
    .filter((d): d is BriefDay => Boolean(d))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export default function BriefsPage() {
  const days = loadDays();
  return (
    <div className="shell" style={{ maxWidth: 720, margin: "0 auto", padding: "48px 20px 96px" }}>
      <header>
        <div className="section-label">Reel board</div>
        <h1 style={{ fontSize: "clamp(30px, 6vw, 44px)", lineHeight: 1.05, marginTop: 10 }}>Today&apos;s reels to film</h1>
        <p style={{ marginTop: 12, opacity: 0.85, fontSize: 15, lineHeight: 1.55 }}>
          The day&apos;s reels to recreate, with the hook, script, and shot notes for each.
          Tick one off when it&apos;s filmed. Internal page, not linked anywhere.
        </p>
      </header>
      <BriefsChecklist days={days} />
    </div>
  );
}
