import type { Metadata } from "next";
import { BreadcrumbsLd } from "@/components/BreadcrumbsLd";

export const metadata: Metadata = {
  title: "Terms of Service | Lockr",
  description: "Lockr Terms of Service. Education and entertainment service. Subscription, cancellation, and acceptable use.",
};

export default function TermsPage() {
  return (
    <div className="shell">
      <BreadcrumbsLd
        trail={[
          { name: "Home", url: "https://joinlockr.com/" },
          { name: "Terms of Service", url: "https://joinlockr.com/terms" },
        ]}
      />
      <article className="legal-page">
        <h1>Terms of Service</h1>
        <div className="updated">Last updated: May 27, 2026</div>

        <p>
          These terms govern your use of Lockr (operated by Lockr LLC) and the services
          delivered at joinlockr.com and through our private Discord community. By creating
          an account or paying for a subscription, you agree to these terms.
        </p>

        <h2>1. What Lockr is</h2>
        <p>
          Lockr is an <strong>education and entertainment service</strong>. Picks
          published by Lockr are opinions, not financial, wagering, or legal advice. You
          are solely responsible for your wagering decisions and your bankroll. Past
          results do not guarantee future outcomes.
        </p>

        <h2>2. Eligibility</h2>
        <p>
          You must be of legal age to wager in your jurisdiction (at least 18, often 21,
          depending on where you live and the platforms you use). You are responsible for
          confirming both the legality of online wagering in your jurisdiction and your
          eligibility to use the third-party platforms we reference. Lockr does not take
          wagers and is not a sportsbook.
        </p>

        <h2>3. Subscription, billing, and cancellation</h2>
        <ul>
          <li>
            <strong>Lockr Subscription:</strong> $29 weekly, $99 monthly, or $599 annually.
            Same features at every cadence. Billing recurs automatically at the cadence
            you select.
          </li>
          <li>
            <strong>Inner Circle:</strong> Application-only. $499 monthly or $4,999
            annually. Capped at 200 active members.
          </li>
          <li>
            <strong>Cancellation:</strong> One-click cancel from your account at any time.
            You retain access through the end of your current billing period; no further
            charges occur after that. No partial refunds are issued for unused time.
          </li>
        </ul>

        <h2>4. Acceptable use</h2>
        <p>
          You agree not to: share or resell access to the private Discord; redistribute
          picks publicly while they remain actionable; harass other members; or use the
          service to facilitate wagering on behalf of others as a paid intermediary.
          Violation may result in immediate termination without refund.
        </p>

        <h2>5. Intellectual property</h2>
        <p>
          All content (picks, reasoning, video, written material) is the property of
          Lockr LLC unless otherwise noted, licensed to you for personal, non-commercial
          use during your active subscription.
        </p>

        <h2>6. Disclaimers and liability</h2>
        <p>
          Lockr is provided &quot;as is.&quot; To the maximum extent permitted by law,
          Lockr disclaims all warranties, express or implied. Lockr&apos;s aggregate
          liability is limited to the amount you paid us in the 12 months preceding the
          event giving rise to the claim.
        </p>

        <h2>7. Changes to these terms</h2>
        <p>
          We may update these terms from time to time. Material changes will be announced
          in the Discord and by email at least 14 days before they take effect.
        </p>

        <h2>8. Contact</h2>
        <p>
          Questions? Reach us at{" "}
          <a href="mailto:hello@joinlockr.com">hello@joinlockr.com</a>.
        </p>
      </article>
    </div>
  );
}
