
import { Facture } from "@/types/facture";
import { generatePDF } from "@/utils/pdfUtils";
import { toast } from "sonner";

export const useFactureActions = () => {
  const handleVoirFacture = (facture: Facture) => {
    generatePDF(facture);
  };

  const handleTelechargerFacture = (facture: Facture) => {
    generatePDF(facture, true);
  };

  const handleCancelFacture = (facture: Facture) => {
    // Normally this would update the status in the database
    toast.success(`Facture ${facture.id} annulée`, {
      description: `La facture pour ${facture.client.nom} a été annulée.`
    });
  };

  const handleSendFacture = (facture: Facture) => {
    // Normally this would send the invoice to the client
    toast.success(`Facture ${facture.id} envoyée`, {
      description: `La facture a été envoyée à ${facture.client.nom}.`
    });
  };

  return {
    handleVoirFacture,
    handleTelechargerFacture,
    handleCancelFacture,
    handleSendFacture
  };
};
