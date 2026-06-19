# Lockr distribution — @joinlockr auto-poster

How the @joinlockr Instagram feed runs itself, and the one-time setup to turn on
fully-hands-off posting. **All the code is already built and verified** — your part
is ~20 minutes of clicking in two dashboards (Instagram + GitHub). No coding.

---

## What it does (already built)

Once a day, on GitHub's servers (no computer of yours involved):

1. **Reads what's actually viral right now** — pulls the biggest-volume markets on
   Polymarket + Kalshi (volume = virality) plus fresh news headlines, as real,
   verified numbers.
2. **Writes the post** — Claude turns the best 2 stories into chyron-style news
   cards + captions, grounded in those real numbers (it cannot make numbers up; a
   banned-phrase filter blocks "guaranteed", income claims, etc.).
3. **Renders the image** — a branded 1080×1350 JPEG via `joinlockr.com/api/intel-card`
   (giant number, one green accent, an on-brand background picked by topic —
   stadium for World Cup, falling money for big wins, etc. All abstract art, no real
   people/teams/logos, so it's safe to run unattended).
4. **Ships it** — auto-posts straight to @joinlockr, and (if a Discord webhook is
   set) drops a copy in your Discord as an audit log of what went out.

You stay in control: a kill-switch pauses auto-post to "review-first" anytime, and
any post that fails to publish makes the run go red and emails you.

---

## The two switches

| You want… | Do this |
|---|---|
| **Fully hands-off** (posts go straight to IG) | Add the two IG secrets below. This is the default once they exist. |
| **Review-first** (draft to Discord, you tap post) | Add repo **Variable** `INTEL_AUTOPOST` = `0`. Delete it (or set `1`) to go live. |
| **Pause everything** | Disable the "Auto intel feed" workflow in the repo's Actions tab. |

**Recommended:** run review-first for ~2 weeks (`INTEL_AUTOPOST=0`) so you can see
what it drafts, then delete that variable to go fully hands-off.

---

## One-time setup (≈20 min, no coding)

> The code that posts to Instagram is **already done and tested** (commit history /
> `scripts/generate-intel.mjs`, `app/api/intel-card/route.tsx`). You only do the
> account + token steps below.

### 1. Switch @joinlockr to a Business account (in the Instagram phone app)
Only Professional accounts can post via the API. In the Instagram app, logged in as
@joinlockr: tap your profile pic → top-right menu → **Settings and activity** →
**Account type and tools** → **Switch to professional account** → **Business** → pick
a category (e.g. *Media/News Company*). When it offers to **Connect to Facebook**,
tap **Skip** — you do **not** need a Facebook Page. (Note: a professional account is
forced public.)

### 2. Create a Meta app + add Instagram
Go to **developers.facebook.com/apps** and log in (your personal Facebook login is
fine — it just owns the app). **Create app** → use case **Other** → type **Business**
→ name it `Lockr Auto-Poster` → Create. On the dashboard, under **Add products** find
**Instagram** → **Set up**. In the left nav open **Instagram → API setup with
Instagram login** (the *Instagram* login one, **not** the Facebook login one).
Leave the app in **Development mode** — for posting to an account you own, that's all
you need: **no App Review, no Business Verification** ever.

### 3. Connect @joinlockr and generate the token (the easy button)
Still on **API setup with Instagram login**:
- Click **Add account** (or "Add an Instagram account"), log in as @joinlockr in the
  popup, click **Allow**.
- Back on that screen, click **Generate token** next to @joinlockr (approve again if
  asked). **Copy the token it shows** — this is already a **60-day long-lived
  token**. Paste it somewhere safe; it's your `IG_ACCESS_TOKEN`.

*(That button is the whole token step — ignore any mention of redirect URIs, "codes",
or app secrets; those are only for the manual developer path, which you don't need.)*

### 4. Get the account's numeric ID
Paste this into a browser address bar, swapping in your token, and press Enter:
```
https://graph.instagram.com/v23.0/me?fields=user_id,username&access_token=PASTE_TOKEN_HERE
```
The page shows raw text like `{"user_id":"178414...","username":"joinlockr"}` (that's
normal, not broken). Copy the **`user_id`** number — that's your `IG_USER_ID`.
Paste the **full** token with no spaces or line breaks. (Use `user_id`, **not** `id`.)

### 5. Add the two secrets to GitHub
In the lockr repo: **Settings → Secrets and variables → Actions → New repository
secret**. Add:
- `IG_USER_ID` = the number from step 4
- `IG_ACCESS_TOKEN` = the token from step 3

`ANTHROPIC_API_KEY` is already set. `DISCORD_WEBHOOK_CONTENT` (optional audit log) =
in Discord: **Edit a private #content-queue channel → Integrations → Webhooks → New →
Copy URL**.

### 6. Keep the token alive (so it truly never needs you again)
A 60-day token dies **permanently** if it ever lapses. The repo already includes a
**weekly auto-refresh** workflow (`.github/workflows/refresh-ig-token.yml`) that
renews it and fails loudly (red run + email) if anything breaks. To enable it, add
one more secret:
- `GH_PAT` = a **fine-grained Personal Access Token** (GitHub → Settings → Developer
  settings → Personal access tokens → Fine-grained) scoped to **this repo only**,
  with **Secrets: Read and write** permission. Add it as a repo secret.

> **Two clocks to remember:** the refresh job keeps `IG_ACCESS_TOKEN` alive forever,
> but `GH_PAT` itself maxes out at **1 year**. Set a calendar reminder to regenerate
> `GH_PAT` before then.
>
> **Don't want to manage a PAT?** Skip step 6 and instead re-do steps 3–5 (click
> *Generate token*, paste the new one) every ~50 days. Set a calendar reminder.

### 7. Test it once
Repo **Actions** tab → **Auto intel feed (@joinlockr)** → **Run workflow**. Confirm a
post appears on @joinlockr and the run is green. (To stage safely first, set Variable
`INTEL_AUTOPOST=0`, run it, check the Discord draft, then delete the variable to go
live.) After that, it runs daily on its own (~10:17am ET).

---

## Things that will bite you (read once)

- **Don't lock down the card URL.** Instagram's servers fetch
  `joinlockr.com/api/intel-card` directly. Keep Vercel **Deployment Protection /
  password protection OFF** for the site, and don't put it behind a bot-challenge —
  a URL that works in your browser can still be blocked for Meta's fetcher.
- **JPEG only.** The card endpoint already serves JPEG (Instagram rejects PNG). Don't
  "fix" it back to PNG.
- **API version.** The code is pinned to `v23.0`. Meta retires old versions roughly
  every ~2 years — if posts ever start failing with a version error, add repo
  Variable `IG_API_VERSION` = the current version (check
  developers.facebook.com/docs/graph-api/changelog). No code change needed.
- **Compliance (gambling vertical):** keep it 21+/responsible-gambling, never imply
  guaranteed wins or income, route everything to the Lockr membership (not a
  sportsbook). The generator enforces a banned-phrase filter, but you're the
  backstop — this is exactly why review-first mode exists for the first couple weeks.
- **Rate limit:** 100 API posts / 24h per account — irrelevant at 2/day.

---

## Tuning

- **More/fewer posts per day:** repo Variable `INTEL_COUNT` (default 2, max 3).
- **More times per day:** add `cron:` lines in `.github/workflows/auto-intel.yml`.
- **Add background art:** drop an image in `public/intel-bg/<category>/` and list its
  path in `BG_LIBRARY` in `scripts/generate-intel.mjs` (categories: markets, sports,
  worldcup, money). Keep them abstract — no real people, teams, or logos.
