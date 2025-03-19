
import { useState } from "react";
import { Facture } from "@/types/facture";
import { filterFactures } from "@/data/factureData";

export const useFacturationFilters = (factures: Facture[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");

  const filteredFactures = filterFactures(
    factures,
    searchTerm,
    statusFilter,
    periodFilter
  );

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    periodFilter,
    setPeriodFilter,
    filteredFactures
  };
};
