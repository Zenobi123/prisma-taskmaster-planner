
import { useMemo } from "react";
import { FiscalDocument } from "../types";

export function useDocumentFiltering(documents: FiscalDocument[]) {
  // Filter out documents that expired more than 30 days ago
  const filteredDocuments = useMemo(() => 
    documents.filter(doc => {
      if (!doc.validUntil) return true; // Keep documents with no expiration
      
      const now = new Date();
      const expiredDays = (now.getTime() - doc.validUntil.getTime()) / (1000 * 60 * 60 * 24);
      return expiredDays <= 30; // Keep if expired less than 30 days ago or not expired yet
    }), 
    [documents]
  );

  return { filteredDocuments };
}
