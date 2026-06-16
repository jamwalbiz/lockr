import Image from "next/image";
import { CountUp } from "@/components/CountUp";
import { JoinCta } from "@/components/JoinCta";
import {
  IconBallAmericanFootball,
  IconBallBasketball,
  IconBallBaseball,
  IconBallFootball,
  IconBallTennis,
  IconKarate,
  IconDeviceGamepad2,
  IconChartLine,
  IconChartCandle,
} from "@tabler/icons-react";
import { PricingCards } from "@/components/PricingCards";
import { Faq } from "@/components/Faq";
import { TESTIMONIALS_ROW_1, TESTIMONIALS_ROW_2 } from "@/lib/testimonials";
import { BET_SLIPS } from "@/lib/betslips";
import { FAQ_ITEMS } from "@/lib/faq";
import { FadeInObserver } from "@/components/FadeInOnView";
import { ScrollProgress } from "@/components/ScrollProgress";
import { TiltCard } from "@/components/TiltCard";

// Platforms Lockr's picks work on - rendered as a calm marquee band.
// All logos uniformly sourced from the iTunes App Store icon CDN
// (512x512 .jpg) for visual consistency.
const BOOKS = [
  { name: "PrizePicks", color: "#6F4FF2", initials: "PP", src: "/logos/prizepicks.jpg" },
  { name: "Underdog", color: "#E03A3E", initials: "UD", src: "/logos/underdog.jpg" },
  { name: "Sleeper", color: "#15A4D5", initials: "S", src: "/logos/sleeper.jpg" },
  { name: "Dabble", color: "#1FBC74", initials: "D", src: "/logos/dabble.jpg" },
  { name: "DraftKings", color: "#1B9D62", initials: "DK", src: "/logos/draftkings.jpg" },
  { name: "FanDuel", color: "#0094E3", initials: "FD", src: "/logos/fanduel.jpg" },
  { name: "Kalshi", color: "#00C2A8", initials: "K", src: "/logos/kalshi.jpg" },
  { name: "Polymarket", color: "#1A66F0", initials: "P", src: "/logos/polymarket.jpg" },
];

// FAQPage structured data - rich-snippet eligible.
const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.text },
  })),
};

