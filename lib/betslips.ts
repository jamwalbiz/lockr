export type BetSlip = {
  book: "prizepicks" | "underdog" | "kalshi" | "polymarket" | "sleeper" | "draftkings";
  bookLabel: string;
  line: string;
  meta: string;
  result: string;
  payout: string;
  stake: string;
  handle: string;
  date: string;
  /** Closing-line value vs entry. Persona-B sharp signal. Plausible range ~ +1..+12%. */
  clv: string;
  /** When set, the card renders this real bet-slip screenshot instead of the
   *  synthetic layout. Path under /public, with natural pixel dimensions. */
  image?: string;
  imageAlt?: string;
  imageW?: number;
  imageH?: number;
};

export const BET_SLIPS: BetSlip[] = [
  {
    book: "prizepicks",
    bookLabel: "PrizePicks",
    line: "Shai Gilgeous-Alexander · OVER 31.5 pts",
    meta: "NBA · OKC vs DAL",
    result: "FINAL 33",
    payout: "+$36.40",
    stake: "$20 → $56.40 · +1.82u",
    handle: "@jordan_k",
    date: "05/24 · 9:42 PM",
    clv: "+6.5%",
    image: "/slips/prizepicks-win.png",
    imageAlt: "PrizePicks 2-pick power play, $5,000 to win $11,000, marked Win",
    imageW: 1320,
    imageH: 989,
  },
  {
    book: "underdog",
    bookLabel: "Underdog",
    line: "Topuria · KO/TKO Rd 1–3",
    meta: "UFC · vs Holloway",
    result: "Rd 2 KO",
    payout: "+$72.50",
    stake: "$50 → $122.50 · +1.07u",
    handle: "@ethan_k",
    date: "05/23 · 11:18 PM",
    clv: "+2.7%",
  },
  {
    book: "kalshi",
    bookLabel: "Kalshi",
    line: "Fed funds rate held at next FOMC · YES",
    meta: "PREDICTION · Entry $0.88",
    result: "$1.00",
    payout: "+$41.00",
    stake: "300 YES @ $0.88 · +0.41u",
    handle: "@devonm",
    date: "05/23 · 2:14 PM",
    clv: "+6.8%",
  },
  {
    book: "sleeper",
    bookLabel: "Sleeper",
    line: "3-pick parlay · NBA player props",
    meta: "SGA pts · Doncic ast · BOS spread",
    result: "3/3 ✓",
    payout: "+$144.50",
    stake: "$25 → $169.50 · 5x",
    handle: "@nia_w",
    date: "05/22 · 10:08 PM",
    clv: "+4.2%",
  },
  {
    book: "polymarket",
    bookLabel: "Polymarket",
    line: "OpenAI GPT-5 by Q3 2026 · NO",
    meta: "PREDICTION · Entry $0.42",
    result: "$0.31",
    payout: "+$55.20",
    stake: "200 NO @ $0.58 · +2.76u",
    handle: "@amir_m",
    date: "05/21 · 4:33 PM",
    clv: "+10.4%",
  },
  {
    book: "draftkings",
    bookLabel: "DraftKings",
    line: "Verstappen · Top 3 Monaco GP",
    meta: "F1 · Backed -180",
    result: "P2 ✓",
    payout: "+$41.70",
    stake: "$75 → $116.70 · +0.83u",
    handle: "@sam_h",
    date: "05/20 · 11:47 AM",
    clv: "+6.4%",
  },
];
