# Lockr Distribution Playbook

Honest version. Lockr is a premium membership where members tail JT's daily sports and prediction-market plays. It is an education and entertainment service. Picks are opinions, not advice. Sports and prediction markets are treated as equal. Every public touchpoint carries the same line: picks are opinions not advice, 21+, bet only what you can afford to lose, problem gambling call 1-800-GAMBLER. No "guaranteed", no "risk-free", no invented win rates or member counts.

The honest strategic call up front: Lockr should win on owned and earned channels (website education, AI citations, email, Discord) and treat paid ads as a slow, lawyer-gated experiment. Most "growth hacks" in this niche (Reddit bots, cashtag spam, paid X creator deals) are now either banned or actively de-ranked. Chasing them burns accounts and domain trust. The compliant path is slower but it compounds.

## 1. Organic content engine (the foundation)

What to do. The site already has a blog, RSS feed, and Article schema. Turn it into a real authority asset. Publish question-led education that treats prediction markets and sports as equals: "Kalshi vs Polymarket", "how to trade prediction markets", "what is the vig", "bankroll math". Every H2 opens with a 40 to 60 word direct answer plus one cited stat. Put JT's real byline on everything.

Automatable. Build, RSS, sitemap, and schema regenerate on deploy. A script can scaffold a new post file. Drafting can be assisted, but a human edits every line for voice and compliance.

Manual. Topic selection, the actual claims, fact-checking, JT's point of view. Never auto-publish gambling content unread.

Needs. The lockr repo (have it), verified sources for every stat, JT's bio and headshot.

Cadence. Two to four genuinely useful posts per month. Quality over volume. Refresh the top three posts quarterly and bump the modified date.

## 2. GEO (getting cited by AI search)

What to do. This is the highest-leverage channel for Lockr because AI search converts far better than a cold organic click, and "Kalshi vs Polymarket" is a high-intent query with a short citation window. Five moves, in order: (1) allow the AI crawlers in robots, (2) put a verifiable named author on every article, (3) write question-led passages with cited stats, (4) ship the three pillar comparison and how-to posts, (5) monitor citations and iterate.

Automatable. Schema generation, the robots change, freshness-date bumps, and weekly citation-check reminders.

Manual. The writing quality and the sourcing. AI systems cite content that reads like a clean, sourced answer, not marketing.

Needs. The on-site changes in the implementation spec, plus a citation monitor (Pixelmojo or Rankeo) once there is content to track. Do not bother maintaining llms.txt as a ranking play; Google has said it does not affect AI Overviews. Ship it once for tooling and move on.

Cadence. Ship the five moves over the first 30 days, then a monthly citation review.

## 3. Instagram and Facebook (the only realistic paid path)

What to do. Meta permits gambling ads with licensing verification and is more workable than TikTok or X. Run age-gated 21+ campaigns. Every creative carries the 1-800-GAMBLER notice, the "opinions not advice" line, and no "guaranteed" or "risk-free" language. Organic posts and Reels run alongside as a warm-up.

Automatable. Scheduling via Meta Business Suite. Audience setup once approved.

Manual and non-negotiable. The gambling-advertiser verification, and a legal review of every creative before it runs. Treat paid as gated until that clears.

Needs. Meta Business Manager, gambling-advertiser verification docs (the Whop processing relationship helps establish legitimacy), legal sign-off on copy. Be honest with JT: verification can stall or fail for an opinion/education service that is not a licensed operator. Budget time, not just money.

Cadence. Organic two to four posts per week now. Paid only after verification and legal clear. Start with a small test budget.

## 4. Reddit and niche forums (organic only, real ban risk)

The honest warning. Do not automate anything here. Reddit removes around 100,000 accounts a day for bot spam, enforces a 90/10 self-promo rule, and gambling-adjacent subs moderate hard. Automated posting, cashtag link shorteners, or dropping Whop links will get the account permanently banned and can shadowban the IP. It also trains Google's spam systems to distrust the domain. There is no compliant way to automate promotion on Reddit.

The compliant alternative. One authentic, aged human account. Genuinely participate in r/sportsbook, r/sportsbetting, r/Kalshi, r/Polymarket at a 9-to-1 or better ratio of real contribution to anything self-referential. Share analysis, not links. Mention Lockr only when a thread explicitly asks for recommendations, and frame it as a personal opinion, not a pitch. Accept that reach is small but the audience is high-intent.

Automatable. Nothing promotional. You may use read-only tooling to find relevant threads to answer.

Needs. A real account with history and karma, and human time. No tooling shortcuts.

Cadence. A few genuine contributions a week, indefinitely. This is relationship work.

## 5. X / Twitter (organic only)

What to do. X banned paid gambling partnerships in February 2026, including affiliate and compensated creator deals. So: post organically from the official @joinlockr account. Talk about plays, prediction-market moves, and education. Do not pay creators to retweet; that violates ToS and risks suspension. Do not use cashtags as affiliate links.

Automatable. Scheduling organic posts via a scheduler. Drafting assist.

Manual. Voice, compliance, and any reply engagement.

Needs. The official account and a scheduler (Buffer or Metricool). If JT ever wants paid, it must go through X enterprise sales pre-authorization, which is slow and case-by-case.

Cadence. Daily to a few times a week organically.

