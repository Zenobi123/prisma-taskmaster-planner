
/// <reference types="vite/client" />

// Global window object extensions
interface Window {
  __invalidateFiscalCaches?: () => void;
  __patenteCacheTimestamp?: number;
  __igsCache?: {
    data: null | any;
    timestamp: number;
  };
}
