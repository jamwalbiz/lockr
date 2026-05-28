import type { Metadata } from "next";
import { BreadcrumbsLd } from "@/components/BreadcrumbsLd";

export const metadata: Metadata = {
  title: "About — Lockr",
  description:
    "I'm Jairo Tovar — JT. I lost $40,000 the year I started betting. Then I built Lockr. Premium picks + intelligence for serious bettors.",
};

export default function AboutPage() {
  return (
    <div className="shell">
      <BreadcrumbsLd
        trail={[
          { name: "Home", url: "https://joinlockr.com/" },
          { name: "About", url: "https://joinlockr.com/about" },
        ]}
      />
      <div className="about-hero">
        <div className="about-text">
          <div className="section-label">About</div>
          <h1>I lost $40,000 the year I started betting. Then I built Lockr.</h1>
          <p>
            I&apos;m Jairo Tovar — most people call me JT. Most picks Discords are run by
            people who&apos;ve gotten lucky a few times and screenshot the wins — or
            people who just fake them outright. I&apos;m not interested in either
            business.
          </p>
          <p>
            I started betting in college. Lost most of what I had. Spent years studying it
            like a job — line movement, value, arbitrage between sportsbooks and
            prediction markets, the science of actually getting better prices than the
            book. Built a process I could repeat. Logged every bet I made in public
            Discords with a timestamp. Posted everything, win or lose.
          </p>
          <p>
            Lockr is what I wish existed when I started: a premium picks + intelligence
            service that respects your bankroll and your time. Built with a small team of
            analysts who care about the craft. Just edges, plus the playbook for actually
            using them.
          </p>
          <div className="about-meta">
            <div className="about-meta-stat">
              <div className="num mono">+147u</div>
              <div className="label">12-mo units won</div>
            </div>
            <div className="about-meta-stat">
              <div className="num mono">60%+</div>
              <div className="label">Win rate</div>
            </div>
            <div className="about-meta-stat">
              <div className="num mono">4.9★</div>
              <div className="label">Member rating</div>
            </div>
          </div>
        </div>
        <div className="about-img">
          {/*
            Founder portrait placeholder. Replace with high-contrast low-light
            photography (Whoop founder portrait style, not Tate yacht style)
            once asset is delivered. See lockr_handoff_brief.md §5 "Must replace
            before launch".
          */}
          <div className="about-img-meta">[ FOUNDER PORTRAIT PLACEHOLDER ]</div>
        </div>
      </div>

      <section id="methodology" style={{ paddingTop: 80 }}>
        <h2 className="section-title" style={{ marginBottom: 32 }}>
          My methodology, in 90 seconds.
        </h2>
        <div className="method-grid">
          <div className="method-card">
            <div className="num">01 · MODEL</div>
            <h3>Build the line yourself</h3>
            <p>
              For every market we touch, we project the line ourselves before looking at
              the book. The gap between our line and the book is the edge.
            </p>
          </div>
          <div className="method-card">
            <div className="num">02 · PRICE</div>
            <h3>Beat the book to the line</h3>
            <p>
              Just because a pick wins doesn&apos;t mean it was a good bet. We measure
              whether we got a better price than the line settled at — the only thing that
              proves a real edge over time.
            </p>
          </div>
          <div className="method-card">
            <div className="num">03 · SIZE</div>
            <h3>Bet the right amount</h3>
            <p>
              Every pick has a size recommendation — not just &quot;the play.&quot;
              Discipline on how much you risk per bet matters more than picking winners.
              We tell you both.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
