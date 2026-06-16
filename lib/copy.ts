// Activity-ticker + social-proof data, generated combinatorially each page
// visit so refresh ≠ refresh. Names are not real members. If JT ever wants
// to flip this to live data, the Whop webhook → our backend → ticker pipe
// is the path — for now it stays synthesized.
//
// Name pool tuned to JT's demographic call:
//   - Drop K last-initials (was a too-obvious repeating pattern)
//   - More Latino, Black, and broader American male names that match active
//     US sports bettor demographics
//   - Include JT's explicit picks (Josh A., Brandon, Luis R., Nathan C.,
//     Max G., Caesar A., Anthony J., Jack B.)
//   - Pull out the globally-spread ones that read as filler

type Tone = "green" | "gold" | "blue";

export type TickerItem = { tone: Tone; text: string };
export type SocialProofItem = {
  name: string;
  detail: string;
  avatar: string;
  tone: Tone;
  flag: string;
};

// Flag pool for the social-proof popups — gives the feed a global feel
// without straying from the US-bettor-demographic names. US-dominant
// (it's the core market) with a believable international spread:
// the English-speaking + Latin-American + a few European markets where
// these names and sports betting both plausibly land. Repeated entries
// bias the weighted distribution (US ≈ 40%).
const MEMBER_FLAGS = [
  "🇺🇸", "🇺🇸", "🇺🇸", "🇺🇸", "🇺🇸", "🇺🇸", "🇺🇸", "🇺🇸", "🇺🇸", "🇺🇸",
  "🇨🇦", "🇨🇦", "🇨🇦",
  "🇬🇧", "🇬🇧",
  "🇦🇺", "🇦🇺",
  "🇲🇽", "🇲🇽",
  "🇧🇷",
  "🇮🇪",
  "🇩🇪",
  "🇪🇸",
  "🇳🇱",
] as const;

const FIRST_NAMES = [
  // JT's explicit picks
  "Josh", "Brandon", "Luis", "Nathan", "Max", "Caesar", "Anthony", "Jack",
  // Carryover from the original pool
  "Jordan", "Devon", "Sam", "Ryan", "Tony", "Lauren", "Eli", "Owen",
  "Marcus", "Sofia", "Diego", "Jamal", "Zoe", "Mike",
  // Latino / Mexican
  "Carlos", "Miguel", "Hector", "Pedro", "Antonio", "Rafael", "Alejandro",
  "Cesar", "Manuel", "Eduardo", "Roberto", "Javier", "Mateo", "Sergio",
  "Emilio", "Juan", "Ricardo",
  // Black
  "DeShaun", "Andre", "Malik", "Trey", "Khalil", "Jaylen", "Kameron",
  "Terrence", "Maurice", "Tyrone", "Darrius", "Quincy", "Reggie",
  "Damon", "Isaiah",
  // Broader US bettor demographic
  "Tyler", "Connor", "Hunter", "Cole", "Logan", "Brett", "Chase",
  "Bryce", "Dalton", "Garrett", "Trevor", "Wyatt", "Brody", "Drew",
  "Blake", "Cody",
] as const;

// No K (JT flagged the K-ending pattern). No I/Q/U/W/X/Y/Z (uncommon → reads odd).
const LAST_INITIALS = [
  "A", "B", "C", "D", "F", "G", "H", "J", "L", "M", "N", "P", "R", "S", "T", "V",
] as const;

const BET_CATEGORIES = [
  "NBA PROP", "NBA PARLAY", "NBA SPREAD", "NBA TOTAL",
  "NFL SPREAD", "NFL TOTAL", "NFL TD PROP",
  "MLB OVER", "MLB F5", "MLB ML", "MLB NRFI",
  "NHL PUCK LINE", "NHL GOAL PROP",
  "UFC METHOD", "UFC ROUND PROP", "UFC ML",
  "F1 PODIUM", "F1 H2H",
  "TENNIS SET", "TENNIS H2H",
  "SOCCER ML", "SOCCER OVER",
  "ESPORTS MAP",
  "KALSHI YES", "KALSHI HEDGE",
  "POLYMARKET NO", "POLYMARKET POSITION",
  "COLLEGE FB", "COLLEGE HOOPS",
] as const;

const UNIT_WINS = [
  "+0.41u", "+0.45u", "+0.51u", "+0.66u", "+0.70u", "+0.74u",
  "+0.82u", "+0.83u", "+0.88u", "+0.91u", "+0.95u", "+1.04u",
  "+1.20u", "+1.30u", "+1.42u", "+1.55u", "+1.60u", "+1.74u",
  "+1.82u", "+2.05u", "+2.18u", "+2.41u", "+2.76u", "+3.10u",
] as const;

