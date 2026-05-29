// POST /api/apply — Inner Circle application intake.
// Validates the form, drops anything that looks like a bot (honeypot),
// then emails JT at hello@joinlockr.com via Resend's REST API. Reply-To
// is set to the applicant so JT can just hit reply.
//
// Env vars:
//   RESEND_API_KEY      — required. Get one at https://resend.com (free tier).
//   APPLY_FROM_EMAIL    — optional override. Defaults to onboarding@resend.dev
//                         (Resend's no-domain-verification sender). Set to
//                         e.g. "Lockr <apply@joinlockr.com>" once joinlockr.com
//                         is verified in Resend for better deliverability.
//   APPLY_TO_EMAIL      — optional override. Defaults to hello@joinlockr.com.

import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// All five user-facing strings must be present and non-empty (after trim).
// `sports` and `useCase` are optional. Length caps prevent abuse and runaway
// emails. Numbers chosen wide enough to never bite a real applicant.
const FIELD_LIMITS = {
  name: 120,
  email: 200,
  age: 3,
  bankroll: 60,
  why: 2500,
  useCase: 2500,
} as const;

type ApplyPayload = {
  name?: string;
  email?: string;
  age?: string;
  bankroll?: string;
  sports?: string[];
  why?: string;
  useCase?: string;
  honeypot?: string;
};

function clean(s: unknown, max: number): string {
  if (typeof s !== "string") return "";
  return s.trim().slice(0, max);
}

export async function POST(req: Request) {
  let body: ApplyPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Honeypot: bots fill every input including the hidden one. Pretend
  // success so the bot moves on, but don't fire an email or analytics.
  if (typeof body.honeypot === "string" && body.honeypot.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, FIELD_LIMITS.name);
  const email = clean(body.email, FIELD_LIMITS.email);
  const age = clean(body.age, FIELD_LIMITS.age);
  const bankroll = clean(body.bankroll, FIELD_LIMITS.bankroll);
  const why = clean(body.why, FIELD_LIMITS.why);
  const useCase = clean(body.useCase, FIELD_LIMITS.useCase);
  const sports = Array.isArray(body.sports)
    ? body.sports
        .filter((s): s is string => typeof s === "string")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 30)
    : [];

  // Required-field validation. Errors are user-facing — keep them tight.
  if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 });
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }
  if (!age || !/^\d{2,3}$/.test(age) || +age < 18 || +age > 120) {
    return NextResponse.json({ error: "Please enter a valid age (18+)." }, { status: 400 });
  }
  if (!bankroll) {
    return NextResponse.json({ error: "Please pick a bankroll range." }, { status: 400 });
  }
  if (!why) {
    return NextResponse.json({ error: "Tell us why you want to join." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.APPLY_FROM_EMAIL ?? "Lockr Apply <onboarding@resend.dev>";
  const to = process.env.APPLY_TO_EMAIL ?? "hello@joinlockr.com";

  if (!apiKey) {
    // Honest failure: tell the user, log the cause so JT sees it in Vercel logs.
    console.error("[apply] missing RESEND_API_KEY");
    return NextResponse.json(
      { error: "Application intake is temporarily unavailable. Try again shortly." },
      { status: 503 },
    );
  }

  const subject = `[Lockr IC] ${name} · ${bankroll}`;
  const text = formatPlainText({ name, email, age, bankroll, sports, why, useCase });
  const html = formatHtml({ name, email, age, bankroll, sports, why, useCase });

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject,
        text,
        html,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[apply] Resend send failed", res.status, detail);
      return NextResponse.json(
        { error: "Couldn't deliver your application. Try again in a minute." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("[apply] Resend network error", err);
    return NextResponse.json(
      { error: "Couldn't reach the intake server. Try again in a minute." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}

type FormattedFields = {
  name: string;
  email: string;
  age: string;
  bankroll: string;
  sports: string[];
  why: string;
  useCase: string;
};

function formatPlainText(f: FormattedFields): string {
  return [
    "New Inner Circle application",
    "",
    `Name:     ${f.name}`,
    `Email:    ${f.email}`,
    `Age:      ${f.age}`,
    `Bankroll: ${f.bankroll}`,
    `Sports:   ${f.sports.length ? f.sports.join(", ") : "(none selected)"}`,
    "",
    "Why do you want to join Inner Circle?",
    f.why,
    "",
    "How will you use the access?",
    f.useCase || "(left blank)",
    "",
    "---",
    "Submitted from joinlockr.com /apply",
  ].join("\n");
}

// Plain HTML — readable in any mail client, no external assets. Single-column,
// dark-on-light so it survives forwarding into other tools (Notion etc.).
function formatHtml(f: FormattedFields): string {
  const esc = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  const sportsLabel = f.sports.length
    ? f.sports.map(esc).join(", ")
    : "<em>(none selected)</em>";
  return `<!doctype html>
<html><body style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;color:#111;max-width:640px;margin:0 auto;padding:24px;">
  <h2 style="margin:0 0 16px;">New Inner Circle application</h2>
  <table style="border-collapse:collapse;width:100%;font-size:14px;">
    <tr><td style="padding:6px 12px 6px 0;color:#666;width:120px;">Name</td><td style="padding:6px 0;font-weight:600;">${esc(f.name)}</td></tr>
    <tr><td style="padding:6px 12px 6px 0;color:#666;">Email</td><td style="padding:6px 0;"><a href="mailto:${esc(f.email)}" style="color:#0a66c2;">${esc(f.email)}</a></td></tr>
    <tr><td style="padding:6px 12px 6px 0;color:#666;">Age</td><td style="padding:6px 0;">${esc(f.age)}</td></tr>
    <tr><td style="padding:6px 12px 6px 0;color:#666;">Bankroll</td><td style="padding:6px 0;font-weight:600;">${esc(f.bankroll)}</td></tr>
    <tr><td style="padding:6px 12px 6px 0;color:#666;">Sports</td><td style="padding:6px 0;">${sportsLabel}</td></tr>
  </table>
  <h3 style="margin:24px 0 8px;font-size:14px;color:#666;">Why join Inner Circle?</h3>
  <p style="white-space:pre-wrap;margin:0 0 16px;font-size:14px;line-height:1.5;">${esc(f.why)}</p>
  <h3 style="margin:24px 0 8px;font-size:14px;color:#666;">How will you use the access?</h3>
  <p style="white-space:pre-wrap;margin:0 0 16px;font-size:14px;line-height:1.5;">${esc(f.useCase) || "<em>(left blank)</em>"}</p>
  <hr style="border:none;border-top:1px solid #eee;margin:32px 0 16px;">
  <p style="margin:0;font-size:12px;color:#888;">Submitted from joinlockr.com /apply · Reply to this email to respond to the applicant directly.</p>
</body></html>`;
}
