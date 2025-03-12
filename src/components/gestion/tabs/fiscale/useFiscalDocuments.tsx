
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { FiscalDocument } from "./types";

// Initial fiscal document - just the ACF document
const initialFiscalDocuments: FiscalDocument[] = [
  {
    id: "acf",
    name: "Attestation de Conformité Fiscale (ACF)",
    description: "Certificat de situation fiscale",
    createdAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000), // 80 days ago
    validUntil: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now (for testing notification)
  }
];

export function useFiscalDocuments() {
  const [fiscalDocuments, setFiscalDocuments] = useState<FiscalDocument[]>(initialFiscalDocuments);

  // Filter out documents that expired more than 30 days ago
  const filteredDocuments = fiscalDocuments.filter(doc => {
    if (!doc.validUntil) return true; // Keep documents with no expiration
    
    const now = new Date();
    const expiredDays = (now.getTime() - doc.validUntil.getTime()) / (1000 * 60 * 60 * 24);
    return expiredDays <= 30; // Keep if expired less than 30 days ago or not expired yet
  });

  useEffect(() => {
    // Check for documents with less than 5 days validity
    filteredDocuments.forEach(doc => {
      if (doc.validUntil) {
        const daysRemaining = Math.ceil((doc.validUntil.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        
        if (daysRemaining <= 5 && daysRemaining > 0) {
          toast({
            title: "Document proche de l'expiration",
            description: `${doc.name} expire dans ${daysRemaining} jour${daysRemaining > 1 ? 's' : ''}.`,
            variant: "destructive",
          });
        }
      }
    });
  }, [filteredDocuments]);

  // Add new document
  const handleAddDocument = (newDoc: Omit<FiscalDocument, "id">) => {
    const newDocument: FiscalDocument = {
      ...newDoc,
      id: Math.random().toString(36).substring(2, 9), // Generate simple ID
    };
    
    setFiscalDocuments(prev => [...prev, newDocument]);
  };

  return {
    fiscalDocuments: filteredDocuments,
    handleAddDocument
  };
}
