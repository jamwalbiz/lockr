import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbsLd } from "@/components/BreadcrumbsLd";
import { getAllPostMeta } from "@/lib/blog";

const BASE = "https://joinlockr.com";
const INSTAGRAM = "https://www.instagram.com/joinlockr";

export const metadata: Metadata = {
  title: "JT (Jairo Tovar), founder of Lockr",
  description:
    "Jairo Tovar, who goes by JT, is the founder of Lockr. He posts the day's best plays across sports and prediction markets, in the open, before the line moves.",
  alternates: { canonical: `${BASE}/about/jt` },
};

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Jairo Tovar",
  alternateName: "JT",
  url: `${BASE}/about/jt`,
  image: `${BASE}/apple-icon`,
  jobTitle: "Founder",
  worksFor: { "@type": "Organization", name: "Lockr", url: BASE },
  sameAs: [INSTAGRAM],
  knowsAbout: [
    "Sports betting",
    "Prediction markets",
    "Kalshi",
    "Polymarket",
    "Bankroll management",
    "Closing line value",
  ],
};

export default function AboutJtPage() {
  const recent = getAllPostMeta().slice(0, 4);
  return (
    <div className="shell author-shell">
      <BreadcrumbsLd
        trail={[
          { name: "Home", url: `${BASE}/` },
          { name: "JT (Jairo Tovar)", url: `${BASE}/about/jt` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />

      <article className="author-card">
        <div className="author-head">
          <div className="author-avatar" aria-hidden="true">
            <span className="author-avatar-dot" />
            <span className="author-avatar-mark">LOCKR</span>
          </div>
          <div>
            <h1 className="author-name">Jairo Tovar</h1>
            <div className="author-role">Goes by JT &middot; Founder, Lockr</div>
            <div className="author-links">
              <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer me">
                Instagram
              </a>
              <a href="mailto:hello@joinlockr.com">hello@joinlockr.com</a>
              <Link href="/blog">Read The Edge</Link>
            </div>
          </div>
        </div>

        <div className="author-bio">
          <p>
            Jairo Tovar, who goes by JT, founded Lockr to do one thing well: post
            the day&apos;s best plays across sports and prediction markets, in the
            open, before the line moves, so members can tail them.
          </p>
          <p>
            He treats Kalshi and Polymarket as equal ground with the sportsbooks,
            not a side feature. Every play is logged live, wins and losses, and
            nothing gets deleted. The idea is simple. Show the work, talk in plain
            English, and teach people how to size a bet and walk away, not just
            what to put money on.
          </p>
          <p className="author-fine">
            Lockr is an education and entertainment service. The plays are
            opinions, not financial or wagering advice. Bet only what you can
            afford to lose. Eligibility and minimum age depend on your
            jurisdiction. If gambling is becoming a problem, call 1-800-GAMBLER.
          </p>
        </div>

        {recent.length > 0 && (
          <nav className="author-recent" aria-label="Recent guides by JT">
            <div className="author-recent-label">Recent from JT</div>
            <ul>
              {recent.map((p) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="author-recent-link">
                    <span className="author-recent-cat">{p.category}</span>
                    <span className="author-recent-title">{p.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </article>
    </div>
  );
}
