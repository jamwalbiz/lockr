import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";

// Internal daily reel-brief feed for JT. Arnav drops the day's reels + scripts via
// Claude (which writes content/briefs/YYYY-MM-DD.json and pushes; Vercel redeploys),
// JT checks this page every day on his phone and films. Unlinked + noindex, same
// treatment as /studio. Mobile-first: JT reads this on his phone.
export const metadata: Metadata = {
  title: "Daily briefs | Lockr",
  robots: { index: false, follow: false },
};

type BriefItem = {
  label: string;
  reelUrl?: string;
  whyItWorks?: string;
  hook?: string;
  script?: string[];
  shotNotes?: string;
  caption?: string;
  gameNotes?: string;
};

type BriefDay = {
  date: string;
  for?: string;
  note?: string;
  items: BriefItem[];
};

function loadBriefs(): BriefDay[] {
  const dir = path.join(process.cwd(), "content/briefs");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      try {
        return JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as BriefDay;
      } catch {
        return null;
      }
    })
    .filter((b): b is BriefDay => Boolean(b && b.date && Array.isArray(b.items)))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

const GREEN = "#00ff85";

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: GREEN }}>{k}</div>
      <div style={{ marginTop: 5, fontSize: 15, lineHeight: 1.55 }}>{children}</div>
    </div>
  );
}

export default function BriefsPage() {
  const days = loadBriefs();
  return (
    <div className="shell" style={{ maxWidth: 720, margin: "0 auto", padding: "48px 20px 96px" }}>
      <header>
        <div className="section-label">Daily briefs</div>
        <h1 style={{ fontSize: "clamp(30px, 6vw, 44px)", lineHeight: 1.05, marginTop: 10 }}>Today&apos;s reels to film</h1>
        <p style={{ marginTop: 12, opacity: 0.85, fontSize: 15, lineHeight: 1.55 }}>
          The day&apos;s reels to recreate, with the hook, script, and shot notes for each.
          New drop most days. Internal page, not linked anywhere.
        </p>
      </header>

      {days.length === 0 ? (
        <p style={{ marginTop: 40, opacity: 0.7 }}>No briefs yet. Today&apos;s drop lands here.</p>
      ) : (
        days.map((day) => (
          <section key={day.date} style={{ marginTop: 44 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, borderBottom: "1px solid rgba(245,244,241,0.12)", paddingBottom: 10 }}>
              <h2 style={{ fontSize: 20 }}>{day.date}</h2>
              {day.for ? <span style={{ fontSize: 13, opacity: 0.7 }}>for {day.for}</span> : null}
            </div>
            {day.note ? (
              <p style={{ marginTop: 10, fontSize: 14, opacity: 0.7, lineHeight: 1.5 }}>{day.note}</p>
            ) : null}

            {day.items.map((item, i) => (
              <article
                key={i}
                style={{
                  marginTop: 20,
                  border: "1px solid rgba(245,244,241,0.12)",
                  borderRadius: 16,
                  padding: "20px 20px 24px",
                  background: "rgba(245,244,241,0.03)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: GREEN }}>#{i + 1}</span>
                  <h3 style={{ fontSize: 17, lineHeight: 1.3 }}>{item.label}</h3>
                </div>

                {item.reelUrl ? (
                  <a
                    href={item.reelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-block",
                      marginTop: 12,
                      border: `1px solid ${GREEN}`,
                      color: GREEN,
                      borderRadius: 999,
                      padding: "8px 18px",
                      fontSize: 14,
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    Watch the reel →
                  </a>
                ) : null}

                {item.whyItWorks ? <Row k="Why it works">{item.whyItWorks}</Row> : null}
                {item.hook ? (
                  <Row k="Your hook (say this first)">
                    <em>&ldquo;{item.hook}&rdquo;</em>
                  </Row>
                ) : null}
                {item.script?.length ? (
                  <Row k="Beats">
                    <ol style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
                      {item.script.map((s, j) => (
                        <li key={j}>{s}</li>
                      ))}
                    </ol>
                  </Row>
                ) : null}
                {item.gameNotes ? <Row k="Game / odds notes">{item.gameNotes}</Row> : null}
                {item.shotNotes ? <Row k="Shooting notes">{item.shotNotes}</Row> : null}
                {item.caption ? <Row k="Caption (paste when posting)">{item.caption}</Row> : null}
              </article>
            ))}
          </section>
        ))
      )}
    </div>
  );
}
