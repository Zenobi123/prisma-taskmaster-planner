
/// <reference types="vite/client" />

// Global window object extensions
interface Window {
  __invalidateFiscalCaches?: () => void;
  __patenteCacheTimestamp?: number;
  __dsfCacheTimestamp?: number;
  __dsfCacheData?: any[] | null;
  __darpCacheTimestamp?: number; // Added missing property
  __igsCache?: {
    data: null | any;
    timestamp: number;
  };
}
