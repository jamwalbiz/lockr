import type { Metadata } from "next";
import { CheckoutFlow } from "./CheckoutFlow";

export const metadata: Metadata = {
  title: "Checkout — Lockr",
  description: "Subscribe to Lockr. Card, ACH, or crypto. Your Discord invite is ready the moment payment clears.",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ tier?: string; cadence?: string }>;

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Next 16: searchParams is async and must be awaited
  const params = await searchParams;
  return (
    <div className="shell">
      <CheckoutFlow
        initialTier={params.tier === "innercircle" ? "innercircle" : "subscription"}
        initialCadence={
          params.cadence === "weekly" || params.cadence === "monthly"
            ? params.cadence
            : "annual"
        }
      />
    </div>
  );
}
