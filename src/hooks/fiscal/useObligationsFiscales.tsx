
import { Client } from "@/types/client";
import { ClientFiscalData, IGSData } from "./types";
import { toast } from "sonner";
import { saveFiscalData } from "./services/fiscalDataService";
import { updateCache } from "./services/fiscalDataCache";
import { useFiscalAttestation } from "./hooks/useFiscalAttestation";
import { useObligationStatus } from "./hooks/useObligationStatus";
import { useFiscalData } from "./hooks/useFiscalData";
import { v4 as uuidv4 } from 'uuid';

export const useObligationsFiscales = (selectedClient: Client) => {
  const {
    creationDate,
    setCreationDate,
    validityEndDate,
    setValidityEndDate,
    showInAlert,
    handleToggleAlert
  } = useFiscalAttestation();

  const {
    obligationStatuses,
    setObligationStatuses,
    handleStatusChange
  } = useObligationStatus();

  const {
    isLoading,
    hiddenFromDashboard,
    handleToggleDashboardVisibility,
    igsData,
    handleIGSDataChange,
    loadFiscalData
  } = useFiscalData(selectedClient);

  const handleSave = async () => {
    if (!selectedClient?.id) {
      toast.error("Impossible d'enregistrer les données: client non sélectionné");
      return;
    }

    try {
      const fiscalData: ClientFiscalData = {
        attestation: {
          creationDate,
          validityEndDate,
          showInAlert
        },
        obligations: obligationStatuses,
        hiddenFromDashboard,
        igs: igsData
      };

      await saveFiscalData(selectedClient.id, fiscalData);
      updateCache(selectedClient.id, fiscalData);
      toast.success("Les informations fiscales ont été mises à jour.");
    } catch (error) {
      console.error("Error saving fiscal data:", error);
      toast.error("Erreur lors de l'enregistrement des données fiscales");
    }
  };

  return {
    creationDate,
    setCreationDate,
    validityEndDate,
    obligationStatuses,
    handleStatusChange,
    handleSave,
    isLoading,
    showInAlert,
    handleToggleAlert,
    hiddenFromDashboard,
    handleToggleDashboardVisibility,
    igsData,
    handleIGSDataChange
  };
};
