
import { useState, useEffect } from "react";
import { Client } from "@/types/client";
import { ObligationStatuses } from "./types";
import { useDefaultObligationRules } from "./useDefaultObligationRules";
import { useFiscalDataLoader } from "./useFiscalDataLoader";

interface UseObligationsFiscalesStateProps {
  selectedClient: Client;
}

export const useObligationsFiscalesState = ({ selectedClient }: UseObligationsFiscalesStateProps) => {
  const [fiscalYear, setFiscalYear] = useState<string>("2025");
  const [creationDate, setCreationDate] = useState<string>("2025-07-01");
  const [validityEndDate, setValidityEndDate] = useState<string>("");
  const [showInAlert, setShowInAlert] = useState<boolean>(true);
  const [hiddenFromDashboard, setHiddenFromDashboard] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  const { 
    obligationStatuses, 
    setObligationStatuses, 
    getDefaultObligationStatuses 
  } = useDefaultObligationRules(selectedClient);

  // Load fiscal data
  useFiscalDataLoader({
    selectedClient,
    fiscalYear,
    setCreationDate,
    setValidityEndDate,
    setShowInAlert,
    setHiddenFromDashboard,
    setFiscalYear,
    setObligationStatuses,
    getDefaultObligationStatuses
  });

  // Reset unsaved changes when client changes
  useEffect(() => {
    setHasUnsavedChanges(false);
  }, [selectedClient?.id]);

  // Mark as having unsaved changes when values change
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [showInAlert, hiddenFromDashboard, obligationStatuses]);

  return {
    fiscalYear,
    setFiscalYear,
    creationDate,
    setCreationDate,
    validityEndDate,
    setValidityEndDate,
    showInAlert,
    setShowInAlert,
    hiddenFromDashboard,
    setHiddenFromDashboard,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    isSaving,
    setIsSaving,
    obligationStatuses,
    setObligationStatuses
  };
};
