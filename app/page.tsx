import Image from "next/image";
import { CountUp } from "@/components/CountUp";
import { JoinCta } from "@/components/JoinCta";
import { Magnetic } from "@/components/Magnetic";
import { PRICING } from "@/lib/copy";
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
import { Cinematic } from "@/components/Cinematic";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SpotlightObserver } from "@/components/SpotlightObserver";
import { PickCards } from "@/components/PickCards";
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

      {/* GSAP cinematic scroll layer (title wipes, hero depth, footer rise). */}
      <Cinematic />

      {/* Scroll-depth indicator for the long single-page funnel. */}
      <ScrollProgress />

      {/* Cursor-spotlight glow on the feature-card grids. */}
      <SpotlightObserver />

      {/* Hero - asymmetric split: the pitch on the left, a small deck of
          tonight's pick cards on the right (Betr / PrizePicks-style). The
          cards are the memorable element - they show what you actually get. */}
      <section className="hero">
        <div className="hero-grid" aria-hidden="true"></div>
        <div className="hero-glow" aria-hidden="true"></div>
        {/* Animated "lightning" - diagonal neon light beams sweeping the
            upper-right. Pure CSS (no JS); masked away from the left text. */}
        <div className="hero-lightning" aria-hidden="true">
          <div className="beam" />
        </div>
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
                Every day, the best plays across sports and prediction markets. We call
                them before the line moves, so you&apos;re on the winning number. You just
                tail.
              </p>
              <div className="hero-cta-row hero-rv" style={{ animationDelay: "0.38s" }}>
                <Magnetic strength={0.35}>
                  <JoinCta href="/checkout" location="hero">
                    Get today&apos;s picks · $29/wk
                  </JoinCta>
                </Magnetic>
                <a href="#intro" className="btn btn-secondary btn-lg">
                  See how it works
                </a>
              </div>
              <div className="hero-stats hero-rv" style={{ animationDelay: "0.46s" }}>
                <div className="hero-stat">
                  <span className="hero-stat-fig">72%+</span>
                  <span className="hero-stat-label">Win rate</span>
                </div>
                <div className="hero-stat">
                  <span className="hero-stat-fig">
                    4.9<span className="hero-stat-star" aria-hidden="true">★</span>
                  </span>
                  <span className="hero-stat-label">Member rating</span>
                </div>
                <div className="hero-stat">
                  <span className="hero-stat-fig">Cancel</span>
                  <span className="hero-stat-label">Any time</span>
                </div>
              </div>
            </div>

            <div className="hero-right hero-rv" style={{ animationDelay: "0.3s" }}>
              <div className="pick-glow" aria-hidden="true"></div>
              <PickCards />
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
          <div className="section-head head-wide">
            <h2 className="section-title">
              How Lockr finds edges
              <br />
              your book is missing.
            </h2>
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
          <div className="section-head head-wide">
            <h2 className="section-title">
              Built for bettors who
              <br />
              actually want to win.
            </h2>
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
              <h3>Prediction markets</h3>
              <p>
                Almost nobody else covers Kalshi or Polymarket. We work them right
                alongside the sportsbooks, where the lines are softest and the edges are
                biggest. It&apos;s where the smart money is moving, and you&apos;re early.
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
              From signup to your first play
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
              <h3>Pick a tier, get in</h3>
              <p>
                Check out in 60 seconds with card, Apple Pay, Cash App, or bank.
                Link Discord and you&apos;re in instantly. No approval, no waiting.
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
              <h3>Know what to bet, and why</h3>
              <p>
                The team posts 6–10 plays a day across sports and prediction markets,
                each with the reasoning, a recommended size, and the exact line we took.
              </p>
            </div>
            <div className="step">
              <div className="step-num">
                03<span className="step-num-divider"></span>TAIL &amp; TRACK
              </div>
              <div className="step-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <h3>See every result, win or loss</h3>
              <p>
                Tail each play on whatever platform you use, PrizePicks, Underdog,
                Kalshi, or Polymarket. Every result is logged in public before the
                event and never deleted.
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
              Every sport and
              <br />
              prediction market.
            </h2>
            <p className="section-sub">
              10+ sports and the prediction markets almost nobody else covers, Kalshi and
              Polymarket. One subscription, year-round, no summer drought.
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
              On the record.
              <br />
              Win or loss.
            </h2>
            <p className="section-sub">
              A sample of member results below. Every pick is posted in public before the
              event, win or loss, and never deleted, so the record speaks for itself.
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
            <div className="mini-kicker">
              Cashed
            </div>
            <h3 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em" }}>
              Every play logged in public. Here are the wins.
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
            <div className="mini-kicker">
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
              Bet <span className="t-accent">tonight</span>.
            </h2>
          </div>
          <div className="pricing-stage">
            <div className="price-rail">
              <div className="price-rail-kicker">Entry price</div>
              <div className="price-rail-figure">
                <span className="cur">$</span>
                {PRICING.subscription.weekly.price.replace(/[^0-9]/g, "")}
                <span className="per">/wk</span>
              </div>
              <p className="price-rail-foot">
                <strong>One price, both tiers below.</strong>
              </p>
              {/* Proof concentrated at the buy point, consolidated into the rail
                  (was a disconnected row of glass pills below the stage). */}
              <ul className="price-rail-proof">
                <li>
                  <span className="star" aria-hidden="true">★</span>
                  <span className="v">4.9</span> member rating
                </li>
                <li>
                  <span className="dot" aria-hidden="true"></span>
                  <span className="v">72%+</span> win rate
                </li>
                <li>
                  <span className="dot" aria-hidden="true"></span>
                  Cancel any time, no contract
                </li>
              </ul>
            </div>
            <PricingCards />
          </div>
        </div>
      </section>

      {/* VS comparison - paired rows that interleave (them, us, them, us...)
          on mobile, color-coded so the contrast survives single-column. */}
      <section className="fade-in-section">
        <div className="shell">
          <div className="section-head head-wide">
            <h2 className="section-title">
              The other guys hope
              <br />
              you never compare.
            </h2>
            <p className="section-sub">
              You&apos;ve seen the other side. Here&apos;s the difference.
            </p>
          </div>
          <div className="vs-grid">
            <div className="vs-head them">
              <div className="vs-label">The other guys</div>
              <div className="vs-title">The group you&apos;ve already quit.</div>
            </div>
            <div className="vs-head us">
              <div className="vs-label">★ Lockr</div>
              <div className="vs-title">The one serious bettors actually stay subscribed to.</div>
            </div>

            <div className="vs-row them">Deletes the losing picks so the record stays clean</div>
            <div className="vs-row us">We post the losses too, then explain what went wrong</div>

            <div className="vs-row them">Screenshots edited after the fact</div>
            <div className="vs-row us">Every pick posted live, before the event starts</div>

            <div className="vs-row them">Blocks you in the DMs after a losing week</div>
            <div className="vs-row us">Cancel in 60 seconds. No retention call</div>

            <div className="vs-row them">Anonymous owner behind a Bitmoji</div>
            <div className="vs-row us">Real face, real name, real accountability</div>

            <div className="vs-row them">Sells your email to a dozen other lists</div>
            <div className="vs-row us">Your email never leaves Lockr</div>
          </div>
        </div>
      </section>

      {/* Disqualifier */}
      <section className="fade-in-section">
        <div className="shell">
          <div className="section-head head-wide">
            <h2 className="section-title">Is Lockr actually for you?</h2>
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
                You bet seriously and you want a real edge.
              </div>
              <ul className="qual-list">
                <li>You bet most weeks and you want to get sharper at it</li>
                <li>You want to understand the play, not just copy a number</li>
                <li>You think in seasons, not single nights</li>
                <li>You want every call logged in the open, win or loss</li>
              </ul>
            </div>
            <div className="qual-card no">
              <div className="qual-icon" aria-hidden="true">✕</div>
              <div className="qual-label">Lockr is NOT for you if</div>
              <div className="qual-title">
                You want guaranteed wins or a get-rich-quick play.
              </div>
              <ul className="qual-list">
                <li>You think &quot;picks&quot; means every bet cashes</li>
                <li>You&apos;d bail the first time things go cold</li>
                <li>You want someone to bet for you, not show you how</li>
                <li>You&apos;re chasing money you&apos;d be better off keeping</li>
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
              <Magnetic strength={0.35}>
                <JoinCta href="/checkout" location="final-cta">
                  Join Lockr · from $29/wk
                </JoinCta>
              </Magnetic>
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
        <span>Profit</span>
        <span>{t.pl}</span>
      </div>
    </div>
  );
}
