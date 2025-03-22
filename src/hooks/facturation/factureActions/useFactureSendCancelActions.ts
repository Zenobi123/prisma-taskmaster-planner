
import { Facture } from "@/types/facture";
import { useToast } from "@/components/ui/use-toast";
import { updateFactureInDatabase } from "@/services/factureService";

export const useFactureSendCancelActions = (
  toast: ReturnType<typeof useToast>,
  factures: Facture[],
  setFactures: React.Dispatch<React.SetStateAction<Facture[]>>
) => {
  // Fonction pour envoyer une facture (changement de statut de brouillon à envoyée)
  const sendFacture = async (facture: Facture) => {
    try {
      const updatedFacture: Facture = {
        ...facture,
        status: "envoyée" as const,
        updated_at: new Date().toISOString()
      };
      
      // Mettre à jour dans la base de données
      await updateFactureInDatabase(updatedFacture);
      
      // Mettre à jour l'état local
      setFactures(factures.map(f => f.id === facture.id ? updatedFacture : f));
      
      toast({
        title: "Facture envoyée",
        description: `La facture ${facture.id} a été marquée comme envoyée.`,
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi de la facture:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la facture. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };
  
  // Fonction pour annuler une facture
  const cancelFacture = async (facture: Facture) => {
    try {
      const updatedFacture: Facture = {
        ...facture,
        status: "annulée" as const,
        updated_at: new Date().toISOString()
      };
      
      // Mettre à jour dans la base de données
      await updateFactureInDatabase(updatedFacture);
      
      // Mettre à jour l'état local
      setFactures(factures.map(f => f.id === facture.id ? updatedFacture : f));
      
      toast({
        title: "Facture annulée",
        description: `La facture ${facture.id} a été annulée.`,
      });
    } catch (error) {
      console.error("Erreur lors de l'annulation de la facture:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'annuler la facture. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };
  
  return {
    sendFacture,
    cancelFacture
  };
};

export default useFactureSendCancelActions;
