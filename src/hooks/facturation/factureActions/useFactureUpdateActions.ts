
import { Facture } from "@/types/facture";
import { updateFactureInDatabase } from "@/services/factureService";
import { useCallback } from "react";

export const useFactureUpdateActions = (
  toast: any,
  setFactures: React.Dispatch<React.SetStateAction<Facture[]>>
) => {
  const updateFacture = useCallback(async (facture: Facture) => {
    try {
      // Mettre à jour l'état local immédiatement pour une UX plus réactive
      setFactures(prevFactures => prevFactures.map(f => f.id === facture.id ? facture : f));
      
      // Update in database
      await updateFactureInDatabase(facture);
      
      toast({
        title: "Succès",
        description: "Facture mise à jour avec succès.",
      });
      
      return true;
    } catch (error) {
      console.error("Error in updateFacture:", error);
      
      // Restaurer les données précédentes en cas d'erreur
      setFactures(prevFactures => {
        const oldFacture = prevFactures.find(f => f.id === facture.id);
        if (oldFacture) {
          return prevFactures.map(f => f.id === facture.id ? oldFacture : f);
        }
        return prevFactures;
      });
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors de la mise à jour de la facture.",
      });
      return false;
    }
  }, [toast, setFactures]);
  
  return {
    updateFacture
  };
};
