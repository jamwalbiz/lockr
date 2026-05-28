// Static placeholder data — wire to real Discord webhook events post-launch.
// Until then: combinatorial generation so each page visit produces a fresh
// mix of names + actions (refresh ≠ refresh).
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
};

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
    const r = Math.random();
    if (r < 0.65) {
      items.push({
        name: name.display,
        detail: `CASHED ${pick(UNIT_WINS)} · ${pick(BET_CATEGORIES)}`,
        avatar: name.avatar,
        tone: "green",
      });
    } else if (r < 0.9) {
      const join = pick(JOIN_UPGRADE_ACTIONS);
      items.push({
        name: name.display,
        detail: join.action,
        avatar: name.avatar,
        tone: join.tone,
      });
    } else {
      items.push({
        name: name.display,
        detail: "APPLIED FOR ★ INNER CIRCLE",
        avatar: name.avatar,
        tone: "gold",
      });
    }
  }
  return items;
}

export const LANGUAGES = [
  { code: "EN", name: "English" },
  { code: "ES", name: "Español" },
  { code: "PT", name: "Português" },
  { code: "FR", name: "Français" },
  { code: "DE", name: "Deutsch" },
  { code: "IT", name: "Italiano" },
  { code: "JA", name: "日本語" },
  { code: "ZH", name: "中文" },
] as const;

export type CadenceTier = "subscription" | "innercircle";
export type CadenceKey = "weekly" | "monthly" | "annual";

// Whop plan IDs — public-facing checkout URL is `https://whop.com/checkout/<id>`.
// IC annual ($4,999) is intentionally absent: Whop's new-merchant cap is $2,500
// per transaction, so the annual plan wasn't created. Re-add once the cap lifts
// (see task #50). Until then, IC stays application-only via /apply and JT sends
// the monthly checkout link to approved applicants.
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
      period: "per month · cancel any time",
      equiv: "billed monthly · most popular",
      whopPlanId: "plan_cgxZPV8SBtB3g",
    },
    annual: {
      price: "$599",
      period: "per year · save ~50%",
      equiv: "$50/mo equivalent · 2 free months",
      save: "SAVE 50%",
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

/**
 * Build the Whop hosted-checkout URL for a given tier+cadence. Returns null
 * if no plan exists (e.g. IC annual until the $2,500 cap lifts). Callers
 * should fall back to /apply when null.
 *
 * If `email` is supplied, it's passed via `?email=` so Whop pre-fills the
 * email field for anonymous buyers. Whop ignores the param if the user is
 * already logged in to a Whop account (uses their own email instead).
 */
export function whopCheckoutUrl(
  tier: "subscription" | "innercircle",
  cadence: CadenceKey,
  email?: string,
): string | null {
  const entry =
    tier === "subscription"
      ? PRICING.subscription[cadence as keyof typeof PRICING.subscription]
      : PRICING.innercircle[cadence as keyof typeof PRICING.innercircle];
  const planId = (entry as { whopPlanId?: string }).whopPlanId;
  if (!planId) return null;
  const base = `https://whop.com/checkout/${planId}`;
  const trimmed = email?.trim();
  return trimmed ? `${base}?email=${encodeURIComponent(trimmed)}` : base;
}

/** Lightweight email validity check: one `@`, one `.` after it, no spaces. */
export function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

export const SUBSCRIPTION_FEATURES = [
  "Daily picks across every sport + prediction markets",
  "Pick reasoning + recommended size on every play",
  "Private Discord community",
  "Live weekly Q&A with the team",
  "Bankroll & sizing playbook",
  "Q&A recordings pinned in Discord",
  "Push notifications when picks drop",
  "Free promo codes for every recommended platform",
];

// TODO: wire to live count from billing (Recurly/Chargebee) once Phase 0 underwriting
// completes. Until then this is the single source of truth — never hardcode the numbers
// in two places.
export const IC_STATUS = {
  active: 167,
  cap: 200,
  get open() {
    return this.cap - this.active;
  },
  get label() {
    return `${this.active} / ${this.cap} ACTIVE · ${this.open} SPOTS OPEN`;
  },
};

export const INNERCIRCLE_FEATURES = [
  "Everything in the Lockr Subscription",
  "Private IC-only Discord channels",
  "Edge ratings + confidence scores on every pick",
  "1-on-1 direct DM with JT",
  "Custom research on request",
  "Monthly 1-on-1 team strategy call",
  "Quarterly mastermind with the IC cohort",
  "Personalized onboarding call when you join",
];
