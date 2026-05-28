import type { Metadata } from "next";
import { BreadcrumbsLd } from "@/components/BreadcrumbsLd";

export const metadata: Metadata = {
  title: "Privacy Policy — Lockr",
  description: "How Lockr collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="shell">
      <BreadcrumbsLd
        trail={[
          { name: "Home", url: "https://joinlockr.com/" },
          { name: "Privacy Policy", url: "https://joinlockr.com/privacy" },
        ]}
      />
      <article className="legal-page">
        <h1>Privacy Policy</h1>
        <div className="updated">Last updated: May 27, 2026</div>

        <p>
          Lockr LLC respects your privacy. This policy explains what we collect, how we
          use it, and the choices you have.
        </p>

        <h2>What we collect</h2>
        <ul>
          <li>
            <strong>Account info:</strong> name, email, optional Discord username.
          </li>
          <li>
            <strong>Payment info:</strong> processed by PaymentCloud (cards/ACH) or
            Coinbase Commerce (crypto). We do not store full card numbers — we receive a
            token and a last-four.
          </li>
          <li>
            <strong>Usage data:</strong> pages viewed, basic device info. We use{" "}
            <a
              href="https://vercel.com/docs/analytics"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vercel Web Analytics
            </a>{" "}
            (cookie-less, privacy-first — no fingerprinting, no cross-site tracking).
          </li>
          <li>
            <strong>Communications:</strong> emails you send us, Discord messages in
            channels you join.
          </li>
        </ul>

        <h2>How we use it</h2>
        <ul>
          <li>To run your subscription and grant Discord access.</li>
          <li>To send you the newsletter, picks notifications, and service emails.</li>
          <li>To improve the product based on aggregate usage.</li>
          <li>To prevent fraud, abuse, and resold access.</li>
        </ul>

        <h2>Who we share it with</h2>
        <p>
          We share only what each processor needs to do its job. Today that&apos;s:
        </p>
        <ul>
          <li>
            <strong>PaymentCloud / Coinbase Commerce</strong> — payment processing
          </li>
          <li>
            <strong>Recurly</strong> — subscription billing
          </li>
          <li>
            <strong>Postmark</strong> — transactional email
          </li>
          <li>
            <strong>Beehiiv</strong> — newsletter
          </li>
          <li>
            <strong>Discord</strong> — community access
          </li>
          <li>
            <strong>Vercel</strong> — hosting + anonymous analytics
          </li>
        </ul>
        <p>
          We do not sell your data. We do not share your email with other operators or
          touts in the category.
        </p>

        <h2>Your choices</h2>
        <ul>
          <li>
            Unsubscribe from any marketing email with one click. Service emails (payment
            receipts, security) continue while your account is active.
          </li>
          <li>
            Request export or deletion of your data by emailing{" "}
            <a href="mailto:hello@joinlockr.com">hello@joinlockr.com</a>. We respond
            within 30 days.
          </li>
        </ul>

        <h2>Retention</h2>
        <p>
          Account data is retained while your account is active and for 24 months after
          cancellation for tax, accounting, and dispute purposes. Anonymized analytics may
          be retained longer.
        </p>

        <h2>Contact</h2>
        <p>
          Questions or requests:{" "}
          <a href="mailto:hello@joinlockr.com">hello@joinlockr.com</a>.
        </p>
      </article>
    </div>
  );
}
