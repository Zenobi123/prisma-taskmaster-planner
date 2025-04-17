
import { useState, useEffect, useCallback } from "react";
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
  
  // Ajouter un état pour suivre si les données fiscales ont été chargées
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  // Ajouter un état pour le compteur de tentatives
  const [loadRetries, setLoadRetries] = useState<number>(0);

  // Utiliser useCallback pour pouvoir réutiliser loadFiscalData dans des effets
  const loadFiscalData = useCallback(async () => {
    if (!selectedClient?.id) return;
    
    setIsLoading(true);
    try {
      console.log(`Chargement des données fiscales pour le client ${selectedClient.id}`);
      console.log("État actuel du cache:", getDebugInfo());
      
      // Effacer le cache pour ce client pour assurer des données fraîches
      if (loadRetries > 0) {
        console.log(`Tentative ${loadRetries}: effacement du cache pour des données fraîches`);
        clearCache(selectedClient.id);
      }
      
      // Tenter d'obtenir les données du cache d'abord
      const cachedData = getFromCache(selectedClient.id);
      if (cachedData) {
        console.log(`Utilisation des données fiscales en cache pour le client ${selectedClient.id}`);
        setFiscalDataFromResponse(cachedData);
        setIsLoading(false);
        return;
      }

      // Si pas dans le cache, récupérer depuis la base de données
      console.log(`Récupération des données fiscales depuis la base de données pour le client ${selectedClient.id}`);
      const fiscalData = await fetchFiscalData(selectedClient.id);
      
      if (fiscalData) {
        console.log(`Données fiscales reçues de la base de données pour le client ${selectedClient.id}`);
        setFiscalDataFromResponse(fiscalData);
        updateCache(selectedClient.id, fiscalData);
      } else {
        console.log(`Aucune donnée fiscale trouvée pour le client ${selectedClient.id}`);
        // Réinitialiser l'état pour des données vides
        setHiddenFromDashboard(false);
        setIgsData(undefined);
        setDataLoaded(true);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données fiscales:", error);
      toast.error("Erreur lors du chargement des données fiscales");
      setDataLoaded(false);
    } finally {
      setIsLoading(false);
    }
  }, [selectedClient?.id, loadRetries, setIgsData]);

  const setFiscalDataFromResponse = (data: ClientFiscalData) => {
    // Gérer les données d'attestation dans le hook parent
    
    // Définir hidden from dashboard
    setHiddenFromDashboard(data.hiddenFromDashboard || false);
    
    // Définir les données IGS si disponibles
    if (data.igs) {
      handleIGSDataChange(data.igs);
    }
    
    // Marquer les données comme chargées
    setDataLoaded(true);
  };

  useEffect(() => {
    if (selectedClient?.id) {
      // Réinitialiser l'état lorsque le client change
      setIsLoading(true);
      setHiddenFromDashboard(false);
      setIgsData(undefined);
      setDataLoaded(false);
      setLoadRetries(0);
      
      // Charger les données fiscales
      loadFiscalData();
    }
  }, [selectedClient?.id, loadFiscalData, setIgsData]);

  // Ajouter un effet pour réessayer le chargement si les données n'ont pas pu être chargées
  useEffect(() => {
    let retryTimeout: NodeJS.Timeout;
    
    if (selectedClient?.id && !dataLoaded && loadRetries < 3 && !isLoading) {
      console.log(`Planification de la tentative #${loadRetries + 1} pour charger les données fiscales`);
      retryTimeout = setTimeout(() => {
        console.log(`Exécution de la tentative #${loadRetries + 1} pour charger les données fiscales`);
        setLoadRetries(prev => prev + 1);
        loadFiscalData();
      }, 3000);
    }
    
    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [selectedClient?.id, dataLoaded, loadRetries, isLoading, loadFiscalData]);

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
