
import { ClientFiscalData } from "../types";

// Cache pour les données fiscales des clients
const fiscalDataCache = new Map<string, {data: ClientFiscalData, timestamp: number}>();

// Durée de validité du cache en ms (30 minutes au lieu de 5 minutes)
const CACHE_DURATION = 1800000; // Augmenté de 5min à 30min pour une persistance optimale

/**
 * Récupérer les données du cache si valides
 */
export const getFromCache = (clientId: string): ClientFiscalData | null => {
  const now = Date.now();
  const cachedData = fiscalDataCache.get(clientId);
  
  if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
    return cachedData.data;
  }
  
  return null;
};

/**
 * Mettre à jour le cache avec de nouvelles données
 */
export const updateCache = (clientId: string, data: ClientFiscalData): void => {
  fiscalDataCache.set(clientId, {
    data,
    timestamp: Date.now()
  });
};

/**
 * Vider le cache pour un client spécifique
 */
export const clearCache = (clientId: string): void => {
  fiscalDataCache.delete(clientId);
};

/**
 * Vider tous les caches
 */
export const clearAllCaches = (): void => {
  fiscalDataCache.clear();
};

/**
 * Forcer l'expiration du cache pour un client spécifique
 * Cela conserve les données mais les fait expirer immédiatement
 */
export const expireCache = (clientId: string): void => {
  const cachedEntry = fiscalDataCache.get(clientId);
  if (cachedEntry) {
    fiscalDataCache.set(clientId, {
      data: cachedEntry.data,
      timestamp: 0 // Mettre le timestamp à 0 pour forcer l'expiration
    });
  }
};

/**
 * Forcer l'expiration de tous les caches
 * Cela conserve les données mais les fait toutes expirer immédiatement
 */
export const expireAllCaches = (): void => {
  fiscalDataCache.forEach((value, key) => {
    fiscalDataCache.set(key, {
      data: value.data,
      timestamp: 0 // Mettre le timestamp à 0 pour forcer l'expiration
    });
  });
};

/**
 * Vérifier si les données sont actuellement en cache (pour le débogage)
 */
export const isCached = (clientId: string): boolean => {
  return fiscalDataCache.has(clientId);
};

/**
 * Obtenir des informations de débogage sur le cache
 */
export const getDebugInfo = (): { 
  cacheSize: number, 
  cachedClients: string[], 
  cacheDetails: {[key: string]: {timestamp: number, validFor: number}} 
} => {
  const now = Date.now();
  const cachedClients = Array.from(fiscalDataCache.keys());
  const cacheDetails: {[key: string]: {timestamp: number, validFor: number}} = {};
  
  cachedClients.forEach(clientId => {
    const entry = fiscalDataCache.get(clientId);
    if (entry) {
      cacheDetails[clientId] = {
        timestamp: entry.timestamp,
        validFor: Math.max(0, CACHE_DURATION - (now - entry.timestamp))
      };
    }
  });
  
  return {
    cacheSize: fiscalDataCache.size,
    cachedClients,
    cacheDetails
  };
};
