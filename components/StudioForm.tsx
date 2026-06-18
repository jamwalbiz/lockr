"use client";

import { useMemo, useState } from "react";

type Play = {
  league: string;
  market: string;
  pick: string;
  odds: string;
  units: string;
  time: string;
  conf: string;
  tone: string;
};

const DEFAULTS: Play = {
  league: "NBA",
  market: "Game total",
  pick: "Over 224.5",
  odds: "-110",
  units: "2",
  time: "7:02p",
  conf: "2",
  tone: "green",
};

// Internal slip-card tool. Enter a play, watch the branded card render live, then
// post it to the members Discord. The post is password-gated server-side.
export function StudioForm() {
  const [f, setF] = useState<Play>(DEFAULTS);
  const [password, setPassword] = useState("");
  const [state, setState] = useState<"idle" | "posting" | "done" | "error">(
    "idle",
  );
  const [msg, setMsg] = useState("");

  const previewUrl = useMemo(() => {
    const qs = new URLSearchParams();
    (Object.entries(f) as [string, string][]).forEach(([k, v]) => qs.set(k, v));
    return `/api/slip?${qs.toString()}`;
  }, [f]);

  const up = (k: keyof Play, v: string) => setF((s) => ({ ...s, [k]: v }));

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
        body: JSON.stringify({ ...f, password }),
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
        <Field label="Market">
          <input
            className="studio-input"
            value={f.market}
            onChange={(e) => up("market", e.target.value)}
          />
        </Field>
        <Field label="Pick">
          <input
            className="studio-input"
            value={f.pick}
            onChange={(e) => up("pick", e.target.value)}
          />
        </Field>
        <div className="studio-row">
          <Field label="Odds">
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
