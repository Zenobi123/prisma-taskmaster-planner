
import { useState, useEffect } from "react";
import { Client } from "@/types/client";
import { ObligationStatuses, ClientFiscalData } from "./types";
import { calculateValidityEndDate, checkAttestationExpiration } from "./utils/dateUtils";
import { getFromCache, updateCache } from "./services/fiscalDataCache";
import { saveFiscalData, fetchFiscalData } from "./services/fiscalDataService";
import { toast } from "sonner";

export const useObligationsFiscales = (selectedClient: Client) => {
  const [creationDate, setCreationDate] = useState<string>("");
  const [validityEndDate, setValidityEndDate] = useState<string>("");
  const [obligationStatuses, setObligationStatuses] = useState<ObligationStatuses>({
    patente: { assujetti: false, paye: false },
    igs: { assujetti: false, paye: false },
    bail: { assujetti: false, paye: false },
    taxeFonciere: { assujetti: false, paye: false },
    dsf: { assujetti: false, depose: false },
    darp: { assujetti: false, depose: false }
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showInAlert, setShowInAlert] = useState<boolean>(true);
  const [hiddenFromDashboard, setHiddenFromDashboard] = useState<boolean>(false);

  // Fetch fiscal data when client changes
  useEffect(() => {
    if (selectedClient?.id) {
      loadFiscalData();
    }
  }, [selectedClient?.id]);

  // Update validity end date when creation date changes
  useEffect(() => {
    if (creationDate) {
      const calculatedEndDate = calculateValidityEndDate(creationDate);
      setValidityEndDate(calculatedEndDate);
    }
  }, [creationDate]);

  // Show toast notifications for expiring attestations
  useEffect(() => {
    if (creationDate && validityEndDate) {
      checkAttestationExpiration(creationDate, validityEndDate);
    }
  }, [creationDate, validityEndDate]);

  const loadFiscalData = async () => {
    setIsLoading(true);
    try {
      // Try to get data from cache first
      const cachedData = getFromCache(selectedClient.id);
      if (cachedData) {
        setFiscalDataToState(cachedData);
        setIsLoading(false);
        return;
      }

      // If not in cache, fetch from database
      const fiscalData = await fetchFiscalData(selectedClient.id);
      
      if (fiscalData) {
        setFiscalDataToState(fiscalData);
        
        // Update cache
        updateCache(selectedClient.id, fiscalData);
      } else {
        // Initialize default values if no data exists
        resetToDefaults();
      }
    } catch (error) {
      console.error("Error loading fiscal data:", error);
      toast.error("Erreur lors du chargement des données fiscales");
      resetToDefaults();
    } finally {
      setIsLoading(false);
    }
  };

  const setFiscalDataToState = (data: ClientFiscalData) => {
    if (data.attestation) {
      setCreationDate(data.attestation.creationDate || "");
      setValidityEndDate(data.attestation.validityEndDate || "");
      setShowInAlert(data.attestation.showInAlert !== false); // Default to true if undefined
    }
    
    if (data.obligations) {
      setObligationStatuses(data.obligations);
    }

    setHiddenFromDashboard(data.hiddenFromDashboard === true);
  };

  const resetToDefaults = () => {
    setCreationDate("");
    setValidityEndDate("");
    setObligationStatuses({
      patente: { assujetti: false, paye: false },
      igs: { assujetti: false, paye: false },
      bail: { assujetti: false, paye: false },
      taxeFonciere: { assujetti: false, paye: false },
      dsf: { assujetti: false, depose: false },
      darp: { assujetti: false, depose: false }
    });
    setShowInAlert(true);
    setHiddenFromDashboard(false);
  };

  const handleStatusChange = (
    type: keyof ObligationStatuses, 
    field: "assujetti" | "paye" | "depose", 
    value: boolean
  ) => {
    setObligationStatuses((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  const handleToggleAlert = () => {
    setShowInAlert(prev => !prev);
  };

  const handleToggleDashboardVisibility = () => {
    setHiddenFromDashboard(prev => !prev);
  };

  const handleSave = async () => {
    const fiscalData: ClientFiscalData = {
      attestation: {
        creationDate,
        validityEndDate,
        showInAlert
      },
      obligations: obligationStatuses,
      hiddenFromDashboard
    };

    try {
      await saveFiscalData(selectedClient.id, fiscalData);
      
      // Update cache
      updateCache(selectedClient.id, fiscalData);
      
      toast.success("Données fiscales enregistrées avec succès");
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
    handleToggleDashboardVisibility
  };
};
