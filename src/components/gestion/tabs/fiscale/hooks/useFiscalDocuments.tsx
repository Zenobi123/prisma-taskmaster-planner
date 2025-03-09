
import { useState, useEffect } from "react";
import { FiscalDocument } from "../types";
import { initialFiscalDocuments } from "../data/mockData";
import { Bell } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import React from "react";
import { getClientFiscalDocuments, saveFiscalDocument } from "@/services/fiscalDocumentService";
import { Client } from "@/types/client";

export const useFiscalDocuments = (selectedClient?: Client) => {
  const [fiscalDocuments, setFiscalDocuments] = useState<FiscalDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les documents depuis Supabase
  useEffect(() => {
    const loadDocuments = async () => {
      if (selectedClient?.id) {
        setIsLoading(true);
        try {
          const documents = await getClientFiscalDocuments(selectedClient.id);
          setFiscalDocuments(documents);
        } catch (error) {
          console.error("Erreur lors du chargement des documents:", error);
          // Utiliser les données de test si l'API échoue
          setFiscalDocuments(initialFiscalDocuments);
        } finally {
          setIsLoading(false);
        }
      } else {
        // Utiliser les données de test si aucun client n'est sélectionné
        setFiscalDocuments(initialFiscalDocuments);
        setIsLoading(false);
      }
    };

    loadDocuments();
  }, [selectedClient]);

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
  const handleAddDocument = async (newDoc: Omit<FiscalDocument, "id">) => {
    try {
      if (selectedClient?.id) {
        // Sauvegarder dans Supabase si un client est sélectionné
        const savedDoc = await saveFiscalDocument(newDoc, selectedClient.id);
        setFiscalDocuments(prev => [...prev, savedDoc]);
        
        toast({
          title: "Document enregistré",
          description: `Le document ${newDoc.name} a été enregistré avec succès.`,
        });
      } else {
        // Fonctionnement local si aucun client n'est sélectionné
        const newDocument: FiscalDocument = {
          ...newDoc,
          id: Math.random().toString(36).substring(2, 9), // Generate simple ID
        };
        
        setFiscalDocuments(prev => [...prev, newDocument]);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du document:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'enregistrement du document.",
        variant: "destructive",
      });
    }
  };

  // Helper to render document validity
  const renderValidity = (doc: FiscalDocument) => {
    if (!doc.validUntil) return null;
    
    const now = new Date();
    const validUntil = new Date(doc.validUntil);
    const daysRemaining = Math.ceil((validUntil.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const validityDate = validUntil.toLocaleDateString();
    
    if (daysRemaining <= 0) {
      return (
        <div className="flex items-center mt-1 text-destructive text-xs">
          <Bell size={14} className="mr-1" />
          Expiré depuis {Math.abs(daysRemaining)} jour{Math.abs(daysRemaining) > 1 ? 's' : ''} ({validityDate})
        </div>
      );
    }
    
    if (daysRemaining <= 5) {
      return (
        <div className="flex items-center mt-1 text-destructive text-xs">
          <Bell size={14} className="mr-1" />
          Expire dans {daysRemaining} jour{daysRemaining > 1 ? 's' : ''} ({validityDate})
        </div>
      );
    }
    
    return (
      <div className="text-xs text-muted-foreground mt-1">
        Valide jusqu'au {validityDate}
      </div>
    );
  };

  return {
    filteredDocuments,
    handleAddDocument,
    renderValidity,
    isLoading
  };
};
