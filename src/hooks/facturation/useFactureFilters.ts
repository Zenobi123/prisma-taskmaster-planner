
import { useState, useMemo } from 'react';
import { Facture } from '@/types/facture';

interface DateRange {
  from: Date | null;
  to: Date | null;
}

export const useFactureFilters = (factures: Facture[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string | null>(null);
  const [clientFilter, setClientFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null });

  const filteredFactures = useMemo(() => {
    return factures.filter((facture) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        facture.client?.nom?.toLowerCase().includes(searchLower) ||
        facture.id.toLowerCase().includes(searchLower);

      const matchesStatus = !statusFilter || facture.status === statusFilter;
      const matchesPaymentStatus = !paymentStatusFilter || facture.status_paiement === paymentStatusFilter;
      const matchesClient = !clientFilter || facture.client_id === clientFilter;

      let matchesDateRange = true;
      if (dateRange?.from) {
        const factureDate = new Date(facture.date);
        const fromDate = new Date(dateRange.from);
        matchesDateRange = factureDate >= fromDate;
      }
      if (dateRange?.to && matchesDateRange) {
        const factureDate = new Date(facture.date);
        const toDate = new Date(dateRange.to);
        matchesDateRange = factureDate <= toDate;
      }

      return matchesSearch && matchesStatus && matchesPaymentStatus && matchesClient && matchesDateRange;
    });
  }, [factures, searchTerm, statusFilter, paymentStatusFilter, clientFilter, dateRange]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    statusPaiementFilter: paymentStatusFilter,
    setStatusPaiementFilter: setPaymentStatusFilter,
    clientFilter,
    setClientFilter,
    dateFilter: dateRange,
    setDateFilter: setDateRange,
    filteredFactures,
  };
};
