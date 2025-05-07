
import { ClientFiscalData } from "../types";

// Local cache storage
const fiscalDataCache: Record<string, {
  data: ClientFiscalData;
  timestamp: number;
}> = {};

// Cache expiration time (10 minutes)
const CACHE_EXPIRATION_TIME = 10 * 60 * 1000;

/**
 * Store fiscal data in local cache
 */
export const storeFiscalDataInCache = (clientId: string, fiscalData: ClientFiscalData): void => {
  fiscalDataCache[clientId] = {
    data: fiscalData,
    timestamp: Date.now()
  };
};

/**
 * Get fiscal data from local cache if available and not expired
 */
export const getFiscalDataFromCache = (clientId: string): ClientFiscalData | null => {
  const cachedItem = fiscalDataCache[clientId];
  
  if (!cachedItem) {
    return null;
  }
  
  // Check if cache is expired
  if (Date.now() - cachedItem.timestamp > CACHE_EXPIRATION_TIME) {
    delete fiscalDataCache[clientId];
    return null;
  }
  
  return cachedItem.data;
};

/**
 * Clear the cache for a specific client or all clients
 */
export const clearFiscalDataCache = (clientId?: string): void => {
  if (clientId) {
    delete fiscalDataCache[clientId];
  } else {
    Object.keys(fiscalDataCache).forEach(key => {
      delete fiscalDataCache[key];
    });
  }
};

/**
 * Create an index file to export all services
 */
export const invalidateFiscalCache = (clientId?: string): void => {
  clearFiscalDataCache(clientId);
};
