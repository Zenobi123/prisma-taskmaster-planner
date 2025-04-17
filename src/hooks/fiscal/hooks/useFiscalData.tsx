
import { useState, useEffect } from "react";
import { Client } from "@/types/client";
import { ClientFiscalData } from "../types";
import { getFromCache, updateCache } from "../services/fiscalDataCache";
import { fetchFiscalData, saveFiscalData } from "../services/fiscalDataService";
import { toast } from "sonner";

export const useFiscalData = (selectedClient: Client) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hiddenFromDashboard, setHiddenFromDashboard] = useState<boolean>(false);
  const [igsData, setIgsData] = useState<IGSData>({
    establishments: [
      {
        id: uuidv4(),
        name: "Établissement principal",
        activity: "",
        city: "",
        department: "",
        district: "",
        revenue: 0
      }
    ],
    previousYearRevenue: 0,
    igsClass: 1,
    igsAmount: 20000,
    cgaReduction: false
  });

  useEffect(() => {
    if (selectedClient?.id) {
      loadFiscalData();
    }
  }, [selectedClient?.id]);

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

  const handleIGSDataChange = (data: IGSData) => {
    setIgsData(data);
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
