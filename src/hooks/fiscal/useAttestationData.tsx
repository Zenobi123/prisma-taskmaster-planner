
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";

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
        setValidityEndDate(fiscalData.attestation.validityEndDate || "");
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
    setCreationDate,
    validityEndDate,
    setValidityEndDate,
    showInAlert,
    handleToggleAlert,
    hiddenFromDashboard,
    handleToggleDashboardVisibility
  };
}
