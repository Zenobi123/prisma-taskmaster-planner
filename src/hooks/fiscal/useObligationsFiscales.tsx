
import { useEffect, useState } from "react";
import { Client } from "@/types/client";
import { FiscalData } from "../fiscal/types";
import useFiscalData from "./hooks/useFiscalData";
import useFiscalSave from "./hooks/useFiscalSave";
import useUnsavedChanges from "./hooks/useUnsavedChanges";

export function useObligationsFiscales(selectedClient: Client) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Utiliser les hooks spécifiques
  const {
    fiscalData,
    selectedYear,
    setSelectedYear,
    fetchFiscalData,
    updateFiscalDataField
  } = useFiscalData(selectedClient.id);

  const {
    hasUnsavedChanges,
    setHasUnsavedChanges,
    handleBeforeUnload
  } = useUnsavedChanges();

  const {
    saveFiscalData,
    saveStatus
  } = useFiscalSave(selectedClient.id, setHasUnsavedChanges);

  // Charger les données fiscales au chargement et quand le client ou l'année change
  useEffect(() => {
    if (selectedClient?.id) {
      setLoading(true);
      setError(null);
      
      fetchFiscalData()
        .then(() => setLoading(false))
        .catch(err => {
          setError("Erreur lors du chargement des données fiscales");
          console.error(err);
          setLoading(false);
        });
    }
  }, [selectedClient.id, selectedYear, fetchFiscalData]);

  // Gestionnaire pour sauvegarder les données
  const handleSave = () => {
    if (fiscalData) {
      saveFiscalData(fiscalData);
    }
  };

  // Souscrire à l'événement beforeunload pour avertir si changements non sauvegardés
  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges, handleBeforeUnload]);

  return {
    fiscalData,
    loading,
    error,
    selectedYear,
    setSelectedYear,
    updateFiscalDataField,
    handleSave,
    hasUnsavedChanges,
    saveStatus
  };
}

export default useObligationsFiscales;
