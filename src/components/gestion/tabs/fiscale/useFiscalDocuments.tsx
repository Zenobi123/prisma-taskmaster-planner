
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { FiscalDocument } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useFiscalDocuments(clientId: string) {
  const queryClient = useQueryClient();

  // Fetch fiscal documents from the database
  const { data: fiscalDocuments = [], isLoading, error } = useQuery({
    queryKey: ["fiscal_documents", clientId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("fiscal_documents")
          .select("*")
          .eq("client_id", clientId);

        if (error) {
          throw error;
        }

        // Transform DB documents to match our FiscalDocument type
        return data.map((doc) => ({
          id: doc.id,
          name: doc.name,
          description: doc.description || "",
          createdAt: new Date(doc.created_at),
          validUntil: doc.valid_until ? new Date(doc.valid_until) : null,
        })) as FiscalDocument[];
      } catch (err) {
        console.error("Error fetching fiscal documents:", err);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les documents fiscaux",
          variant: "destructive",
        });
        return [];
      }
    },
    enabled: !!clientId, // Only run query if clientId exists
  });

  // Add a new document to the database
  const addDocumentMutation = useMutation({
    mutationFn: async (newDoc: Omit<FiscalDocument, "id">) => {
      const { data, error } = await supabase
        .from("fiscal_documents")
        .insert([{
          name: newDoc.name,
          description: newDoc.description,
          created_at: newDoc.createdAt.toISOString(),
          valid_until: newDoc.validUntil ? newDoc.validUntil.toISOString() : null,
          client_id: clientId,
        }])
        .select("*")
        .single();

      if (error) {
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fiscal_documents"] });
      toast({
        title: "Document ajouté",
        description: "Le document fiscal a été ajouté avec succès",
      });
    },
    onError: (error) => {
      console.error("Error adding fiscal document:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le document fiscal",
        variant: "destructive",
      });
    },
  });

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

  const handleAddDocument = (newDoc: Omit<FiscalDocument, "id">) => {
    // Only allow ACF document to be added per requirements
    if (newDoc.name.includes("Attestation de Conformité Fiscale")) {
      addDocumentMutation.mutate(newDoc);
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
    isLoading,
    error,
    handleAddDocument
  };
}