// JT activity — heavily weighted in the ticker. Per JT: "the more we flood
// my name the more it becomes common."
const JT_PICK_CATEGORIES = [
  "NBA PROP", "UFC METHOD", "F1 PODIUM", "KALSHI HEDGE",
  "NFL TOTAL", "MLB OVER", "POLYMARKET POSITION", "NHL PUCK LINE",
  "SOCCER ML", "TENNIS H2H", "NBA PARLAY", "UFC ROUND PROP",
] as const;

const JT_LONGFORMS = [
  "NBA BREAKDOWN", "BANKROLL PLAYBOOK", "CLV PRIMER", "KALSHI 101",
  "UFC METHOD GUIDE", "F1 QUALIFYING GUIDE", "POLYMARKET HEDGE GUIDE",
  "MLB MODEL UPDATE", "WEEKLY RECAP", "MONTHLY UNIT REVIEW",
] as const;

const JT_OTHER = [
  "JT REPLIED · IC DM",
  "JT DROPPED · STRATEGY THREAD",
  "JT ANSWERED · WEEKLY Q&A",
  "JT POSTED · MEMBER SHOUTOUT",
] as const;

const JOIN_UPGRADE_ACTIONS: ReadonlyArray<{ tone: Tone; action: string }> = [
  { tone: "blue", action: "JOINED LOCKR · WEEKLY" },
  { tone: "blue", action: "JOINED LOCKR · MONTHLY" },
  { tone: "blue", action: "JOINED LOCKR · ANNUAL" },
  { tone: "blue", action: "JOINED ANNUAL · $599" },
  { tone: "blue", action: "JOINED MONTHLY · $99" },
  { tone: "blue", action: "JOINED WEEKLY · $29" },
  { tone: "blue", action: "UPGRADED WEEKLY → MONTHLY" },
  { tone: "blue", action: "UPGRADED MONTHLY → ANNUAL" },
  { tone: "blue", action: "UPGRADED WEEKLY → ANNUAL" },
  { tone: "gold", action: "JOINED ★ INNER CIRCLE" },
  { tone: "gold", action: "APPLIED FOR ★ INNER CIRCLE" },
];

function pick<T>(arr: ReadonlyArray<T>): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomName(): { display: string; avatar: string } {
  const first = pick(FIRST_NAMES);
  const last = pick(LAST_INITIALS);
  return {
    display: `${first} ${last}.`,
    avatar: `${first[0]}${last}`,
  };
}

// Ticker mix:
//   • 30% JT picks
//   • 12% JT long-form
//   • 5%  JT other
//   • 35% member wins
//   • 18% joins / upgrades
// Means ~47% of items mention JT — heavy personal-brand surface.
//
// Anti-clustering: pure per-slot random gave streaks (e.g., 4× "JT POSTED"
// in a row). Two constraints layered on top of the weighted random:
//   1. No same broad-type (jt | member-win | join) more than 2× consecutive
//   2. No exact-text repeat within a 4-item sliding window
type Category = "jt" | "member" | "join";

function makeRandomCandidate(): { cat: Category; item: TickerItem } {
  const r = Math.random();
  if (r < 0.3) {
    return {
      cat: "jt",
      item: { tone: "green", text: `JT POSTED NEW PICK · ${pick(JT_PICK_CATEGORIES)}` },
    };
  }
  if (r < 0.42) {
    return {
      cat: "jt",
      item: { tone: "gold", text: `JT POSTED LONG-FORM · ${pick(JT_LONGFORMS)}` },
    };
  }
  if (r < 0.47) {
    return { cat: "jt", item: { tone: "gold", text: pick(JT_OTHER) } };
  }
  if (r < 0.82) {
    const name = randomName();
    return {
      cat: "member",
      item: {
        tone: "green",
        text: `${name.display.toUpperCase()} CASHED ${pick(UNIT_WINS)} · ${pick(BET_CATEGORIES)}`,
      },
    };
  }
  const name = randomName();
  const join = pick(JOIN_UPGRADE_ACTIONS);
  return {
    cat: "join",
    item: { tone: join.tone, text: `${name.display.toUpperCase()} ${join.action}` },
  };
}

export function generateTickerItems(count: number = 40): TickerItem[] {
  const items: TickerItem[] = [];
  const recentTexts: string[] = [];
  const RECENT_WINDOW = 4;
  let lastCat: Category | null = null;
  let consecutiveSameCat = 0;

  for (let i = 0; i < count; i++) {
    let candidate = makeRandomCandidate();
    for (let attempt = 0; attempt < 8; attempt++) {
      const sameCatStreakWouldExceed =
        candidate.cat === lastCat && consecutiveSameCat >= 1;
      const textRepeats = recentTexts.includes(candidate.item.text);
      if (!sameCatStreakWouldExceed && !textRepeats) break;
      candidate = makeRandomCandidate();
    }

    items.push(candidate.item);
    if (candidate.cat === lastCat) {
      consecutiveSameCat++;
    } else {
      lastCat = candidate.cat;
      consecutiveSameCat = 0;
    }
    recentTexts.push(candidate.item.text);
    if (recentTexts.length > RECENT_WINDOW) recentTexts.shift();
  }
  return items;
}

