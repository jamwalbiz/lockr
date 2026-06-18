# Lockr GEO/SEO implementation spec

From the distribution-engine research. Items are prioritized; effort S/M/L.

### Build the /about/jt author page + wire a real author Person object (the single biggest E-E-A-T gap).
- **Why:** Article schema currently ships author as a bare name string ({"@type":"Person",name:post.author} in app/blog/[slug]/page.tsx line ~71). Named, verifiable bylines are the strongest buffer against the March 2026 core update that cut 60%+ traffic from anonymized gambling sites. No /about/jt route exists yet, so the author has no entity to point to.
- **Effort:** M  ·  **Needs:** JT (Jairo Tovar) real LinkedIn URL, X profile, a 100-150 word honest bio, and a real photo. Do not fabricate credentials or a win history. Add lib/authors.ts exporting {name,url:'https://joinlockr.com/about/jt',sameAs:[linkedin,x],jobTitle:'Founder, Lockr',image}. Update articleLd.author to spread that object.

### Allow AI crawlers explicitly in app/robots.ts (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended) while keeping /checkout and /api blocked.
- **Why:** The most common cause of zero AI citations is bots being blocked. Current robots.ts only has a single User-agent:* rule. Perplexity can cite in 2-7 days and Claude in 14-45 once allowed. This is a near-zero-effort unlock with outsized payoff since AI search converts far higher than organic.
- **Effort:** S  ·  **Needs:** Nothing. Add explicit per-bot rules in the rules array of app/robots.ts. Keep disallow [/checkout, /api/] on each.

### Decide and fix the FAQPage schema exposure on app/page.tsx (line ~46) and app/blog/[slug]/page.tsx (line ~87).
- **Why:** The research flags FAQPage as restricted to government/health sites; Google has been narrowing FAQ rich results since 2023. For a YMYL gambling marketing page this can read as schema spam. Lowest-risk move is to keep FAQ as visible on-page content (great for AI passage extraction) but drop FAQPage JSON-LD from the marketing homepage, and keep it on genuinely educational blog posts only where the Q and A match visible text exactly.
- **Effort:** S  ·  **Needs:** Audit decision from JT. At minimum remove FAQPage JSON-LD from app/page.tsx. On blog, gate faqLd so it only emits when every Q/A is visibly rendered on the page (it currently is via lib/faq).

### Add a real dateModified field to blog frontmatter and schema, separate from date.
- **Why:** Article schema in app/blog/[slug]/page.tsx hardcodes dateModified: post.date, so freshness signals never update. Posts refreshed in the last 30-90 days see materially higher AI citation frequency. A separate updated field lets JT bump freshness without faking the original publish date.
- **Effort:** S  ·  **Needs:** Add optional updated: ISO date to PostMeta in lib/blog.ts, default to date when absent. Use it for dateModified and show a small 'Updated {date}' line when updated > date.

### Publish the 3 pillar education pieces as the citation moat: kalshi-vs-polymarket, how-to-trade-kalshi, how-to-trade-polymarket.
- **Why:** Prediction markets hit record volume in mid 2026, making 'Kalshi vs Polymarket' and 'how to trade prediction markets' high-intent, low-competition queries with an 8-week AI citation window. This is where Lockr's equal sports/prediction-market positioning becomes a differentiator no sportsbook content has.
- **Effort:** L  ·  **Needs:** Real sourced stats (cite Kalshi/Polymarket, CFTC, Pew, CoinDesk inline; do not invent volume or share numbers). Each post: a 40-60 word direct answer under each H2, 2-3 cited stats, JT byline, comparison table. Drops straight into content/blog as .md.

### Restructure existing and new blog posts so every H2 opens with a 40-60 word direct answer to the implied question, with one cited stat.
- **Why:** LLMs extract passages, not pages. A question-led H2 plus a self-contained answer paragraph is what Perplexity and Claude lift verbatim. Adding a statistic and citing a third party measurably increases citation rate. This is a writing-template change, not an engineering one.
- **Effort:** M  ·  **Needs:** An editorial template (can live as a comment block in lib/blog.ts or a CONTRIBUTING note) plus 5-10 verifiable sources per topic. No fabricated numbers.

### Enrich Organization JSON-LD in app/layout.tsx with responsible-gaming references and confirm the founder Person links out.
- **Why:** Responsible gambling markup is both a YMYL trust signal and compliance hygiene. The Organization block already names Jairo Tovar as founder but has no sameAs on him and no link to /responsible-gaming. Adding founder.url -> /about/jt and a responsible-gaming reference strengthens the entity graph.
- **Effort:** S  ·  **Needs:** The /about/jt route to exist first. Add founder.url and a knowsAbout / mainEntityOfPage hint, and reference https://joinlockr.com/responsible-gaming.

