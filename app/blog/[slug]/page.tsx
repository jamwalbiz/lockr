import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbsLd } from "@/components/BreadcrumbsLd";
import { getAllSlugs, getPost, getRelatedPosts } from "@/lib/blog";

const BASE = "https://joinlockr.com";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Guide not found | Lockr" };
  const url = `${BASE}/blog/${slug}`;
  return {
    title: `${post.title} | Lockr`,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const url = `${BASE}/blog/${slug}`;
  const related = getRelatedPosts(slug, 3);
  const showUpdated = post.updated > post.date;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated,
    author: {
      "@type": "Person",
      name: "Jairo Tovar",
      alternateName: "JT",
      url: `${BASE}/about/jt`,
    },
    publisher: {
      "@type": "Organization",
      name: "Lockr",
      url: BASE,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    keywords: post.keywords.join(", "),
    articleSection: post.category,
    isAccessibleForFree: true,
  };

  const faqLd =
    post.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  return (
    <div className="shell blog-shell">
      <BreadcrumbsLd
        trail={[
          { name: "Home", url: `${BASE}/` },
          { name: "Blog", url: `${BASE}/blog` },
          { name: post.title, url },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}

      <article className="blog-article">
        <Link href="/blog" className="blog-back">
          ← All guides
        </Link>
        <div className="blog-article-meta">
          <span className="blog-card-cat">{post.category}</span>
          <span className="blog-card-read">{post.readMinutes} min read</span>
        </div>
        <h1 className="blog-article-title">{post.title}</h1>
        <div className="blog-article-byline">
          By{" "}
          <Link href="/about/jt" className="blog-byline-author">
            {post.author}
          </Link>{" "}
          · {formatDate(post.date)}
          {showUpdated ? ` · Updated ${formatDate(post.updated)}` : ""}
        </div>

        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
        />

        {post.faq.length > 0 && (
          <section className="blog-faq" aria-label="Frequently asked questions">
            <h2>Common questions</h2>
            <dl>
              {post.faq.map((f, i) => (
                <div key={i} className="blog-faq-item">
                  <dt>{f.q}</dt>
                  <dd>{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <aside className="blog-cta">
          <div className="blog-cta-label">Stop reading. Start tailing.</div>
          <p>
            Lockr posts the day&apos;s best plays across sports and prediction
            markets before the line moves. You just tail.
          </p>
          <Link href="/checkout" className="btn btn-primary btn-lg">
            See today&apos;s picks · $29/wk
          </Link>
          <p className="blog-cta-fine">
            Education and entertainment only. Picks are opinions, not advice. Bet
            only what you can afford to lose. 21+ where applicable. 1-800-GAMBLER.
          </p>
        </aside>

        {related.length > 0 && (
          <nav className="blog-related" aria-label="Related guides">
            <div className="blog-related-label">Keep reading</div>
            <ul>
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/blog/${r.slug}`} className="blog-related-link">
                    <span className="blog-related-cat">{r.category}</span>
                    <span className="blog-related-title">{r.title}</span>
                    <span className="blog-related-arrow" aria-hidden="true">
                      &rarr;
                    </span>
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
