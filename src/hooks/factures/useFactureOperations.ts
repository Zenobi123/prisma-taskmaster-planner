
import { useState } from 'react';
import { Facture } from '@/types/facture';
import * as factureService from '@/services/factureService';
import { useToast } from '@/components/ui/use-toast';

export const useFactureOperations = (refetchFactures: () => Promise<void>) => {
  const { toast } = useToast();
  const [selectedFacture, setSelectedFacture] = useState<Facture | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createFacture = async (factureData: any): Promise<boolean> => {
    setIsLoading(true);
    try {
      await factureService.createFacture(factureData);
      refetchFactures();
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
      refetchFactures();
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
      refetchFactures();
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

  return {
    selectedFacture,
    isLoading,
    createFacture,
    updateFacture,
    deleteFacture,
    fetchFactureById,
    setSelectedFacture
  };
};
