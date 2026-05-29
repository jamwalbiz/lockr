import Link from "next/link";
import { LanguageToggle } from "./LanguageToggle";
import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  return (
    <footer>
      <div className="shell">
        <div className="footer-capture">
          <div className="footer-capture-text">
            <strong>Stay in the loop</strong>
            <span className="sub">
              Lockr newsletter — strategy content, big member wins, launch updates, and
              occasional promos. Unsubscribe any time.
            </span>
          </div>
          <NewsletterForm />
        </div>
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">
              <span className="logo-dot"></span>LOCKR
            </div>
            <p>
              Where serious bettors get serious edges. Built by JT and the Lockr team.
              Public track record, updated daily.
            </p>
          </div>
          <div className="footer-col">
            <h4>Product</h4>
            <Link href="/">Picks</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/about">About</Link>
            <Link href="/checkout">Join Lockr</Link>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <Link href="/about">About</Link>
            <Link href="/about#methodology">Methodology</Link>
            <Link href="#">Press</Link>
            <a href="mailto:hello@joinlockr.com">Contact</a>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/disclaimers">Disclaimers</Link>
            <Link href="/responsible-gaming">Responsible gaming</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© 2026 Lockr. All rights reserved.</div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <a href="#">X</a>
            <a href="#">TikTok</a>
            <a href="#">Instagram</a>
            <a href="#">YouTube</a>
            <LanguageToggle />
          </div>
        </div>
        <div className="footer-disclaimer" style={{ marginTop: 24 }}>
          Lockr is an education and entertainment service. Picks are opinions, not
          financial or wagering advice. Bet only what you can afford to lose. Eligibility,
          legality, and minimum age depend on your local jurisdiction and the platforms
          you use — confirm both before placing any wager. If gambling is becoming a
          problem, call 1-800-GAMBLER or visit ncpgambling.org. Past performance does not
          guarantee future results.
        </div>
      </div>
    </footer>
  );
}
