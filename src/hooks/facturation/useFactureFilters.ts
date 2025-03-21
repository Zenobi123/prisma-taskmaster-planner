
import { useState } from "react";
import { Facture } from "@/types/facture";
import {
  applySearchFilter,
  applyStatusFilter,
  applyClientFilter,
  applyDateFilter
} from "@/utils/factureUtils";

export const useFactureFilters = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [statusPaiementFilter, setStatusPaiementFilter] = useState<string | null>(null);
  const [clientFilter, setClientFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  
  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    statusPaiementFilter,
    setStatusPaiementFilter,
    clientFilter,
    setClientFilter,
    dateFilter,
    setDateFilter
  };
};

// Static methods for applying filters
useFactureFilters.applyFilters = (
  factures: Facture[],
  searchTerm: string,
  statusFilter: string | null,
  statusPaiementFilter: string | null,
  clientFilter: string | null,
  dateFilter: Date | null
): Facture[] => {
  let result = applySearchFilter(factures, searchTerm);
  result = applyStatusFilter(result, statusFilter);
  
  // Apply status_paiement filter
  if (statusPaiementFilter) {
    result = result.filter(facture => facture.status_paiement === statusPaiementFilter);
  }
  
  result = applyClientFilter(result, clientFilter);
  result = applyDateFilter(result, dateFilter);
  
  return result;
};
