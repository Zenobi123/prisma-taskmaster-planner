
import { useState } from "react";
import { Facture } from "@/types/facture";
import { sortFactures as sortFacturesUtil } from "@/utils/factureUtils";

export const useFactureSorting = () => {
  const [sortKey, setSortKey] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  return {
    sortKey,
    setSortKey,
    sortDirection,
    setSortDirection
  };
};

// Static method for sorting factures
useFactureSorting.sortFactures = (
  factures: Facture[],
  sortKey: string,
  sortDirection: "asc" | "desc"
): Facture[] => {
  return sortFacturesUtil(factures, sortKey, sortDirection);
};
