
import { Client } from "@/types/client";

// Cache duration in milliseconds (30 seconds)
const CACHE_DURATION = 30000;

// Add cache for clients to prevent multiple identical requests in short time
let clientsCache: {
  data: Client[] | null;
  timestamp: number;
} = {
  data: null,
  timestamp: 0
};

export const getClientsFromCache = (): Client[] | null => {
  const now = Date.now();
  if (clientsCache.data && now - clientsCache.timestamp < CACHE_DURATION) {
    console.log("Utilisation du cache clients");
    return clientsCache.data;
  }
  return null;
};

export const setClientsCache = (clients: Client[]): void => {
  clientsCache = {
    data: clients,
    timestamp: Date.now()
  };
};

export const invalidateClientsCache = (): void => {
  clientsCache.data = null;
  clientsCache.timestamp = 0;
  console.log("Cache clients invalidé");
};
