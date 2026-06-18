import { NextResponse } from "next/server";

// Email-capture endpoint for the free "Prediction Markets 101" lead magnet.
// Subscribes the email to Kit (ConvertKit), which owns delivery of the guide
// and any welcome/nurture sequence. This is the owned-audience funnel: free
// education in exchange for an email; the actual daily picks stay paid.
//
// JT setup (then it captures for real):
//   1. Create a Kit (kit.com) account + a Form (e.g. "Prediction Markets 101").
//   2. In the form's automation, send a welcome email delivering the guide link
//      (https://joinlockr.com/blog/prediction-markets-101).
//   3. Add two env vars in Vercel: KIT_API_KEY and KIT_FORM_ID.
// Until those exist, the form still works in the UI (returns ok) but no email is
// stored, so nothing looks broken while wiring it up.

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let email = "";
  try {
    const body = (await req.json()) as { email?: unknown; website?: unknown };
    // Honeypot: bots fill hidden "website"; humans never do.
    if (typeof body.website === "string" && body.website.trim() !== "") {
      return NextResponse.json({ ok: true });
    }
    email = String(body.email ?? "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Enter a valid email." },
      { status: 422 },
    );
  }

  const apiKey = process.env.KIT_API_KEY;
  const formId = process.env.KIT_FORM_ID;

  // Not wired yet: don't break the UX while JT sets up Kit.
  if (!apiKey || !formId) {
    console.warn("[lead] Kit not configured (KIT_API_KEY/KIT_FORM_ID missing).");
    return NextResponse.json({ ok: true, configured: false });
  }

  try {
    const res = await fetch(
      `https://api.kit.com/v4/forms/${formId}/subscribers`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Kit-Api-Key": apiKey,
        },
        body: JSON.stringify({ email_address: email }),
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!res.ok) {
      const detail = await res.text();
      console.error("[lead] Kit error", res.status, detail.slice(0, 300));
      return NextResponse.json(
        { ok: false, error: "Could not subscribe. Try again." },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true, configured: true });
  } catch (err) {
    console.error("[lead] Kit request failed", err);
    return NextResponse.json(
      { ok: false, error: "Could not subscribe. Try again." },
      { status: 502 },
    );
  }
}
