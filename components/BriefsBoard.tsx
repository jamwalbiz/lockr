"use client";

// Self-serve reel board. Reels are submitted right here on the page (POST /api/briefs,
// Blob-backed, gated by the studio password which is remembered on-device after once).
// JT's "filmed" check-offs persist in THIS browser via localStorage — no server needed
// for those. Filmed items gray out, strike through, and drop into a per-day "Filmed" group.
import { useCallback, useEffect, useMemo, useState } from "react";

const GREEN = "#00ff85";
const PW_KEY = "lockr-studio-pw";
const FILMED_KEY = "lockr-briefs-filmed";

type ReelItem = { id: string; url: string; note: string; addedAt: string };
type Draft = { url: string; note: string };
const EMPTY: Draft[] = [
  { url: "", note: "" },
  { url: "", note: "" },
  { url: "", note: "" },
  { url: "", note: "" },
];

const dayLabel = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { timeZone: "America/Los_Angeles", weekday: "short", month: "short", day: "numeric" });
const timeLabel = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", { timeZone: "America/Los_Angeles", hour: "numeric", minute: "2-digit" });

export function BriefsBoard() {
  const [items, setItems] = useState<ReelItem[] | null>(null);
  const [error, setError] = useState("");
  const [filmed, setFilmed] = useState<Record<string, boolean>>({});
  const [showForm, setShowForm] = useState(false);
  const [drafts, setDrafts] = useState<Draft[]>(EMPTY);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState("");

  useEffect(() => {
    setPassword(localStorage.getItem(PW_KEY) || "");
    try {
      setFilmed(JSON.parse(localStorage.getItem(FILMED_KEY) || "{}"));
    } catch {
      setFilmed({});
    }
  }, []);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/briefs", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not load the board.");
        setItems([]);
        return;
      }
      setError("");
      setItems(data.items || []);
    } catch {
      setError("Could not reach the board. Refresh to retry.");
      setItems([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = (id: string) =>
    setFilmed((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (!next[id]) delete next[id];
      try {
        localStorage.setItem(FILMED_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });

  const submit = useCallback(async () => {
    const toAdd = drafts.filter((d) => d.url.trim() || d.note.trim());
    if (!toAdd.length) return setFormMsg("Paste at least one reel link.");
    setSubmitting(true);
    setFormMsg("");
    try {
      const res = await fetch("/api/briefs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password, items: toAdd }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormMsg(data.error || "Could not add.");
      } else {
        localStorage.setItem(PW_KEY, password);
        setDrafts(EMPTY);
        setFormMsg(`Added ${data.added}. ✅`);
        load();
      }
    } catch {
      setFormMsg("Network error, try again.");
    } finally {
      setSubmitting(false);
    }
  }, [drafts, password, load]);

  const days = useMemo(() => {
    if (!items) return [] as [string, ReelItem[]][];
    const map = new Map<string, ReelItem[]>();
    for (const it of items) {
      const k = dayLabel(it.addedAt);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(it);
    }
    return Array.from(map.entries());
  }, [items]);

  const card = (it: ReelItem) => {
    const done = Boolean(filmed[it.id]);
    return (
      <div
        key={it.id}
        style={{
          display: "flex",
          gap: 14,
          alignItems: "flex-start",
          border: "1px solid rgba(245,244,241,0.12)",
          borderRadius: 14,
          padding: "14px 16px",
          background: done ? "rgba(245,244,241,0.02)" : "rgba(245,244,241,0.04)",
          opacity: done ? 0.5 : 1,
        }}
      >
        <input
          type="checkbox"
          checked={done}
          onChange={() => toggle(it.id)}
          aria-label={done ? "Mark as not filmed" : "Mark as filmed"}
          style={{ width: 24, height: 24, marginTop: 2, accentColor: GREEN, flexShrink: 0, cursor: "pointer" }}
        />
        <div style={{ minWidth: 0, flex: 1, textDecoration: done ? "line-through" : "none" }}>
          {it.url ? (
            <a href={it.url} target="_blank" rel="noopener noreferrer" style={{ color: GREEN, fontWeight: 600, fontSize: 15, wordBreak: "break-all" }}>
              {it.url.replace(/^https?:\/\/(www\.)?/, "").slice(0, 64)}
            </a>
          ) : null}
          {it.note ? <p style={{ marginTop: it.url ? 6 : 0, fontSize: 14.5, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{it.note}</p> : null}
          <div style={{ marginTop: 6, fontSize: 12, opacity: 0.55 }}>added {timeLabel(it.addedAt)}</div>
        </div>
      </div>
    );
  };

  const field = (i: number, key: keyof Draft, placeholder: string, strong: boolean) => (
    <input
      placeholder={placeholder}
      value={drafts[i][key]}
      onChange={(e) => setDrafts((p) => p.map((x, j) => (j === i ? { ...x, [key]: e.target.value } : x)))}
      style={{
        padding: "10px 12px",
        borderRadius: 10,
        border: `1px solid rgba(245,244,241,${strong ? 0.2 : 0.12})`,
        background: "transparent",
        color: "inherit",
        fontSize: 14,
        width: "100%",
      }}
    />
  );

  return (
    <div>
      <div style={{ marginTop: 26 }}>
        <button
          onClick={() => setShowForm((s) => !s)}
          style={{ border: `1px solid ${GREEN}`, color: GREEN, background: "transparent", borderRadius: 999, padding: "9px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
        >
          {showForm ? "Close" : "+ Add reels"}
        </button>

        {showForm ? (
          <div style={{ marginTop: 16, border: "1px solid rgba(245,244,241,0.12)", borderRadius: 14, padding: 16 }}>
            {drafts.map((_, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                {field(i, "url", `Reel link ${i + 1}`, true)}
                {field(i, "note", "What it is / notes for JT (optional)", false)}
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <input
                type="password"
                placeholder="Studio password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(245,244,241,0.2)", background: "transparent", color: "inherit", fontSize: 14, flex: 1, minWidth: 150 }}
              />
              <button
                onClick={submit}
                disabled={submitting}
                style={{ background: GREEN, color: "#0a0a0c", border: "none", borderRadius: 999, padding: "10px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", opacity: submitting ? 0.6 : 1 }}
              >
                {submitting ? "Adding…" : "Add to board"}
              </button>
            </div>
            {formMsg ? <p style={{ marginTop: 10, fontSize: 13, opacity: 0.85 }}>{formMsg}</p> : null}
          </div>
        ) : null}
      </div>

      {items === null ? (
        <p style={{ marginTop: 36, opacity: 0.7 }}>Loading the board…</p>
      ) : error ? (
        <p style={{ marginTop: 36, opacity: 0.85, lineHeight: 1.5 }}>{error}</p>
      ) : days.length === 0 ? (
        <p style={{ marginTop: 36, opacity: 0.7 }}>Nothing on the board yet. Add today&apos;s reels above.</p>
      ) : (
        days.map(([label, dayItems]) => {
          const open = dayItems.filter((i) => !filmed[i.id]);
          const done = dayItems.filter((i) => filmed[i.id]);
          return (
            <section key={label} style={{ marginTop: 40 }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", borderBottom: "1px solid rgba(245,244,241,0.12)", paddingBottom: 8 }}>
                <h2 style={{ fontSize: 19 }}>{label}</h2>
                <span style={{ fontSize: 13, opacity: 0.65 }}>
                  {done.length}/{dayItems.length} filmed
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>{open.map(card)}</div>
              {done.length ? (
                <div style={{ marginTop: 18 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: GREEN, opacity: 0.8 }}>Filmed</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 10 }}>{done.map(card)}</div>
                </div>
              ) : null}
            </section>
          );
        })
      )}
    </div>
  );
}
