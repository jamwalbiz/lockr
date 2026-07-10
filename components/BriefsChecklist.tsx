"use client";

// DB-free reel board. Reels come from git (content/briefs/*.json, rendered by the
// server). The only interactive state is JT's "filmed" check-offs, which persist in
// THIS browser's localStorage — no database, no login. Filmed items gray out, strike
// through, and drop into a "Filmed" group under their day.
import { useEffect, useState } from "react";

const GREEN = "#00ff85";
const STORE_KEY = "lockr-briefs-filmed";

export type BriefItem = {
  id: string;
  label: string;
  reelUrl?: string;
  whyItWorks?: string;
  hook?: string;
  script?: string[];
  shotNotes?: string;
  caption?: string;
  gameNotes?: string;
};
export type BriefDay = { date: string; note?: string; items: BriefItem[] };

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: GREEN }}>{k}</div>
      <div style={{ marginTop: 4, fontSize: 15, lineHeight: 1.55 }}>{children}</div>
    </div>
  );
}

export function BriefsChecklist({ days }: { days: BriefDay[] }) {
  const [filmed, setFilmed] = useState<Record<string, boolean>>({});
  const [ready, setReady] = useState(false);

  // load persisted check-offs from this device
  useEffect(() => {
    try {
      setFilmed(JSON.parse(localStorage.getItem(STORE_KEY) || "{}"));
    } catch {
      setFilmed({});
    }
    setReady(true);
  }, []);

  const toggle = (id: string) => {
    setFilmed((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (!next[id]) delete next[id];
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify(next));
      } catch {
        // storage disabled — checkbox still works for this session
      }
      return next;
    });
  };

  const card = (item: BriefItem) => {
    const done = Boolean(filmed[item.id]);
    return (
      <div
        key={item.id}
        style={{
          display: "flex",
          gap: 14,
          alignItems: "flex-start",
          border: "1px solid rgba(245,244,241,0.12)",
          borderRadius: 16,
          padding: "18px 18px 20px",
          background: done ? "rgba(245,244,241,0.02)" : "rgba(245,244,241,0.04)",
          opacity: done ? 0.5 : 1,
        }}
      >
        <input
          type="checkbox"
          checked={done}
          onChange={() => toggle(item.id)}
          aria-label={done ? "Mark as not filmed" : "Mark as filmed"}
          style={{ width: 24, height: 24, marginTop: 2, accentColor: GREEN, flexShrink: 0, cursor: "pointer" }}
        />
        <div style={{ minWidth: 0, flex: 1, textDecoration: done ? "line-through" : "none" }}>
          <h3 style={{ fontSize: 17, lineHeight: 1.3 }}>{item.label}</h3>
          {item.reelUrl ? (
            <a
              href={item.reelUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-block", marginTop: 10, border: `1px solid ${GREEN}`, color: GREEN, borderRadius: 999, padding: "7px 16px", fontSize: 14, fontWeight: 600, textDecoration: "none" }}
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
              <ol style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 5 }}>
                {item.script.map((s, j) => (
                  <li key={j}>{s}</li>
                ))}
              </ol>
            </Row>
          ) : null}
          {item.gameNotes ? <Row k="Game / odds notes">{item.gameNotes}</Row> : null}
          {item.shotNotes ? <Row k="Shooting notes">{item.shotNotes}</Row> : null}
          {item.caption ? <Row k="Caption (paste when posting)">{item.caption}</Row> : null}
        </div>
      </div>
    );
  };

  if (!days.length) {
    return <p style={{ marginTop: 36, opacity: 0.7 }}>No briefs yet. Today&apos;s drop lands here.</p>;
  }

  return (
    <div style={{ opacity: ready ? 1 : 0, transition: "opacity 150ms ease" }}>
      {days.map((day) => {
        const open = day.items.filter((i) => !filmed[i.id]);
        const done = day.items.filter((i) => filmed[i.id]);
        return (
          <section key={day.date} style={{ marginTop: 40 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", borderBottom: "1px solid rgba(245,244,241,0.12)", paddingBottom: 8 }}>
              <h2 style={{ fontSize: 20 }}>{day.date}</h2>
              <span style={{ fontSize: 13, opacity: 0.65 }}>
                {done.length}/{day.items.length} filmed
              </span>
            </div>
            {day.note ? <p style={{ marginTop: 10, fontSize: 14, opacity: 0.7, lineHeight: 1.5 }}>{day.note}</p> : null}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>{open.map(card)}</div>
            {done.length ? (
              <div style={{ marginTop: 18 }}>
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: GREEN, opacity: 0.8 }}>Filmed</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 10 }}>{done.map(card)}</div>
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