export default function Home() {
  return (
    <>
      {/* Scroll-triggered fade-in for sections below the fold. Hero is
          excluded - it's already in view on load and should not animate. */}
      <FadeInObserver />

      {/* Scroll-depth indicator for the long single-page funnel. */}
      <ScrollProgress />

      {/* Hero - "the bettor's terminal". Asymmetric editorial split: the
          pitch on the left, a live data terminal on the right. The terminal
          is the memorable element - it frames Lockr as a precision
          instrument, not a Discord. */}
      <section className="hero">
        <div className="hero-grid" aria-hidden="true"></div>
        <div className="hero-glow" aria-hidden="true"></div>
        <div className="hero-grain" aria-hidden="true"></div>
        <div className="shell">
          <div className="hero-layout">
            <div className="hero-left">
              <div className="verified-badge hero-rv" style={{ animationDelay: "0.05s" }}>
                <span className="dot"></span>
                <span>Daily picks · sports + prediction markets</span>
              </div>
              <h1 className="hero-title">
                <span className="hero-rv" style={{ animationDelay: "0.12s" }}>
                  Stop guessing.
                </span>
                <span
                  className="hero-rv hero-title-accent"
                  style={{ animationDelay: "0.2s" }}
                >
                  <span className="hero-title-accent-mark">Start winning.</span>
                </span>
              </h1>
              <p className="hero-sub hero-rv" style={{ animationDelay: "0.3s" }}>
                Daily plays across every sport, plus prediction markets like Kalshi and
                Polymarket. Every pick posted before the game, win or loss.
              </p>
              <div className="hero-cta-row hero-rv" style={{ animationDelay: "0.38s" }}>
                <JoinCta href="/checkout" location="hero">
                  Get today&apos;s picks · $29/wk
                </JoinCta>
                <a href="#intro" className="btn btn-secondary btn-lg">
                  See how it works
                </a>
              </div>
              <div className="hero-trust hero-rv" style={{ animationDelay: "0.46s" }}>
                <span>72%+ win rate</span>
                <span className="hero-trust-sep">·</span>
                <span className="hero-trust-rating">
                  <span className="hero-trust-star" aria-hidden="true">★</span>
                  4.9 member rating
                </span>
                <span className="hero-trust-sep">·</span>
                <span>Cancel any time</span>
              </div>
            </div>

            <div className="hero-right hero-rv" style={{ animationDelay: "0.3s" }}>
              <div className="terminal">
                <div className="terminal-head">
                  <div className="terminal-id">
                    <span className="terminal-dot"></span>LOCKR&nbsp;·&nbsp;TODAY&apos;S&nbsp;PICKS
                  </div>
                  <div className="terminal-live">
                    <span className="terminal-live-dot"></span>LIVE
                  </div>
                </div>

                {/* Today's board - illustrative format showing what a member
                    sees: the call, the market, and the post-time (the wedge is
                    "posted before the event"). Tonight's slate, all PENDING. */}
                <div className="terminal-feed">
                  <div className="terminal-row">
                    <span className="t">NBA</span>
                    <span className="mkt">
                      Lakers / Nuggets <em className="ln">Over 224.5</em>
                    </span>
                    <span className="terminal-stat pending">7:02p · PENDING</span>
                  </div>
                  <div className="terminal-row">
                    <span className="t">UFC</span>
                    <span className="mkt">
                      Main event <em className="ln">KO / TKO</em>
                    </span>
                    <span className="terminal-stat pending">8:40p · PENDING</span>
                  </div>
                  <div className="terminal-row">
                    <span className="t">NHL</span>
                    <span className="mkt">
                      Canes / Habs <em className="ln">Over 5.5</em>
                    </span>
                    <span className="terminal-stat pending">9:15p · PENDING</span>
                  </div>
                </div>

                {/* Beginner welcome - plain language, any experience level. */}
                <div className="terminal-foot-line">
                  New to betting? Every pick says{" "}
                  <strong>what to bet, how much, and why</strong>.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform compatibility wall - placed high, right under the hero, as an
          early familiarity/trust signal: "this works with the apps you already use". */}
      <section className="fade-in-section">
        <div className="shell">
          <div className="books-label">
            Works with every platform you already bet on
          </div>
          {/* Calm horizontal marquee (reuses the shipped marquee engine) - reads
              "works with everything you use" without the static-grid stiffness.
              BOOKS is rendered twice for a seamless loop. */}
          <div className="marquee books-marquee">
            <div className="marquee-track">
              {[...BOOKS, ...BOOKS].map((b, i) => (
                <SportsbookMark key={b.name + i} {...b} />
              ))}
            </div>
          </div>
          <div className="books-coverage">
            <span className="books-coverage-num">
              <CountUp to={8} suffix="+" />
            </span>{" "}
            books &amp; prediction markets supported · free promo codes on every tier
          </div>
        </div>
      </section>

      {/* VSL - founder-to-camera intro.
          To swap in the real video without touching code: set the
          NEXT_PUBLIC_VSL_URL env var in Vercel (any standard embed URL works
          - https://player.vimeo.com/video/XXXXXX, https://www.youtube.com/embed/XXXXXX,
          a Wistia oEmbed URL, a Mux signed URL, etc.). When the var is set
          the iframe replaces the placeholder card automatically.
          The placeholder (when no URL is configured) intentionally has no
          fake duration/HD chip - we don't lie about a video that doesn't
          exist yet. */}
      <section id="intro" className="fade-in-section">
        <div className="shell">
          <div className="section-head">            <h2 className="section-title">How Lockr finds edges your book is missing.</h2>
          </div>
          <div className="vsl-wrap">
            {process.env.NEXT_PUBLIC_VSL_URL ? (
              <div className="vsl-player" style={{ cursor: "default" }}>
                <iframe
                  src={process.env.NEXT_PUBLIC_VSL_URL}
                  title="Lockr founder intro"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    border: 0,
                    borderRadius: 10,
                  }}
                ></iframe>
              </div>
            ) : (
              <div
                className="vsl-player"
                style={{ cursor: "default" }}
                aria-label="Founder intro video, coming soon"
              >
                {/* Lockr OG banner as a soft backdrop so the placeholder
                    reads as branded, not empty. Sits underneath the dimmed
                    play button and JT · INTRO / COMING SOON overlay. */}
                <Image
                  src="/brand/lockr-og-1200x630.png"
                  alt=""
                  fill
                  sizes="(max-width: 920px) 100vw, 920px"
                  priority
                  style={{ objectFit: "cover", opacity: 0.5 }}
                />
                {/* Disabled-looking play affordance - kept for visual weight
                    so the section doesn't feel empty, but doesn't claim a
                    playable video exists. */}
                <div
                  className="vsl-play"
                  style={{ opacity: 0.45, cursor: "default", pointerEvents: "none" }}
                  aria-hidden="true"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div className="vsl-overlay">
                  <div className="vsl-meta">JT · INTRO</div>
                  <div className="vsl-meta">COMING SOON</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="fade-in-section">
        <div className="shell">
          <div className="section-head">            <h2 className="section-title">Built for bettors who actually want to win.</h2>
          </div>
          <div className="pillars">
            <div className="pillar">
              <div className="pillar-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12l3 3 4-4 5 5 4-4 2 2" />
                </svg>
              </div>
              <h3>Public track record</h3>
              <p>
                Every play posted live before the event starts. No screenshot edits. No
                &quot;I told you so&quot; after the fact. Wins and losses logged in the
                open and never deleted. Anyone inside can scroll back and check.
              </p>
            </div>
            <div className="pillar">
              <div className="pillar-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4.5L6 21l1.5-7.5L2 9h7z" />
                </svg>
              </div>
              <h3>Prediction-market plays</h3>
              <p>
                Lockr is one of the few that works Kalshi and Polymarket alongside the
                sportsbooks. Bigger menu, better prices on the markets your book either
                won&apos;t offer or prices badly.
              </p>
            </div>
            <div className="pillar">
              <div className="pillar-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 3" />
                </svg>
              </div>
              <h3>A system, not just picks</h3>
              <p>
                We&apos;ll teach you how much to bet, when to walk away, and how to grow
                your bankroll the smart way. New to betting or doing it for years,
                there&apos;s a playbook here for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Process */}
      <section id="method" className="fade-in-section">
        <div className="shell">
          <div className="section-head">
            <div className="section-label">Method</div>
            <h2 className="section-title">
              From signup to first cashed ticket
              <br />
              in under 10 minutes.
            </h2>
          </div>
          <div className="steps-grid">
            <div className="step">
              <div className="step-num">
                01<span className="step-num-divider"></span>JOIN
              </div>
              <div className="step-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
              </div>
              <h3>Pick a tier &amp; join</h3>
              <p>
                Checkout in 60 seconds with card, Apple Pay, Cash App, or bank
                transfer. Link Discord in your account and claim access. Your role
                assigns in under 30 seconds, no manual approval, no waiting.
              </p>
            </div>
            <div className="step">
              <div className="step-num">
                02<span className="step-num-divider"></span>GET PICKS
              </div>
              <div className="step-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3>Picks drop daily</h3>
              <p>
                Our team posts 6–10 plays a day across every sport, plus prediction
                markets. Each play comes with the reasoning, the recommended bet size,
                and the exact line we entered. You always know what to bet and why.
              </p>
            </div>
            <div className="step">
              <div className="step-num">
                03<span className="step-num-divider"></span>PLACE &amp; TRACK
              </div>
              <div className="step-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 17 9 11 13 15 21 7" />
                  <polyline points="14 7 21 7 21 14" />
                </svg>
              </div>
              <h3>Place &amp; watch the bag grow</h3>
              <p>
                Tail the picks on your sportsbook, PrizePicks, Underdog, Kalshi, or
                Polymarket. Track your P/L against the team&apos;s running unit count,
                updated in real time.
              </p>
            </div>
          </div>
          <div className="inline-cta">
            <div className="inline-cta-text">
              3 steps. 10 minutes. Then you&apos;re tailing today&apos;s picks.
            </div>
            <JoinCta href="/checkout" location="step3-inline">
              Get today&apos;s picks · from $29/wk
            </JoinCta>
          </div>
        </div>
      </section>

      {/* By the numbers (static, no live tracker per handoff decision) */}
      <section className="fade-in-section">
        <div className="shell">
          <div className="section-head">
            <h2 className="section-title">
              Real picks.
              <br />
              Real numbers.
            </h2>
          </div>
          <div className="tracker-card">
            <div className="tracker-grid">
              <div className="tracker-big">
                <div className="tracker-big-num">
                  <CountUp to={147} prefix="+" suffix="u" />
                </div>
                <div className="tracker-big-label">Units · trailing 12 months</div>
              </div>
              <div className="tracker-stats">
                <div className="tracker-stat">
                  <div className="tracker-stat-num">
                    <CountUp to={72} suffix="%+" />
                  </div>
                  <div className="tracker-stat-label">Win rate</div>
                </div>
                <div className="tracker-stat">
                  <div className="tracker-stat-num" style={{ color: "var(--accent)" }}>
                    <CountUp to={4.9} decimals={1} suffix="★" />
                  </div>
                  <div className="tracker-stat-label">Member rating</div>
                </div>
                <div className="tracker-stat">
                  <div className="tracker-stat-num" style={{ color: "var(--accent)" }}>
                    <CountUp to={24.7} decimals={1} prefix="+" suffix="u" />
                  </div>
                  <div className="tracker-stat-label">Last 30 days</div>
                </div>
                <div className="tracker-stat">
                  <div className="tracker-stat-num">
                    <CountUp to={10} suffix="+" />
                  </div>
                  <div className="tracker-stat-label">Sports + markets</div>
                </div>
              </div>
            </div>
            <div className="tracker-chart">
              <svg width="100%" height="100" viewBox="0 0 600 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#00FF85" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#00FF85" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polyline
                  fill="none"
                  stroke="#00FF85"
                  strokeWidth="1.5"
                  points="0,80 50,72 100,75 150,68 200,55 250,58 300,45 350,42 400,30 450,35 500,22 550,18 600,12"
                />
                <polygon
                  fill="url(#grad)"
                  points="0,80 50,72 100,75 150,68 200,55 250,58 300,45 350,42 400,30 450,35 500,22 550,18 600,12 600,100 0,100"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Sports coverage grid */}
      <section className="fade-in-section">
        <div className="shell">
          <div className="section-head">            <h2 className="section-title">
              Year-round, every sport.
              <br />
              Plus prediction markets.
            </h2>
            <p className="section-sub">
              10+ sports and two prediction-market platforms, under one subscription. No
              summer drought.
            </p>
          </div>
          <div className="sports-grid">
            <SportCard tag="NFL" name="Football" desc="Sundays, Mondays, Thursdays. Spreads, totals, player props, playoffs.">
              <IconBallAmericanFootball size={28} stroke={1.5} />
            </SportCard>
            <SportCard tag="NBA" name="Basketball" desc="Nightly props, spreads, totals. Deep dives on usage, pace, matchups.">
              <IconBallBasketball size={28} stroke={1.5} />
            </SportCard>
            <SportCard tag="MLB" name="Baseball" desc="Daily slates, F5, NRFI/YRFI. Carries you through summer.">
              <IconBallBaseball size={28} stroke={1.5} />
            </SportCard>
            <SportCard tag="NHL" name="Hockey" desc="Puck lines, totals, goalie props. Smart money lives in this market.">
              <CustomSportIcon>
                {/* Hockey stick + puck - Tabler has no hockey icon */}
                <path d="M5 4l13 13" />
                <path d="M17 17l3 3" />
                <ellipse cx="7" cy="19" rx="4" ry="1.5" />
              </CustomSportIcon>
            </SportCard>
            <SportCard tag="UFC" name="UFC & Boxing" desc="Method-of-victory, round props, fight breakdowns. Soft books, big edges.">
              <IconKarate size={28} stroke={1.5} />
            </SportCard>
            <SportCard tag="F1" name="Formula 1" desc="Qualifying, podium, head-to-head. One of the softest markets in sports.">
              <CustomSportIcon>
                {/* F1 race car silhouette - Tabler has no racing-specific icon.
                    Smaller wheels (r=2) so the body reads as the dominant element
                    instead of two circles ("binoculars" effect at small sizes).
                    Long horizontal chassis with cockpit bump, rear wing on right. */}
                {/* Underbody / chassis floor */}
                <path d="M2 17h20" />
                {/* Top profile: front nose → side pod → cockpit → rear */}
                <path d="M2 17l1-3h6l1.5-3h3l1.5 3h6l1 3" />
                {/* Cockpit halo bump */}
                <path d="M11 11l.3-1.5h1.4l.3 1.5" />
                {/* Rear wing pillar with top wing element */}
                <path d="M20 14v-3h2" />
                {/* Wheels - smaller, sit at the floor level */}
                <circle cx="6" cy="17" r="2" />
                <circle cx="18" cy="17" r="2" />
              </CustomSportIcon>
            </SportCard>
            <SportCard tag="NCAA" name="College Football & Hoops" desc="Saturdays, March Madness, bowl season. Where the books get it wrong most.">
              <CustomSportIcon>
                {/* Graduation cap - Tabler has no school/graduation icon */}
                <path d="M2 9l10-5 10 5-10 5z" />
                <path d="M6 11v5c0 1.5 3 2.5 6 2.5s6-1 6-2.5v-5" />
                <line x1="22" y1="9" x2="22" y2="14" />
                <circle cx="22" cy="14.5" r="0.5" fill="currentColor" />
              </CustomSportIcon>
            </SportCard>
            <SportCard tag="SOCCER" name="Soccer" desc="Premier League, Champions League, World Cup years. ML, totals, BTTS.">
              <IconBallFootball size={28} stroke={1.5} />
            </SportCard>
            <SportCard tag="TENNIS" name="Tennis" desc="Grand Slams + ATP/WTA majors. Set spreads, total games, H2Hs.">
              <IconBallTennis size={28} stroke={1.5} />
            </SportCard>
            <SportCard tag="ESPORTS" name="Esports" desc="CS, Valorant, League. Money lines, map handicaps, total maps.">
              <IconDeviceGamepad2 size={28} stroke={1.5} />
            </SportCard>
            <SportCard tag="KALSHI" name="Kalshi" desc="CFTC-regulated event contracts. Sports, politics, economics, tech." featured>
              <IconChartLine size={28} stroke={1.5} />
            </SportCard>
            <SportCard tag="POLYMARKET" name="Polymarket" desc="Crypto-native prediction markets. Softest edges in all of betting." featured>
              <IconChartCandle size={28} stroke={1.5} />
            </SportCard>
          </div>
          <div className="inline-cta">
            <div className="inline-cta-text">
              One subscription. Every sport. Every prediction market.
            </div>
            <JoinCta href="/checkout" location="sports-inline">
              Join Lockr →
            </JoinCta>
          </div>
        </div>
      </section>

      {/* Testimonials + bet slips + Discord embeds (the "Results" nav target) */}
      <section id="results" className="fade-in-section">
        <div className="shell">
          <div className="section-head">
            <div className="section-label">Results</div>
            <h2 className="section-title">
              Real members.
              <br />
              Real receipts.
            </h2>
            <p className="section-sub">
              No actor photos. No fake screenshots. The members below are real, and
              they&apos;ll be in the room with you the day you join.
            </p>
          </div>

          {/* Marquee row 1 */}
          <div className="marquee" style={{ marginBottom: 16 }}>
            <div className="marquee-track">
              {[...TESTIMONIALS_ROW_1, ...TESTIMONIALS_ROW_1].map((t, i) => (
                <TestimonialCard key={i} t={t} />
              ))}
            </div>
          </div>

          {/* Marquee row 2 (reverse) */}
          <div className="marquee" style={{ marginBottom: 48 }}>
            <div className="marquee-track reverse">
              {[...TESTIMONIALS_ROW_2, ...TESTIMONIALS_ROW_2].map((t, i) => (
                <TestimonialCard key={i} t={t} />
              ))}
            </div>
          </div>

          {/* Bet slips */}
          <div style={{ textAlign: "center", margin: "64px 0 32px" }}>
            <div className="section-label" style={{ color: "var(--text-mute)" }}>
              Real wins · last 7 days
            </div>
            <h3 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em" }}>
              Member bet slips from this week.
            </h3>
          </div>
          <div className="slips-grid">
            {BET_SLIPS.map((slip) => (
              <TiltCard
                key={slip.handle + slip.date}
                className={`slip ${slip.book}`}
                maxTilt={5}
                scale={1.015}
              >
                <div className="slip-head">
                  <div className="slip-book">{slip.bookLabel}</div>
                  <div className="slip-badges">
                    <div className="slip-clv" title="Closing-line value">
                      CLV {slip.clv}
                    </div>
                    <div className="slip-status">WIN</div>
                  </div>
                </div>
                <div className="slip-leg">
                  <div className="slip-leg-line">{slip.line}</div>
                  <div className="slip-leg-meta">
                    {slip.meta} <span className="slip-leg-result">{slip.result}</span>
                  </div>
                </div>
                <hr className="slip-divider" />
                <div className="slip-foot">
                  <div className="slip-payout">
                    <div className="slip-payout-label">Payout</div>
                    <div className="slip-payout-amount">{slip.payout}</div>
                    <div className="slip-payout-stake">{slip.stake}</div>
                  </div>
                  <div className="slip-member">
                    <div className="slip-member-handle">{slip.handle}</div>
                    <div className="slip-member-date">{slip.date}</div>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>

          {/* Discord embeds */}
          <div style={{ textAlign: "center", margin: "64px 0 32px" }}>
            <div className="section-label" style={{ color: "var(--text-mute)" }}>
              Inside the room
            </div>
            <h3 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em" }}>
              Live from #wins-and-losses
            </h3>
          </div>
          <div className="discord-wrap">
            <div className="discord">
              <div className="discord-channel-bar">
                <span className="discord-hash">#</span> wins-and-losses
              </div>
              <div className="discord-msgs">
                <div className="discord-msg">
                  <div className="discord-avatar a2">JK</div>
                  <div className="discord-body">
                    <div className="discord-name-row">
                      <span className="discord-name">jordan_k</span>
                      <span className="discord-time">Earlier today</span>
                    </div>
                    <div className="discord-text">
                      SGA over 31.5 hit at the buzzer 😤 JT called this one before line
                      moved to -130
                    </div>
                    <div className="discord-img-embed">
                      [ image: bet slip · SGA 33 PTS · +1.82u ]
                    </div>
                    <div className="discord-reactions">
                      <span className="discord-react">🔥 14</span>
                      <span className="discord-react">💰 9</span>
                    </div>
                  </div>
                </div>
                <div className="discord-msg">
                  <div className="discord-avatar a3">DM</div>
                  <div className="discord-body">
                    <div className="discord-name-row">
                      <span className="discord-name">devonm</span>
                      <span className="discord-time">A few hours ago</span>
                    </div>
                    <div className="discord-text">
                      that Kalshi Fed hold position from yesterday, closed at 0.94 from
                      our 0.88 entry. that&apos;s{" "}
                      <span className="green">+6.8% in 18 hours</span>
                    </div>
                    <div className="discord-reactions">
                      <span className="discord-react">🧠 22</span>
                      <span className="discord-react">📈 11</span>
                    </div>
                  </div>
                </div>
                <div className="discord-msg">
                  <div className="discord-avatar a6">MR</div>
                  <div className="discord-body">
                    <div className="discord-name-row">
                      <span className="discord-name" style={{ color: "var(--accent)" }}>
                        jt
                      </span>
                      <span className="discord-creator-tag">CREATOR</span>
                      <span className="discord-time">Just now</span>
                    </div>
                    <div className="discord-text">
                      posted the F1 Monaco breakdown in #long-form. Explains why
                      Verstappen top-3 is still live for tomorrow even at -220
                    </div>
                    <div className="discord-reactions">
                      <span className="discord-react">🏎️ 31</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="discord">
              <div className="discord-channel-bar">
                <span className="discord-hash">#</span> inner-circle
              </div>
              <div className="discord-msgs">
                <div className="discord-msg">
                  <div className="discord-avatar a4">EK</div>
                  <div className="discord-body">
                    <div className="discord-name-row">
                      <span className="discord-name">ethan</span>
                      <span className="discord-ic-tag">★ INNER CIRCLE</span>
                      <span className="discord-time">Yesterday</span>
                    </div>
                    <div className="discord-text">
                      jt the prop model output on Topuria pre-fight was unreal.{" "}
                      <span className="gold">+1.07u</span> at +145 closing. saved me 3
                      hours of tape review
                    </div>
                    <div className="discord-reactions">
                      <span className="discord-react">⚡ 8</span>
                    </div>
                  </div>
                </div>
                <div className="discord-msg">
                  <div className="discord-avatar a1">AM</div>
                  <div className="discord-body">
                    <div className="discord-name-row">
                      <span className="discord-name">amir</span>
                      <span className="discord-ic-tag">★ INNER CIRCLE</span>
                      <span className="discord-time">Yesterday</span>
                    </div>
                    <div className="discord-text">
                      the Polymarket GPT-5 NO position printed today. closed -11% from our
                      entry. <span className="green">+2.76u</span> sized at 2u
                    </div>
                    <div className="discord-reactions">
                      <span className="discord-react">🎯 12</span>
                      <span className="discord-react">🤖 5</span>
                    </div>
                  </div>
                </div>
                <div className="discord-msg">
                  <div className="discord-avatar a6">MR</div>
                  <div className="discord-body">
                    <div className="discord-name-row">
                      <span className="discord-name" style={{ color: "var(--accent)" }}>
                        jt
                      </span>
                      <span className="discord-creator-tag">CREATOR</span>
                      <span className="discord-time">This morning</span>
                    </div>
                    <div className="discord-text">
                      weekly call moved to Thursday 8pm ET. agenda in the pinned message.
                      bring questions on the NBA Finals series price
                    </div>
                    <div className="discord-reactions">
                      <span className="discord-react">📅 18</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="fade-in-section">
        <div className="shell">
          <div className="section-head">
            <div className="section-label">Pricing</div>
            <h2 className="section-title">
              Pick a tier.
              <br />
              Bet tonight.
            </h2>
          </div>
          <PricingCards />
          {/* Last-second trust, concentrated at the buy point. Reuses the
              verified-badge / hero-trust primitives, not new art. */}
          <div className="trust-pills">
            <span className="trust-pill">
              <span className="star" aria-hidden="true">★</span>4.9 member rating
            </span>
            <span className="trust-pill">
              <span className="dot" aria-hidden="true"></span>72%+ win rate, logged
            </span>
            <span className="trust-pill">
              <span className="dot" aria-hidden="true"></span>Cancel anytime · no contract
            </span>
          </div>
          <div className="guarantee">
            <div className="guarantee-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 1 0 9-9" />
                <polyline points="3 4 3 12 11 12" />
              </svg>
            </div>
            <div>
              <div className="guarantee-title">Cancel any time. No retention call.</div>
              <div className="guarantee-sub">
                One-click cancel from your account. No &quot;are you sure&quot; friction,
                no retention department, no email gauntlet. You keep access through the
                end of your billing period. Then you&apos;re done.
              </div>
            </div>
            <div className="guarantee-stat">No hidden fees →</div>
          </div>
        </div>
      </section>

      {/* VS comparison */}
      <section className="fade-in-section">
        <div className="shell">
          <div className="section-head">            <h2 className="section-title">Two ways to buy picks online.</h2>
            <p className="section-sub">
              You&apos;ve seen the other side. Here&apos;s the difference.
            </p>
          </div>
          <div className="vs-section">
            <div className="vs-col them">
              <div className="vs-label">The other guys</div>
              <div className="vs-title">The picks service you&apos;ve already quit.</div>
              <ul className="vs-list">
                <li>Screenshots edited after the fact</li>
                <li>Lambo emojis. &quot;BANGER 🚨🚨🚨&quot; energy</li>
                <li>Lifetime $9.99 every week for &quot;first 5 spots&quot;</li>
                <li>Blocks you in the DMs after a losing week</li>
                <li>Owner is anonymous behind a Bitmoji</li>
                <li>Nobody mentions CLV or unit sizing</li>
                <li>The group goes dark in the summer</li>
                <li>Sells your email to a dozen other lists</li>
              </ul>
            </div>
            <div className="vs-divider">VS</div>
            <div className="vs-col us">
              <div className="vs-label">★ Lockr</div>
              <div className="vs-title">
                The picks service serious bettors stay subscribed to.
              </div>
              <ul className="vs-list">
                <li>Every pick posted live before the event starts</li>
                <li>Strategy + education. No emojis. No costume jewelry</li>
                <li>Cancel in 60 seconds. No retention call, no friction</li>
                <li>We post the losses too, then explain what went wrong</li>
                <li>Real face, real name, real accountability</li>
                <li>Picks plus a system: how much to bet, when to walk away</li>
                <li>Year-round across 10+ sports + prediction markets</li>
                <li>Your email never leaves Lockr&apos;s database</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Disqualifier */}
      <section className="fade-in-section">
        <div className="shell">
          <div className="section-head">            <h2 className="section-title">Is Lockr actually for you?</h2>
            <p className="section-sub">
              We&apos;d rather not have your money than have you cancel angry in 3 weeks.
              Read this before you join.
            </p>
          </div>
          <div className="qual-grid">
            <div className="qual-card yes">
              <div className="qual-icon" aria-hidden="true">✓</div>
              <div className="qual-label">★ Lockr is for you if</div>
              <div className="qual-title">
                You bet, you take it seriously, and you want to compound.
              </div>
              <ul className="qual-list">
                <li>You bet at least once a week and want to win more than you lose</li>
                <li>You&apos;re open to learning a system, not just copying picks blindly</li>
                <li>You understand losing weeks happen and you don&apos;t blame the messenger</li>
                <li>You want a method you can keep using even after you cancel</li>
                <li>You want one place for picks across every sport plus Kalshi and Polymarket</li>
              </ul>
            </div>
            <div className="qual-card no">
              <div className="qual-icon" aria-hidden="true">✕</div>
              <div className="qual-label">Lockr is NOT for you if</div>
              <div className="qual-title">
                You want guaranteed wins or a get-rich-quick play.
              </div>
              <ul className="qual-list">
                <li>You think &quot;picks&quot; means &quot;every bet wins&quot;</li>
                <li>You&apos;ll cancel and chargeback after one losing week</li>
                <li>You can&apos;t risk what you wager, so bet only what you can afford to lose</li>
                <li>You want a group chat full of Lambo emojis and chants</li>
                <li>You expect the team to think for you instead of teaching you to think</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="fade-in-section">
        <div className="shell">
          <div className="section-head">
            <div className="section-label">FAQ</div>
            <h2 className="section-title">The questions everyone asks.</h2>
          </div>
          <Faq />
          {/* FAQPage JSON-LD for rich snippets in Google */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }}
          />
        </div>
      </section>

      {/* Final CTA */}
      <section className="fade-in-section">
        <div className="shell">
          <div className="final-cta">
            <div className="final-cta-content">
              <h2
                style={{
                  fontSize: "clamp(36px, 5vw, 56px)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  marginBottom: 16,
                }}
              >
                Stop scrolling.
                <br />
                Start tailing.
              </h2>
              <p
                style={{
                  color: "var(--text-mute)",
                  fontSize: 17,
                  maxWidth: 520,
                  margin: "0 auto 32px",
                }}
              >
                Link Discord in your account, claim access, and your role assigns
                in under 30 seconds. The next pick drops soon after.
              </p>
              <JoinCta href="/checkout" location="final-cta">
                Join Lockr · from $29/wk
              </JoinCta>
              <div
                style={{
                  marginTop: 16,
                  fontSize: 12,
                  color: "var(--text-dim)",
                }}
              >
                No contract. Cancel any time. Every play logged in the open.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------
   Small inline helpers - keep them next to the page that uses them.
   ------------------------------------------------------------------ */
// Sportsbook wall mark - two modes:
//   1. `src` provided → render real logo file from /public/logos/
//   2. otherwise → brand-colored initial badge placeholder
// Mixed mode is intentional: drop real assets in as you collect them
// from each affiliate program's media kit; remaining brands keep the
// placeholder badge until their file lands.
function SportsbookMark({
  name,
  color,
  initials,
  src,
}: {
  name: string;
  color: string;
  initials: string;
  src?: string;
}) {
  return (
    <div className="book-mark" title={name}>
      {src ? (
        <Image
          src={src}
          alt={`${name} logo`}
          width={48}
          height={48}
          className="book-mark-img"
        />
      ) : (
        <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
          <rect x="2" y="2" width="44" height="44" rx="11" fill={color} />
          <text
            x="24"
            y="24"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#fff"
            fontFamily="var(--font-inter), 'Inter', system-ui, sans-serif"
            fontWeight="800"
            fontSize={initials.length > 1 ? "16" : "22"}
            letterSpacing="-0.04em"
          >
            {initials}
          </text>
        </svg>
      )}
      <div className="book-mark-name">{name}</div>
    </div>
  );
}

function SportCard({
  tag,
  name,
  desc,
  featured,
  children,
}: {
  tag: string;
  name: string;
  desc: string;
  featured?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`sport-card${featured ? " featured" : ""}`}>
      <div className="sport-icon">{children}</div>
      <div className="sport-tag">
        <span className="sport-tag-dot"></span>
        {tag}
      </div>
      <div className="sport-name">{name}</div>
      <div className="sport-desc">{desc}</div>
    </div>
  );
}

// Wrapper so hand-drawn icons match Tabler's API + visual weight.
function CustomSportIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

function TestimonialCard({ t }: { t: import("@/lib/testimonials").Testimonial }) {
  return (
    <div className="marquee-card">
      <div className="marquee-head">
        <div className="marquee-avatar">{t.initials}</div>
        <div>
          <div className="marquee-name">{t.name}</div>
          <div className="marquee-handle">{t.handle}</div>
        </div>
      </div>
      <p className="marquee-body">&ldquo;{t.body}&rdquo;</p>
      <div className="marquee-result">
        <span>P/L</span>
        <span>{t.pl}</span>
      </div>
    </div>
  );
}
