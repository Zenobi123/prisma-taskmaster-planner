
import { useState, useEffect } from "react";
import { Client } from "@/types/client";
import { ClientFiscalData } from "../types";
import { getFromCache, updateCache } from "../services/fiscalDataCache";
import { fetchFiscalData } from "../services/fiscalDataService";
import { toast } from "sonner";
import { useIGSData } from "./useIGSData";
import { IGSData } from "../types/igsTypes";

export const useFiscalData = (selectedClient: Client) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hiddenFromDashboard, setHiddenFromDashboard] = useState<boolean>(false);
  const { igsData, handleIGSDataChange } = useIGSData();

  useEffect(() => {
    if (selectedClient?.id) {
      loadFiscalData();
    }
  }, [selectedClient?.id]);

  const setFiscalDataFromResponse = (data: ClientFiscalData) => {
    setHiddenFromDashboard(data.hiddenFromDashboard || false);
    if (data.igs) {
      handleIGSDataChange(data.igs);
    }
  };

  const loadFiscalData = async () => {
    if (!selectedClient?.id) return;
    
    setIsLoading(true);
    try {
      const cachedData = getFromCache(selectedClient.id);
      if (cachedData) {
        setFiscalDataFromResponse(cachedData);
        setIsLoading(false);
        return;
      }

      const fiscalData = await fetchFiscalData(selectedClient.id);
      if (fiscalData) {
        setFiscalDataFromResponse(fiscalData);
        updateCache(selectedClient.id, fiscalData);
      }
    } catch (error) {
      console.error("Error loading fiscal data:", error);
      toast.error("Erreur lors du chargement des données fiscales");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleDashboardVisibility = () => {
    setHiddenFromDashboard(prev => !prev);
  };

  return {
    isLoading,
    hiddenFromDashboard,
    handleToggleDashboardVisibility,
    igsData,
    handleIGSDataChange,
    loadFiscalData
  };
};
