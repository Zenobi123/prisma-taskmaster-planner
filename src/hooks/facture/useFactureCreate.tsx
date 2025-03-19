
import { useToast } from "@/components/ui/use-toast";
import { Facture } from "@/types/facture";
import { createFactureInDB } from "@/services/factureService";
import { prepareNewInvoice } from "@/utils/factureUtils";

export const useFactureCreate = (factures: Facture[], setFactures: React.Dispatch<React.SetStateAction<Facture[]>>) => {
  const { toast } = useToast();

  const handleCreateInvoice = async (formData: any) => {
    try {
      const { newFactureDB, newFactureState } = await prepareNewInvoice(formData, factures);
      
      await createFactureInDB(newFactureDB);
      
      setFactures([...factures, newFactureState]);
      
      toast({
        title: "Facture créée",
        description: "La nouvelle facture a été créée avec succès.",
      });
      
      return newFactureState;
    } catch (error) {
      console.error("Erreur lors de la création de la facture:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la facture.",
        variant: "destructive"
      });
      return null;
    }
  };

  return { handleCreateInvoice };
};
