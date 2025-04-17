
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { calculateValidityEndDate } from "./utils/dateUtils";

export function useAttestationData(fiscalData: any, isLoading: boolean) {
  const { toast } = useToast();
  
  // States for fiscal attestation
  const [creationDate, setCreationDate] = useState("");
  const [validityEndDate, setValidityEndDate] = useState("");
  const [showInAlert, setShowInAlert] = useState(false);
  const [hiddenFromDashboard, setHiddenFromDashboard] = useState(false);

  // Initialize attestation data when fiscal data changes
  useEffect(() => {
    if (isLoading || !fiscalData) return;
    
    try {
      // Initialize attestation data
      if (fiscalData?.attestation) {
        setCreationDate(fiscalData.attestation.creationDate || "");
        
        // Si une date de validité existe déjà, l'utiliser
        if (fiscalData.attestation.validityEndDate) {
          setValidityEndDate(fiscalData.attestation.validityEndDate);
        } 
        // Sinon, calculer la date de validité à partir de la date de création
        else if (fiscalData.attestation.creationDate) {
          const endDate = calculateValidityEndDate(fiscalData.attestation.creationDate);
          setValidityEndDate(endDate);
        }
        
        setShowInAlert(!!fiscalData.attestation.showInAlert);
      }
      
      // Initialize dashboard visibility
      setHiddenFromDashboard(!!fiscalData?.hiddenFromDashboard);
    } catch (error) {
      console.error("Error initializing attestation data:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données d'attestation",
        variant: "destructive"
      });
    }
  }, [fiscalData, isLoading, toast]);
  
  // Mettre à jour la date de fin de validité quand la date de création change
  useEffect(() => {
    if (creationDate) {
      const newEndDate = calculateValidityEndDate(creationDate);
      if (newEndDate) {
        setValidityEndDate(newEndDate);
      }
    }
  }, [creationDate]);
  
  // Gérer le changement de la date de création
  const handleCreationDateChange = useCallback((date: string) => {
    setCreationDate(date);
  }, []);
  
  // Handle alert visibility toggle
  const handleToggleAlert = useCallback((checked: boolean) => {
    setShowInAlert(checked);
  }, []);
  
  // Handle dashboard visibility toggle
  const handleToggleDashboardVisibility = useCallback((checked: boolean) => {
    setHiddenFromDashboard(checked);
  }, []);

  return {
    creationDate,
    setCreationDate: handleCreationDateChange,
    validityEndDate,
    setValidityEndDate,
    showInAlert,
    handleToggleAlert,
    hiddenFromDashboard,
    handleToggleDashboardVisibility
  };
}
