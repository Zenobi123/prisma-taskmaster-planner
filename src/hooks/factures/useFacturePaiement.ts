
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import * as factureService from '@/services/factureService';

export const useFacturePaiement = (refetchFactures: () => Promise<void>) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

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
      refetchFactures();
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

  return {
    isLoading,
    enregistrerPaiement
  };
};
