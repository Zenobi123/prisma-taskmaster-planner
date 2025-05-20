
import { useState, useEffect, useCallback } from "react";
import { ClientFiscalData } from "../types";

export const useFiscalAttestation = (
  fiscalData: ClientFiscalData | null, 
  markAsChanged: () => void
) => {
  const [creationDate, setCreationDate] = useState<string | null>(null);
  const [validityEndDate, setValidityEndDate] = useState<string | null>(null);
  const [showInAlert, setShowInAlert] = useState<boolean>(true);
  const [hiddenFromDashboard, setHiddenFromDashboard] = useState<boolean>(false);

  // Initialize state from fiscal data
  useEffect(() => {
    if (!fiscalData) return;

    if (fiscalData.attestation) {
      setCreationDate(fiscalData.attestation.creationDate);
      setValidityEndDate(fiscalData.attestation.validityEndDate);
      setShowInAlert(fiscalData.attestation.showInAlert ?? true);
    } else if (fiscalData.attestationCreatedAt || fiscalData.attestationValidUntil || fiscalData.showInAlert !== undefined) {
      // Legacy support for old format
      setCreationDate(fiscalData.attestationCreatedAt || null);
      setValidityEndDate(fiscalData.attestationValidUntil || null);
      setShowInAlert(fiscalData.showInAlert ?? true);
    }

    if (typeof fiscalData.hiddenFromDashboard !== 'undefined') {
      setHiddenFromDashboard(!!fiscalData.hiddenFromDashboard);
    } else {
      setHiddenFromDashboard(false);
    }
  }, [fiscalData]);

  // Toggle alert visibility
  const handleToggleAlert = useCallback(() => {
    setShowInAlert(prev => {
      const newValue = !prev;
      markAsChanged();
      return newValue;
    });
  }, [markAsChanged]);

  // Toggle dashboard visibility
  const handleToggleDashboardVisibility = useCallback((value: boolean, triggerChange: boolean = true) => {
    setHiddenFromDashboard(value);
    if (triggerChange) {
      markAsChanged();
    }
  }, [markAsChanged]);

  return {
    creationDate,
    validityEndDate,
    showInAlert,
    hiddenFromDashboard,
    setCreationDate: (date: string | null) => {
      setCreationDate(date);
      markAsChanged();
    },
    setValidityEndDate: (date: string | null) => {
      setValidityEndDate(date);
      markAsChanged();
    },
    handleToggleAlert,
    handleToggleDashboardVisibility
  };
};
