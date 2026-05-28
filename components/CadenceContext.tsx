"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type Cadence = "weekly" | "monthly" | "annual";

type CadenceCtx = {
  subscription: Cadence;
  setSubscription: (c: Cadence) => void;
};

const CadenceContext = createContext<CadenceCtx>({
  subscription: "monthly",
  setSubscription: () => {},
});

export function CadenceProvider({ children }: { children: ReactNode }) {
  // Default to "monthly" — matches the default selection in PricingCards.
  const [subscription, setSubscription] = useState<Cadence>("monthly");
  return (
    <CadenceContext.Provider value={{ subscription, setSubscription }}>
      {children}
    </CadenceContext.Provider>
  );
}

export function useCadence(): CadenceCtx {
  return useContext(CadenceContext);
}
