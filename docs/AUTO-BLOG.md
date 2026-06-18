# The Edge: automatic post feed

The blog auto-populates with fresh sports / prediction-market posts via a
GitHub Action. It runs on GitHub's servers (no machine of ours needs to be on),
generates one compliance-reviewed post, commits it, and Vercel redeploys.

## Turn it on (two steps)

**1. Add the workflow file.** The Action lives in this repo as
`docs/auto-blog.workflow.yml` (it could not be pushed into `.github/workflows/`
from here because that needs a GitHub token with `workflow` scope). On GitHub:
**Add file -> Create new file**, name it `.github/workflows/auto-blog.yml`, and
paste the contents of `docs/auto-blog.workflow.yml`. (Adding workflow files
through the GitHub web UI is allowed.) The generator script
`scripts/generate-blog-post.mjs` is already in the repo.

**2. Add the API key.** Repo **Settings -> Secrets and variables -> Actions ->
New repository secret**. Name: `ANTHROPIC_API_KEY`, value: an Anthropic API key
(console.anthropic.com).

That's it. The next scheduled run publishes a post; you can also trigger it
immediately from the **Actions** tab.

## Cadence

Monday / Wednesday / Friday, ~14:17 UTC (about 9-10am US Eastern). Change the
`cron` line in `.github/workflows/auto-blog.yml` to adjust. You can also trigger
a run anytime from the repo **Actions** tab -> "Auto blog post" -> "Run workflow".

## How it stays honest

`scripts/generate-blog-post.mjs` sends a strict brand + compliance brief and a
built-in self-review: no em dashes, no fabricated stats / odds / volumes (any
number must be web-searched and cited inline), no "guaranteed" or "risk-free",
responsible-gambling framing, and it avoids repeating existing post topics. It
uses web search so timely posts are grounded in real sources.

## Important: it auto-publishes

Posts go live with no human review. For a gambling brand, glance at the first
several it produces. If you would rather approve each post first, change the
final step of the workflow to open a pull request instead of pushing to `main`
(swap the commit/push step for `peter-evans/create-pull-request`). Then a post
is generated automatically but only goes live when you merge it.

## Pause it

Disable "Auto blog post" in the repo **Actions** tab, or comment out the
`schedule:` block in the workflow file.

## Run it locally

```
ANTHROPIC_API_KEY=sk-... node scripts/generate-blog-post.mjs
```

Writes a new `content/blog/<slug>.md`. Commit it yourself, or let the Action do it.

## Cost

Each run is a couple of model calls plus web search. At a few posts a week this
is a few dollars a month on the API. Set `BLOG_MODEL` (env) to a smaller model
to cut cost, or a larger one for more depth.
