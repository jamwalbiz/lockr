import { NextResponse } from "next/server";
import { put, list } from "@vercel/blob";

// Reel-board API backed by Vercel Blob (free, no plan to pick). The whole board is
// one small public JSON doc; submissions rewrite it. JT's "filmed" check-offs are
// NOT here — they live in his browser's localStorage (per-device), so this only
// stores the reels themselves.
//
// GET    -> { items }                     (open; the page is unlisted)
// POST   -> add up to 8 reels             (gated by STUDIO_PASSWORD)
// DELETE -> remove one reel by id         (gated by STUDIO_PASSWORD)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KEY = "reel-board.json";

type ReelItem = { id: string; url: string; note: string; addedAt: string };

// The store is reachable either via a static read-write token OR via Vercel's
// OIDC connection (which sets BLOB_STORE_ID and injects VERCEL_OIDC_TOKEN at
// runtime; the @vercel/blob SDK uses those automatically when no static token
// is present). Accept either so an OIDC-only connection isn't wrongly blocked.
function hasStore() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

async function readItems(): Promise<ReelItem[]> {
  const { blobs } = await list({ prefix: KEY, limit: 1 });
  const blob = blobs.find((b) => b.pathname === KEY);
  if (!blob) return [];
  const res = await fetch(blob.url, { cache: "no-store" });
  if (!res.ok) return [];
  const data = (await res.json()) as { items?: ReelItem[] };
  return Array.isArray(data.items) ? data.items : [];
}

async function writeItems(items: ReelItem[]) {
  await put(KEY, JSON.stringify({ items }), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0, // mutable doc — don't let the CDN serve a stale board
  });
}

const NOT_CONNECTED = NextResponse.json(
  { error: "Storage not connected yet. In Vercel: project -> Storage -> Blob -> Create (it's free, no plan), then redeploy." },
  { status: 503 },
);

export async function GET() {
  if (!hasStore()) return NOT_CONNECTED;
  try {
    const items = (await readItems()).sort((a, b) => (a.addedAt < b.addedAt ? 1 : -1));
    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json({ error: `Storage error: ${String(err).slice(0, 120)}` }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!hasStore()) return NOT_CONNECTED;
  const expected = process.env.STUDIO_PASSWORD;
  if (!expected) return NextResponse.json({ error: "STUDIO_PASSWORD is not set in Vercel env." }, { status: 503 });

  let body: { password?: string; items?: { url?: string; note?: string }[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON." }, { status: 400 });
  }
  if (body.password !== expected) return NextResponse.json({ error: "Wrong password." }, { status: 401 });

  const clean = (body.items || [])
    .map((i) => ({ url: (i.url || "").trim().slice(0, 400), note: (i.note || "").trim().slice(0, 2000) }))
    .filter((i) => i.url || i.note)
    .slice(0, 8);
  if (!clean.length) return NextResponse.json({ error: "Nothing to add." }, { status: 400 });

  try {
    const now = new Date().toISOString();
    const existing = await readItems();
    const added: ReelItem[] = clean.map((i) => ({
      id: crypto.randomUUID(),
      url: i.url,
      note: i.note,
      addedAt: now,
    }));
    await writeItems([...existing, ...added]);
    return NextResponse.json({ ok: true, added: added.length });
  } catch (err) {
    return NextResponse.json({ error: `Storage error: ${String(err).slice(0, 120)}` }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!hasStore()) return NOT_CONNECTED;
  const expected = process.env.STUDIO_PASSWORD;
  let body: { id?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON." }, { status: 400 });
  }
  if (!expected || body.password !== expected) return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  if (!body.id) return NextResponse.json({ error: "Missing id." }, { status: 400 });

  try {
    const items = (await readItems()).filter((i) => i.id !== body.id);
    await writeItems(items);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: `Storage error: ${String(err).slice(0, 120)}` }, { status: 500 });
  }
}
