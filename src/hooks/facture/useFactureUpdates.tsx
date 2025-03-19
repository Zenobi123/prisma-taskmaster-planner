
import { useToast } from "@/components/ui/use-toast";
import { Facture, Paiement } from "@/types/facture";
import { enregistrerPaiementPartiel, updateFactureStatus } from "@/services/factureService";

export const useFactureUpdates = (factures: Facture[], setFactures: React.Dispatch<React.SetStateAction<Facture[]>>) => {
  const { toast } = useToast();

  const handleUpdateStatus = async (factureId: string, newStatus: 'payée' | 'en_attente' | 'envoyée' | 'partiellement_payée') => {
    try {
      await updateFactureStatus(factureId, newStatus);
      
      const updatedFactures = factures.map(facture => 
        facture.id === factureId 
          ? { ...facture, status: newStatus } 
          : facture
      );
      
      setFactures(updatedFactures);
      
      toast({
        title: "Statut mis à jour",
        description: `La facture ${factureId} est maintenant ${newStatus.replace('_', ' ')}.`
      });

      return updatedFactures.find(f => f.id === factureId);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut.",
        variant: "destructive"
      });
      return null;
    }
  };

  const handlePaiementPartiel = async (
    factureId: string, 
    paiement: Paiement, 
    prestationsIds: string[]
  ): Promise<Facture | null> => {
    try {
      const factureIndex = factures.findIndex(f => f.id === factureId);
      if (factureIndex === -1) {
        throw new Error("Facture non trouvée");
      }
      
      const facture = factures[factureIndex];
      const nouveauMontantPaye = (facture.montantPaye || 0) + paiement.montant;
      
      await enregistrerPaiementPartiel(factureId, paiement, prestationsIds, nouveauMontantPaye);
      
      // Mettre à jour le statut en fonction du montant payé
      let newStatus: 'payée' | 'partiellement_payée' | 'en_attente' | 'envoyée' = facture.status;
      
      if (nouveauMontantPaye >= facture.montant) {
        newStatus = 'payée';
      } else if (nouveauMontantPaye > 0) {
        newStatus = 'partiellement_payée';
      }
      
      // Mettre à jour les prestations payées
      const updatedPrestations = facture.prestations.map(prestation => {
        if (prestation.id && prestationsIds.includes(prestation.id)) {
          return { ...prestation, estPaye: true, datePaiement: new Date().toISOString().split('T')[0] };
        }
        return prestation;
      });
      
      // Créer la facture mise à jour
      const updatedFacture = {
        ...facture,
        status: newStatus,
        montantPaye: nouveauMontantPaye,
        paiements: [...(facture.paiements || []), paiement],
        prestations: updatedPrestations
      };
      
      // Mettre à jour l'état
      const newFactures = [...factures];
      newFactures[factureIndex] = updatedFacture;
      setFactures(newFactures);
      
      toast({
        title: "Paiement enregistré",
        description: `Un paiement de ${paiement.montant} FCFA a été enregistré pour la facture ${factureId}.`
      });
      
      return updatedFacture;
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du paiement partiel:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le paiement partiel.",
        variant: "destructive"
      });
      return null;
    }
  };

  return { handleUpdateStatus, handlePaiementPartiel };
};
