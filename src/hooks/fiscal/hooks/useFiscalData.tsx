
import { useState, useEffect } from "react";
import { Client } from "@/types/client";
import { ClientFiscalData } from "../types";
import { getFromCache, updateCache } from "../services/fiscalDataCache";
import { fetchFiscalData } from "../services/fiscalDataService";
import { toast } from "sonner";
import { useIGSData } from "./useIGSData";

export const useFiscalData = (selectedClient: Client) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hiddenFromDashboard, setHiddenFromDashboard] = useState<boolean>(false);
  const { igsData, setIgsData, handleIGSDataChange } = useIGSData();
  
  // Add a state to track whether fiscal data has been loaded
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (selectedClient?.id) {
      // Reset state when client changes
      setIsLoading(true);
      setHiddenFromDashboard(false);
      setIgsData(undefined);
      setDataLoaded(false);
      
      // Load the fiscal data
      loadFiscalData();
    }
  }, [selectedClient?.id]);

  const setFiscalDataFromResponse = (data: ClientFiscalData) => {
    // Handle attestation data in parent hook
    
    // Set hidden from dashboard
    setHiddenFromDashboard(data.hiddenFromDashboard || false);
    
    // Set IGS data if available
    if (data.igs) {
      handleIGSDataChange(data.igs);
    }
    
    // Mark data as loaded
    setDataLoaded(true);
  };

  const loadFiscalData = async () => {
    if (!selectedClient?.id) return;
    
    setIsLoading(true);
    try {
      console.log(`Loading fiscal data for client ${selectedClient.id}`);
      
      // Try to get data from cache first
      const cachedData = getFromCache(selectedClient.id);
      if (cachedData) {
        console.log(`Using cached fiscal data for client ${selectedClient.id}`);
        setFiscalDataFromResponse(cachedData);
        setIsLoading(false);
        return;
      }

      // If not in cache, fetch from database
      console.log(`Fetching fiscal data from database for client ${selectedClient.id}`);
      const fiscalData = await fetchFiscalData(selectedClient.id);
      if (fiscalData) {
        console.log(`Received fiscal data from database for client ${selectedClient.id}`);
        setFiscalDataFromResponse(fiscalData);
        updateCache(selectedClient.id, fiscalData);
      } else {
        console.log(`No fiscal data found for client ${selectedClient.id}`);
        // Reset state for empty data
        setHiddenFromDashboard(false);
        setIgsData(undefined);
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
    dataLoaded,
    hiddenFromDashboard,
    handleToggleDashboardVisibility,
    igsData,
    handleIGSDataChange,
    loadFiscalData
  };
};
