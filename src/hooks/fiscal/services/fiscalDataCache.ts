
import { ClientFiscalData } from "../types";

// Cache for clients' fiscal data
const fiscalDataCache = new Map<string, {data: ClientFiscalData, timestamp: number}>();

// Cache validity duration in ms (1 minute)
const CACHE_DURATION = 60000;

/**
 * Get data from cache if valid
 */
export const getFromCache = (clientId: string): ClientFiscalData | null => {
  const now = Date.now();
  const cachedData = fiscalDataCache.get(clientId);
  
  if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
    console.log(`Using cache for client ${clientId} fiscal data`);
    return cachedData.data;
  }
  
  return null;
};

/**
 * Update cache with new data
 */
export const updateCache = (clientId: string, data: ClientFiscalData): void => {
  console.log(`Updating cache for client ${clientId}`, data);
  fiscalDataCache.set(clientId, {
    data,
    timestamp: Date.now()
  });
};

/**
 * Clear cache for specific client
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
 * Force expire cache for a specific client
 * This keeps the data but makes it expire immediately
 */
export const expireCache = (clientId: string): void => {
  const cachedEntry = fiscalDataCache.get(clientId);
  if (cachedEntry) {
    console.log(`Expiring cache for client ${clientId}`);
    fiscalDataCache.set(clientId, {
      data: cachedEntry.data,
      timestamp: 0 // Set timestamp to 0 to force expiration
    });
  }
};

/**
 * Force expire all caches
 * This keeps the data but makes it all expire immediately
 */
export const expireAllCaches = (): void => {
  console.log('Expiring all fiscal data caches');
  fiscalDataCache.forEach((value, key) => {
    fiscalDataCache.set(key, {
      data: value.data,
      timestamp: 0 // Set timestamp to 0 to force expiration
    });
  });
};
