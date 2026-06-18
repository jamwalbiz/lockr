import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbsLd } from "@/components/BreadcrumbsLd";
import { getAllPostMeta } from "@/lib/blog";

const BASE = "https://joinlockr.com";

export const metadata: Metadata = {
  title: "The Edge — sports betting & prediction market guides | Lockr",
  description:
    "Plain-English guides to sports betting and prediction markets (Kalshi, Polymarket): tailing, closing line value, bankroll, and how sharp bettors actually think.",
  alternates: {
    canonical: `${BASE}/blog`,
    types: { "application/rss+xml": `${BASE}/feed.xml` },
  },
};

export default function BlogIndex() {
  const posts = getAllPostMeta();
  return (
    <div className="shell blog-shell">
      <BreadcrumbsLd
        trail={[
          { name: "Home", url: `${BASE}/` },
          { name: "Blog", url: `${BASE}/blog` },
        ]}
      />
      <header className="section-head head-wide">
        <div className="section-label">The Edge</div>
        <h1 className="section-title">Get sharper every week.</h1>
        <p className="section-sub">
          Plain-English breakdowns of sports betting and prediction markets. No
          jargon, no hype. Just how the edges actually work, and how to use them.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="blog-empty">New guides are dropping soon.</p>
      ) : (
        <ul className="blog-list">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`} className="blog-card">
                <div className="blog-card-meta">
                  <span className="blog-card-cat">{p.category}</span>
                  <span className="blog-card-read">{p.readMinutes} min read</span>
                </div>
                <h2 className="blog-card-title">{p.title}</h2>
                <p className="blog-card-desc">{p.description}</p>
                <span className="blog-card-cta">Read the guide →</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
