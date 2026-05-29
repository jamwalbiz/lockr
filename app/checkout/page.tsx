import type { Metadata } from "next";
import { CheckoutFlow } from "./CheckoutFlow";

export const metadata: Metadata = {
  title: "Checkout — Lockr",
  description: "Subscribe to Lockr. Card, ACH, or Cash App via Whop. Discord access is automatic after payment.",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ tier?: string; cadence?: string }>;

const VALID_TIERS = ["subscription", "innercircle"] as const;
const VALID_CADENCES = ["weekly", "monthly", "annual"] as const;

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Next 16: searchParams is async and must be awaited
  const params = await searchParams;
  const tier = VALID_TIERS.includes(params.tier as (typeof VALID_TIERS)[number])
    ? (params.tier as "subscription" | "innercircle")
    : undefined;
  const cadence = VALID_CADENCES.includes(
    params.cadence as (typeof VALID_CADENCES)[number],
  )
    ? (params.cadence as "weekly" | "monthly" | "annual")
    : undefined;
  return (
    <div className="shell">
      <CheckoutFlow initialTier={tier} initialCadence={cadence} />
    </div>
  );
}
