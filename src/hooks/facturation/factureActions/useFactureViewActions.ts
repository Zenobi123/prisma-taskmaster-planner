
import { Facture } from "@/types/facture";
import { Paiement } from "@/types/paiement";
import { useToast } from "@/components/ui/use-toast";
import { PDFFacture, SimplifiedClient } from "@/utils/pdf/types";
import { generateInvoicePDF } from "@/utils/pdf/invoicePdfGenerator";
import { generateReceiptPDF, formatClientForReceipt } from "@/utils/pdf/receiptPdfGenerator";

export const useFactureViewActions = () => {
  const { toast } = useToast();
  
  const handleVoirFacture = (facture: Facture) => {
    try {
      console.log("Aperçu de la facture:", facture.id);
      
      // Format the client data according to the expected structure for PDF
      const pdfFacture: PDFFacture = {
        id: facture.id,
        // Properly map the client data structure
        client: {
          id: facture.client.id,
          nom: facture.client.nom,
          raisonsociale: facture.client.raisonsociale,
          type: facture.client.type,
          niu: facture.client.niu,
          adresse: facture.client.adresse,
          contact: facture.client.contact,
          // Add other required client properties from the Client type
          centrerattachement: facture.client.centrerattachement,
          secteuractivite: facture.client.secteuractivite,
          statut: facture.client.statut,
          interactions: facture.client.interactions || [],
          gestionexternalisee: facture.client.gestionexternalisee
        },
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
      
      // Générer et visualiser (ouvrir dans un nouvel onglet)
      generateInvoicePDF(pdfFacture, false);
      
      toast({
        title: "Facture visualisée",
        description: `La facture ${facture.id} a été ouverte dans un nouvel onglet.`,
      });
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
      
      // Format the client data according to the expected structure for PDF
      const pdfFacture: PDFFacture = {
        id: facture.id,
        // Properly map the client data structure
        client: {
          id: facture.client.id,
          nom: facture.client.nom,
          raisonsociale: facture.client.raisonsociale,
          type: facture.client.type,
          niu: facture.client.niu,
          adresse: facture.client.adresse,
          contact: facture.client.contact,
          // Add other required client properties from the Client type
          centrerattachement: facture.client.centrerattachement,
          secteuractivite: facture.client.secteuractivite,
          statut: facture.client.statut,
          interactions: facture.client.interactions || [],
          gestionexternalisee: facture.client.gestionexternalisee
        },
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
      
      // Générer et télécharger
      generateInvoicePDF(pdfFacture, true);
      
      toast({
        title: "Facture téléchargée",
        description: `La facture ${facture.id} a été téléchargée.`,
      });
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
      
      // Générer et visualiser (ouvrir dans un nouvel onglet)
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
      
      // Ensure client is properly formatted
      const formattedClient = paiement.client ? formatClientForReceipt(paiement.client) : undefined;
      
      // Format paiement with client
      const paiementWithFormattedClient = {
        ...paiement,
        client: formattedClient
      };
      
      // Générer et télécharger
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
