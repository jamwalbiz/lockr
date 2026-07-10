import { NextResponse } from "next/server";

// Reel-brief board API. Backed by Upstash Redis (connect it in Vercel: project ->
// Storage -> Upstash Redis; the integration injects the env vars). One hash key
// holds every item; the page groups them by day client-side.
//
// GET    -> { items: BriefItem[] }            (open; the page is unlisted)
// POST   -> add 1..8 items                    (gated by STUDIO_PASSWORD)
// PATCH  -> toggle done on one item by id     (open; harmless + JT needs zero friction)
// DELETE -> remove one item by id             (gated by STUDIO_PASSWORD)
//
// BriefItem: { id, url, note, addedAt, done, doneAt? }
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KEY = "briefs:items";

function kv() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url: url.replace(/\/$/, ""), token };
}

async function cmd(store: { url: string; token: string }, command: (string | number)[]) {
  const res = await fetch(store.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${store.token}`, "content-type": "application/json" },
    body: JSON.stringify(command),
    signal: AbortSignal.timeout(8000),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`kv ${command[0]} failed: ${res.status}`);
  const data = (await res.json()) as { result: unknown };
  return data.result;
}

type BriefItem = {
  id: string;
  url: string;
  note: string;
  addedAt: string;
  done: boolean;
  doneAt?: string;
};

async function readAll(store: { url: string; token: string }): Promise<BriefItem[]> {
  const flat = (await cmd(store, ["HGETALL", KEY])) as string[] | null;
  if (!flat || !Array.isArray(flat)) return [];
  const items: BriefItem[] = [];
  for (let i = 1; i < flat.length; i += 2) {
    try {
      items.push(JSON.parse(flat[i]) as BriefItem);
    } catch {
      // skip corrupt entries
    }
  }
  return items.sort((a, b) => (a.addedAt < b.addedAt ? 1 : -1));
}

const NOT_CONFIGURED = NextResponse.json(
  { error: "Storage not connected. In Vercel: project -> Storage -> Create -> Upstash Redis, then redeploy." },
  { status: 503 },
);

export async function GET() {
  const store = kv();
  if (!store) return NOT_CONFIGURED;
  try {
    return NextResponse.json({ items: await readAll(store) });
  } catch (err) {
    return NextResponse.json({ error: `Storage error: ${String(err).slice(0, 120)}` }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const store = kv();
  if (!store) return NOT_CONFIGURED;
  const expected = process.env.STUDIO_PASSWORD;
  if (!expected) {
    return NextResponse.json({ error: "STUDIO_PASSWORD is not set in Vercel env." }, { status: 503 });
  }
  let body: { password?: string; items?: { url?: string; note?: string }[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON." }, { status: 400 });
  }
  if (body.password !== expected) {
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }
  const clean = (body.items || [])
    .map((i) => ({ url: (i.url || "").trim().slice(0, 400), note: (i.note || "").trim().slice(0, 2000) }))
    .filter((i) => i.url || i.note)
    .slice(0, 8);
  if (!clean.length) {
    return NextResponse.json({ error: "Nothing to add." }, { status: 400 });
  }
  try {
    const now = new Date().toISOString();
    const added: BriefItem[] = clean.map((i) => ({
      id: crypto.randomUUID(),
      url: i.url,
      note: i.note,
      addedAt: now,
      done: false,
    }));
    for (const item of added) {
      await cmd(store, ["HSET", KEY, item.id, JSON.stringify(item)]);
    }
    return NextResponse.json({ ok: true, added: added.length });
  } catch (err) {
    return NextResponse.json({ error: `Storage error: ${String(err).slice(0, 120)}` }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const store = kv();
  if (!store) return NOT_CONFIGURED;
  let body: { id?: string; done?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON." }, { status: 400 });
  }
  if (!body.id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
  try {
    const raw = (await cmd(store, ["HGET", KEY, body.id])) as string | null;
    if (!raw) return NextResponse.json({ error: "Not found." }, { status: 404 });
    const item = JSON.parse(raw) as BriefItem;
    item.done = Boolean(body.done);
    item.doneAt = item.done ? new Date().toISOString() : undefined;
    await cmd(store, ["HSET", KEY, item.id, JSON.stringify(item)]);
    return NextResponse.json({ ok: true, item });
  } catch (err) {
    return NextResponse.json({ error: `Storage error: ${String(err).slice(0, 120)}` }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const store = kv();
  if (!store) return NOT_CONFIGURED;
  const expected = process.env.STUDIO_PASSWORD;
  let body: { id?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON." }, { status: 400 });
  }
  if (!expected || body.password !== expected) {
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }
  if (!body.id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
  try {
    await cmd(store, ["HDEL", KEY, body.id]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: `Storage error: ${String(err).slice(0, 120)}` }, { status: 500 });
  }
}
