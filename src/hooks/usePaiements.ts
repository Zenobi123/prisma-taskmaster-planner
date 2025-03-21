
import { useState } from "react";
import { Paiement } from "@/types/paiement";

export const usePaiements = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Empty array instead of demo data
  const filteredPaiements: Paiement[] = [];

  return {
    searchTerm,
    setSearchTerm,
    filteredPaiements
  };
};
