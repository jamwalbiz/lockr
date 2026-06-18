// Track-record layer. The play log lives in content/plays.json (one entry per
// play JT posts; the future slip-card tool appends to it). This computes the
// public record shown on /results AND is meant to feed the home-page number, so
// there is ONE source of truth instead of scattered hardcoded stats.
//
// Server-only (reads the filesystem). Honest by construction: the record is
// computed from settled plays, never hardcoded. Win/loss/push only count once
// settled; pending plays prove "posted before the event" without claiming a
// result.
import fs from "node:fs";
import path from "node:path";

export type PlayStatus = "won" | "lost" | "push" | "pending";

export type Play = {
  date: string; // ISO yyyy-mm-dd
  league: string;
  market: string;
  pick: string;
  odds: string;
  units: number;
  status: PlayStatus;
  unitsResult: number; // realized +/- units; 0 for pending/push
  note?: string;
};

export type TrackRecord = {
  wins: number;
  losses: number;
  pushes: number;
  decided: number; // wins + losses (pushes excluded from win rate)
  settled: number; // wins + losses + pushes
  winRate: number; // 0-100, rounded
  netUnits: number; // sum of settled unitsResult
  roi: number; // netUnits / total staked on settled, as a percentage
  pendingCount: number;
};

const FILE = path.join(process.cwd(), "content/plays.json");

function readAll(): Play[] {
  try {
    if (!fs.existsSync(FILE)) return [];
    const raw = JSON.parse(fs.readFileSync(FILE, "utf8")) as {
      plays?: unknown;
    };
    const list = Array.isArray(raw.plays) ? raw.plays : [];
    return list
      .map((p) => p as Record<string, unknown>)
      .filter((p) => p && typeof p.date === "string")
      .map((p) => ({
        date: String(p.date),
        league: String(p.league ?? ""),
        market: String(p.market ?? ""),
        pick: String(p.pick ?? ""),
        odds: String(p.odds ?? ""),
        units: Number(p.units ?? 0),
        status: (["won", "lost", "push", "pending"].includes(String(p.status))
          ? String(p.status)
          : "pending") as PlayStatus,
        unitsResult: Number(p.unitsResult ?? 0),
        note: p.note ? String(p.note) : undefined,
      }));
  } catch {
    return [];
  }
}

/** All plays, newest first. */
export function getPlays(): Play[] {
  return readAll().sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function getSettledPlays(): Play[] {
  return getPlays().filter((p) => p.status !== "pending");
}

export function getPendingPlays(): Play[] {
  return getPlays().filter((p) => p.status === "pending");
}

/** Record computed from settled plays only. Empty-safe (all zeros). */
export function getTrackRecord(): TrackRecord {
  const plays = readAll();
  const settled = plays.filter((p) => p.status !== "pending");
  const wins = settled.filter((p) => p.status === "won").length;
  const losses = settled.filter((p) => p.status === "lost").length;
  const pushes = settled.filter((p) => p.status === "push").length;
  const decided = wins + losses;
  const netUnits = settled.reduce((s, p) => s + p.unitsResult, 0);
  const staked = settled.reduce((s, p) => s + p.units, 0);
  return {
    wins,
    losses,
    pushes,
    decided,
    settled: settled.length,
    winRate: decided > 0 ? Math.round((wins / decided) * 100) : 0,
    netUnits: Math.round(netUnits * 100) / 100,
    roi: staked > 0 ? Math.round((netUnits / staked) * 1000) / 10 : 0,
    pendingCount: plays.filter((p) => p.status === "pending").length,
  };
}
