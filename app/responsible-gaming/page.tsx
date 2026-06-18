import { BreadcrumbsLd } from "@/components/BreadcrumbsLd";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Responsible Gaming | Lockr",
  description:
    "Resources and help lines for problem gambling. 1-800-GAMBLER. ncpgambling.org.",
  path: "/responsible-gaming",
});

export default function ResponsibleGamingPage() {
  return (
    <div className="shell">
      <BreadcrumbsLd
        trail={[
          { name: "Home", url: "https://joinlockr.com/" },
          { name: "Responsible Gaming", url: "https://joinlockr.com/responsible-gaming" },
        ]}
      />
      <article className="legal-page">
        <h1>Responsible gaming</h1>
        <div className="updated">Last updated: May 27, 2026</div>

        <p>
          We believe sports wagering and prediction-market trading work best as
          entertainment for adults who can afford to lose every dollar they put at risk.
          If it stops being that for you, the resources below are free, confidential, and
          available right now.
        </p>

        <h2>Help lines</h2>
        <ul>
          <li>
            <strong>1-800-GAMBLER:</strong> National Council on Problem Gambling helpline
            (24/7).{" "}
            <a href="tel:1-800-426-2537">Call or text 1-800-426-2537</a>.
          </li>
          <li>
            <strong>ncpgambling.org:</strong>{" "}
            <a
              href="https://www.ncpgambling.org/help-treatment/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Treatment finder, chat, and resources
            </a>
            .
          </li>
          <li>
            <strong>GamblersAnonymous.org:</strong>{" "}
            <a
              href="https://www.gamblersanonymous.org/ga/locations"
              target="_blank"
              rel="noopener noreferrer"
            >
              Find a meeting
            </a>
            .
          </li>
        </ul>

        <h2>Signs to watch for</h2>
        <ul>
          <li>You bet more than you planned, or chase losses to break even.</li>
          <li>You hide your wagering from people close to you.</li>
          <li>You feel restless, irritable, or anxious when you cut back.</li>
          <li>You wager with money meant for rent, food, savings, or debt.</li>
          <li>Your wagering is affecting work, relationships, or mood.</li>
        </ul>
        <p>If any of those land, treat that as a signal to step back, not a verdict.</p>

        <h2>Things you can do today</h2>
        <ul>
          <li>
            <strong>Set deposit limits</strong> directly with every sportsbook and
            prediction market you use. Every major platform supports this in account
            settings.
          </li>
          <li>
            <strong>Self-exclude.</strong> Most state-licensed platforms support voluntary
            self-exclusion for set periods (months to years). Use it.
          </li>
          <li>
            <strong>Pause Lockr.</strong> One-click cancel from your account. We don&apos;t
            run a retention department. Re-subscribe later if and when it makes sense.
          </li>
          <li>
            <strong>Talk to someone.</strong> Either someone close to you or one of the
            help lines above. Both work.
          </li>
        </ul>

        <h2>Eligibility reminder</h2>
        <p>
          You must be of legal age to wager in your jurisdiction. Lockr is not a
          sportsbook and does not accept wagers. We do not encourage anyone underage or
          living in a jurisdiction where wagering is illegal to use the platforms we
          reference.
        </p>
      </article>
    </div>
  );
}
