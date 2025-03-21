
import { Facture } from "@/types/facture";
import { generatePDF } from "@/utils/pdfUtils";
import { 
  addFactureToDatabase,
  deleteFactureFromDatabase,
  updateFactureInDatabase
} from "@/services/factureService";

export const useFactureActions = (
  toast: any,
  factures: Facture[],
  setFactures: React.Dispatch<React.SetStateAction<Facture[]>>
) => {
  const handleVoirFacture = (facture: Facture) => {
    generatePDF(facture);
  };

  const handleTelechargerFacture = (facture: Facture) => {
    generatePDF(facture, true);
  };

  const addFacture = async (facture: Facture) => {
    try {
      // Save to database
      await addFactureToDatabase(facture);
      
      // Add the facture to the local state
      setFactures(prevFactures => [facture, ...prevFactures]);
      
      toast({
        title: "Succès",
        description: "Facture enregistrée avec succès.",
      });
      
      return true;
    } catch (error) {
      console.error("Error in addFacture:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'enregistrement de la facture.",
      });
      return false;
    }
  };

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
    handleVoirFacture,
    handleTelechargerFacture,
    addFacture,
    updateFacture,
    deleteFacture
  };
};
