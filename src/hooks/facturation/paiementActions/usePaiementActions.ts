
import { useState } from "react";
import { Paiement } from "@/types/paiement";
import { usePaiementCreate } from "./usePaiementCreate";
import { usePaiementUpdate } from "./usePaiementUpdate";
import { usePaiementDelete } from "./usePaiementDelete";

export const usePaiementActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { addPaiement, generateReceiptFromPaiement } = usePaiementCreate();
  const { updatePaiement } = usePaiementUpdate();
  const { deletePaiement } = usePaiementDelete();

  // Combine loading states from all hooks
  const updateLoadingState = (loading: boolean) => {
    setIsLoading(loading);
  };

  // We keep the same API but delegate to specialized hooks
  return {
    addPaiement,
    updatePaiement,
    deletePaiement,
    generateReceiptFromPaiement,
    isLoading
  };
};

export default usePaiementActions;
