import type { Metadata } from "next";
import { StudioForm } from "@/components/StudioForm";

// Internal slip-card studio. Unlinked + noindex; posting is password-gated.
export const metadata: Metadata = {
  title: "Slip Studio | Lockr",
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  return (
    <div className="shell studio-shell">
      <header className="studio-head">
        <div className="section-label">Slip studio</div>
        <h1 className="studio-title">Post a play</h1>
        <p className="studio-sub">
          Enter the play, check the card, post it straight to the members Discord.
          Internal tool, not linked anywhere.
        </p>
      </header>
      <StudioForm />
    </div>
  );
}
