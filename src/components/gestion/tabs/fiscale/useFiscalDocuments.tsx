
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { FiscalDocument, FiscalDocumentDisplay } from "./types";
import { supabase } from "@/integrations/supabase/client";

export function useFiscalDocuments(clientId?: string) {
  const [fiscalDocuments, setFiscalDocuments] = useState<FiscalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId) {
      setFiscalDocuments([]);
      setLoading(false);
      return;
    }

    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("fiscal_documents")
          .select("*")
          .eq("client_id", clientId);

        if (error) throw error;

        const formattedDocs: FiscalDocument[] = data.map(doc => ({
          id: doc.id,
          name: doc.name || getDocumentNameFromType(doc.document_type || "ACF"),
          description: doc.description || "",
          createdAt: new Date(doc.created_at),
          validUntil: doc.valid_until ? new Date(doc.valid_until) : null,
          documentType: doc.document_type || "ACF",
          documentUrl: doc.document_url
        }));

        setFiscalDocuments(formattedDocs);
      } catch (err) {
        console.error("Erreur lors du chargement des documents:", err);
        setError("Erreur lors du chargement des documents fiscaux");
        toast({
          title: "Erreur",
          description: "Impossible de charger les documents fiscaux",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [clientId]);

  const getDocumentNameFromType = (type: string): string => {
    switch (type) {
      case "ACF":
        return "Attestation de Conformité Fiscale";
      case "DSF":
        return "Déclaration Statistique et Fiscale";
      case "PATENTE":
        return "Patente";
      case "AUTRE":
        return "Document fiscal";
      default:
        return "Document fiscal";
    }
  };

  const filteredDocuments = fiscalDocuments.filter(doc => {
    if (!doc.validUntil) return true;

    const now = new Date();
    const expiredDays = (now.getTime() - doc.validUntil.getTime()) / (1000 * 60 * 60 * 24);
    return expiredDays <= 30;
  });

  useEffect(() => {
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

  const handleAddDocument = async (newDoc: Omit<FiscalDocument, "id">) => {
    if (!clientId) {
      toast({
        title: "Erreur",
        description: "Aucun client sélectionné",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if a document of the same type already exists for this client
      const { data: existingDocs, error: checkError } = await supabase
        .from("fiscal_documents")
        .select("*")
        .eq("client_id", clientId)
        .eq("document_type", newDoc.documentType || "ACF");
      
      if (checkError) throw checkError;
      
      if (existingDocs && existingDocs.length > 0) {
        toast({
          title: "Document déjà existant",
          description: `Un document de type ${newDoc.name || getDocumentNameFromType(newDoc.documentType || "ACF")} existe déjà pour ce client.`,
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from("fiscal_documents")
        .insert({
          name: newDoc.name || getDocumentNameFromType(newDoc.documentType || "ACF"),
          description: newDoc.description,
          created_at: newDoc.createdAt.toISOString(),
          valid_until: newDoc.validUntil ? newDoc.validUntil.toISOString() : null,
          client_id: clientId,
          document_type: newDoc.documentType || "ACF",
          document_url: null // Document URL toujours null car on n'attache plus de document
        })
        .select();

      if (error) throw error;

      if (data && data[0]) {
        const addedDoc: FiscalDocument = {
          id: data[0].id,
          name: data[0].name || getDocumentNameFromType(data[0].document_type || "ACF"),
          description: data[0].description || "",
          createdAt: new Date(data[0].created_at),
          validUntil: data[0].valid_until ? new Date(data[0].valid_until) : null,
          documentType: data[0].document_type || "ACF",
          documentUrl: data[0].document_url
        };

        setFiscalDocuments(prev => [...prev, addedDoc]);
        
        toast({
          title: "Document ajouté",
          description: `${addedDoc.name} a été ajouté avec succès`,
        });
      }
    } catch (err) {
      console.error("Erreur lors de l'ajout du document:", err);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le document fiscal",
        variant: "destructive",
      });
    }
  };

  return {
    fiscalDocuments: filteredDocuments,
    loading,
    error,
    handleAddDocument
  };
}
