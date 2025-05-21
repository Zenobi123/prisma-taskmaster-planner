
import { useState, useEffect } from "react";
import { useUnsavedChanges } from "./useUnsavedChanges";
import { ClientFiscalData } from "../types";
import { format } from "date-fns";

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
        // Assurons-nous que les dates sont au format YYYY-MM-DD pour la cohérence
        if (fiscalData.attestation.creationDate) {
          setCreationDate(normalizeDate(fiscalData.attestation.creationDate));
        } else {
          setCreationDate("");
        }
        
        if (fiscalData.attestation.validityEndDate) {
          setValidityEndDate(normalizeDate(fiscalData.attestation.validityEndDate));
        } else {
          setValidityEndDate("");
        }
        
        setShowInAlert(fiscalData.attestation.showInAlert !== false);
      }
      setHiddenFromDashboard(fiscalData.hiddenFromDashboard === true);
    }
  }, [fiscalData, setHasUnsavedChanges]);
  
  // Fonction pour normaliser le format de date (toujours en YYYY-MM-DD)
  const normalizeDate = (date: string): string => {
    if (!date) return "";
    
    try {
      // Si la date est déjà au format YYYY-MM-DD
      if (date.includes('-') && date.indexOf('-') === 4) {
        return date;
      }
      
      // Si la date est au format DD/MM/YYYY, la convertir en YYYY-MM-DD
      if (date.includes('/')) {
        const parts = date.split('/');
        if (parts.length === 3) {
          const day = parts[0].padStart(2, '0');
          const month = parts[1].padStart(2, '0');
          const year = parts[2];
          return `${year}-${month}-${day}`;
        }
      }
      
      // Si le format n'est pas reconnu, renvoyer tel quel
      return date;
    } catch (error) {
      console.error("Erreur lors de la normalisation de la date:", error);
      return date;
    }
  };
  
  // Handler for creation date update
  const handleCreationDateChange = (date: string) => {
    console.log("useFiscalAttestation - date de création reçue:", date);
    if (date) {
      setCreationDate(date);
      onMarkAsChanged();
    }
  };

  // Handler for validity end date update
  const handleValidityEndDateChange = (date: string) => {
    console.log("useFiscalAttestation - date de fin reçue:", date);
    if (date) {
      setValidityEndDate(date);
      onMarkAsChanged();
    }
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
    setValidityEndDate: handleValidityEndDateChange,
    handleToggleAlert,
    handleToggleDashboardVisibility
  };
};
