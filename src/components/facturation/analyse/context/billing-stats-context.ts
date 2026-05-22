import { createContext, useContext } from "react";
import { BillingStatsContextData } from "../types/AnalyseTypes";

// Create context with a default empty value
export const BillingStatsContext = createContext<BillingStatsContextData | undefined>(undefined);

// Custom hook to use the billing stats context
export const useBillingStats = (): BillingStatsContextData => {
  const context = useContext(BillingStatsContext);
  if (context === undefined) {
    throw new Error("useBillingStats must be used within a BillingStatsProvider");
  }
  return context;
};
