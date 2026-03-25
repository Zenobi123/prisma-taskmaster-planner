import { ClientFiscalData } from "../types";

// Cache pour les données fiscales avec durée de validité optimisée
const fiscalDataCache = new Map<string, {data: ClientFiscalData, timestamp: number}>();

// Réduction de la durée du cache à 30 minutes pour un meilleur équilibre entre performance et fraîcheur des données
export const CACHE_DURATION = 1800000; // 30 minutes

// Limite de taille du cache (nombre d'entrées max)
const MAX_CACHE_ENTRIES = 50;

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Valide la structure basique d'un objet cache parsé depuis localStorage.
 */
function isValidCacheEntry(parsed: unknown): parsed is { data: ClientFiscalData; timestamp: number } {
  if (typeof parsed !== 'object' || parsed === null) return false;
  const obj = parsed as Record<string, unknown>;
  if (typeof obj.timestamp !== 'number' || obj.timestamp <= 0) return false;
  if (typeof obj.data !== 'object' || obj.data === null) return false;
  const data = obj.data as Record<string, unknown>;
  if (typeof data.clientId !== 'string') return false;
  return true;
}

/**
 * Récupérer les données du cache si valides
 */
export const getFromCache = (clientId: string): ClientFiscalData | null => {
  if (!UUID_REGEX.test(clientId)) return null;

  const now = Date.now();
  const cachedData = fiscalDataCache.get(clientId);

  if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
    return cachedData.data;
  }

  // Si le cache en mémoire n'est pas disponible, essayer localStorage
  if (typeof window !== 'undefined') {
    try {
      const cacheKey = `fiscal_cache_${clientId}`;
      const storedCache = window.localStorage.getItem(cacheKey);

      if (storedCache) {
        const parsedCache = JSON.parse(storedCache);
        if (isValidCacheEntry(parsedCache) && now - parsedCache.timestamp < CACHE_DURATION) {
          // Aussi restaurer dans le cache en mémoire
          fiscalDataCache.set(clientId, {
            data: parsedCache.data,
            timestamp: parsedCache.timestamp
          });
          return parsedCache.data;
        } else {
          // Nettoyer le localStorage si le cache est périmé ou invalide
          window.localStorage.removeItem(cacheKey);
        }
      }
    } catch {
      // Ignorer les erreurs de parsing - données corrompues
    }
  }

  return null;
};

/**
 * Mettre à jour le cache avec de nouvelles données et limiter sa taille
 */
export const updateCache = (clientId: string, data: ClientFiscalData): void => {
  if (!UUID_REGEX.test(clientId)) return;

  // Si le cache atteint sa limite, supprimer l'entrée la plus ancienne
  if (fiscalDataCache.size >= MAX_CACHE_ENTRIES) {
    let oldestTimestamp = Date.now();
    let oldestKey = '';

    fiscalDataCache.forEach((entry, key) => {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
        oldestKey = key;
      }
    });

    if (oldestKey) {
      fiscalDataCache.delete(oldestKey);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(`fiscal_cache_${oldestKey}`);
      }
    }
  }

  // Mettre à jour le cache en mémoire
  fiscalDataCache.set(clientId, {
    data,
    timestamp: Date.now()
  });

  // Persister aussi dans localStorage
  if (typeof window !== 'undefined') {
    try {
      const cacheKey = `fiscal_cache_${clientId}`;
      window.localStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch {
      // Quota localStorage dépassé ou erreur d'écriture
    }
  }
};

/**
 * Vider le cache pour un client spécifique
 */
export const clearCache = (clientId: string): void => {
  fiscalDataCache.delete(clientId);

  if (typeof window !== 'undefined') {
    try {
      const cacheKey = `fiscal_cache_${clientId}`;
      window.localStorage.removeItem(cacheKey);
    } catch {
      // Ignorer
    }
  }
};

/**
 * Vider tous les caches avec nettoyage de localStorage
 */
export const clearAllCaches = (): void => {
  fiscalDataCache.clear();

  if (typeof window !== 'undefined') {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key && key.startsWith('fiscal_cache_')) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => {
        window.localStorage.removeItem(key);
      });
    } catch {
      // Ignorer
    }
  }
};

// Fonction unifiée pour invalider tous les caches liés aux obligations fiscales
export const invalidateAllFiscalCaches = (): void => {
  clearAllCaches();

  if (typeof window !== 'undefined') {
    (window as any).__patenteCacheTimestamp = 0;
    (window as any).__dsfCacheTimestamp = 0;
    (window as any).__darpCacheTimestamp = 0;

    if ((window as any).__igsCache) {
      (window as any).__igsCache.timestamp = 0;
      (window as any).__igsCache.data = null;
    }
  }
};

/**
 * Try to recover cache from storage if available
 */
export const recoverCacheFromStorage = (clientId: string): ClientFiscalData | null => {
  if (typeof window === 'undefined') return null;
  if (!UUID_REGEX.test(clientId)) return null;

  try {
    const cacheKey = `fiscal_cache_${clientId}`;
    const storedCache = window.localStorage.getItem(cacheKey);

    if (storedCache) {
      const parsedCache = JSON.parse(storedCache);
      const now = Date.now();

      if (isValidCacheEntry(parsedCache) && now - parsedCache.timestamp < CACHE_DURATION) {
        fiscalDataCache.set(clientId, {
          data: parsedCache.data,
          timestamp: parsedCache.timestamp
        });
        return parsedCache.data;
      }
    }
  } catch {
    // Ignorer les erreurs de parsing
  }

  return null;
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
