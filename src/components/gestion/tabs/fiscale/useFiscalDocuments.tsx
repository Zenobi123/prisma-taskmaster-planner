
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { FiscalDocument } from "./types";

// Initial fiscal document - just the ACF document with real data
const initialFiscalDocuments: FiscalDocument[] = [
  {
    id: "acf",
    name: "Attestation de Conformité Fiscale (ACF)",
    description: "Certificat de situation fiscale",
    createdAt: new Date("2023-12-22"), // Real date from image: 22/12/2024
    validUntil: new Date("2024-03-16"), // Real date from image: expires on 16/03/2025
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

  // Add new document - for future use, but currently restricted to only allow ACF
  const handleAddDocument = (newDoc: Omit<FiscalDocument, "id">) => {
    // Only allow ACF document to be added per requirements
    if (newDoc.name.includes("Attestation de Conformité Fiscale")) {
      const newDocument: FiscalDocument = {
        ...newDoc,
        id: Math.random().toString(36).substring(2, 9), // Generate simple ID
      };
      
      setFiscalDocuments(prev => [...prev, newDocument]);
    } else {
      toast({
        title: "Document non autorisé",
        description: "Seule l'Attestation de Conformité Fiscale est autorisée pour le moment.",
        variant: "destructive",
      });
    }
  };

  return {
    fiscalDocuments: filteredDocuments,
    handleAddDocument
  };
}
