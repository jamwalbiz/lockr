import type { Metadata } from "next";
import Image from "next/image";
import { BreadcrumbsLd } from "@/components/BreadcrumbsLd";

export const metadata: Metadata = {
  title: "About — Lockr",
  description:
    "Everyone shows you their wins. Lockr shows you everything — every play logged, win or loss, never deleted. The sports betting + prediction markets intelligence brand, founded by Jairo Tovar.",
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
          <h1>Everyone shows you their wins. Lockr shows you everything.</h1>
          <p>
            I&apos;m Jairo Tovar — most people call me JT, and I founded Lockr. Most
            betting services are run by people who&apos;ve gotten lucky a few times and
            screenshot the wins — or people who just fake them outright. I wasn&apos;t
            interested in building either one.
          </p>
          <p>
            I started betting in college and treated it like a hobby. Then I started
            treating it like a job — line movement, value, arbitrage between sportsbooks
            and prediction markets, the science of actually getting better prices than the
            book. I built a process I could repeat, and I posted every bet in public with
            a timestamp. Win or lose, it all went up — and stayed up.
          </p>
          <p>
            Lockr is what I wish existed when I started: the intelligence brand for sports
            betting and prediction markets, built with a small team that cares about the
            craft. Real plays with the reasoning and the right size on every one — and
            whether you&apos;ve bet for years or you&apos;re placing your first one, we
            walk you through it. No hype. Just edges, in the open.
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
          {/* Founder portrait placeholder. The Lockr brand icon sits
              centered behind the .about-img::before "JAIRO TOVAR · JT"
              pseudo-element so the card reads as intentional brand-
              typographic instead of a blank box.

              TO SWAP IN THE REAL PHOTO when it's shot (specs in
              docs/asset-specs.md):
                1. Save as /public/brand/jt-portrait.jpg (1600x2000, 4:5).
                2. Replace the <Image src="/brand/lockr-icon-512.png" .../>
                   below with:
                     <Image
                       src="/brand/jt-portrait.jpg"
                       alt="Jairo Tovar — founder of Lockr"
                       fill
                       sizes="(max-width: 768px) 100vw, 40vw"
                       priority
                       style={{ objectFit: "cover" }}
                     />
                3. Drop the .about-img::before pseudo-element in
                   globals.css (the "JAIRO TOVAR · JT" text — the real
                   photo will cover it). */}
          <Image
            src="/brand/lockr-icon-512.png"
            alt=""
            width={220}
            height={220}
            priority
            style={{ opacity: 0.3, position: "relative", zIndex: 0 }}
          />
        </div>
      </div>

      <section id="methodology" style={{ paddingTop: 80 }}>
        <h2 className="section-title" style={{ marginBottom: 32 }}>
          My methodology, in 90 seconds.
        </h2>
        <div className="method-grid">
          <div className="method-card">
            <div className="method-icon" aria-hidden="true">
              {/* Model: two diverging lines — our projection vs the book's */}
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 24l6-6 5 3 8-10 5 3" />
                <path d="M4 28l6-2 5 2 8-4 5 2" strokeDasharray="2 2" opacity="0.5" />
                <circle cx="22" cy="11" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <div className="num">01 · MODEL</div>
            <h3>Build the line yourself</h3>
            <p>
              For every market we touch, we project the line ourselves before looking at
              the book. The gap between our line and the book is the edge.
            </p>
          </div>
          <div className="method-card">
            <div className="method-icon" aria-hidden="true">
              {/* Price: line dropping (line moves toward our entry) */}
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 8l8 6 6-3 10 4" />
                <circle cx="4" cy="8" r="1.5" fill="currentColor" />
                <path d="M4 8v18M4 26h22" />
                <text x="14" y="22" fontSize="6" fill="currentColor" stroke="none" fontFamily="var(--font-jetbrains), monospace" fontWeight="700">+CLV</text>
              </svg>
            </div>
            <div className="num">02 · PRICE</div>
            <h3>Beat the book to the line</h3>
            <p>
              Just because a pick wins doesn&apos;t mean it was a good bet. We measure
              whether we got a better price than the line settled at — the only thing that
              proves a real edge over time.
            </p>
          </div>
          <div className="method-card">
            <div className="method-icon" aria-hidden="true">
              {/* Size: target with center dot */}
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="16" cy="16" r="12" />
                <circle cx="16" cy="16" r="7" />
                <circle cx="16" cy="16" r="2.5" fill="currentColor" />
                <path d="M16 2v4M16 26v4M2 16h4M26 16h4" />
              </svg>
            </div>
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
