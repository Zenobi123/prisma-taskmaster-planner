
import { Facture } from "@/types/facture";
import { deleteFactureFromDatabase } from "@/services/factureService";

export const useFactureDeleteActions = (
  toast: any,
  setFactures: React.Dispatch<React.SetStateAction<Facture[]>>
) => {
  const deleteFacture = async (factureId: string) => {
    try {
      await deleteFactureFromDatabase(factureId);
      
      // Update local state by removing the deleted facture
      setFactures(prevFactures => prevFactures.filter(f => f.id !== factureId));
      
      toast({
        title: "Succès",
        description: "Facture supprimée avec succès.",
      });
      
      return true;
    } catch (error) {
      console.error("Error in deleteFacture:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur s'est produite lors de la suppression de la facture.",
      });
      return false;
    }
  };
  
  return {
    deleteFacture
  };
};
