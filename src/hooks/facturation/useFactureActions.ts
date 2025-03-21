
import { Facture } from "@/types/facture";
import { useFactureViewActions } from "./factureActions/useFactureViewActions";
import { useFactureCreateActions } from "./factureActions/useFactureCreateActions";
import { useFactureUpdateActions } from "./factureActions/useFactureUpdateActions";
import { useFactureDeleteActions } from "./factureActions/useFactureDeleteActions";

export const useFactureActions = (
  toast: any,
  factures: Facture[],
  setFactures: React.Dispatch<React.SetStateAction<Facture[]>>
) => {
  // Compose the actions from specialized hooks
  const { handleVoirFacture, handleTelechargerFacture } = useFactureViewActions();
  const { addFacture } = useFactureCreateActions(toast, setFactures);
  const { updateFacture } = useFactureUpdateActions(toast, setFactures);
  const { deleteFacture } = useFactureDeleteActions(toast, setFactures);
  
  return {
    handleVoirFacture,
    handleTelechargerFacture,
    addFacture,
    updateFacture,
    deleteFacture
  };
};

// Re-export for backward compatibility
export { useFactureActions as default };
