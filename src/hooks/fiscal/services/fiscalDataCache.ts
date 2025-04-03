
import { ClientFiscalData } from "../types";

// Cache for clients' fiscal data
export const fiscalDataCache = new Map<string, {data: ClientFiscalData, timestamp: number}>();

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
  fiscalDataCache.set(clientId, {
    data,
    timestamp: Date.now()
  });
};
