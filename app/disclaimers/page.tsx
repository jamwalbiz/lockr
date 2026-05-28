import type { Metadata } from "next";
import { BreadcrumbsLd } from "@/components/BreadcrumbsLd";

export const metadata: Metadata = {
  title: "Disclaimers — Lockr",
  description:
    "Lockr is an education and entertainment service. Picks are opinions, not advice. Bet only what you can afford to lose.",
};

export default function DisclaimersPage() {
  return (
    <div className="shell">
      <BreadcrumbsLd
        trail={[
          { name: "Home", url: "https://joinlockr.com/" },
          { name: "Disclaimers", url: "https://joinlockr.com/disclaimers" },
        ]}
      />
      <article className="legal-page">
        <h1>Disclaimers</h1>
        <div className="updated">Last updated: May 27, 2026</div>

        <h2>Entertainment & education only</h2>
        <p>
          Lockr is an <strong>entertainment and education service</strong>. Picks
          published in our Discord, on our site, or in any other Lockr channel are{" "}
          <strong>opinions</strong>, not financial, wagering, or legal advice. They are
          provided for informational and educational purposes only.
        </p>

        <h2>No guarantees</h2>
        <p>
          No outcome is guaranteed. Past performance — including the trailing
          12-month unit count, win rate, and ROI shown on this site — does not predict
          future results. Sports outcomes and prediction-market resolutions are inherently
          uncertain.
        </p>

        <h2>Your responsibility</h2>
        <ul>
          <li>
            You are solely responsible for your wagering decisions and your bankroll.
          </li>
          <li>
            Bet only what you can afford to lose. Never use rent, savings, or borrowed
            money to wager.
          </li>
          <li>
            Confirm the legality of online wagering in your jurisdiction and your
            eligibility on any third-party platform before placing any wager.
          </li>
        </ul>

        <h2>Third-party platforms</h2>
        <p>
          Lockr is not affiliated with any sportsbook, daily-fantasy operator, or
          prediction market unless explicitly stated. Mentions of PrizePicks, Underdog,
          Sleeper, Dabble, DraftKings, FanDuel, Kalshi, Polymarket, and others are
          for informational and tailing purposes only. Always read each platform&apos;s
          own terms.
        </p>

        <h2>Affiliate disclosure</h2>
        <p>
          Some links to third-party platforms may be affiliate links. If you sign up
          through one, Lockr may receive a referral commission at no extra cost to you.
          The picks we publish are not influenced by affiliate economics.
        </p>

        <h2>Problem gambling</h2>
        <p>
          If gambling is causing problems for you or someone you know, call or text{" "}
          <a href="tel:1-800-426-2537">1-800-GAMBLER (1-800-426-2537)</a> or visit{" "}
          <a
            href="https://www.ncpgambling.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            ncpgambling.org
          </a>
          . See also our <a href="/responsible-gaming">responsible-gaming page</a>.
        </p>
      </article>
    </div>
  );
}
