
import { Facture } from "@/types/facture";
import { generatePDF } from "@/utils/pdfUtils";

export const useFactureActions = () => {
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
