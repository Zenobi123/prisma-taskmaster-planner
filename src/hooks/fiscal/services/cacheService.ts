
import { ClientFiscalData } from "../types";

// Cache for fiscal data with extended validity period
const fiscalDataCache = new Map<string, {data: ClientFiscalData, timestamp: number}>();

// Augmented cache duration of 2 hours for better persistence
export const CACHE_DURATION = 7200000; // 2 hours

/**
 * Get data from cache if valid, with improved persistence
 */
export const getFromCache = (clientId: string): ClientFiscalData | null => {
  const now = Date.now();
  const cachedData = fiscalDataCache.get(clientId);
  
  if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
    console.log(`[CacheService] Using cache for client ${clientId}`);
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
          console.log(`[CacheService] Recovering from localStorage for client ${clientId}`);
          // Also restore to in-memory cache
          fiscalDataCache.set(clientId, {
            data: parsedCache.data,
            timestamp: parsedCache.timestamp
          });
          return parsedCache.data;
        }
      }
    } catch (e) {
      console.error("[CacheService] Error accessing localStorage:", e);
    }
  }
  
  return null;
};

/**
 * Update cache with new data and persist to localStorage
 */
export const updateCache = (clientId: string, data: ClientFiscalData): void => {
  console.log(`[CacheService] Updating cache for client ${clientId}`);
  fiscalDataCache.set(clientId, {
    data,
    timestamp: Date.now()
  });
  
  // Also persist cache in localStorage for better persistence across page navigations
  if (typeof window !== 'undefined') {
    try {
      const cacheKey = `fiscal_cache_${clientId}`;
      window.localStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
      console.log(`[CacheService] Cache persisted in localStorage for ${clientId}`);
    } catch (e) {
      console.error("[CacheService] Error persisting cache:", e);
    }
  }
};

/**
 * Try to recover cache from storage if available
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
        console.log(`[CacheService] Recovering cache from localStorage for ${clientId}`);
        // Also restore to in-memory cache
        fiscalDataCache.set(clientId, {
          data: parsedCache.data,
          timestamp: parsedCache.timestamp
        });
        return parsedCache.data;
      }
    }
  } catch (e) {
    console.error("[CacheService] Error recovering cache:", e);
  }
  
  return null;
};

/**
 * Clear cache for a specific client
 */
export const clearCache = (clientId: string): void => {
  console.log(`[CacheService] Clearing cache for client ${clientId}`);
  fiscalDataCache.delete(clientId);
  
  if (typeof window !== 'undefined') {
    try {
      const cacheKey = `fiscal_cache_${clientId}`;
      window.localStorage.removeItem(cacheKey);
    } catch (e) {
      console.error("[CacheService] Error removing cache:", e);
    }
  }
};

/**
 * Clear all caches
 */
export const clearAllCaches = (): void => {
  console.log('[CacheService] Clearing all fiscal data caches');
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
      console.error("[CacheService] Error removing caches:", e);
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