## 6. TikTok and YouTube Shorts (education only, expect friction)

What to do. Treat both as community and discovery, not revenue. Post educational breakdowns: how a prediction market works, how to read a line, bankroll discipline. Avoid "buy my picks" and any "click here to bet" CTA. Framing Kalshi as CFTC-regulated education is safer than promotional framing.

The honest limits. TikTok ads for a picks/education service that is not a licensed operator are near-impossible to certify, so plan on organic only, auto age-gated to 18+. YouTube restricts and often demonetizes gambling Shorts and bans links to unlicensed operators. Do not count on ad revenue from either.

Automatable. Scheduling and captions. Repurposing one idea into several short clips.

Manual. Filming, the actual claims, compliance review of every link and CTA.

Needs. Business accounts on both. No external links to unlicensed gambling. Accept reduced reach.

Cadence. Two to five Shorts per week if JT has the appetite to film. Otherwise deprioritize behind the content engine and email.

## 7. Email (the most compliant and most owned channel)

What to do. This is the safest, highest-control channel and it should be a priority. Build a list from website opt-in (double opt-in for EU). Send a daily or weekly digest, education, and membership nudges. Every email carries: a working unsubscribe, a physical postal address, "picks are opinions, not advice", and the 1-800-GAMBLER notice. No "guaranteed", no fake ROI.

Automatable. Sequences, segmentation, scheduling, and send-time. This is the channel where automation is fully compliant.

Manual. List hygiene decisions and honoring opt-outs (never override them). Voice and claims review.

Needs. An ESP (Beehiiv is already wired as a placeholder in the repo; Klaviyo or ConvertKit also fine), SPF/DKIM/DMARC set up, a compliant signature block, and a real mailing address. Never let a third-party affiliate send on Lockr's behalf without a compliance agreement, since Lockr stays liable.

Cadence. Welcome sequence on signup. Weekly education digest minimum. Daily digest for subscribers if there is genuinely something to say.

## 8. Discord (the community engine)

What to do. The community lives here. Age-gate at entry with an explicit 21+ requirement and turn on Discord's native age verification as it rolls out. Member-only channels deliver the picks. Use compliant bots (MEE6, Dyno) for roles and moderation only.

Automatable. Role assignment, access gating tied to Whop, moderation. Compliant.

Manual and important. Community management and the picks themselves. Do not use bots for automated promotional broadcasting; that crosses the line.

Needs. The server, an age-gate, moderators, clear posted terms, and the Whop-to-Discord access link.

Cadence. Daily presence. This is where retention is won or lost.

## 9. Partnerships and affiliates (cautiously)

What to do. Selective partnerships with aligned sports/prediction-market creators can work, but only with a written compliance clause: they own any deceptive claim they make, and Lockr must monitor what they publish because Lockr can still be pursued by the FTC. No paid X creator deals (banned). No buying placements in gambling-link directories (Google blacklists them and it flags the domain as spammy).

Automatable. Tracking links and payouts via Whop's affiliate tooling.

Manual. Vetting partners, the compliance clause, and monitoring their content.

Needs. Whop affiliate setup, a standard agreement with FTC and responsible-gambling language, and someone actually reviewing partner posts.

Cadence. Slow and selective. One good aligned partner beats ten cheap ones.

## Prioritized 30 / 60 / 90 day rollout

### First 30 days (unlock and foundation)
- Allow AI crawlers in robots. Near-zero effort, unlocks Perplexity in days.
- Stand up the /about/jt author page with a real bio, photo, and links, and wire the author Person into Article schema. Highest E-E-A-T payoff.
- Resolve the FAQPage schema exposure (drop it from the marketing homepage; keep only where Q/A is visibly on-page).
- Add the sitewide compliance footer (21+, opinions-not-advice, 1-800-GAMBLER, responsible-gaming link).
- Stand up email capture and the welcome sequence.
- Launch the Discord age-gate and member channels.
- Start one authentic Reddit/forum presence (no promotion yet, pure participation).

### Days 31 to 60 (content moat and owned audience)
- Publish the three pillar posts: Kalshi vs Polymarket, how to trade Kalshi, how to trade Polymarket. Sourced, bylined, question-led.
- Add dateModified support and internal-linking clusters across the blog.
- Begin the weekly email digest in earnest.
- Stand up citation monitoring and log a baseline for the target queries.
- Begin organic Instagram/Facebook and X posting. Start, but do not gate growth on, Meta gambling-advertiser verification.

### Days 61 to 90 (amplify and measure)
- Ship the whitepaper as a gated PDF lead magnet feeding the email list.
- If Meta verification clears, run a small, legally reviewed paid test on Instagram/Facebook.
- Add two to four more education posts and refresh the pillars.
- First monthly citation report: which posts get cited, by which AI systems, and which competitors are cited instead. Iterate the weakest pages.
- Decide on TikTok/YouTube Shorts based on whether JT will commit to filming. If not, double down on the content engine, email, and Discord.

### What to deliberately not do
- No bots or automation on Reddit, forums, or for any promotional broadcast anywhere.
- No cashtag link schemes.
- No paid X creator partnerships (banned).
- No bought backlinks or gambling-directory placements.
- No "guaranteed", "risk-free", invented win rates, ROI, member counts, or profit figures, ever, on any channel.
