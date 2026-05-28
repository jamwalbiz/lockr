// Static placeholder data — wire to real Discord webhook events post-launch.
// Until then: bigger pools + evergreen content (no specific player/event refs,
// no specific timestamps) so the feed doesn't read stale.

type Tone = "green" | "gold" | "blue";

export const ACTIVITY_ITEMS: ReadonlyArray<{ tone: Tone; text: string }> = [
  // Wins — most common in a real feed
  { tone: "green", text: "JORDAN K. CASHED +1.82u · NBA PROP" },
  { tone: "green", text: "DEVON M. CASHED +0.41u · KALSHI HEDGE" },
  { tone: "green", text: "SAM H. CASHED +0.83u · F1 PODIUM" },
  { tone: "green", text: "NIA W. CASHED +1.74u · NBA PROP" },
  { tone: "green", text: "PRIYA G. CASHED +2.41u · UFC METHOD" },
  { tone: "green", text: "MARCUS T. CASHED +0.91u · NFL SPREAD" },
  { tone: "green", text: "SOFIA R. CASHED +1.20u · POLYMARKET POSITION" },
  { tone: "green", text: "AALIYAH J. CASHED +0.74u · MLB OVER" },
  { tone: "green", text: "WEI L. CASHED +1.55u · KALSHI YES" },
  { tone: "green", text: "YUSUF A. CASHED +0.82u · NHL PUCK LINE" },
  { tone: "green", text: "MAYA P. CASHED +3.10u · UFC ROUND PROP" },
  { tone: "green", text: "DIEGO H. CASHED +0.92u · NCAA SPREAD" },
  { tone: "green", text: "JAMAL R. CASHED +1.42u · NBA PARLAY" },
  { tone: "green", text: "LILA K. CASHED +0.51u · TENNIS H2H" },
  { tone: "green", text: "HIROTO K. CASHED +2.18u · SOCCER ML" },
  { tone: "green", text: "ZOE B. CASHED +0.66u · ESPORTS MAP" },
  { tone: "green", text: "OLU W. CASHED +1.04u · MLB F5" },
  { tone: "green", text: "KAI N. CASHED +0.88u · POLYMARKET NO" },
  // Joins / upgrades
  { tone: "gold", text: "ETHAN K. JOINED ★ INNER CIRCLE" },
  { tone: "gold", text: "AMIR M. JOINED ★ INNER CIRCLE" },
  { tone: "gold", text: "RENATA M. JOINED ★ INNER CIRCLE" },
  { tone: "blue", text: "RYAN P. UPGRADED WEEKLY → MONTHLY" },
  { tone: "blue", text: "TONY C. UPGRADED MONTHLY → ANNUAL" },
  { tone: "blue", text: "CARMEN O. UPGRADED MONTHLY → ANNUAL" },
  { tone: "blue", text: "LAUREN F. JOINED LOCKR · MONTHLY" },
  { tone: "blue", text: "ELI M. JOINED LOCKR · WEEKLY" },
  { tone: "blue", text: "VIKRAM S. JOINED LOCKR · ANNUAL" },
  { tone: "blue", text: "IMANI K. JOINED LOCKR · WEEKLY" },
  { tone: "blue", text: "OWEN D. UPGRADED WEEKLY → ANNUAL" },
  // JT activity
  { tone: "green", text: "JT POSTED NEW PICK · NBA PROP" },
  { tone: "green", text: "JT POSTED NEW PICK · UFC METHOD" },
  { tone: "green", text: "JT POSTED NEW PICK · F1 PODIUM" },
  { tone: "green", text: "JT POSTED NEW PICK · KALSHI HEDGE" },
  { tone: "green", text: "JT POSTED NEW PICK · NFL TOTAL" },
  { tone: "gold", text: "JT POSTED LONG-FORM · NBA BREAKDOWN" },
  { tone: "gold", text: "JT POSTED LONG-FORM · BANKROLL PLAYBOOK" },
  { tone: "gold", text: "JT POSTED LONG-FORM · CLV PRIMER" },
  { tone: "gold", text: "JT POSTED LONG-FORM · KALSHI 101" },
];

