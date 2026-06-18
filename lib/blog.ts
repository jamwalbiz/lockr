// Blog content layer. Posts live as markdown files in content/blog/*.md with
// YAML frontmatter. Adding a post = dropping a file in that folder, which is
// what makes the "automated blog posts" pipeline simple: a script (or JT) can
// generate a new .md and the route, sitemap, and RSS feed pick it up on build.
//
// Server-only (reads the filesystem). Imported by server components, the RSS
// route handler, sitemap.ts, and generateStaticParams.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export type FaqItem = { q: string; a: string };

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO yyyy-mm-dd (published)
  updated: string; // ISO yyyy-mm-dd (last meaningful edit; defaults to date)
  category: string;
  keywords: string[];
  readMinutes: number;
  author: string;
  featured: boolean; // pin to the top of the feed (timely flagship posts)
  faq: FaqItem[];
};

export type Post = PostMeta & { bodyMarkdown: string; bodyHtml: string };

function coerceDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string" && value.length >= 10) return value.slice(0, 10);
  return "2026-01-01";
}

function listSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getAllSlugs(): string[] {
  return listSlugs();
}

export function getPost(slug: string): Post | null {
  const file = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const bodyHtml = marked.parse(content, { async: false }) as string;
  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    date: coerceDate(data.date),
    updated: data.updated ? coerceDate(data.updated) : coerceDate(data.date),
    category: String(data.category ?? "Guide"),
    keywords: Array.isArray(data.keywords) ? data.keywords.map(String) : [],
    readMinutes: Number(data.readMinutes ?? 5),
    author: String(data.author ?? "JT, Lockr"),
    featured: Boolean(data.featured),
    faq: Array.isArray(data.faq)
      ? data.faq.map((f: { q?: unknown; a?: unknown }) => ({
          q: String(f.q ?? ""),
          a: String(f.a ?? ""),
        }))
      : [],
    bodyMarkdown: content,
    bodyHtml,
  };
}

/** All posts, newest first, metadata only (no rendered body). */
export function getAllPostMeta(): PostMeta[] {
  return listSlugs()
    .map((slug) => getPost(slug))
    .filter((p): p is Post => Boolean(p))
    .sort(
      (a, b) =>
        (b.featured ? 1 : 0) - (a.featured ? 1 : 0) ||
        (a.date < b.date ? 1 : -1),
    )
    .map(({ bodyMarkdown: _b, bodyHtml: _h, ...meta }) => meta);
}

/**
 * Related posts for internal linking: same category scores highest, then shared
 * keywords, with recency as the tiebreak. Builds the topical cluster that helps
 * both SEO authority and on-site retention.
 */
export function getRelatedPosts(slug: string, limit = 3): PostMeta[] {
  const all = getAllPostMeta();
  const current = all.find((p) => p.slug === slug);
  if (!current) return all.filter((p) => p.slug !== slug).slice(0, limit);
  const kw = new Set(current.keywords.map((k) => k.toLowerCase()));
  return all
    .filter((p) => p.slug !== slug)
    .map((p) => {
      let score = p.category === current.category ? 3 : 0;
      for (const k of p.keywords) if (kw.has(k.toLowerCase())) score += 1;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score || (a.p.date < b.p.date ? 1 : -1))
    .slice(0, limit)
    .map((x) => x.p);
}
