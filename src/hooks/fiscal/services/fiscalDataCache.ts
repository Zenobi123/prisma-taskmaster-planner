
import { ClientFiscalData } from "../types";

// Cache pour les données fiscales des clients
const fiscalDataCache = new Map<string, {data: ClientFiscalData, timestamp: number}>();

// Durée de validité du cache en ms (5 minutes au lieu de 10 secondes)
const CACHE_DURATION = 300000; // Augmenté de 10s à 5min pour une meilleure persistance

/**
 * Récupérer les données du cache si valides
 */
export const getFromCache = (clientId: string): ClientFiscalData | null => {
  const now = Date.now();
  const cachedData = fiscalDataCache.get(clientId);
  
  if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
    console.log(`Utilisation du cache pour les données fiscales du client ${clientId}`);
    return cachedData.data;
  }
  
  console.log(`Cache invalide ou non trouvé pour le client ${clientId}`);
  return null;
};

/**
 * Mettre à jour le cache avec de nouvelles données
 */
export const updateCache = (clientId: string, data: ClientFiscalData): void => {
  console.log(`Mise à jour du cache pour le client ${clientId}`, data);
  fiscalDataCache.set(clientId, {
    data,
    timestamp: Date.now()
  });
};

/**
 * Vider le cache pour un client spécifique
 */
export const clearCache = (clientId: string): void => {
  console.log(`Suppression du cache pour le client ${clientId}`);
  fiscalDataCache.delete(clientId);
};

/**
 * Vider tous les caches
 */
export const clearAllCaches = (): void => {
  console.log('Suppression de tous les caches de données fiscales');
  fiscalDataCache.clear();
};

/**
 * Forcer l'expiration du cache pour un client spécifique
 * Cela conserve les données mais les fait expirer immédiatement
 */
export const expireCache = (clientId: string): void => {
  const cachedEntry = fiscalDataCache.get(clientId);
  if (cachedEntry) {
    console.log(`Expiration du cache pour le client ${clientId}`);
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
  console.log('Expiration de tous les caches de données fiscales');
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
