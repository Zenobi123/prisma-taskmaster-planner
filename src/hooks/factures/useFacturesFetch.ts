
import { useState, useEffect, useCallback } from 'react';
import { Facture } from '@/types/facture';
import * as factureService from '@/services/factureService';
import { useToast } from '@/components/ui/use-toast';

export interface FacturesFilters {
  status?: string;
  clientId?: string;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
  page?: number;
  limit?: number;
}

export const useFacturesFetch = (initialFilters?: FacturesFilters) => {
  const { toast } = useToast();
  const [factures, setFactures] = useState<Facture[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<FacturesFilters>(initialFilters || {
    status: 'all',
    page: 1,
    limit: 10
  });

  const fetchFactures = useCallback(async () => {
    setIsLoading(true);
    try {
      const { factures: data, count } = await factureService.getFactures(filters);
      setFactures(data);
      setTotalCount(count || data.length);
    } catch (error) {
      console.error("Erreur lors de la récupération des factures:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les factures",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [filters, toast]);

  useEffect(() => {
    fetchFactures();
  }, [fetchFactures]);

  const updateFilters = (newFilters: Partial<FacturesFilters>) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters,
      // Réinitialiser la page à 1 si les filtres changent (sauf si la page elle-même est mise à jour)
      page: newFilters.page || 1
    }));
  };

  return {
    factures,
    isLoading,
    totalCount,
    filters,
    fetchFactures,
    updateFilters
  };
};
