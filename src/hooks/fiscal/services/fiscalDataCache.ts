
import { ClientFiscalData } from "../types";

// Cache pour les données fiscales des clients
const fiscalDataCache = new Map<string, {data: ClientFiscalData, timestamp: number}>();

// Durée de validité du cache en ms (1 minute)
const CACHE_DURATION = 60000;

/**
 * Récupérer des données du cache si elles sont valides
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
 * Mettre à jour le cache avec de nouvelles données
 */
export const updateCache = (clientId: string, data: ClientFiscalData): void => {
  fiscalDataCache.set(clientId, {
    data,
    timestamp: Date.now()
  });
};

// Exporter le cache pour permettre aux tests et autres services d'y accéder si nécessaire
export { fiscalDataCache };
