"use client";

import { useMemo, useState } from "react";

type Play = {
  league: string;
  market: string;
  legs: string[];
  odds: string;
  units: string;
  time: string;
  conf: string;
  tone: string;
};

type StrKey = Exclude<keyof Play, "legs">;

const DEFAULTS: Play = {
  league: "NBA",
  market: "Game total",
  legs: ["Over 224.5"],
  odds: "-110",
  units: "2",
  time: "7:02p",
  conf: "2",
  tone: "green",
};

// Internal slip-card tool. Enter a play (straight or parlay), watch the branded
// card render live, then post it to the members Discord. Password-gated server-side.
export function StudioForm() {
  const [f, setF] = useState<Play>(DEFAULTS);
  const [password, setPassword] = useState("");
  const [state, setState] = useState<"idle" | "posting" | "done" | "error">(
    "idle",
  );
  const [msg, setMsg] = useState("");

  const legCount = f.legs.filter((l) => l.trim()).length;
  const isParlay = legCount >= 2;

  const previewUrl = useMemo(() => {
    const qs = new URLSearchParams();
    qs.set("league", f.league);
    qs.set("market", f.market);
    qs.set("odds", f.odds);
    qs.set("units", f.units);
    qs.set("time", f.time);
    qs.set("conf", f.conf);
    qs.set("tone", f.tone);
    f.legs.filter((l) => l.trim()).forEach((l) => qs.append("legs", l));
    return `/api/slip?${qs.toString()}`;
  }, [f]);

  const up = (k: StrKey, v: string) => setF((s) => ({ ...s, [k]: v }));
  const setLeg = (i: number, v: string) =>
    setF((s) => ({ ...s, legs: s.legs.map((l, j) => (j === i ? v : l)) }));
  const addLeg = () =>
    setF((s) => (s.legs.length >= 6 ? s : { ...s, legs: [...s.legs, ""] }));
  const removeLeg = (i: number) =>
    setF((s) =>
      s.legs.length <= 1 ? s : { ...s, legs: s.legs.filter((_, j) => j !== i) },
    );

  // Slips route by type: blue accent -> #prediction-markets, else #sports-picks.
  const dest = f.tone === "blue" ? "#prediction-markets" : "#sports-picks";

  async function post() {
    if (state === "posting") return;
    setState("posting");
    setMsg("");
    try {
      const res = await fetch("/api/slip/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, legs: f.legs.filter((l) => l.trim()), password }),
      });
      const d = (await res.json()) as { ok?: boolean; error?: string };
      if (res.ok && d.ok) {
        setState("done");
        setMsg(`Posted to ${dest}.`);
      } else {
        setState("error");
        setMsg(d.error || "Failed to post.");
      }
    } catch {
      setState("error");
      setMsg("Network error. Try again.");
    }
  }

  return (
    <div className="studio">
      <div className="studio-form">
        <Field label="Slip type">
          <select
            className="studio-input"
            value={f.tone}
            onChange={(e) => up("tone", e.target.value)}
          >
            <option value="green">Sports · green · #sports-picks</option>
            <option value="blue">Prediction market · blue · #prediction-markets</option>
          </select>
        </Field>
        <p className="studio-dest">
          Recolors the card and posts to <strong>{dest}</strong>.
        </p>
        <Field label="League / event">
          <input
            className="studio-input"
            value={f.league}
            onChange={(e) => up("league", e.target.value)}
          />
        </Field>
        {!isParlay && (
          <Field label="Market">
            <input
              className="studio-input"
              value={f.market}
              onChange={(e) => up("market", e.target.value)}
            />
          </Field>
        )}

        {/* Legs: 1 = straight, 2+ = parlay (card switches automatically) */}
        <div className="studio-field">
          <span className="studio-field-label">
            {isParlay ? `Legs · ${legCount}-leg parlay` : "Pick"}
          </span>
          {f.legs.map((leg, i) => (
            <div key={i} className="studio-leg">
              <input
                className="studio-input"
                value={leg}
                onChange={(e) => setLeg(i, e.target.value)}
                placeholder={i === 0 ? "e.g. Celtics ML" : `Leg ${i + 1}`}
              />
              {f.legs.length > 1 && (
                <button
                  type="button"
                  className="studio-leg-x"
                  onClick={() => removeLeg(i)}
                  aria-label={`Remove leg ${i + 1}`}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          {f.legs.length < 6 && (
            <button type="button" className="studio-leg-add" onClick={addLeg}>
              + Add leg (parlay)
            </button>
          )}
        </div>

        <div className="studio-row">
          <Field label={isParlay ? "Parlay odds" : "Odds"}>
            <input
              className="studio-input"
              value={f.odds}
              onChange={(e) => up("odds", e.target.value)}
            />
          </Field>
          <Field label="Units">
            <input
              className="studio-input"
              value={f.units}
              onChange={(e) => up("units", e.target.value)}
            />
          </Field>
          <Field label="Time">
            <input
              className="studio-input"
              value={f.time}
              onChange={(e) => up("time", e.target.value)}
            />
          </Field>
        </div>
        <Field label="Confidence">
          <select
            className="studio-input"
            value={f.conf}
            onChange={(e) => up("conf", e.target.value)}
          >
            <option value="1">1 / Lean</option>
            <option value="2">2 / Solid</option>
            <option value="3">3 / Strong</option>
          </select>
        </Field>

        <div className="studio-post">
          <Field label="Studio password">
            <input
              type="password"
              className="studio-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="required to post"
            />
          </Field>
          <button
            type="button"
            className="btn btn-primary btn-lg studio-btn"
            onClick={post}
            disabled={state === "posting"}
          >
            {state === "posting" ? "Posting..." : `Post to ${dest}`}
          </button>
          {msg && (
            <p className={`studio-msg ${state === "error" ? "err" : "ok"}`}>{msg}</p>
          )}
        </div>
      </div>

      <div className="studio-preview">
        <div className="studio-preview-label">Live preview</div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={previewUrl} alt="Slip card preview" className="studio-img" />
        <a href={previewUrl} target="_blank" rel="noreferrer" className="studio-open">
          Open image ↗
        </a>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="studio-field">
      <span className="studio-field-label">{label}</span>
      {children}
    </label>
  );
}
