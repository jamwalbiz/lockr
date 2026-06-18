import { EmailCapture } from "@/components/EmailCapture";

// The free-education front door. Trades a genuinely useful guide for an email
// (the owned list), while the daily plays stay paid. Drop it on warm pages
// (home, blog). `location` tags the source for analytics.
export function LeadMagnetBand({ location }: { location: string }) {
  return (
    <section className="fade-in-section lead-band-section">
      <div className="shell">
        <div className="lead-band">
          <div className="lead-band-text">
            <div className="lead-band-eyebrow">Free guide</div>
            <h2 className="lead-band-title">Prediction Markets 101</h2>
            <p className="lead-band-sub">
              How Kalshi and Polymarket actually work, how to read an edge, and
              why prediction markets sit level with the sportsbooks. The playbook,
              not the picks. Free, straight to your inbox.
            </p>
          </div>
          <div className="lead-band-form">
            <EmailCapture location={location} />
            <p className="lead-band-fine">
              The guide is free. The daily plays are members-only. No spam,
              unsubscribe any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
