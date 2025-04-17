
import { ClientFiscalData } from "../types";

// Cache for fiscal data with enhanced persistence
const fiscalDataCache = new Map<string, {data: ClientFiscalData, timestamp: number}>();

// Duration of cache validity (2 hours instead of 30 minutes)
export const CACHE_DURATION = 7200000; // 2 heures

/**
 * Get data from cache if valid
 */
export const getFromCache = (clientId: string): ClientFiscalData | null => {
  const now = Date.now();
  const cachedData = fiscalDataCache.get(clientId);
  
  if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
    console.log(`Using cache for client ${clientId}`);
    return cachedData.data;
  }
  
  return null;
};

/**
 * Update cache with new data
 */
export const updateCache = (clientId: string, data: ClientFiscalData): void => {
  console.log(`Updating cache for client ${clientId}`);
  fiscalDataCache.set(clientId, {
    data,
    timestamp: Date.now()
  });
  
  // Persist cache in sessionStorage for resilience
  if (typeof window !== 'undefined') {
    try {
      const cacheKey = `fiscal_cache_${clientId}`;
      window.sessionStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
      console.log(`Cache persisté dans sessionStorage pour ${clientId}`);
    } catch (e) {
      console.error("Erreur lors de la persistance du cache:", e);
    }
  }
};

/**
 * Try to recover cache from sessionStorage if available
 */
export const recoverCacheFromStorage = (clientId: string): ClientFiscalData | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const cacheKey = `fiscal_cache_${clientId}`;
    const storedCache = window.sessionStorage.getItem(cacheKey);
    
    if (storedCache) {
      const parsedCache = JSON.parse(storedCache);
      const now = Date.now();
      
      if (now - parsedCache.timestamp < CACHE_DURATION) {
        console.log(`Récupération du cache depuis sessionStorage pour ${clientId}`);
        // Restaurer dans le cache en mémoire également
        fiscalDataCache.set(clientId, {
          data: parsedCache.data,
          timestamp: parsedCache.timestamp
        });
        return parsedCache.data;
      }
    }
  } catch (e) {
    console.error("Erreur lors de la récupération du cache:", e);
  }
  
  return null;
};

/**
 * Clear cache for a specific client
 */
export const clearCache = (clientId: string): void => {
  console.log(`Clearing cache for client ${clientId}`);
  fiscalDataCache.delete(clientId);
  
  if (typeof window !== 'undefined') {
    try {
      const cacheKey = `fiscal_cache_${clientId}`;
      window.sessionStorage.removeItem(cacheKey);
    } catch (e) {
      console.error("Erreur lors de la suppression du cache:", e);
    }
  }
};

/**
 * Clear all caches
 */
export const clearAllCaches = (): void => {
  console.log('Clearing all fiscal data caches');
  fiscalDataCache.clear();
  
  if (typeof window !== 'undefined') {
    try {
      // Suppression des caches de session uniquement pour les données fiscales
      Object.keys(window.sessionStorage).forEach(key => {
        if (key.startsWith('fiscal_cache_')) {
          window.sessionStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.error("Erreur lors de la suppression des caches:", e);
    }
  }
};

/**
 * Get debug info about cache state
 */
export const getDebugInfo = () => {
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
    cacheDuration: CACHE_DURATION,
    cachedClients,
    cacheDetails
  };
};
