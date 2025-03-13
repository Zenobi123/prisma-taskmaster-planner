import { useMemo } from "react";
import { FiscalDocument } from "../types";

interface FilterOptions {
  showExpired: boolean;
  expiryThreshold: number; // in days
}

export function useDocumentFiltering(
  documents: FiscalDocument[], 
  options: FilterOptions = { showExpired: true, expiryThreshold: 30 }
) {
  // Filter documents based on options with proper memoization
  const filteredDocuments = useMemo(() => 
    documents.filter(doc => {
      if (!doc.validUntil) return true; // Keep documents with no expiration
      
      const now = new Date();
      const expiredDays = (now.getTime() - doc.validUntil.getTime()) / (1000 * 60 * 60 * 24);
      
      // If showExpired is false, only show non-expired documents
      if (!options.showExpired && expiredDays > 0) return false;
      
      // Otherwise, apply the threshold filter
      return options.showExpired ? expiredDays <= options.expiryThreshold : true;
    }), 
    [documents, options.showExpired, options.expiryThreshold]
  );

  // Calculate document statistics (useful for UI)
  const documentStats = useMemo(() => {
    const total = documents.length;
    const expired = documents.filter(doc => 
      doc.validUntil && new Date() > doc.validUntil
    ).length;
    const expiringSoon = documents.filter(doc => {
      if (!doc.validUntil) return false;
      const now = new Date();
      const daysRemaining = Math.ceil((doc.validUntil.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysRemaining > 0 && daysRemaining <= 30;
    }).length;
    const valid = total - expired - expiringSoon;

    return { total, valid, expired, expiringSoon };
  }, [documents]);

  return { 
    filteredDocuments,
    documentStats
  };
}
