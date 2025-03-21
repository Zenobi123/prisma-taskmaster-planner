
import { Facture } from "@/types/facture";
import { generatePDF } from "@/utils/pdfUtils";

export const useFactureViewActions = () => {
  const handleVoirFacture = (facture: Facture) => {
    generatePDF(facture);
  };

  const handleTelechargerFacture = (facture: Facture) => {
    generatePDF(facture, true);
  };
  
  return {
    handleVoirFacture,
    handleTelechargerFacture
  };
};
