
import { Facture } from "@/types/facture";
import { updateFactureInDatabase } from "@/services/factureService";

export const useFactureUpdateActions = (
  toast: any,
  setFactures: React.Dispatch<React.SetStateAction<Facture[]>>
) => {
  const updateFacture = async (facture: Facture) => {
    try {
      // Update in database
      await updateFactureInDatabase(facture);
      
      // Update the facture in the local state
      setFactures(prevFactures => prevFactures.map(f => f.id === facture.id ? facture : f));
      
      toast({
        title: "Succès",
        description: "Facture mise à jour avec succès.",
      });
      
      return true;
    } catch (error) {
      console.error("Error in updateFacture:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors de la mise à jour de la facture.",
      });
      return false;
    }
  };
  
  return {
    updateFacture
  };
};
