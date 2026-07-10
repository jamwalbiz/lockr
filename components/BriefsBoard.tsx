"use client";

// Interactive reel-brief board. Reads /api/briefs, groups items by day (Pacific),
// checkbox on the left toggles filmed; filmed items gray out + strike through and
// sink into a "Filmed" group under their day. "Add reels" is collapsed by default
// and gated by the shared studio password (remembered in localStorage after once).
import { useCallback, useEffect, useMemo, useState } from "react";

const GREEN = "#00ff85";

type BriefItem = {
  id: string;
  url: string;
  note: string;
  addedAt: string;
  done: boolean;
  doneAt?: string;
};

type Draft = { url: string; note: string };
const EMPTY_DRAFTS: Draft[] = [
  { url: "", note: "" },
  { url: "", note: "" },
  { url: "", note: "" },
  { url: "", note: "" },
];

function dayLabel(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function timeLabel(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function BriefsBoard() {
  const [items, setItems] = useState<BriefItem[] | null>(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [drafts, setDrafts] = useState<Draft[]>(EMPTY_DRAFTS);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState("");

  useEffect(() => {
    setPassword(localStorage.getItem("lockr-studio-pw") || "");
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

  const toggle = useCallback(
    async (id: string, done: boolean) => {
      // optimistic
      setItems((prev) => (prev ? prev.map((i) => (i.id === id ? { ...i, done } : i)) : prev));
      try {
        const res = await fetch("/api/briefs", {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ id, done }),
        });
        if (!res.ok) load(); // revert to server truth
      } catch {
        load();
      }
    },
    [load],
  );

  const submit = useCallback(async () => {
    const toAdd = drafts.filter((d) => d.url.trim() || d.note.trim());
    if (!toAdd.length) {
      setFormMsg("Paste at least one reel link.");
      return;
    }
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
        localStorage.setItem("lockr-studio-pw", password);
        setDrafts(EMPTY_DRAFTS);
        setFormMsg(`Added ${data.added}.`);
        load();
      }
    } catch {
      setFormMsg("Network error, try again.");
    } finally {
      setSubmitting(false);
    }
  }, [drafts, password, load]);

  const days = useMemo(() => {
    if (!items) return [];
    const map = new Map<string, BriefItem[]>();
    for (const item of items) {
      const key = dayLabel(item.addedAt);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return Array.from(map.entries());
  }, [items]);

  const card = (item: BriefItem) => (
    <div
      key={item.id}
      style={{
        display: "flex",
        gap: 14,
        alignItems: "flex-start",
        border: "1px solid rgba(245,244,241,0.12)",
        borderRadius: 14,
        padding: "14px 16px",
        background: item.done ? "rgba(245,244,241,0.02)" : "rgba(245,244,241,0.04)",
        opacity: item.done ? 0.45 : 1,
      }}
    >
      <input
        type="checkbox"
        checked={item.done}
        onChange={(e) => toggle(item.id, e.target.checked)}
        aria-label={item.done ? "Mark as not filmed" : "Mark as filmed"}
        style={{ width: 22, height: 22, marginTop: 2, accentColor: GREEN, flexShrink: 0, cursor: "pointer" }}
      />
      <div style={{ minWidth: 0, textDecoration: item.done ? "line-through" : "none" }}>
        {item.url ? (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: GREEN, fontWeight: 600, fontSize: 15, wordBreak: "break-all" }}
          >
            {item.url.replace(/^https?:\/\/(www\.)?/, "").slice(0, 60)}
          </a>
        ) : null}
        {item.note ? (
          <p style={{ marginTop: item.url ? 6 : 0, fontSize: 14.5, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{item.note}</p>
        ) : null}
        <div style={{ marginTop: 6, fontSize: 12, opacity: 0.6 }}>added {timeLabel(item.addedAt)}</div>
      </div>
    </div>
  );

  return (
    <div>
      {/* add form */}
      <div style={{ marginTop: 28 }}>
        <button
          onClick={() => setShowForm((s) => !s)}
          style={{
            border: `1px solid ${GREEN}`,
            color: GREEN,
            background: "transparent",
            borderRadius: 999,
            padding: "9px 20px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {showForm ? "Close" : "+ Add reels"}
        </button>

        {showForm ? (
          <div style={{ marginTop: 16, border: "1px solid rgba(245,244,241,0.12)", borderRadius: 14, padding: 16 }}>
            {drafts.map((d, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                <input
                  placeholder={`Reel link ${i + 1}`}
                  value={d.url}
                  onChange={(e) => setDrafts((p) => p.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))}
                  style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(245,244,241,0.2)", background: "transparent", color: "inherit", fontSize: 14 }}
                />
                <input
                  placeholder="What it is / notes for JT (optional)"
                  value={d.note}
                  onChange={(e) => setDrafts((p) => p.map((x, j) => (j === i ? { ...x, note: e.target.value } : x)))}
                  style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(245,244,241,0.12)", background: "transparent", color: "inherit", fontSize: 14 }}
                />
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <input
                type="password"
                placeholder="Studio password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(245,244,241,0.2)", background: "transparent", color: "inherit", fontSize: 14, flex: 1, minWidth: 160 }}
              />
              <button
                onClick={submit}
                disabled={submitting}
                style={{
                  background: GREEN,
                  color: "#0a0a0c",
                  border: "none",
                  borderRadius: 999,
                  padding: "10px 24px",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  opacity: submitting ? 0.6 : 1,
                }}
              >
                {submitting ? "Adding…" : "Add to board"}
              </button>
            </div>
            {formMsg ? <p style={{ marginTop: 10, fontSize: 13, opacity: 0.85 }}>{formMsg}</p> : null}
          </div>
        ) : null}
      </div>

      {/* board */}
      {items === null ? (
        <p style={{ marginTop: 36, opacity: 0.7 }}>Loading the board…</p>
      ) : error ? (
        <p style={{ marginTop: 36, opacity: 0.85, lineHeight: 1.5 }}>{error}</p>
      ) : days.length === 0 ? (
        <p style={{ marginTop: 36, opacity: 0.7 }}>Nothing on the board yet. Today&apos;s drop lands here.</p>
      ) : (
        days.map(([label, dayItems]) => {
          const open = dayItems.filter((i) => !i.done);
          const filmed = dayItems.filter((i) => i.done);
          return (
            <section key={label} style={{ marginTop: 40 }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", borderBottom: "1px solid rgba(245,244,241,0.12)", paddingBottom: 8 }}>
                <h2 style={{ fontSize: 19 }}>{label}</h2>
                <span style={{ fontSize: 13, opacity: 0.65 }}>
                  {filmed.length}/{dayItems.length} filmed
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>{open.map(card)}</div>
              {filmed.length ? (
                <div style={{ marginTop: 18 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: GREEN, opacity: 0.8 }}>
                    Filmed
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 10 }}>{filmed.map(card)}</div>
                </div>
              ) : null}
            </section>
          );
        })
      )}
    </div>
  );
}
