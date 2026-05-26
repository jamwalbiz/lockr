// Static placeholder data — replace with real Discord activity stream / CMS later.
// Keeping in one place so it's trivial to find and swap.

export const ACTIVITY_ITEMS = [
  { tone: "green", text: "JORDAN K. CASHED +1.82u · SGA OVER 31.5 · 2 MIN AGO" },
  { tone: "gold", text: "ETHAN K. JOINED ★ INNER CIRCLE · 6 MIN AGO" },
  { tone: "green", text: "DEVON M. CASHED +0.41u · KALSHI FED HOLD · 14 MIN AGO" },
  { tone: "blue", text: "RYAN P. UPGRADED WEEKLY → MONTHLY · 22 MIN AGO" },
  { tone: "green", text: "JT POSTED NEW PICK · TOPURIA RD 1-3 KO · 28 MIN AGO" },
  { tone: "green", text: "SAM H. CASHED +0.83u · VERSTAPPEN TOP 3 MONACO · 41 MIN AGO" },
  { tone: "gold", text: "JT POSTED LATEST LONG-FORM · NBA FINALS BREAKDOWN" },
  { tone: "green", text: "NIA W. CASHED +1.74u · NBA PLAYER PROP · 1 HR AGO" },
] as const;

export const SOCIAL_PROOF = [
  { name: "Jordan K.", detail: "CASHED +1.82u · SGA OVER 31.5", avatar: "JK", tone: "green" },
  { name: "Ethan K.", detail: "APPLIED FOR ★ INNER CIRCLE", avatar: "EK", tone: "gold" },
  { name: "Devon M.", detail: "CASHED +0.41u · KALSHI FED HOLD", avatar: "DM", tone: "green" },
  { name: "Ryan P.", detail: "UPGRADED WEEKLY → MONTHLY", avatar: "RP", tone: "blue" },
  { name: "Sam H.", detail: "JOINED ANNUAL · $599", avatar: "SH", tone: "blue" },
  { name: "Nia W.", detail: "CASHED +1.74u · NBA PLAYER PROP", avatar: "NW", tone: "green" },
  { name: "Amir M.", detail: "CASHED +2.76u · POLYMARKET HEDGE", avatar: "AM", tone: "green" },
  { name: "Tony C.", detail: "UPGRADED MONTHLY → ANNUAL", avatar: "TC", tone: "blue" },
  { name: "Priya G.", detail: "CASHED +0.83u · F1 MONACO", avatar: "PG", tone: "green" },
  { name: "Lauren F.", detail: "JOINED MONTHLY · $99", avatar: "LF", tone: "blue" },
] as const;

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
    monthly: { price: "$99", period: "per month · cancel any time", equiv: "" },
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
