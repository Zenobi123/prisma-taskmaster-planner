
import { useState, useEffect } from "react";
import { useUnsavedChanges } from "./useUnsavedChanges";
import { ClientFiscalData } from "../types";

export const useFiscalAttestation = (
  fiscalData: ClientFiscalData | null,
  onMarkAsChanged: () => void
) => {
  const { setHasUnsavedChanges } = useUnsavedChanges();
  
  // State for attestation fields
  const [creationDate, setCreationDate] = useState<string>("");
  const [validityEndDate, setValidityEndDate] = useState<string>("");
  const [showInAlert, setShowInAlert] = useState<boolean>(true);
  const [hiddenFromDashboard, setHiddenFromDashboard] = useState<boolean>(false);
  
  // Initialize from fiscal data when it changes
  useEffect(() => {
    if (fiscalData) {
      if (fiscalData.attestation) {
        setCreationDate(fiscalData.attestation.creationDate || "");
        setValidityEndDate(fiscalData.attestation.validityEndDate || "");
        setShowInAlert(fiscalData.attestation.showInAlert !== false);
      }
      setHiddenFromDashboard(fiscalData.hiddenFromDashboard === true);
    }
  }, [fiscalData, setHasUnsavedChanges]);
  
  // Handler for creation date update
  const handleCreationDateChange = (date: string) => {
    setCreationDate(date);
    onMarkAsChanged();
  };
  
  // Handler for alert toggle
  const handleToggleAlert = () => {
    setShowInAlert(prev => !prev);
    onMarkAsChanged();
  };
  
  // Handler for dashboard visibility toggle
  const handleToggleDashboardVisibility = (value: boolean) => {
    setHiddenFromDashboard(value);
    onMarkAsChanged();
  };
  
  return {
    creationDate,
    validityEndDate,
    showInAlert,
    hiddenFromDashboard,
    setCreationDate: handleCreationDateChange,
    handleToggleAlert,
    handleToggleDashboardVisibility
  };
};
