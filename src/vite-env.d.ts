
/// <reference types="vite/client" />

// Global window object extensions
interface Window {
  __invalidateFiscalCaches?: () => void;
  __patenteCacheTimestamp?: number;
  __dsfCacheTimestamp?: number;
  __dsfCacheData?: unknown[] | null;
  __darpCacheTimestamp?: number; // Property for DARP cache timestamp
  __igsCache?: {
    data: null | any;
    timestamp: number;
  };
  
  // Ajout d'une fonction unifiée d'invalidation des caches
  __invalidateAllCaches?: () => void;
}
