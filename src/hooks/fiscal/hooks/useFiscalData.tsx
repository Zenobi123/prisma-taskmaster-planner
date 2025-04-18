
import { useState, useCallback, useEffect } from "react";
import { Client } from "@/types/client";
import { ClientFiscalData } from "../types";
import { getFromCache, updateCache, clearCache, getDebugInfo, recoverCacheFromStorage } from "../services/cacheService";
import { fetchFiscalData } from "../services/fetchService";
import { toast } from "sonner";

export const useFiscalData = (selectedClient: Client) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hiddenFromDashboard, setHiddenFromDashboard] = useState<boolean>(false);
  
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [loadRetries, setLoadRetries] = useState<number>(0);
  const [lastSuccessfulLoad, setLastSuccessfulLoad] = useState<number | null>(null);

  const loadFiscalData = useCallback(async (force = false) => {
    if (!selectedClient?.id) return;
    
    setIsLoading(true);
    try {
      console.log(`Loading fiscal data for client ${selectedClient.id}`);
      console.log("Current cache state:", getDebugInfo());
      
      if (force || loadRetries > 0) {
        console.log(`${force ? 'Forcing' : `Attempt ${loadRetries}`}: clearing cache for fresh data`);
        clearCache(selectedClient.id);
      }
      
      // First try in-memory cache
      let cachedData = null;
      if (!force) {
        cachedData = getFromCache(selectedClient.id);
        if (cachedData) {
          console.log(`Using in-memory cached fiscal data for client ${selectedClient.id}`);
          setFiscalDataFromResponse(cachedData);
          setIsLoading(false);
          setLastSuccessfulLoad(Date.now());
          setDataLoaded(true);
          return;
        }
      }
      
      // Then try localStorage cache
      if (!force && !cachedData) {
        const storedCache = recoverCacheFromStorage(selectedClient.id);
        if (storedCache) {
          console.log(`Using localStorage fiscal data for client ${selectedClient.id}`);
          setFiscalDataFromResponse(storedCache);
          setIsLoading(false);
          setLastSuccessfulLoad(Date.now());
          setDataLoaded(true);
          return;
        }
      }

      // Finally, fetch from database
      console.log(`Fetching fiscal data from database for client ${selectedClient.id}`);
      const fiscalData = await fetchFiscalData(selectedClient.id);
      
      if (fiscalData) {
        console.log(`Fiscal data received from database for client ${selectedClient.id}`);
        setFiscalDataFromResponse(fiscalData);
        updateCache(selectedClient.id, fiscalData);
        setLastSuccessfulLoad(Date.now());
        setDataLoaded(true);
      } else {
        console.log(`No fiscal data found for client ${selectedClient.id}`);
        setHiddenFromDashboard(false);
        setDataLoaded(true);
      }
    } catch (error) {
      console.error("Error loading fiscal data:", error);
      toast.error("Error loading fiscal data");
      setDataLoaded(false);
    } finally {
      setIsLoading(false);
    }
  }, [selectedClient?.id, loadRetries]);

  const setFiscalDataFromResponse = (data: ClientFiscalData) => {
    setHiddenFromDashboard(data.hiddenFromDashboard || false);
    setDataLoaded(true);
  };

  useEffect(() => {
    if (selectedClient?.id) {
      setIsLoading(true);
      setHiddenFromDashboard(false);
      setDataLoaded(false);
      setLoadRetries(0);
      setLastSuccessfulLoad(null);
      
      loadFiscalData();
    }
  }, [selectedClient?.id, loadFiscalData]);

  useEffect(() => {
    let retryTimeout: NodeJS.Timeout;
    
    if (selectedClient?.id && !dataLoaded && loadRetries < 3 && !isLoading) {
      console.log(`Planning attempt #${loadRetries + 1} to load fiscal data`);
      retryTimeout = setTimeout(() => {
        console.log(`Executing attempt #${loadRetries + 1} to load fiscal data`);
        setLoadRetries(prev => prev + 1);
        loadFiscalData(true);
      }, 2000 + loadRetries * 1000);
    }
    
    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [selectedClient?.id, dataLoaded, loadRetries, isLoading, loadFiscalData]);

  useEffect(() => {
    let refreshInterval: NodeJS.Timeout;

    if (selectedClient?.id && dataLoaded && lastSuccessfulLoad) {
      refreshInterval = setInterval(() => {
        const timeSinceLoad = Date.now() - lastSuccessfulLoad;
        if (timeSinceLoad > 300000) {
          console.log("Periodic refresh of fiscal data");
          loadFiscalData(true);
        }
      }, 120000);
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [selectedClient?.id, dataLoaded, lastSuccessfulLoad, loadFiscalData]);

  const handleToggleDashboardVisibility = () => {
    setHiddenFromDashboard(prev => !prev);
  };

  return {
    isLoading,
    dataLoaded,
    hiddenFromDashboard,
    handleToggleDashboardVisibility,
    loadFiscalData
  };
};
