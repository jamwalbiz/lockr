# Lockr

Premium subscription product selling daily sports betting picks and prediction-market plays. Marketing site for **joinlockr.com**.

Built by JT (Jairo Tovar) and the Lockr team.

---

## Stack

- **Next.js 16** (App Router, Turbopack)
- **Tailwind v4** + design tokens in `app/globals.css`
- **TypeScript 5**
- **next/font** for Inter + JetBrains Mono
- **@vercel/analytics** for cookie-less pageviews
- Hosted on **Vercel**

## Dev setup

Node 20.9+ required. We use **24.16.0** via nvm.

```bash
nvm use 24.16.0   # or: nvm install 24.16.0
npm install
npm run dev       # default port 3001
```

The launch config at `~/.claude/launch.json` runs this on port 3001 so it doesn't collide with curb-cleans on 3000.

## File map

```
app/
  page.tsx                 # / (home — 13 sections)
  pricing/page.tsx         # /pricing
  about/page.tsx           # /about
  apply/                   # /apply (Inner Circle application)
  checkout/                # /checkout (4-step flow)
  terms/                   #   ─┐
  privacy/                 #    ├─ Legal stubs (DRAFT — pending counsel review)
  disclaimers/             #    │
  responsible-gaming/      #   ─┘
  not-found.tsx            # branded 404
  error.tsx                # branded 500 / error boundary
  icon.tsx                 # favicon (next/og)
  apple-icon.tsx           # apple touch icon
  opengraph-image.tsx      # 1200×630 OG card
  robots.ts
  sitemap.ts
  layout.tsx               # site chrome (nav, footer, popups)
  globals.css              # design tokens + ported component styles

components/
  Nav.tsx                  # nav + mobile hamburger + scroll state
  Footer.tsx               # footer + newsletter capture
  MobileCta.tsx            # sticky bottom CTA (≤768px only)
  LanguageToggle.tsx       # 8-locale UI (translation pipeline deferred)
  SocialProofPopups.tsx    # bottom-left rotating popups
  PricingCards.tsx         # cadence toggle, IC application gate
  Faq.tsx                  # accordion
  NewsletterForm.tsx       # footer email capture

lib/
  copy.ts                  # static copy / IC_STATUS / cadence-keyed pricing
  faq.tsx                  # FAQ items (with JSX rendering + plain-text for JSON-LD)
  testimonials.ts          # marquee rows
  betslips.ts              # bet slip gallery data
```

## Integration seams

Currently wired (live in production):

| Seam | Wire | Env var | Status |
|---|---|---|---|
| Payments + subscription billing | Whop hosted checkout (`whop.com/checkout/<plan_id>`) | none on our side — plan IDs in `lib/copy.ts` | live |
| Payment → Discord role | Whop Discord app + Wbot | none on our side — configured in Whop dashboard | live |
| IC application | Client-side form → `@vercel/analytics` event → direct Whop checkout link | none — fully client-side, no per-submit email | live |

Still TODO (pre-launch checklist):

| Item | Owner |
|---|---|
| Whop tax + bank verification (KYC) | JT |
| Discord channel permissions (gate paid channels to roles) | JT |
| Founder portrait — real photo | JT shoots |
| VSL video — Wistia embed | JT records |
| Error reporting (Sentry / Highlight) | Optional, pick before launch |
| Live unit count / win rate (currently fabricated) | Wire Whop API + Discord webhook stream post-launch |

See `~/Downloads/Lockr_Full_Package/lockr_launch_checklist.md` for the full operational launch sequence.

## Deferred per handoff brief

- **No `/track` page** — "Discord timestamps ARE the record." See decision in `lockr_handoff_brief.md`.
- **No live tracker chart** — static SVG only on the home page.
- **No V2 dashboard** — `lockr_dashboard.html` is the spec for later, build when MRR > ~$30K.

## Deploy

Vercel + GitHub. Default Next.js settings. No env vars needed for the initial deploy (placeholders only). Add env vars at the seams above as integrations come online.

DNS: `joinlockr.com` → Vercel (records issued in project settings).

## Brand

Tokens live in `app/globals.css` (`:root` + Tailwind `@theme`):

- Background: `#0A0A0B`
- Elevated: `#141416` / `#1B1B1E`
- Text: `#F5F4F1` / mute `#8B8B85` / dim `#5C5C58`
- Accent green: `#00FF85`
- Gold (Inner Circle): `#C9A76A`
- Danger: `#FF4D4D`
- Blue: `#4A9EFF`

Typography: Inter (display + body), JetBrains Mono (numbers + data).
