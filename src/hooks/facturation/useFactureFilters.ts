
import { useState, useMemo } from 'react';
import { Facture } from '@/types/facture';

interface DateRange {
  from: Date | null;
  to: Date | null;
}

export const useFactureFilters = (factures: Facture[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [statusPaiementFilter, setStatusPaiementFilter] = useState<string | null>(null);
  const [clientFilter, setClientFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<DateRange>({ from: null, to: null });

  const filteredFactures = useMemo(() => {
    return factures.filter((facture) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        facture.client?.nom?.toLowerCase().includes(searchLower) ||
        facture.id.toLowerCase().includes(searchLower);

      const matchesStatus = !statusFilter || facture.status === statusFilter;
      const matchesPaymentStatus = !statusPaiementFilter || facture.status_paiement === statusPaiementFilter;
      const matchesClient = !clientFilter || facture.client_id === clientFilter;

      let matchesDateRange = true;
      if (dateFilter?.from) {
        const factureDate = new Date(facture.date);
        const fromDate = new Date(dateFilter.from);
        matchesDateRange = factureDate >= fromDate;
      }
      if (dateFilter?.to && matchesDateRange) {
        const factureDate = new Date(facture.date);
        const toDate = new Date(dateFilter.to);
        matchesDateRange = factureDate <= toDate;
      }

      return matchesSearch && matchesStatus && matchesPaymentStatus && matchesClient && matchesDateRange;
    });
  }, [factures, searchTerm, statusFilter, statusPaiementFilter, clientFilter, dateFilter]);

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
    setDateFilter,
    filteredFactures,
  };
};
