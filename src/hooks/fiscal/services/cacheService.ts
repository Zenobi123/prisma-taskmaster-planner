
import { ClientFiscalData } from "../types";

// Cache for fiscal data
const fiscalDataCache = new Map<string, {data: ClientFiscalData, timestamp: number}>();

// Duration of cache validity (30 minutes)
export const CACHE_DURATION = 1800000;

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
};

/**
 * Clear cache for a specific client
 */
export const clearCache = (clientId: string): void => {
  console.log(`Clearing cache for client ${clientId}`);
  fiscalDataCache.delete(clientId);
};

/**
 * Clear all caches
 */
export const clearAllCaches = (): void => {
  console.log('Clearing all fiscal data caches');
  fiscalDataCache.clear();
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
    cachedClients,
    cacheDetails
  };
};
