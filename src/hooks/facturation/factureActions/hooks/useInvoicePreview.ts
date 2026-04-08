
import { useToast } from "@/components/ui/use-toast";
import { Facture } from "@/types/facture";
import { PDFFacture } from "@/utils/pdf/types";
import { generateInvoicePDF } from "@/utils/pdf/invoicePdfGenerator";
import { mapClientToPdfClient } from "../utils/clientMapper";

export const useInvoicePreview = () => {
  const { toast } = useToast();

  const handleVoirFacture = (facture: Facture) => {
    try {
      
      const pdfFacture: PDFFacture = {
        id: facture.id,
        client: mapClientToPdfClient(facture.client),
        date: facture.date,
        echeance: facture.echeance,
        montant: facture.montant,
        montant_paye: facture.montant_paye,
        status: facture.status,
        status_paiement: facture.status_paiement,
        prestations: facture.prestations,
        paiements: facture.paiements,
        notes: facture.notes && typeof facture.notes === 'string' ? facture.notes : ''
      };
      
      
      generateInvoicePDF(pdfFacture, false);
      
      toast({
        title: "Facture visualisée",
        description: `La facture ${facture.id} a été ouverte dans un nouvel onglet.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'afficher l'aperçu de la facture."
      });
    }
  };

  const handleTelechargerFacture = (facture: Facture) => {
    try {
      
      const pdfFacture: PDFFacture = {
        id: facture.id,
        client: mapClientToPdfClient(facture.client),
        date: facture.date,
        echeance: facture.echeance,
        montant: facture.montant,
        montant_paye: facture.montant_paye,
        status: facture.status,
        status_paiement: facture.status_paiement,
        prestations: facture.prestations,
        paiements: facture.paiements,
        notes: facture.notes && typeof facture.notes === 'string' ? facture.notes : ''
      };
      
      
      generateInvoicePDF(pdfFacture, true);
      
      toast({
        title: "Facture téléchargée",
        description: `La facture ${facture.id} a été téléchargée.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de télécharger la facture."
      });
    }
  };

  return {
    handleVoirFacture,
    handleTelechargerFacture
  };
};
