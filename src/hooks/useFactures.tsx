
import { useFetchFactures } from "./facture/useFetchFactures";
import { useFactureUpdates } from "./facture/useFactureUpdates";
import { useFactureDelete } from "./facture/useFactureDelete";
import { useFactureCreate } from "./facture/useFactureCreate";

export const useFactures = () => {
  const { factures, setFactures, isLoading, fetchFactures } = useFetchFactures();
  const { handleUpdateStatus, handlePaiementPartiel } = useFactureUpdates(factures, setFactures);
  const { handleDeleteInvoice } = useFactureDelete(factures, setFactures);
  const { handleCreateInvoice } = useFactureCreate(factures, setFactures);

  return {
    factures,
    isLoading,
    handleUpdateStatus,
    handleDeleteInvoice,
    handleCreateInvoice,
    handlePaiementPartiel,
    fetchFactures
  };
};
