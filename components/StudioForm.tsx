"use client";

import { useMemo, useState } from "react";

type Leg = { tag: string; pick: string };
type Play = {
  league: string;
  market: string;
  legs: Leg[];
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
  legs: [{ tag: "", pick: "Over 224.5" }],
  odds: "-110",
  units: "2",
  time: "7:02p",
  conf: "2",
  tone: "green",
};

// Internal slip-card tool. Enter a play (straight or parlay, single- or
// mixed-league), watch the branded card render live, then post it to the
// members Discord. Password-gated server-side.
export function StudioForm() {
  const [f, setF] = useState<Play>(DEFAULTS);
  const [password, setPassword] = useState("");
  const [state, setState] = useState<"idle" | "posting" | "done" | "error">(
    "idle",
  );
  const [msg, setMsg] = useState("");

  const cleanLegs = f.legs.filter((l) => l.pick.trim());
  // A second leg row means we're building a parlay; the form switches layout
  // immediately (hides League/Market, shows per-leg tags). The card still
  // renders from the legs that actually have a pick.
  const isParlay = f.legs.length >= 2;

  const previewUrl = useMemo(() => {
    const qs = new URLSearchParams();
    qs.set("league", f.league);
    qs.set("market", f.market);
    qs.set("odds", f.odds);
    qs.set("units", f.units);
    qs.set("time", f.time);
    qs.set("conf", f.conf);
    qs.set("tone", f.tone);
    f.legs
      .filter((l) => l.pick.trim())
      .forEach((l) => {
        qs.append("legs", l.pick);
        qs.append("legtags", l.tag);
      });
    return `/api/slip?${qs.toString()}`;
  }, [f]);

  const up = (k: StrKey, v: string) => setF((s) => ({ ...s, [k]: v }));
  const setLeg = (i: number, field: keyof Leg, v: string) =>
    setF((s) => ({
      ...s,
      legs: s.legs.map((l, j) => (j === i ? { ...l, [field]: v } : l)),
    }));
  const addLeg = () =>
    setF((s) =>
      s.legs.length >= 6 ? s : { ...s, legs: [...s.legs, { tag: "", pick: "" }] },
    );
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
        body: JSON.stringify({ ...f, legs: cleanLegs, password }),
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
        {!isParlay && (
          <Field label="League / event">
            <input
              className="studio-input"
              value={f.league}
              onChange={(e) => up("league", e.target.value)}
            />
          </Field>
        )}
        {!isParlay && (
          <Field label="Market">
            <input
              className="studio-input"
              value={f.market}
              onChange={(e) => up("market", e.target.value)}
            />
          </Field>
        )}

        {/* Legs: 1 = straight, 2+ = parlay. In parlay mode each leg gets an
            optional league tag so mixed-league parlays render cleanly. */}
        <div className="studio-field">
          <span className="studio-field-label">
            {isParlay ? "Legs · parlay" : "Pick"}
          </span>
          {f.legs.map((leg, i) => (
            <div key={i} className="studio-leg">
              {isParlay && (
                <input
                  className="studio-input studio-leg-tag"
                  value={leg.tag}
                  onChange={(e) => setLeg(i, "tag", e.target.value)}
                  placeholder="NBA"
                  aria-label={`Leg ${i + 1} league`}
                />
              )}
              <input
                className="studio-input"
                value={leg.pick}
                onChange={(e) => setLeg(i, "pick", e.target.value)}
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
          {isParlay && (
            <span className="studio-hint">
              The card titles itself from these tags: all the same → “NBA
              PARLAY”, different → “MIXED PARLAY”, blank → “PARLAY”.
            </span>
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
