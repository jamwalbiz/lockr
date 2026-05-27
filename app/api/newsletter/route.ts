// POST /api/newsletter — captures footer newsletter signups into Beehiiv.
// Disallowed in robots.txt; not indexed.
import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let email: string;
  try {
    const body = await req.json();
    email = typeof body?.email === "string" ? body.email.trim() : "";
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  const apiKey = process.env.BEEHIIV_API_KEY;
  const pubId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !pubId) {
    // Honest failure: tell the user, log the cause.
    console.error("[newsletter] missing BEEHIIV env vars");
    return NextResponse.json(
      { error: "Newsletter signup is temporarily unavailable." },
      { status: 503 },
    );
  }

  try {
    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          reactivate_existing: true,
          send_welcome_email: true,
          utm_source: "joinlockr_footer",
        }),
      },
    );

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("[newsletter] beehiiv responded", res.status, errText);
      return NextResponse.json(
        { error: "Couldn't subscribe right now. Try again in a moment." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[newsletter] network error", err);
    return NextResponse.json(
      { error: "Couldn't reach the newsletter service. Try again." },
      { status: 502 },
    );
  }
}
