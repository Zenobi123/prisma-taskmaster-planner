
import { Facture } from "@/types/facture";
import { Paiement } from "@/types/paiement";
import { generatePDF, generateReceiptPDF, formatClientForReceipt } from "@/utils/pdfUtils";
import { useToast } from "@/components/ui/use-toast";
import { PDFFacture, SimplifiedClient } from "@/utils/pdf/types";

export const useFactureViewActions = () => {
  const { toast } = useToast();
  
  const handleVoirFacture = (facture: Facture) => {
    try {
      console.log("Aperçu de la facture:", facture.id);
      
      // Convert facture to PDFFacture format with proper client handling
      const pdfFacture: PDFFacture = {
        id: facture.id,
        // Cast to unknown first to avoid type error
        client: facture.client as unknown as import('@/types/client').Client,
        date: facture.date,
        echeance: facture.echeance,
        montant: facture.montant,
        montant_paye: facture.montant_paye,
        status: facture.status,
        status_paiement: facture.status_paiement,
        prestations: facture.prestations,
        paiements: facture.paiements,
        notes: facture.notes
      };
      
      generatePDF(pdfFacture);
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
      
      // Convert facture to PDFFacture format with proper client handling
      const pdfFacture: PDFFacture = {
        id: facture.id,
        // Cast to unknown first to avoid type error
        client: facture.client as unknown as import('@/types/client').Client,
        date: facture.date,
        echeance: facture.echeance,
        montant: facture.montant,
        montant_paye: facture.montant_paye,
        status: facture.status,
        status_paiement: facture.status_paiement,
        prestations: facture.prestations,
        paiements: facture.paiements,
        notes: facture.notes
      };
      
      generatePDF(pdfFacture, true);
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
      
      // Ensure client is properly formatted
      const formattedClient = paiement.client ? formatClientForReceipt(paiement.client) : undefined;
      
      // Format paiement with client
      const paiementWithFormattedClient = {
        ...paiement,
        client: formattedClient
      };
      
      // Utiliser directement la fonction generateReceiptPDF
      generateReceiptPDF(paiementWithFormattedClient);
      
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
      
      // Ensure client is properly formatted
      const formattedClient = paiement.client ? formatClientForReceipt(paiement.client) : undefined;
      
      // Format paiement with client
      const paiementWithFormattedClient = {
        ...paiement,
        client: formattedClient
      };
      
      // Télécharger le reçu
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
    handleVoirFacture,
    handleTelechargerFacture,
    handleVoirRecu,
    handleTelechargerRecu
  };
};

export default useFactureViewActions;
