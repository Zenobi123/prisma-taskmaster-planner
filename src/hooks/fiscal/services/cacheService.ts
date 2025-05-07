
import { ClientFiscalData } from "../types";

// Cache pour les données fiscales avec durée de validité optimisée
const fiscalDataCache = new Map<string, {data: ClientFiscalData, timestamp: number}>();

// Réduction de la durée du cache à 30 minutes pour un meilleur équilibre entre performance et fraîcheur des données
export const CACHE_DURATION = 1800000; // 30 minutes

// Limite de taille du cache (nombre d'entrées max)
const MAX_CACHE_ENTRIES = 50;

/**
 * Récupérer les données du cache si valides
 */
export const getFromCache = (clientId: string): ClientFiscalData | null => {
  const now = Date.now();
  const cachedData = fiscalDataCache.get(clientId);
  
  if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
    console.log(`[CacheService] Using cache for client ${clientId}`);
    return cachedData.data;
  }
  
  // Si le cache en mémoire n'est pas disponible, essayer localStorage
  // mais seulement si on n'est pas en SSR
  if (typeof window !== 'undefined') {
    try {
      const cacheKey = `fiscal_cache_${clientId}`;
      const storedCache = window.localStorage.getItem(cacheKey);
      
      if (storedCache) {
        const parsedCache = JSON.parse(storedCache);
        if (now - parsedCache.timestamp < CACHE_DURATION) {
          console.log(`[CacheService] Recovering from localStorage for client ${clientId}`);
          // Aussi restaurer dans le cache en mémoire
          fiscalDataCache.set(clientId, {
            data: parsedCache.data,
            timestamp: parsedCache.timestamp
          });
          return parsedCache.data;
        } else {
          // Nettoyer le localStorage si le cache est périmé
          window.localStorage.removeItem(cacheKey);
        }
      }
    } catch (e) {
      console.error("[CacheService] Error accessing localStorage:", e);
    }
  }
  
  return null;
};

/**
 * Mettre à jour le cache avec de nouvelles données et limiter sa taille
 */
export const updateCache = (clientId: string, data: ClientFiscalData): void => {
  console.log(`[CacheService] Updating cache for client ${clientId}`);
  
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
      // Aussi nettoyer localStorage
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
      console.log(`[CacheService] Cache persisted in localStorage for ${clientId}`);
    } catch (e) {
      console.error("[CacheService] Error persisting cache:", e);
    }
  }
};

/**
 * Vider le cache pour un client spécifique
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
 * Vider tous les caches avec nettoyage de localStorage
 */
export const clearAllCaches = (): void => {
  console.log('[CacheService] Clearing all fiscal data caches');
  fiscalDataCache.clear();
  
  if (typeof window !== 'undefined') {
    try {
      // Supprimer seulement les caches de données fiscales de localStorage
      const keysToRemove: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key && key.startsWith('fiscal_cache_')) {
          keysToRemove.push(key);
        }
      }
      
      // Supprimer les clés en dehors de la boucle pour éviter les problèmes d'itération
      keysToRemove.forEach(key => {
        window.localStorage.removeItem(key);
      });
    } catch (e) {
      console.error("[CacheService] Error removing caches:", e);
    }
  }
};

// Fonction unifiée pour invalider tous les caches liés aux obligations fiscales
export const invalidateAllFiscalCaches = (): void => {
  console.log('[CacheService] Invalidating all fiscal caches');
  
  // Invalider le cache en mémoire
  clearAllCaches();
  
  // Invalider les caches spécifiques dans window
  if (typeof window !== 'undefined') {
    window.__patenteCacheTimestamp = 0;
    window.__dsfCacheTimestamp = 0;
    window.__darpCacheTimestamp = 0;
    
    if (window.__igsCache) {
      window.__igsCache.timestamp = 0;
      window.__igsCache.data = null;
    }
    
    // S'assurer que la fonction d'invalidation globale existe
    window.__invalidateFiscalCaches = function() {
      invalidateAllFiscalCaches();
    };
  }
};

// These are the aliases to maintain compatibility with existing import names
export const getFiscalDataFromCache = getFromCache;
export const storeFiscalDataInCache = updateCache;
export const recoverCacheFromStorage = getFromCache;

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
