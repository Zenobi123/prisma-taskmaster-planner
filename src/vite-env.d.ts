
/// <reference types="vite/client" />

// Global window object extensions
interface Window {
  __invalidateFiscalCaches?: () => void;
  __patenteCacheTimestamp?: number;
  __dsfCacheTimestamp?: number;
  __dsfCacheData?: any[] | null;
  __igsCache?: {
    data: null | any;
    timestamp: number;
  };
}