// Social-proof popup pool — randomized in-component on mount so visit ≠ visit.
export const SOCIAL_PROOF: ReadonlyArray<{
  name: string;
  detail: string;
  avatar: string;
  tone: Tone;
}> = [
  { name: "Jordan K.", detail: "CASHED +1.82u · NBA PROP", avatar: "JK", tone: "green" },
  { name: "Ethan K.", detail: "APPLIED FOR ★ INNER CIRCLE", avatar: "EK", tone: "gold" },
  { name: "Devon M.", detail: "CASHED +0.41u · KALSHI HEDGE", avatar: "DM", tone: "green" },
  { name: "Ryan P.", detail: "UPGRADED WEEKLY → MONTHLY", avatar: "RP", tone: "blue" },
  { name: "Sam H.", detail: "JOINED ANNUAL · $599", avatar: "SH", tone: "blue" },
  { name: "Nia W.", detail: "CASHED +1.74u · NBA PROP", avatar: "NW", tone: "green" },
  { name: "Amir M.", detail: "CASHED +2.76u · POLYMARKET HEDGE", avatar: "AM", tone: "green" },
  { name: "Tony C.", detail: "UPGRADED MONTHLY → ANNUAL", avatar: "TC", tone: "blue" },
  { name: "Priya G.", detail: "CASHED +0.83u · F1 PODIUM", avatar: "PG", tone: "green" },
  { name: "Lauren F.", detail: "JOINED MONTHLY · $99", avatar: "LF", tone: "blue" },
  { name: "Marcus T.", detail: "CASHED +0.91u · NFL SPREAD", avatar: "MT", tone: "green" },
  { name: "Sofia R.", detail: "JOINED MONTHLY · $99", avatar: "SR", tone: "blue" },
  { name: "Aaliyah J.", detail: "CASHED +0.74u · MLB OVER", avatar: "AJ", tone: "green" },
  { name: "Wei L.", detail: "CASHED +1.55u · KALSHI YES", avatar: "WL", tone: "green" },
  { name: "Yusuf A.", detail: "APPLIED FOR ★ INNER CIRCLE", avatar: "YA", tone: "gold" },
  { name: "Maya P.", detail: "CASHED +3.10u · UFC ROUND PROP", avatar: "MP", tone: "green" },
  { name: "Diego H.", detail: "JOINED WEEKLY · $29", avatar: "DH", tone: "blue" },
  { name: "Jamal R.", detail: "CASHED +1.42u · NBA PARLAY", avatar: "JR", tone: "green" },
  { name: "Lila K.", detail: "UPGRADED MONTHLY → ANNUAL", avatar: "LK", tone: "blue" },
  { name: "Hiroto K.", detail: "CASHED +2.18u · SOCCER ML", avatar: "HK", tone: "green" },
  { name: "Renata M.", detail: "APPLIED FOR ★ INNER CIRCLE", avatar: "RM", tone: "gold" },
  { name: "Kai N.", detail: "CASHED +0.88u · POLYMARKET NO", avatar: "KN", tone: "green" },
  { name: "Imani K.", detail: "JOINED WEEKLY · $29", avatar: "IK", tone: "blue" },
  { name: "Olu W.", detail: "CASHED +1.04u · MLB F5", avatar: "OW", tone: "green" },
  { name: "Carmen O.", detail: "UPGRADED MONTHLY → ANNUAL", avatar: "CO", tone: "blue" },
];

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

export const PRICING = {
  subscription: {
    weekly: { price: "$29", period: "per week · cancel any time", equiv: "$116/mo equivalent" },
    monthly: { price: "$99", period: "per month · cancel any time", equiv: "★ MOST POPULAR" },
    annual: {
      price: "$599",
      period: "per year · save ~50%",
      equiv: "$50/mo equivalent · 2 free months",
      save: "SAVE 50%",
    },
  },
  innercircle: {
    monthly: { price: "$499", period: "per month · cancel any time", equiv: "" },
    annual: {
      price: "$4,999",
      period: "per year · save ~17%",
      equiv: "$416/mo equivalent",
      save: "SAVE 17%",
    },
  },
} as const;

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
