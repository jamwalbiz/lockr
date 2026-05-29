# Lockr Discord Setup Checklist

Everything you need to paste/upload to finish the Discord build. Do these in
order — earlier steps unlock later ones.

---

## 0. Already done

- ✅ Whop Discord app installed, two instances (one per product)
- ✅ Lockr Subscriber + Inner Circle roles created in Discord
- ✅ Wbot role moved to top of role hierarchy
- ✅ SUBSCRIBER and INNER CIRCLE categories created with role permissions

## 1. Foundation (do first — unlocks everything)

### 1a. Reorganize: create `📍 START HERE` category at the top

In Discord client → Server name dropdown → Create Category → name it `📍 START HERE` → leave Private OFF (everyone can see).

Then drag the existing `#welcome` + `#announcements` into it. The category should be visually at the top of the sidebar, above SUBSCRIBER and INNER CIRCLE.

### 1b. Enable Community Server

Server Settings → bottom of left sidebar → **Enable Community** → walk through the wizard. You'll need:

- A rules channel (`#welcome` is fine, but a separate `#rules` is cleaner — create one if you want)
- A community updates channel (`#announcements` works)
- Default notifications: **Only @mentions** (so members don't get pinged for every chat message)

This unlocks Stage channels, Forum channels, Rules Screening, Onboarding, Announcement channels.

### 1c. Verification Level: Medium

Server Settings → Safety Setup → Verification Level → **Medium** ("verified email + 5 min on Discord").

Stops most spam bots without friction-blocking real members.

### 1d. Rules Screening — paste these 5 rules

Server Settings → Safety Setup → Rules Screening → enable. Paste these as the 5 rules new members must agree to:

```
1. Respect every member. Disagreement is fine; personal attacks aren't.

2. Picks stay inside. Screenshotting or reselling picks elsewhere = permanent ban.

3. Results vary. Lockr posts are for informational purposes — you're responsible for your own action.

4. Pick channels are for picks. Take debate, banter, and off-topic to #general-chat.

5. Members must be 18+ and in a jurisdiction where sports betting / prediction markets are legal.
```

---

## 2. Better channel types

### 2a. Convert `Weekly Call` + `IC Mastermind` to Stage Channels

Discord lets you create Stage from scratch but doesn't let you convert an existing voice channel. Easiest path:

1. Delete the two voice channels we set up earlier (`Weekly Call` and `IC Mastermind`)
2. Right-click the category they were in → Create Channel → choose **Stage** type → name it the same → save
3. Repeat for the second one

Stage channels show speakers at the top, audience listens, raise-hand to ask. Way better than voice for weekly Q&A.

### 2b. Convert `#inner-circle` to a Forum Channel

Same deal — delete the existing `#inner-circle` text channel and recreate it as a **Forum** type inside the INNER CIRCLE category.

Set up forum tags: `Deep Dive`, `Custom Research`, `Mastermind Recap`, `Strategy`, `Member Question`. Members and JT pick a tag when posting; threads stay organized.

Default sort: **Recent activity**. Auto-archive: **3 days of inactivity** (so old threads collapse but stay searchable).

---

## 3. Channel topics + IC additions

> Community Onboarding flow is intentionally skipped. Paid members get every channel by default; opt-in roles like `daily-pings` / `big-play-alerts` are dropped — JT prefers a simpler member experience without notification toggles.

### 3a. Add IC channels (keep 1-on-1s + scheduling in-platform)

Under the **INNER CIRCLE** category, add three new channels so every IC perk runs inside the server (no DMs, no Zoom, no Calendly):

1. **`#schedule-with-jt`** (text)
   - Slowmode: 1 hour
   - Permissions: IC role gets `Send Messages` ✓, `Add Reactions` ✓. Lockr Team gets `Send Messages` ✓ + `Manage Messages` ✓. Inherits category view-gate.

2. **`🎙 1-on-1 with JT`** (voice)
   - **User Limit: 2** — this is the privacy primitive. Once member + JT are both connected, nobody else can join the room. Cleaner than per-call permission edits.
   - Permissions: IC role gets `Connect` ✓ + `Speak` ✓. Lockr Team gets `Connect` + `Speak` + `Move Members` + `Mute Members`. Inherits category view-gate.

3. **`#ic-coaching-notes`** (text, threads on)
   - Permissions: IC role gets `Send Messages` ✓ + `Create Public Threads` ✓. Lockr Team same. Inherits category view-gate.

Then create a **recurring monthly Discord Event** linked to the `IC Mastermind` Stage: Server → Events → Create Event → Recurring monthly → Location: Stage Channel → restrict visibility to IC role. Members see "next mastermind in N days" on the Events tab without JT having to post a reminder.

### 3a.5. Add a RESOURCES category (educational content + promo codes)

The "Free promo codes for every recommended platform" line on the site's pricing cards needs a real home. Same for the bankroll & sizing playbook claim, the sport-specific guides, and the "we'll teach you how" promise built into the methodology framing. A dedicated **RESOURCES** category sits between SUBSCRIBER and INNER CIRCLE in the sidebar and gives the educational content a real surface.

Create a new category — **RESOURCES** — with the same access pattern as SUBSCRIBER (private, gated to Lockr Subscriber + Inner Circle + Lockr Team). The IC role inherits view via being higher tier; Lockr Subscriber sees it as a paid-tier perk; `@everyone` denied.

Channels to create under it (text channels, broadcast-only — Lockr Team posts, members can react/thread but not send messages, matching the same `Send Messages = ❌` + `Add Reactions = ✓` pattern as the broadcast channels under SUBSCRIBER):

| Channel | What goes in it | Why it matters |
|---|---|---|
| `#promo-codes` | One pinned post per platform (PrizePicks, Underdog, Sleeper, Dabble, DK, FD, BetMGM, Kalshi, Polymarket) with the JT-specific affiliate code + sign-up link + bonus details. Updated as JT's affiliate approvals land. | Backs the "Free promo codes for every recommended platform" claim on the pricing cards. Until any affiliate is approved, this channel sits with a pinned "promo partnerships coming online — drop a note in #general-chat if you're stuck on a specific platform" message. Honest about timing, not a broken promise. |
| `#dictionary` | A→Z glossary of betting + prediction-market terms (CLV, vig, EV, Kelly, parlay, prop, OU, ML, etc.). Single long pinned post or one entry per message — searchable either way. | New members joining from social will not know half the terminology JT uses in picks. This is a 1-time investment that compounds — every new member sends fewer "what does CLV mean?" pings in `#general-chat`. |
| `#guides` | Long-form how-to posts. Bankroll & sizing (matches the marketing-page promise). Line shopping. Sportsbook arbitrage basics. How to read a prop pick. How to evaluate a Kalshi event contract. Each a pinned message or a thread. | Backs the "Bankroll & sizing playbook" line on the pricing card. Also, this is content JT writes once and reuses for content marketing (X threads, TikTok carousels). |
| `#methodology` | Deeper-than-the-marketing-page explanations of how JT actually finds picks. Model → Price → Size, with examples. Why CLV is the real proof of edge. How JT's process differs from generic touts. | Reinforces the trust mechanic post-purchase. A member who reads the methodology channel is far less likely to churn after a losing week — they understand the process. |

All four sit in the **RESOURCES** category with the access pattern: Lockr Team can post, Lockr Subscriber + Inner Circle can view + react (broadcast-only), `@everyone` denied.

The `#getting-started` channel role is already served by `#welcome` under START HERE. No need to duplicate.

### 3b. Channel topics — paste these into each channel header

Right-click channel → Edit Channel → Topic field. Paste:

| Channel | Topic |
|---|---|
| `#welcome` | `Read first. How Lockr works + how to claim your access via Whop.` |
| `#announcements` | `JT broadcasts only. Schedule changes, big wins, product updates.` |
| `#sports-picks` | `Daily picks across every sport in season. Pick + reasoning + recommended size, posted live before each event.` |
| `#prediction-markets` | `Daily plays on Kalshi + Polymarket. Event contracts, political markets, economic indicators, weather.` |
| `#wins-and-losses` | `The receipts. JT logs every pick's outcome here as it settles. Drop your own bet slips, tailing wins, and fade calls too — show the room.` |
| `#general-chat` | `Member-to-member talk. Banter about plays, off-topic, ask anything.` |
| `Weekly Call` (Stage) | `Live weekly Q&A with JT. Members raise hand to ask questions.` |
| `#inner-circle` (Forum) | `IC-only discussions. Deep dives + custom research = individual threads. Pick a tag when posting.` |
| `IC Mastermind` (Stage) | `Monthly cohort mastermind. Full IC room live — 60-min deep dive on the month, what worked, what didn't, where the edge moved. Recurring Discord Event linked.` |
| `#schedule-with-jt` | `Request a 1-on-1 with JT. Post your topic + 2-3 windows you're free. JT confirms here. No DMs — everything in this channel.` |
| `🎙 1-on-1 with JT` (voice) | `1-on-1 call venue. Member-of-2 cap — once you + JT are both in, nobody else can join. Drop in at your scheduled time.` |
| `#ic-coaching-notes` | `Pre-call notes + post-call action items. Long-form receipts of every 1-on-1 — searchable IC IP.` |
| `#promo-codes` | `JT's affiliate codes + sign-up bonuses for every recommended platform. Pinned post per platform — check before signing up anywhere.` |
| `#dictionary` | `A→Z glossary of betting + prediction-market terms. Search the channel for any term you don't know.` |
| `#guides` | `Bankroll & sizing, line shopping, prop deep-dives, prediction-market 101. Long-form how-tos pinned at the top.` |
| `#methodology` | `How JT actually finds picks. Model → Price → Size, deeper than the marketing page. Worked examples.` |

### 3c. Pinned starter message in `#welcome`

After channels are set up, send this as a message in `#welcome` and pin it (right-click message → Pin Message):

```
👋 Welcome to Lockr.

You're in. Here's how the next 60 seconds go:

1. Link Discord to Whop
   → In your Whop account → Connected Accounts → connect Discord (one click).

2. Claim access
   → Hit the Discord tile in your Whop product page → "Claim Access". Your tier
     role is assigned automatically.

3. Find your channels
   - Sports picks → #sports-picks
   - Kalshi/Polymarket → #prediction-markets
   - Track record → #wins-and-losses
   - Inner Circle members → #inner-circle (your gold-tier channels)

Weekly Q&A: every Thursday 8pm ET in 🔊 Weekly Call.

Questions? Drop them in #general-chat — JT, the team, or another member
will answer.
```

---

## 4. Custom emojis

Upload these PNGs as server emojis. Server Settings → Emoji → Upload Emoji.

| Name (without colons) | File | Use case |
|---|---|---|
| `win` | `public/brand/emoji-win.png` | Pick cashed |
| `loss` | `public/brand/emoji-loss.png` | Pick lost |
| `tail` | `public/brand/emoji-tail.png` | Member followed the pick |
| `fade` | `public/brand/emoji-fade.png` | Member bet the other side |
| `lockr` | `public/brand/emoji-lockr.png` | General Lockr-brand approval |

Once uploaded, members can react with `:win:` `:loss:` `:tail:` `:fade:` `:lockr:` on any pick post — at-a-glance signal of how the community is acting on a pick.

All 5 PNGs are in this repo under `public/brand/`. They're also live at
`https://joinlockr.com/brand/emoji-*.png` after Vercel redeploys.

### 4a. About restricting members to *only* the uploaded emojis

Short answer: Discord doesn't let you. Unicode emojis (😀 🔥 💯 etc.) are always available to every member on every server — it's a platform-level thing, not a server setting. You can lock down who can **upload** new custom emojis (Server Settings → Roles → "Create Expressions" / "Manage Expressions" off for `@everyone`), but you can't disable the standard Unicode set.

The practical workaround — **seed the reaction with the Lockr emoji first.** When JT (or the bot) posts a pick, immediately react to it with `:tail:` and `:fade:`. When the result is posted, react with `:win:` or `:loss:`. Members tapping the existing reaction is one click; finding a Unicode emoji is three. The Lockr set becomes the path of least resistance and you get the at-a-glance signal without having to police anything.

---

## 5. Cleanup (last)

- Delete the default `#general` text channel (replaced by `#general-chat`)
- Delete the default `General` voice channel (replaced by the two Stage channels)

That's it. Tell Claude **"channels done"** when finished and we'll move to Whop stage 2 (tax + bank).
