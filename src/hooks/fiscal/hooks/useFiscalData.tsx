
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
      console.log(`Chargement des données fiscales pour le client ${selectedClient.id}`);
      console.log("État actuel du cache:", getDebugInfo());
      
      if (force || loadRetries > 0) {
        console.log(`${force ? 'Forçage' : `Tentative ${loadRetries}`}: effacement du cache pour des données fraîches`);
        clearCache(selectedClient.id);
      }
      
      // Essayer d'abord le cache en mémoire
      let cachedData = null;
      if (!force) {
        cachedData = getFromCache(selectedClient.id);
        if (cachedData) {
          console.log(`Utilisation des données fiscales en cache pour le client ${selectedClient.id}`);
          setFiscalDataFromResponse(cachedData);
          setIsLoading(false);
          setLastSuccessfulLoad(Date.now());
          setDataLoaded(true);
          return;
        }
      }
      
      // Ensuite essayer le cache persisté dans sessionStorage
      if (!force && !cachedData) {
        const storedCache = recoverCacheFromStorage(selectedClient.id);
        if (storedCache) {
          console.log(`Utilisation des données fiscales du sessionStorage pour le client ${selectedClient.id}`);
          setFiscalDataFromResponse(storedCache);
          setIsLoading(false);
          setLastSuccessfulLoad(Date.now());
          setDataLoaded(true);
          return;
        }
      }

      // Finalement, récupérer depuis la base de données
      console.log(`Récupération des données fiscales depuis la base pour le client ${selectedClient.id}`);
      const fiscalData = await fetchFiscalData(selectedClient.id);
      
      if (fiscalData) {
        console.log(`Données fiscales reçues de la base de données pour le client ${selectedClient.id}`);
        setFiscalDataFromResponse(fiscalData);
        updateCache(selectedClient.id, fiscalData);
        setLastSuccessfulLoad(Date.now());
        setDataLoaded(true);
      } else {
        console.log(`Aucune donnée fiscale trouvée pour le client ${selectedClient.id}`);
        setHiddenFromDashboard(false);
        setDataLoaded(true);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données fiscales:", error);
      toast.error("Erreur lors du chargement des données fiscales");
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
      console.log(`Planification de la tentative #${loadRetries + 1} pour charger les données fiscales`);
      retryTimeout = setTimeout(() => {
        console.log(`Exécution de la tentative #${loadRetries + 1} pour charger les données fiscales`);
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

    // Diminuer la fréquence des rafraîchissements automatiques
    if (selectedClient?.id && dataLoaded && lastSuccessfulLoad) {
      refreshInterval = setInterval(() => {
        const timeSinceLoad = Date.now() - lastSuccessfulLoad;
        if (timeSinceLoad > 300000) { // 5 minutes au lieu de 2 minutes
          console.log("Rafraîchissement périodique des données fiscales");
          loadFiscalData(true);
        }
      }, 120000); // Vérifier toutes les 2 minutes au lieu de 30 secondes
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
