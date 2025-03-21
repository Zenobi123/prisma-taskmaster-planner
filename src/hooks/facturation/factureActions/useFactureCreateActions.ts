
import { Facture } from "@/types/facture";
import { addFactureToDatabase } from "@/services/factureService";

export const useFactureCreateActions = (
  toast: any,
  setFactures: React.Dispatch<React.SetStateAction<Facture[]>>
) => {
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
  
  return {
    addFacture
  };
};
