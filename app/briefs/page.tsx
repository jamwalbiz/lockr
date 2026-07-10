import type { Metadata } from "next";
import { BriefsBoard } from "@/components/BriefsBoard";

// Internal reel-brief board. Arnav (or Claude, via POST /api/briefs) drops the
// day's reels; JT checks this on his phone daily and checks items off as he films
// them (filmed items gray out and sink into a "Filmed" group). Backed by Upstash
// Redis via /api/briefs. Unlinked + noindex, same treatment as /studio.
export const metadata: Metadata = {
  title: "Reel board | Lockr",
  robots: { index: false, follow: false },
};

export default function BriefsPage() {
  return (
    <div className="shell" style={{ maxWidth: 720, margin: "0 auto", padding: "48px 20px 96px" }}>
      <header>
        <div className="section-label">Reel board</div>
        <h1 style={{ fontSize: "clamp(30px, 6vw, 44px)", lineHeight: 1.05, marginTop: 10 }}>Today&apos;s reels to film</h1>
        <p style={{ marginTop: 12, opacity: 0.85, fontSize: 15, lineHeight: 1.55 }}>
          The day&apos;s reels to recreate, logged by day. Check one off when it&apos;s filmed.
          Internal page, not linked anywhere.
        </p>
      </header>
      <BriefsBoard />
    </div>
  );
}
