
import { Facture } from "@/types/facture";
import { Paiement } from "@/types/paiement";
import { generatePDF } from "@/utils/pdfUtils";

export const useFactureViewActions = () => {
  const handleVoirFacture = (facture: Facture) => {
    console.log("Aperçu de la facture:", facture.id);
    generatePDF(facture);
  };

  const handleTelechargerFacture = (facture: Facture) => {
    console.log("Téléchargement de la facture:", facture.id);
    generatePDF(facture, true);
  };
  
  const handleVoirRecu = (paiement: Paiement) => {
    console.log("Aperçu du reçu de paiement:", paiement.id);
    // Ici, nous pourrions appeler une fonction similaire à generatePDF mais pour les reçus
    // generateRecuPDF(paiement);
  };
  
  return {
    handleVoirFacture,
    handleTelechargerFacture,
    handleVoirRecu
  };
};

export default useFactureViewActions;
