
import { useState, useEffect } from "react";
import { Client } from "@/types/client";
import { ClientFiscalData } from "../types";
import { getFromCache, updateCache, isCached, getDebugInfo, clearCache } from "../services/fiscalDataCache";
import { fetchFiscalData } from "../services/fiscalDataService";
import { toast } from "sonner";
import { useIGSData } from "./useIGSData";

export const useFiscalData = (selectedClient: Client) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hiddenFromDashboard, setHiddenFromDashboard] = useState<boolean>(false);
  const { igsData, setIgsData, handleIGSDataChange } = useIGSData();
  
  // Add a state to track whether fiscal data has been loaded
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  // Add a state for retry counter
  const [loadRetries, setLoadRetries] = useState<number>(0);

  useEffect(() => {
    if (selectedClient?.id) {
      // Reset state when client changes
      setIsLoading(true);
      setHiddenFromDashboard(false);
      setIgsData(undefined);
      setDataLoaded(false);
      setLoadRetries(0);
      
      // Load the fiscal data
      loadFiscalData();
    }
  }, [selectedClient?.id]);

  // Add an effect to retry loading if data failed to load
  useEffect(() => {
    let retryTimeout: NodeJS.Timeout;
    
    if (selectedClient?.id && !dataLoaded && loadRetries < 3 && !isLoading) {
      console.log(`Scheduling retry #${loadRetries + 1} to load fiscal data`);
      retryTimeout = setTimeout(() => {
        console.log(`Executing retry #${loadRetries + 1} to load fiscal data`);
        setLoadRetries(prev => prev + 1);
        loadFiscalData();
      }, 3000);
    }
    
    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [selectedClient?.id, dataLoaded, loadRetries, isLoading]);

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
      console.log("Current cache state:", getDebugInfo());
      
      // Clear cache for this client to ensure fresh data
      if (loadRetries > 0) {
        console.log(`Retry attempt ${loadRetries}: clearing cache for fresh data`);
        clearCache(selectedClient.id);
      }
      
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
        setDataLoaded(true);
      }
    } catch (error) {
      console.error("Error loading fiscal data:", error);
      toast.error("Erreur lors du chargement des données fiscales");
      setDataLoaded(false);
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
