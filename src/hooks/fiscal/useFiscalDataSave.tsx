
import { useCallback } from "react";
import { Client } from "@/types/client";
import { ObligationStatuses } from "./types";
import { toast } from "sonner";
import { prepareFiscalDataForSave } from "./services/fiscalDataPreparer";
import { saveFiscalDataToDatabase } from "./services/fiscalDataSaver";
import { invalidateClientsCache } from "@/services/clientService";

interface UseFiscalDataSaveProps {
  selectedClient: Client;
  fiscalYear: string;
  creationDate: string;
  validityEndDate: string;
  showInAlert: boolean;
  hiddenFromDashboard: boolean;
  obligationStatuses: ObligationStatuses;
  setIsSaving: (saving: boolean) => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
}

export const useFiscalDataSave = ({
  selectedClient,
  fiscalYear,
  creationDate,
  validityEndDate,
  showInAlert,
  hiddenFromDashboard,
  obligationStatuses,
  setIsSaving,
  setHasUnsavedChanges
}: UseFiscalDataSaveProps) => {
  
  const saveChanges = useCallback(async () => {
    if (!selectedClient?.id) {
      toast.error("Impossible de sauvegarder : client non sélectionné");
      return false;
    }

    try {
      setIsSaving(true);
      console.log(`=== DÉBUT SAUVEGARDE ===`);
      console.log("Client ID:", selectedClient.id);
      console.log("Année fiscale:", fiscalYear);

      // Préparer les données pour la sauvegarde
      const fiscalDataToSave = prepareFiscalDataForSave({
        selectedClient,
        fiscalYear,
        creationDate,
        validityEndDate,
        showInAlert,
        hiddenFromDashboard,
        obligationStatuses
      });

      // Sauvegarder dans la base de données
      const success = await saveFiscalDataToDatabase(selectedClient.id, fiscalDataToSave);

      if (success) {
        console.log("=== SAUVEGARDE RÉUSSIE ===");
        invalidateClientsCache();
        setHasUnsavedChanges(false);
        toast.success("Données fiscales sauvegardées avec succès");
        return true;
      } else {
        toast.error("Erreur lors de la sauvegarde");
        return false;
      }
    } catch (error) {
      console.error("Exception lors de la sauvegarde:", error);
      toast.error("Erreur inattendue lors de la sauvegarde");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [
    selectedClient,
    fiscalYear,
    creationDate,
    validityEndDate,
    showInAlert,
    hiddenFromDashboard,
    obligationStatuses,
    setIsSaving,
    setHasUnsavedChanges
  ]);

  return { saveChanges };
};
