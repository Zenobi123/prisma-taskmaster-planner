
import { useState, useEffect, useCallback } from 'react';
import { Facture } from '@/types/facture';
import * as factureService from '@/services/factureService';
import { useToast } from '@/components/ui/use-toast';

interface FacturesFilters {
  status?: string;
  clientId?: string;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
  page?: number;
  limit?: number;
}

export const useFactures = (initialFilters?: FacturesFilters) => {
  const { toast } = useToast();
  const [factures, setFactures] = useState<Facture[]>([]);
  const [selectedFacture, setSelectedFacture] = useState<Facture | null>(null);
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

  const createFacture = async (factureData: any) => {
    setIsLoading(true);
    try {
      await factureService.createFacture(factureData);
      fetchFactures();
      toast({
        title: "Succès",
        description: "La facture a été créée avec succès"
      });
      return true;
    } catch (error) {
      console.error("Erreur lors de la création de la facture:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la facture",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateFacture = async (id: string, updates: Partial<Facture>) => {
    setIsLoading(true);
    try {
      await factureService.updateFacture(id, updates);
      fetchFactures();
      if (selectedFacture && selectedFacture.id === id) {
        const updatedFacture = await factureService.getFactureById(id);
        setSelectedFacture(updatedFacture);
      }
      toast({
        title: "Succès",
        description: "La facture a été mise à jour avec succès"
      });
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la facture:", error);
      toast({
        title: "Erreur", 
        description: error instanceof Error ? error.message : "Impossible de mettre à jour la facture",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFacture = async (id: string) => {
    setIsLoading(true);
    try {
      await factureService.deleteFacture(id);
      fetchFactures();
      if (selectedFacture && selectedFacture.id === id) {
        setSelectedFacture(null);
      }
      toast({
        title: "Succès",
        description: "La facture a été supprimée avec succès"
      });
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression de la facture:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de supprimer la facture",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFactureById = async (id: string) => {
    setIsLoading(true);
    try {
      const facture = await factureService.getFactureById(id);
      setSelectedFacture(facture);
      return facture;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la facture ${id}:`, error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les détails de la facture",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const enregistrerPaiement = async (
    factureId: string,
    montant: number,
    modePaiement: string,
    datePaiement: string,
    notes?: string
  ) => {
    setIsLoading(true);
    try {
      const facture = await factureService.enregistrerPaiement(
        factureId,
        montant,
        modePaiement,
        datePaiement,
        notes
      );
      fetchFactures();
      if (selectedFacture && selectedFacture.id === factureId) {
        setSelectedFacture(facture);
      }
      toast({
        title: "Succès",
        description: "Le paiement a été enregistré avec succès"
      });
      return true;
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du paiement:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le paiement",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

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
    selectedFacture,
    isLoading,
    totalCount,
    filters,
    fetchFactures,
    createFacture,
    updateFacture,
    deleteFacture,
    fetchFactureById,
    setSelectedFacture,
    updateFilters,
    enregistrerPaiement
  };
};
