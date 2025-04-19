
import { useToast } from "@/components/ui/use-toast";
import { Paiement } from "@/types/paiement";
import { generateReceiptPDF, formatClientForReceipt } from "@/utils/pdf/receiptPdfGenerator";

export const useReceiptPreview = () => {
  const { toast } = useToast();

  const handleVoirRecu = (paiement: Paiement) => {
    try {
      console.log("Aperçu du reçu de paiement:", paiement.id);
      
      const formattedClient = paiement.client ? formatClientForReceipt(paiement.client) : undefined;
      
      const paiementWithFormattedClient = {
        ...paiement,
        client: formattedClient
      };
      
      generateReceiptPDF(paiementWithFormattedClient, false);
      
      toast({
        title: "Reçu de paiement",
        description: `Visualisation du reçu pour le paiement ${paiement.reference || paiement.id}`,
      });
    } catch (error) {
      console.error("Erreur lors de l'aperçu du reçu:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'afficher le reçu de paiement."
      });
    }
  };

  const handleTelechargerRecu = (paiement: Paiement) => {
    try {
      console.log("Téléchargement du reçu de paiement:", paiement.id);
      
      const formattedClient = paiement.client ? formatClientForReceipt(paiement.client) : undefined;
      
      const paiementWithFormattedClient = {
        ...paiement,
        client: formattedClient
      };
      
      generateReceiptPDF(paiementWithFormattedClient, true);
      
      toast({
        title: "Reçu téléchargé",
        description: `Le reçu pour le paiement ${paiement.reference || paiement.id} a été téléchargé.`,
      });
    } catch (error) {
      console.error("Erreur lors du téléchargement du reçu:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de télécharger le reçu de paiement."
      });
    }
  };

  return {
    handleVoirRecu,
    handleTelechargerRecu
  };
};