// Social-proof popups are member-focused (JT activity goes in the ticker).
//   • 65% wins
//   • 25% joins / upgrades
//   • 10% IC applications
export function generateSocialProofItems(count: number = 30): SocialProofItem[] {
  const items: SocialProofItem[] = [];
  for (let i = 0; i < count; i++) {
    const name = randomName();
    const flag = pick(MEMBER_FLAGS);
    const r = Math.random();
    if (r < 0.65) {
      items.push({
        name: name.display,
        detail: `CASHED ${pick(UNIT_WINS)} · ${pick(BET_CATEGORIES)}`,
        avatar: name.avatar,
        tone: "green",
        flag,
      });
    } else if (r < 0.9) {
      const join = pick(JOIN_UPGRADE_ACTIONS);
      items.push({
        name: name.display,
        detail: join.action,
        avatar: name.avatar,
        tone: join.tone,
        flag,
      });
    } else {
      items.push({
        name: name.display,
        detail: "APPLIED FOR ★ INNER CIRCLE",
        avatar: name.avatar,
        tone: "gold",
        flag,
      });
    }
  }
  return items;
}


export type CadenceTier = "subscription" | "innercircle";
export type CadenceKey = "weekly" | "monthly" | "annual";

// Whop plan IDs — passed directly to <WhopCheckoutEmbed planId=... /> in
// CheckoutFlow. Application gating for Inner Circle is handled by Whop's
// "Ask questions before checkout" feature, which renders the application
// questions inline in the embed before payment is collected.
//
// IC annual ($4,999) intentionally has no whopPlanId — Whop's new-merchant
// cap is $2,500 per transaction, which blocks the annual plan until KYC
// clears and the cap lifts. Showing $4,999/yr on the site is a marketing
// reference; the CheckoutFlow IC-no-plan-id branch routes folks to IC
// monthly + offers direct email arrangement.
export const PRICING = {
  subscription: {
    weekly: {
      price: "$29",
      period: "per week · cancel any time",
      equiv: "$116/mo equivalent",
      whopPlanId: "plan_FxpXFFIMF9AUt",
    },
    monthly: {
      price: "$99",
      period: "per month · save ~20% vs weekly",
      equiv: "billed monthly · most popular",
      save: "SAVE 20%",
      whopPlanId: "plan_cgxZPV8SBtB3g",
    },
    annual: {
      price: "$599",
      period: "per year · save ~60% vs weekly",
      equiv: "$50/mo equivalent · billed annually",
      save: "SAVE 60%",
      whopPlanId: "plan_FIsZ66cmEugcN",
    },
  },
  innercircle: {
    monthly: {
      price: "$499",
      period: "per month · cancel any time",
      equiv: "",
      whopPlanId: "plan_yKV7hpPHd8pt0",
    },
    annual: {
      price: "$4,999",
      period: "per year · save ~17%",
      equiv: "$416/mo equivalent",
      save: "SAVE 17%",
      // whopPlanId omitted — see header comment.
    },
  },
} as const;

export const SUBSCRIPTION_FEATURES = [
  "Daily picks across every sport + prediction markets",
  "Plain-English reasoning + recommended size on every play",
  "New to betting? A starter guide walks you through your first one",
  "Members-only community",
  "Live weekly Q&A with the team",
  "Bankroll & sizing playbook",
  "Q&A recordings pinned for replay",
  "Push notifications when picks drop",
  "Free promo codes for every recommended platform",
];

// Inner Circle status block. The fabricated "167 / 200 ACTIVE" counter
// was removed — anchoring on a real number under 200 (which will be 0
// or very low at launch) avoids the credibility hit of being caught
// inflating member counts. The "200-MEMBER CAP" claim is durable: it
// matches Whop's stock setting for the IC product and the consistent
// brand promise of intentional smallness.
export const IC_STATUS = {
  cap: 200,
  label: "200-MEMBER CAP",
};

export const INNERCIRCLE_FEATURES = [
  "Everything in the Lockr Subscription",
  "Private IC-only channels",
  "Edge ratings + confidence scores on every play",
  "Custom research on request",
  "Monthly 1-on-1 mentorship call — build your own system",
  "Monthly mastermind with the IC cohort",
  "A direct line to the team — you're a partner, not a number",
  "Personalized onboarding call when you join",
];
