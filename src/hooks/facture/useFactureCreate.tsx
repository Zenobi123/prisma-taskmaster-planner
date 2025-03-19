
import { useToast } from "@/components/ui/use-toast";
import { Facture } from "@/types/facture";
import { createFactureInDB } from "@/services/facture/factureCreate";
import { prepareNewInvoice } from "@/utils/factureUtils";

export const useFactureCreate = (factures: Facture[], setFactures: React.Dispatch<React.SetStateAction<Facture[]>>) => {
  const { toast } = useToast();

  const handleCreateInvoice = async (formData: any) => {
    try {
      console.log("Préparation de la nouvelle facture...");
      const { newFactureDB, newFactureState } = await prepareNewInvoice(formData, factures);
      
      console.log("Tentative de création en base de données:", newFactureDB.id);
      await createFactureInDB(newFactureDB);
      
      console.log("Facture créée avec succès:", newFactureState.id);
      setFactures([...factures, newFactureState]);
      
      toast({
        title: "Facture créée",
        description: `La facture ${newFactureState.id} a été créée avec succès.`,
      });
      
      return newFactureState;
    } catch (error) {
      console.error("Erreur lors de la création de la facture:", error);
      
      // Message d'erreur plus détaillé
      let errorMessage = "Impossible de créer la facture.";
      if (error instanceof Error) {
        errorMessage += " Erreur: " + error.message;
      }
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      return null;
    }
  };

  return { handleCreateInvoice };
};
