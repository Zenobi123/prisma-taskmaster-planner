
import { useInvoicePreview } from "./hooks/useInvoicePreview";
import { useReceiptPreview } from "./hooks/useReceiptPreview";

export const useFactureViewActions = () => {
  const { handleVoirFacture, handleTelechargerFacture } = useInvoicePreview();
  const { handleVoirRecu, handleTelechargerRecu } = useReceiptPreview();
  
  return {
    handleVoirFacture,
    handleTelechargerFacture,
    handleVoirRecu,
    handleTelechargerRecu,
  };
};

export default useFactureViewActions;
