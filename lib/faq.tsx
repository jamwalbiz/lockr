// `a` is rendered (can be JSX with <strong> + links).
// `text` is the plain-text fallback used by JSON-LD FAQPage schema.
// Keep them in sync semantically.
export const FAQ_ITEMS: Array<{ q: string; a: React.ReactNode; text: string }> = [
  {
    q: "How is the track record actually verified?",
    a: "Every pick is posted in our private member Discord with a timestamp before the line moves and before the event starts. The Discord post timestamps are the record — once you're in, you can scroll back any time to verify exactly when a pick was made, before any outcome was known. We don't edit or delete picks. Win or lose, every play stays in the channel.",
    text: "Every pick is posted in our private member Discord with a timestamp before the line moves and before the event starts. The Discord post timestamps are the record — once you're in, you can scroll back any time to verify exactly when a pick was made, before any outcome was known. We don't edit or delete picks. Win or lose, every play stays in the channel.",
  },
  {
    q: "What happens after a losing week?",
    a: "JT posts a long-form breakdown of what went wrong — line moves, injury impacts, model adjustments. This is the deal: you'll lose weeks. The job is to win across volume. The discipline content is what separates the members who compound from the ones who churn after one bad stretch.",
    text: "JT posts a long-form breakdown of what went wrong — line moves, injury impacts, model adjustments. This is the deal: you'll lose weeks. The job is to win across volume. The discipline content is what separates the members who compound from the ones who churn after one bad stretch.",
  },
  {
    q: "What sports do you cover?",
    a: "NFL, NBA, MLB, UFC, boxing, F1, soccer (Premier League + Champions League), NHL, tennis (majors), esports (CS, Valorant, LoL), and prediction markets via Kalshi and Polymarket. Year-round coverage — no summer dead zones.",
    text: "NFL, NBA, MLB, UFC, boxing, F1, soccer (Premier League + Champions League), NHL, tennis (majors), esports (CS, Valorant, LoL), and prediction markets via Kalshi and Polymarket. Year-round coverage — no summer dead zones.",
  },
  {
    q: "What's the deal with prediction markets?",
    a: "Kalshi and Polymarket let you take positions on events your sportsbook either won't price or prices badly. We show you when there's a real edge — and when those markets give you a clean hedge against a position your book takes you out of.",
    text: "Kalshi and Polymarket let you take positions on events your sportsbook either won't price or prices badly. We show you when there's a real edge — and when those markets give you a clean hedge against a position your book takes you out of.",
  },
  {
    q: "How do I get into the Discord?",
    a: "Auto-invite. You'll get a Discord link in your email within 60 seconds of payment. Your tier badge is auto-assigned by our bot — no manual approval, no waiting.",
    text: "Auto-invite. You'll get a Discord link in your email within 60 seconds of payment. Your tier badge is auto-assigned by our bot — no manual approval, no waiting.",
  },
  {
    q: "What payment methods do you accept?",
    a: "All major cards, ACH, and crypto (BTC, ETH, USDC) via Coinbase Commerce. Annual subscriptions can be paid in installments on request.",
    text: "All major cards, ACH, and crypto (BTC, ETH, USDC) via Coinbase Commerce. Annual subscriptions can be paid in installments on request.",
  },
  {
    q: "Can I cancel any time?",
    a: "Yes. One-click cancel from your account page. No retention department. No “are you sure” friction. You keep access until the end of your billing period. We'd rather lose you than fight you.",
    text: "Yes. One-click cancel from your account page. No retention department. No \"are you sure\" friction. You keep access until the end of your billing period. We'd rather lose you than fight you.",
  },
  {
    q: "New to betting? What do “units” and “edges” mean?",
    a: (
      <>
        <strong>Units</strong> are how bettors measure profit and loss as a percentage of
        bankroll, not in raw dollars. One unit usually equals 1–5% of your bankroll — so
        &ldquo;+5u&rdquo; means the same growth whether you bet $50 or $5,000 per play.{" "}
        <strong>Edges</strong> are bets where the math is on your side — your projection
        of an outcome is meaningfully better than the price the sportsbook is offering.{" "}
        <strong>Prediction markets</strong> (Kalshi, Polymarket) are regulated
        event-contract platforms where you can take positions on outcomes your sportsbook
        either won&apos;t price or prices badly. You don&apos;t need to know any of this
        to follow the picks — each play comes with the reasoning and recommended size
        spelled out. Pick up the rest from JT&apos;s weekly Q&amp;As and the bankroll
        playbook.
      </>
    ),
    text: "Units are how bettors measure profit and loss as a percentage of bankroll, not in raw dollars. One unit usually equals 1–5% of your bankroll — so \"+5u\" means the same growth whether you bet $50 or $5,000 per play. Edges are bets where the math is on your side — your projection of an outcome is meaningfully better than the price the sportsbook is offering. Prediction markets (Kalshi, Polymarket) are regulated event-contract platforms where you can take positions on outcomes your sportsbook either won't price or prices badly. You don't need to know any of this to follow the picks — each play comes with the reasoning and recommended size spelled out. Pick up the rest from JT's weekly Q&As and the bankroll playbook.",
  },
  {
    q: "Is this gambling advice?",
    a: (
      <>
        No. Lockr is entertainment and education. Picks are opinions, not advice.
        You&apos;re responsible for your own decisions and your own bankroll. Bet only
        what you can afford to lose. If gambling is becoming a problem, reach out to{" "}
        <a href="https://www.ncpgambling.org/" target="_blank" rel="noopener noreferrer">
          1-800-GAMBLER
        </a>
        .
      </>
    ),
    text: "No. Lockr is entertainment and education. Picks are opinions, not advice. You're responsible for your own decisions and your own bankroll. Bet only what you can afford to lose. If gambling is becoming a problem, reach out to 1-800-GAMBLER.",
  },
];
