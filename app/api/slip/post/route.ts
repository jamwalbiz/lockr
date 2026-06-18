import { NextResponse } from "next/server";

// Posts a slip card to the right members Discord channel via webhook, routed by
// play type: tone "blue" = prediction market -> #prediction-markets, anything
// else = sports -> #sports-picks. Password-gated (STUDIO_PASSWORD) so only JT can
// post. The slip image is embedded by URL (Discord fetches it from /api/slip), so
// no file upload is needed.
//
// JT setup:
//   1. In EACH members channel (#sports-picks and #prediction-markets):
//      Edit Channel -> Integrations -> Webhooks -> New Webhook -> Copy URL.
//   2. Add env vars in Vercel, then redeploy:
//        DISCORD_WEBHOOK_SPORTS   = #sports-picks webhook
//        DISCORD_WEBHOOK_MARKETS  = #prediction-markets webhook
//        STUDIO_PASSWORD          = your post password
//      (DISCORD_WEBHOOK_URL still works as a single-channel fallback for either
//       type if a type-specific webhook isn't set.)
export const runtime = "nodejs";

const BASE = "https://joinlockr.com";

export async function POST(req: Request) {
  let body: Record<string, string> = {};
  try {
    body = (await req.json()) as Record<string, string>;
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  const password = process.env.STUDIO_PASSWORD;
  // Route by play type: blue accent = prediction market, else sports. Each maps
  // to its own channel webhook; DISCORD_WEBHOOK_URL is a single-channel fallback.
  const isMarket = body.tone === "blue";
  const fallback = process.env.DISCORD_WEBHOOK_URL;
  const webhook = isMarket
    ? process.env.DISCORD_WEBHOOK_MARKETS || fallback
    : process.env.DISCORD_WEBHOOK_SPORTS || fallback;

  if (!password || !webhook) {
    const missing = isMarket ? "DISCORD_WEBHOOK_MARKETS" : "DISCORD_WEBHOOK_SPORTS";
    return NextResponse.json(
      {
        ok: false,
        error: `Posting is not configured yet. Set STUDIO_PASSWORD and ${missing} (or DISCORD_WEBHOOK_URL).`,
      },
      { status: 503 },
    );
  }
  if (body.password !== password) {
    return NextResponse.json({ ok: false, error: "Wrong password." }, { status: 401 });
  }

  const fields = ["league", "market", "pick", "odds", "units", "time", "conf", "tone"];
  const qs = new URLSearchParams();
  for (const f of fields) if (body[f]) qs.set(f, body[f]);
  const slipUrl = `${BASE}/api/slip?${qs.toString()}`;

  const desc = `**${body.league || ""} · ${body.market || ""}**\n${body.pick || ""}  ·  ${body.odds || ""}  ·  ${body.units || ""}u`;

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Lockr",
        embeds: [
          {
            color: 0x00ff85,
            description: desc,
            image: { url: slipUrl },
          },
        ],
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      const detail = await res.text();
      console.error("[slip/post] Discord error", res.status, detail.slice(0, 200));
      return NextResponse.json(
        { ok: false, error: "Discord rejected the post." },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true, slipUrl });
  } catch (err) {
    console.error("[slip/post] request failed", err);
    return NextResponse.json(
      { ok: false, error: "Could not reach Discord. Try again." },
      { status: 502 },
    );
  }
}
