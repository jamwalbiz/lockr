# Discord Audit — Lockr server (2026-05-29)

Full read-only audit of the Lockr Discord server (Server ID: 1509707421914763325). No permissions or settings were modified during the audit, per safety rules. This document lists what's correctly configured, what's still open, and what additions are needed to keep IC fully in-Discord (no off-platform scheduling, no off-platform calls).

---

## ✓ What's correctly configured

### Server identity
- Server name: **Lockr** ✓
- Server icon: brand glyph uploaded ✓
- Community Server: enabled ✓
- Rules channel: `#rules` ✓
- Community Updates channel: `#announcements` ✓
- Server Primary Language: English ✓

### Channel structure (matches the spec in `docs/discord-setup.md`)
- **START HERE**: `#welcome`, `#announcements`, `#rules`
- **SUBSCRIBER** (private category): `#sports-picks`, `#prediction-markets`, `#wins-and-losses`, `#general-chat`, **Weekly Call** (Stage)
- **INNER CIRCLE** (private category): `#inner-circle`, **IC Mastermind** (Stage)

### Roles (5 total, hierarchy correct)
1. **Whop Bot** (top) — needed above tier roles so it can assign them ✓
2. **Lockr Team** — Administrator: ON ✓ (1 member: JT)
3. **Inner Circle** — gold color, Hoist ON, Mentionable OFF, all server permissions OFF ✓
4. **Lockr Subscriber** — green color, Hoist ON, Mentionable OFF, all server permissions OFF ✓
5. **Server Booster** — Discord-managed (untouched) ✓

Both tier roles act as identity tags only. All channel access comes from category/channel overrides, which is the correct deny-by-default pattern.

### Category-level access (the critical tier gate)
- **SUBSCRIBER** category — Private: ON. Whitelist: Lockr Team, Inner Circle, Lockr Subscriber, JT (owner). `@everyone` View Channels = denied. ✓
- **INNER CIRCLE** category — Private: ON. Whitelist: Lockr Team, Inner Circle, JT (owner). **Lockr Subscriber NOT in the whitelist** — tier isolation confirmed. ✓

IC members can see Subscriber channels (broader access) but Subscribers cannot see IC channels. Correct.

### `@everyone` server-level permissions
- View Channels: ON (needed so verified members can see public channels)
- **Create Invite: OFF** ✓ (critical — only Lockr Team can invite)
- All Manage* permissions: OFF ✓
- Use External Emoji / Stickers: OFF ✓
- Mention @everyone, @here, All Roles: OFF ✓
- Manage Messages, Pin Messages, Bypass Slowmode: OFF ✓

### Safety Setup (3 of 4 sections fully enabled)
- **Raid Protection and CAPTCHA**: 3 of 3 enabled ✓
- **DM and Spam Protection**: 5 of 5 enabled ✓
- **Permissions → Remove risky permissions from @everyone**: enabled (`@everyone` has 0 risky permissions) ✓

### Broadcast channels — Send Messages locked down ✓ (verified 2026-05-29 re-check)
All 5 broadcast channels confirmed: Lockr Subscriber + Inner Circle both have `Send Messages` = ❌ DENIED, `Send Messages in Threads` = ❌ DENIED, `Add Reactions` = ✓ ALLOWED.

| Channel | Subscriber Send | IC Send | Reactions |
|---|---|---|---|
| `#welcome` | ❌ | ❌ | ✓ |
| `#announcements` | ❌ | ❌ | ✓ |
| `#rules` | ❌ | ❌ | ✓ |
| `#sports-picks` | ❌ | ❌ | ✓ |
| `#prediction-markets` | ❌ | ❌ | ✓ |

Embed Links / Attach Files / Threads / External Emoji are all explicitly denied on these channels too. Only Lockr Team can post; members can only react with the legend emojis (🟢 on it · 🔴 against · ✓ hit · ✗ missed).

### Welcome content
- Server welcome banner image present ✓
- `#welcome` pinned message live with the 4-step onboarding (claim → channels → picks → Q&A) and the reaction legend ✓
- Custom emojis visible in the picker ✓

---

## ⚠️ Still open before launch

### 1. AutoMod is under-configured (1 of 5 filters enabled)
**Severity: medium**

