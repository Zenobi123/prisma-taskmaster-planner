
import { useState, useCallback, useEffect } from "react";
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
  useEffect(() => {
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
  }, [selectedClient?.id, toast]);

  // Use our custom hooks
  const { 
    creationDate, 
    setCreationDate,
    validityEndDate, 
    setValidityEndDate, // Important: nous exportons maintenant cette fonction
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
    
    console.log("Saving changes for client:", selectedClient.id);
    console.log("Current IGS data before preparing:", igsData);
    
    // S'assurer que etablissements est toujours un tableau avant l'enregistrement
    const safeIgsData = {
      ...igsData,
      etablissements: Array.isArray(igsData.etablissements) ? [...igsData.etablissements] : []
    };
    
    console.log("Saving safe IGS data with etablissements:", safeIgsData.etablissements);
    
    // Prepare data for saving
    const preparedFiscalData = prepareFiscalData(
      creationDate,
      validityEndDate,
      showInAlert,
      obligationStatuses,
      hiddenFromDashboard,
      safeIgsData
    );
    
    console.log("Prepared fiscal data for saving:", preparedFiscalData);
    
    // Extract IGS data for client object
    const extractedIGSData = extractClientIGSData(safeIgsData);
    console.log("Extracted IGS data for client:", extractedIGSData);
    
    try {
      // Make sure to update both fiscal_data and igs properties
      await mutateAsync({
        id: selectedClient.id,
        updates: {
          fiscal_data: preparedFiscalData,
          // Si le régime fiscal est IGS, on met à jour également l'objet igs
          ...(selectedClient.regimefiscal === "igs" ? { igs: extractedIGSData } : {}),
          // Make sure to preserve the regimefiscal value
          regimefiscal: selectedClient.regimefiscal
        }
      });
      
      console.log("Fiscal data and IGS data saved successfully");
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
    selectedClient?.regimefiscal,
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
    setValidityEndDate, // Important: nous exportons maintenant cette fonction
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
