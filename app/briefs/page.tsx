import type { Metadata } from "next";
import { BriefsBoard } from "@/components/BriefsBoard";

// Internal self-serve reel board. Arnav adds the day's reels right on the page
// (POST /api/briefs, Blob-backed, password-gated); JT opens it on his phone and
// checks reels off as he films them (check-offs persist in his browser via
// localStorage). Unlinked + noindex, same treatment as /studio.
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
          Add the day&apos;s reels with <strong>+ Add reels</strong>. Tick one off when it&apos;s filmed.
          Internal page, not linked anywhere.
        </p>
      </header>
      <BriefsBoard />
    </div>
  );
}