Only **Block Mention Spam** is on. For a paid community where chargeback-bait and spam DMs are common, recommend also enabling:
- **Block Suspected Spam Content** (Discord's ML filter — free, English-only)
- **Block Commonly Flagged Words** (profanity filter — sets the floor for chat quality)
- **Block Words in Member Profile Names** (catches usernames designed to impersonate or spam)

Skip **Block Custom Words** unless JT has a specific blocklist in mind.

### 2. No "Require 2FA for moderator actions"
**Severity: medium**

Safety Setup → Permissions shows **Require 2FA for moderator actions** = OFF. If JT's account is ever compromised, an attacker could mass-ban / mass-delete. Enable 2FA on JT's Discord account first, then flip this on. One-time setup, hard to undo damage if skipped.

### 3. Safety Notifications Channel not set
**Severity: low**

Community Overview → Safety Notifications Channel: empty. Discord won't have anywhere to post raid alerts / takedown notices / Trust & Safety messages. Recommend creating a private `#mod-log` (Lockr Team only) and pointing this setting at it.

### 4. Server Description empty
**Severity: low**

Text that appears in Discord invite embed previews. Currently blank. Recommend something durable like:

> "Lockr — daily sports + prediction-market picks. Subscribers only."

### 5. `inner-circle` channel type
**Severity: needs verification**

`docs/discord-setup.md` calls for `inner-circle` to be a **Forum channel** (one post per thesis, threaded discussion). Worth confirming in the channel-edit dialog — Forum gives IC the long-form structure the spec was after.

---

## 🆕 IC needs added — keep everything in Discord

Goal: every IC perk runs inside the server. No DM scheduling, no Zoom, no Calendly. The current IC surface has `#inner-circle` + `IC Mastermind` Stage, which covers the monthly cohort call. It doesn't cover the **1-on-1 strategy calls**, and the monthly call has no scheduling surface yet.

### A. Add `#schedule-with-jt` text channel (under INNER CIRCLE)

A single channel where IC members request 1-on-1 time and JT replies with confirmed slots — all visible to the IC room (it's a perk worth showing off, and other members can piggy-back on overflow availability).

- **Topic:** "Request a 1-on-1 with JT. Post your topic + 2-3 windows you're free. JT confirms here. No DMs."
- **Slowmode:** 1 hour (prevents anyone from spamming requests)
- **Permissions:** IC can Send Messages here (explicit allow override — different from broadcast channels). Lockr Team can Send Messages + Manage Messages.

### B. Add `🎙 1-on-1 with JT` voice channel (under INNER CIRCLE)

The actual venue for 1-on-1 calls. IC member drops in at the scheduled time; JT joins. Discord native voice = real-time, ephemeral, in-platform.

- **User Limit: 2** ← this is the privacy trick. Once member + JT are both connected, nobody else can join. No accidental drop-ins.
- **Permissions:** IC role can Connect + Speak. Lockr Team can Connect + Speak + Move/Mute (so JT can clean up if a member forgets to disconnect).
- **Naming:** lead with the mic emoji so it visually reads as a call surface, not a hangout.

If JT later wants concurrent 1-on-1s, add `🎙 1-on-1 Room 2` / `Room 3` with the same User Limit = 2 pattern.

### C. Add a recurring Discord Event for the monthly cohort mastermind

Discord Events live on the server's Events tab, push notifications to opted-in IC members, and auto-link to a channel (in this case `IC Mastermind` Stage). One recurring event = members see "next mastermind: in 3 days" without JT having to post a reminder.

- **Setup:** Server → Events → Create Event → Recurring monthly → Location: `IC Mastermind` Stage Channel.
- **Visibility:** restrict to IC role so Subscribers don't see it.

### D. Add `#ic-coaching-notes` text channel (optional, recommended)

Long-running text channel where:
- IC members post pre-call notes ("here's the situation I want to talk through this week")
- JT drops post-call action items
- Past 1-on-1 takeaways become searchable IC IP

This is what makes "1-on-1 with JT" a Lockr durable asset rather than 30 minutes that vanish. Without it, calls happen and the value walks out with the member.

- **Permissions:** IC + Lockr Team can post. Threads on by default.

### E. Rename `#inner-circle` → `#ic-room` (or keep but make Forum)

If we go Forum (as the original spec called for): one post per high-conviction thesis, members debate in-thread. This is where the deep-dive content lives.

If JT prefers it stays text: rename to something more obvious so it doesn't compete with the category name in the sidebar.

### F. Channel order under INNER CIRCLE (suggested)

```
INNER CIRCLE
  📋 inner-circle              ← long-form thesis discussion (Forum or text)
  📝 ic-coaching-notes         ← pre/post 1-on-1 notes
  📅 schedule-with-jt          ← 1-on-1 booking
  🎙 1-on-1 with JT            ← voice (User Limit: 2)
  📡 IC Mastermind             ← Stage (existing, monthly recurring Event)
```

---

## ℹ️ Notes

- Two test accounts present (`katanaslasher10` + a 2nd) carrying Subscriber + IC roles, presumably from JT's incognito Whop checkout tests. Not a security issue, but if those were real Whop subscriptions, they're being billed. Worth confirming before launch and refunding/clearing.
- Whop Bot is correctly positioned at the top of the role list so it can assign Subscriber + IC on Whop-side membership events.
- Role icons (custom 64×64 PNGs) require server boost level 2. JT can leave them off until the server has the boosts.
- Onboarding flow + `daily-pings` / `big-play-alerts` opt-in roles intentionally dropped per JT (2026-05-29). The original spec called for them; JT prefers a simpler member experience without those toggles.

---

## Out of scope (not modified by audit)

Per safety rules, I do not modify permissions, sharing, channel structure, or access controls directly. All fixes and additions above need JT to apply them in the Discord UI.
