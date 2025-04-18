
import { ClientFiscalData } from "../types";

// Cache for fiscal data with enhanced persistence
const fiscalDataCache = new Map<string, {data: ClientFiscalData, timestamp: number}>();

// Duration of cache validity (2 hours)
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
  
  // If in-memory cache is not available, try localStorage
  if (typeof window !== 'undefined') {
    try {
      const cacheKey = `fiscal_cache_${clientId}`;
      const storedCache = window.localStorage.getItem(cacheKey);
      
      if (storedCache) {
        const parsedCache = JSON.parse(storedCache);
        if (now - parsedCache.timestamp < CACHE_DURATION) {
          console.log(`Recovering from localStorage for client ${clientId}`);
          // Also restore to in-memory cache
          fiscalDataCache.set(clientId, {
            data: parsedCache.data,
            timestamp: parsedCache.timestamp
          });
          return parsedCache.data;
        }
      }
    } catch (e) {
      console.error("Error accessing localStorage:", e);
    }
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
  
  // Persist cache in localStorage for better persistence across page navigations
  if (typeof window !== 'undefined') {
    try {
      const cacheKey = `fiscal_cache_${clientId}`;
      window.localStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
      console.log(`Cache persisted in localStorage for ${clientId}`);
    } catch (e) {
      console.error("Error persisting cache:", e);
    }
  }
};

/**
 * Try to recover cache from localStorage if available
 */
export const recoverCacheFromStorage = (clientId: string): ClientFiscalData | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const cacheKey = `fiscal_cache_${clientId}`;
    const storedCache = window.localStorage.getItem(cacheKey);
    
    if (storedCache) {
      const parsedCache = JSON.parse(storedCache);
      const now = Date.now();
      
      if (now - parsedCache.timestamp < CACHE_DURATION) {
        console.log(`Recovering cache from localStorage for ${clientId}`);
        // Also restore to in-memory cache
        fiscalDataCache.set(clientId, {
          data: parsedCache.data,
          timestamp: parsedCache.timestamp
        });
        return parsedCache.data;
      }
    }
  } catch (e) {
    console.error("Error recovering cache:", e);
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
      window.localStorage.removeItem(cacheKey);
    } catch (e) {
      console.error("Error removing cache:", e);
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
      // Delete only fiscal data caches from localStorage
      Object.keys(window.localStorage).forEach(key => {
        if (key.startsWith('fiscal_cache_')) {
          window.localStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.error("Error removing caches:", e);
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
