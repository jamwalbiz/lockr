// `a` is rendered (can be JSX with <strong> + links).
// `text` is the plain-text fallback used by JSON-LD FAQPage schema.
// Keep them in sync semantically.
export const FAQ_ITEMS: Array<{ q: string; a: React.ReactNode; text: string }> = [
  {
    q: "How is the track record actually verified?",
    a: "Every pick is posted in our private member Discord with a timestamp before the line moves and before the event starts. The Discord post timestamps are the record. Once you're in, you can scroll back any time to verify exactly when a pick was made, before any outcome was known. We don't edit or delete picks. Win or lose, every play stays in the channel.",
    text: "Every pick is posted in our private member Discord with a timestamp before the line moves and before the event starts. The Discord post timestamps are the record. Once you're in, you can scroll back any time to verify exactly when a pick was made, before any outcome was known. We don't edit or delete picks. Win or lose, every play stays in the channel.",
  },
  {
    q: "Who's behind Lockr?",
    a: "Lockr was founded by Jairo Tovar (JT), who started betting in college and turned it into a disciplined process: modeling lines, hunting value, and arbitraging between sportsbooks and prediction markets. From day one he posted every bet in public with a timestamp, win or loss, and never deleted a single one. Today Lockr runs as a small team built on that same rule, so the public track record speaks for itself.",
    text: "Lockr was founded by Jairo Tovar (JT), who started betting in college and turned it into a disciplined process: modeling lines, hunting value, and arbitraging between sportsbooks and prediction markets. From day one he posted every bet in public with a timestamp, win or loss, and never deleted a single one. Today Lockr runs as a small team built on that same rule, so the public track record speaks for itself.",
  },
  {
    q: "How does Lockr actually find its edges?",
    a: "Three steps on every market we touch. First we model the line ourselves before looking at the book, so the gap between our number and theirs is the edge. Then we price it: a pick only counts if we got in at a better number than where the line closed, which is what proves a real edge over luck. Finally we size it, telling you how many units to risk, because discipline on how much you bet matters more than picking winners. Model, price, size, on every play.",
    text: "Three steps on every market we touch. First we model the line ourselves before looking at the book, so the gap between our number and theirs is the edge. Then we price it: a pick only counts if we got in at a better number than where the line closed, which is what proves a real edge over luck. Finally we size it, telling you how many units to risk, because discipline on how much you bet matters more than picking winners. Model, price, size, on every play.",
  },
  {
    q: "What happens after a losing week?",
    a: "JT posts a long-form breakdown of what went wrong: line moves, injury impacts, model adjustments. This is the deal: you'll lose weeks. The job is to win across volume. The discipline content is what separates the members who compound from the ones who churn after one bad stretch.",
    text: "JT posts a long-form breakdown of what went wrong: line moves, injury impacts, model adjustments. This is the deal: you'll lose weeks. The job is to win across volume. The discipline content is what separates the members who compound from the ones who churn after one bad stretch.",
  },
  {
    q: "What sports do you cover?",
    a: "NFL, NBA, MLB, UFC, boxing, F1, soccer (Premier League + Champions League), NHL, tennis (majors), esports (CS, Valorant, LoL), and prediction markets via Kalshi and Polymarket. Year-round coverage. No summer dead zones.",
    text: "NFL, NBA, MLB, UFC, boxing, F1, soccer (Premier League + Champions League), NHL, tennis (majors), esports (CS, Valorant, LoL), and prediction markets via Kalshi and Polymarket. Year-round coverage. No summer dead zones.",
  },
  {
    q: "What's the deal with prediction markets?",
    a: "Kalshi and Polymarket let you take positions on events your sportsbook either won't price or prices badly. We show you when there's a real edge, and when those markets give you a clean hedge against a position your book takes you out of.",
    text: "Kalshi and Polymarket let you take positions on events your sportsbook either won't price or prices badly. We show you when there's a real edge, and when those markets give you a clean hedge against a position your book takes you out of.",
  },
  {
    q: "How do I get into the Discord?",
    a: "One-click via Whop. After payment, link your Discord account in your Whop profile, then claim access on the Discord tile. Your tier role is auto-assigned in under 30 seconds. No manual approval.",
    text: "One-click via Whop. After payment, link your Discord account in your Whop profile, then claim access on the Discord tile. Your tier role is auto-assigned in under 30 seconds. No manual approval.",
  },
  {
    q: "What payment methods do you accept?",
    a: "All major cards, ACH bank transfer, and Cash App via Whop. Annual subscriptions can be paid up-front or split on request.",
    text: "All major cards, ACH bank transfer, and Cash App via Whop. Annual subscriptions can be paid up-front or split on request.",
  },
  {
    q: "Can I cancel any time?",
    a: "Yes. One-click cancel from your account page. No retention department. No “are you sure” friction. You keep access until the end of your billing period. We'd rather lose you than fight you.",
    text: "Yes. One-click cancel from your account page. No retention department. No \"are you sure\" friction. You keep access until the end of your billing period. We'd rather lose you than fight you.",
  },
  {
    q: "New to betting? What do the key terms mean?",
    a: (
      <>
        <dl className="faq-terms">
          <div>
            <dt>Unit (u)</dt>
            <dd>
              Your standard bet size, measured as a % of bankroll rather than raw
              dollars. One unit is usually 1–5% of your bankroll, so &ldquo;+5u&rdquo;
              means the same growth whether you bet $50 or $5,000.
            </dd>
          </div>
          <div>
            <dt>Tail</dt>
            <dd>To copy a pick we post: see the play, place the same bet on your app.</dd>
          </div>
          <div>
            <dt>Edge</dt>
            <dd>
              A bet where the math is on your side: our projection of the outcome is
              meaningfully better than the price the book is offering.
            </dd>
          </div>
          <div>
            <dt>CLV</dt>
            <dd>
              Closing line value: proof we got in at a better number than where the line
              closed. The mark of a real edge over luck.
            </dd>
          </div>
          <div>
            <dt>Prediction markets</dt>
            <dd>
              Regulated event-contract platforms (Kalshi, Polymarket) for positions your
              sportsbook won&apos;t price or prices badly.
            </dd>
          </div>
        </dl>
        <p className="faq-terms-foot">
          You don&apos;t need to know any of this to follow the picks. Every play comes
          with the reasoning and recommended size spelled out.
        </p>
      </>
    ),
    text: "Units are how bettors measure profit and loss as a percentage of bankroll, not in raw dollars. One unit usually equals 1–5% of your bankroll, so \"+5u\" means the same growth whether you bet $50 or $5,000 per play. To tail a pick just means to copy it on your own app. Edges are bets where the math is on your side: your projection of an outcome is meaningfully better than the price the sportsbook is offering, and CLV (closing line value) is the proof we got a better price than the line's closing number, which is what separates a real edge from luck. Prediction markets (Kalshi, Polymarket) are regulated event-contract platforms where you can take positions on outcomes your sportsbook either won't price or prices badly. You don't need to know any of this to follow the picks. Each play comes with the reasoning and recommended size spelled out. Pick up the rest from JT's weekly Q&As and the bankroll playbook.",
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
