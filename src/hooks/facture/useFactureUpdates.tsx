
import { useToast } from "@/components/ui/use-toast";
import { Facture } from "@/types/facture";
import { updateFactureStatus } from "@/services/factureService";

export const useFactureUpdates = (factures: Facture[], setFactures: React.Dispatch<React.SetStateAction<Facture[]>>) => {
  const { toast } = useToast();

  const handleUpdateStatus = async (factureId: string, newStatus: 'payée' | 'en_attente' | 'envoyée') => {
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

  return { handleUpdateStatus };
};
