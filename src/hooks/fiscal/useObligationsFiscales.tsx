
import { useState, useCallback } from "react";
import { Client } from "@/types/client";
import { useUpdateClientMutation } from "@/pages/clients/hooks/mutations/useUpdateClientMutation";
import { loadFiscalData } from "./utils/loadFiscalData";
import { prepareFiscalData, extractClientIGSData } from "./utils/saveFiscalData";
import { useToast } from "@/components/ui/use-toast";
import { useIGSData } from "./useIGSData";
import { useObligationStatus } from "./useObligationStatus";
import { useAttestationData } from "./useAttestationData";

export function useObligationsFiscales(selectedClient: Client) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [fiscalData, setFiscalData] = useState(null);
  const { mutateAsync } = useUpdateClientMutation();

  // Load client's fiscal data
  useState(() => {
    const fetchFiscalData = async () => {
      if (!selectedClient?.id) return;
      
      setIsLoading(true);
      
      try {
        const data = await loadFiscalData(selectedClient.id);
        console.log("Fiscal data loaded:", data);
        setFiscalData(data);
      } catch (error) {
        console.error("Error fetching fiscal data:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données fiscales",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFiscalData();
  }, [selectedClient, toast]);

  // Use our new custom hooks
  const { 
    creationDate, 
    setCreationDate,
    validityEndDate, 
    setValidityEndDate,
    showInAlert, 
    handleToggleAlert,
    hiddenFromDashboard, 
    handleToggleDashboardVisibility 
  } = useAttestationData(fiscalData, isLoading);
  
  const { 
    obligationStatuses, 
    handleStatusChange 
  } = useObligationStatus(fiscalData, isLoading);
  
  const { 
    igsData, 
    handleIGSChange 
  } = useIGSData(selectedClient, fiscalData, isLoading);
  
  // Save fiscal data changes
  const handleSave = useCallback(async () => {
    if (!selectedClient?.id) return;
    
    // S'assurer que etablissements est toujours un tableau avant l'enregistrement
    const safeIgsData = {
      ...igsData,
      etablissements: Array.isArray(igsData.etablissements) ? [...igsData.etablissements] : []
    };
    
    console.log("Saving safe IGS data with etablissements:", safeIgsData.etablissements);
    
    const fiscalData = prepareFiscalData(
      creationDate,
      validityEndDate,
      showInAlert,
      obligationStatuses,
      hiddenFromDashboard,
      safeIgsData
    );
    
    console.log("Saving fiscal data:", fiscalData);
    
    try {
      await mutateAsync({
        id: selectedClient.id,
        updates: {
          fiscal_data: fiscalData,
          // Update the igs object for backward compatibility
          igs: extractClientIGSData(safeIgsData)
        }
      });
      
      console.log("Fiscal data saved successfully");
      toast({
        title: "Succès",
        description: "Données fiscales enregistrées avec succès",
      });
    } catch (error) {
      console.error("Error saving fiscal data:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les données fiscales",
        variant: "destructive"
      });
    }
  }, [
    selectedClient?.id,
    creationDate,
    validityEndDate,
    showInAlert,
    obligationStatuses,
    hiddenFromDashboard,
    igsData,
    mutateAsync,
    toast
  ]);
  
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
    handleIGSChange
  };
}
