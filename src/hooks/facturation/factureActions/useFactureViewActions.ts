
import { Facture } from "@/types/facture";
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
  
  return {
    handleVoirFacture,
    handleTelechargerFacture
  };
};

export default useFactureViewActions;
