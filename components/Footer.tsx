import Link from "next/link";

export function Footer() {
  return (
    <footer>
      <div className="shell">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">
              <span className="logo-dot"></span>LOCKR
            </div>
            <p>
              Where serious bettors get serious edges. Built by the Lockr team.
            </p>
          </div>
          <div className="footer-col">
            <h3>Product</h3>
            <Link href="/">Picks</Link>
            <a href="/#method">Method</a>
            <Link href="/markets">Live markets</Link>
            <a href="/#pricing">Pricing</a>
            <Link href="/checkout">Join Lockr</Link>
          </div>
          <div className="footer-col">
            <h3>Company</h3>
            <a href="/#faq">About</a>
            <a href="/#faq">FAQ</a>
            <a href="mailto:hello@joinlockr.com">Contact</a>
            <Link href="/blog">Blog</Link>
          </div>
          <div className="footer-col">
            <h3>Legal</h3>
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/disclaimers">Disclaimers</Link>
            <Link href="/responsible-gaming">Responsible gaming</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© 2026 Lockr. All rights reserved.</div>
          {/* Social handles hidden until reserved + linked. Re-enable when
              the X / TikTok / Instagram / YouTube accounts are live;
              previously these all pointed at href="#" which scrolled the
              user to the top of the page (worse than no link). */}
        </div>
        <div className="footer-disclaimer" style={{ marginTop: 24 }}>
          Lockr is an education and entertainment service. Picks are opinions, not
          financial or wagering advice. Bet only what you can afford to lose. Eligibility,
          legality, and minimum age depend on your local jurisdiction and the platforms
          you use. Confirm both before placing any wager. If gambling is becoming a
          problem, call 1-800-GAMBLER or visit ncpgambling.org. Past performance does not
          guarantee future results.
        </div>
      </div>
      <div className="footer-wordmark" aria-hidden="true">LOCKR</div>
    </footer>
  );
}
