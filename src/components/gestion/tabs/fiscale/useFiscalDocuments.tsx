
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { FiscalDocument } from "./types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFiscalDocuments, addFiscalDocument, updateFiscalDocument, deleteFiscalDocument } from "@/services/fiscalDocumentService";

export function useFiscalDocuments(clientId?: string) {
  const queryClient = useQueryClient();
  
  // Utilise une requête React Query pour récupérer les documents
  const { data: fiscalDocuments = [], isLoading, error } = useQuery({
    queryKey: ["fiscal_documents", clientId],
    queryFn: () => clientId ? getFiscalDocuments(clientId) : Promise.resolve([]),
    enabled: !!clientId,
  });

  // Filter out documents that expired more than 30 days ago
  const filteredDocuments = fiscalDocuments.filter(doc => {
    if (!doc.validUntil) return true; // Keep documents with no expiration
    
    const now = new Date();
    const expiredDays = (now.getTime() - doc.validUntil.getTime()) / (1000 * 60 * 60 * 24);
    return expiredDays <= 30; // Keep if expired less than 30 days ago or not expired yet
  });

  // Mutation pour ajouter un document
  const addMutation = useMutation({
    mutationFn: (newDoc: Omit<FiscalDocument, "id" | "createdAt">) => {
      if (!clientId) throw new Error("Aucun client sélectionné");
      
      // Prépare les données à envoyer au service
      return addFiscalDocument({
        name: newDoc.name,
        description: newDoc.description,
        client_id: clientId,
        valid_until: newDoc.validUntil,
      });
    },
    onSuccess: () => {
      // Invalide le cache pour recharger les données
      queryClient.invalidateQueries({ queryKey: ["fiscal_documents", clientId] });
      queryClient.invalidateQueries({ queryKey: ["fiscal_documents_to_renew"] });
      
      toast({
        title: "Document ajouté",
        description: "Le document fiscal a été ajouté avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'ajout du document",
        variant: "destructive",
      });
    },
  });

  // Mutation pour mettre à jour un document
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<FiscalDocument, "id" | "createdAt">> }) => {
      return updateFiscalDocument(id, {
        name: data.name,
        description: data.description,
        valid_until: data.validUntil,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fiscal_documents", clientId] });
      queryClient.invalidateQueries({ queryKey: ["fiscal_documents_to_renew"] });
      
      toast({
        title: "Document mis à jour",
        description: "Le document fiscal a été mis à jour avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la mise à jour du document",
        variant: "destructive",
      });
    },
  });

  // Mutation pour supprimer un document
  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      return deleteFiscalDocument(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fiscal_documents", clientId] });
      queryClient.invalidateQueries({ queryKey: ["fiscal_documents_to_renew"] });
      
      toast({
        title: "Document supprimé",
        description: "Le document fiscal a été supprimé avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la suppression du document",
        variant: "destructive",
      });
    },
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

  const handleAddDocument = (newDoc: Omit<FiscalDocument, "id" | "createdAt">) => {
    addMutation.mutate(newDoc);
  };

  const handleUpdateDocument = (id: string, data: Partial<Omit<FiscalDocument, "id" | "createdAt">>) => {
    updateMutation.mutate({ id, data });
  };

  const handleDeleteDocument = (id: string) => {
    deleteMutation.mutate(id);
  };

  return {
    fiscalDocuments: filteredDocuments,
    isLoading,
    error,
    handleAddDocument,
    handleUpdateDocument,
    handleDeleteDocument
  };
}