### Add a sitewide sticky compliance footer element: 21+ badge, 'Picks are opinions, not advice', 1-800-GAMBLER link, and a /responsible-gaming link.
- **Why:** FTC and platform rules require responsible-gambling and non-advice framing on every touchpoint. A persistent footer also reinforces YMYL trust on every crawled page. The responsible-gaming page already exists with 1-800-GAMBLER; this surfaces it everywhere.
- **Effort:** S  ·  **Needs:** Confirm the exact disclaimer line with JT. Reuse existing Footer component; do not claim a license Lockr does not hold.

### Add 3-5 contextual internal links per article plus a RelatedArticles block at the end of each blog post.
- **Why:** AI crawlers infer topic authority from link topology. Siloed posts read as standalone; a networked cluster (Kalshi post links to Prediction Markets 101, Bankroll Management, and the membership value-prop) signals expertise. Use descriptive anchors, never 'click here'.
- **Effort:** M  ·  **Needs:** A topic-cluster map of existing + planned posts. A <RelatedArticles limit={3}/> component reading lib/blog.ts by shared category/keywords.

### Generate /llms.txt (and optionally /llms-full.txt) as a static route, but treat it as low priority.
- **Why:** Google has publicly stated llms.txt does not affect AI Overviews, and mainstream LLMs barely read it. Real value is developer-tooling discovery and a tidy machine-readable index of Lockr's honest pages. Cheap to ship, low expected payoff, so do it after bots/bylines/pillars.
- **Effort:** S  ·  **Needs:** Final page URLs. Serve via app/llms.txt/route.ts returning the file contents provided in this deliverable with text/plain.

## Tool / MCP / skill map

| Tool | Purpose | Status |
|---|---|---|
| Next.js app/robots.ts + app/llms.txt route (already in repo) | Allow AI crawlers and publish the machine-readable index. Pure code change, no external dependency. | manual |
| Claude Code (this environment) + the lockr repo | Implement all on-site schema, author page, robots changes, pillar posts, and the llms.txt route directly in /Users/arnavjamwal/lockr. | connected |
| WebSearch / WebFetch (deferred Claude tools) | Pull and verify the Kalshi/Polymarket/CFTC/Pew stats that the pillar posts and whitepaper must cite. Load via ToolSearch before use. | needs-install |
| deep-research skill (available) | Run the multi-source, fact-checked pass behind the whitepaper and the 'Kalshi vs Polymarket' pillar so every number is sourced, not invented. | connected |
| brand-voice skills (enforce-voice, generate-guidelines) | Keep every post and email inside the Lockr voice and hard writing rules (no em dashes, no 'guaranteed', equal sports/prediction framing). | connected |
| anthropic-skills:docx / pdf | Render the finished whitepaper as a gated PDF lead magnet for email capture. | connected |
| Whop | Payments, subscription billing, tax compliance, product delivery, and Discord access gating. High-risk-merchant friendly. | needs-account-or-key |
| Beehiiv (or Klaviyo / ConvertKit) | Owned email list, double opt-in for EU, automated daily/weekly sends with the compliance footer. Beehiiv API is already a flagged placeholder in the repo. | needs-account-or-key |
| Meta Business Suite + Meta Business Manager | Compliant paid Instagram/Facebook ads after gambling-advertiser verification, plus organic scheduling. | needs-account-or-key |
| Discord + compliant bots (MEE6 / Dyno) and native age-gate | Member community, role assignment, moderation. Bots for moderation only, never automated promo broadcasting. | needs-account-or-key |
| Citation monitor (Pixelmojo, Rankeo, or similar) | Track Lockr mentions weekly across ChatGPT, Claude, Perplexity, and Google AI Overviews for the target queries. | needs-account-or-key |
| Google Search Console + Bing Webmaster + Rich Results Test | Validate Article/Breadcrumb schema, watch freshness and CTR, confirm indexing. Free. | needs-account-or-key |
| Buffer / Metricool (or native schedulers) | Schedule organic short-form and X posts. Manual creative and compliance review still required per post. | needs-account-or-key |
| scheduled-tasks / cron MCP (deferred) | Automate the safe, owned-channel work only: regenerate sitemap/RSS on publish, weekly citation-check reminders, freshness audits. Never automate anything that posts promotionally to Reddit or forums. | needs-install |
| mcp-registry (available) | Discover and suggest additional connectors (email, social schedulers) if JT wants more automation later. | connected |
