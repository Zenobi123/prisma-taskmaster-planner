
import { Facture } from "@/types/facture";
import { Paiement } from "@/types/paiement";
import { generatePDF, generateReceiptPDF } from "@/utils/pdfUtils";
import { useToast } from "@/components/ui/use-toast";

export const useFactureViewActions = () => {
  const { toast } = useToast();
  
  const handleVoirFacture = (facture: Facture) => {
    try {
      console.log("Aperçu de la facture:", facture.id);
      // Convertir status à un type acceptable si nécessaire
      const factureAjustee = {
        ...facture,
        status: facture.status as any
      };
      generatePDF(factureAjustee);
    } catch (error) {
      console.error("Erreur lors de l'aperçu de la facture:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'afficher l'aperçu de la facture."
      });
    }
  };

  const handleTelechargerFacture = (facture: Facture) => {
    try {
      console.log("Téléchargement de la facture:", facture.id);
      // Convertir status à un type acceptable si nécessaire
      const factureAjustee = {
        ...facture,
        status: facture.status as any
      };
      generatePDF(factureAjustee, true);
    } catch (error) {
      console.error("Erreur lors du téléchargement de la facture:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de télécharger la facture."
      });
    }
  };
  
  const handleVoirRecu = (paiement: Paiement) => {
    try {
      console.log("Aperçu du reçu de paiement:", paiement.id);
      
      // Utiliser directement la fonction generateReceiptPDF
      generateReceiptPDF(paiement);
      
      toast({
        title: "Reçu de paiement",
        description: `Visualisation du reçu pour le paiement ${paiement.reference}`,
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
      
      // Télécharger le reçu
      generateReceiptPDF(paiement, true);
      
      toast({
        title: "Reçu téléchargé",
        description: `Le reçu pour le paiement ${paiement.reference} a été téléchargé.`,
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
    handleVoirFacture,
    handleTelechargerFacture,
    handleVoirRecu,
    handleTelechargerRecu
  };
};

export default useFactureViewActions;
