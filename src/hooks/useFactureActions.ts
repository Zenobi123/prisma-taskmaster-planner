
import { Facture } from "@/types/facture";
import { generatePDF } from "@/utils/pdfUtils";

export const useFactureActions = () => {
  const handleVoirFacture = (facture: Facture) => {
    generatePDF(facture);
  };

  const handleTelechargerFacture = (facture: Facture) => {
    generatePDF(facture, true);
  };

  const addFacture = (factures: Facture[], facture: Facture): Facture[] => {
    return [facture, ...factures];
  };

  return {
    handleVoirFacture,
    handleTelechargerFacture,
    addFacture
  };
};
