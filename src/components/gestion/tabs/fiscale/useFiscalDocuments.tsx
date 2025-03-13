
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FiscalDocument } from "./types";
import { getFiscalDocuments } from "@/services/fiscalDocumentService";
import { useDocumentMutations } from "./hooks/useDocumentMutations";
import { useDocumentFiltering } from "./hooks/useDocumentFiltering";
import { useDocumentNotifications } from "./hooks/useDocumentNotifications";

export function useFiscalDocuments(clientId?: string) {
  // Filter options state
  const [filterOptions, setFilterOptions] = useState({
    showExpired: true,
    expiryThreshold: 30
  });

  // Fetch documents with React Query
  const { data: fiscalDocuments = [], isLoading, error } = useQuery({
    queryKey: ["fiscal_documents", clientId],
    queryFn: () => clientId ? getFiscalDocuments(clientId) : Promise.resolve([]),
    enabled: !!clientId,
  });

  // Use our optimized filtering hook
  const { filteredDocuments, documentStats } = useDocumentFiltering(
    fiscalDocuments, 
    filterOptions
  );
  
  // Use other focused hooks for mutations and notifications
  const { addMutation, updateMutation, deleteMutation } = useDocumentMutations(clientId);
  useDocumentNotifications(filteredDocuments);

  // Handler functions
  const handleAddDocument = (newDoc: Omit<FiscalDocument, "id" | "createdAt">) => {
    addMutation.mutate(newDoc);
  };

  const handleUpdateDocument = (id: string, data: Partial<Omit<FiscalDocument, "id" | "createdAt">>) => {
    updateMutation.mutate({ id, data });
  };

  const handleDeleteDocument = (id: string) => {
    deleteMutation.mutate(id);
  };

  // Handler for changing filter options
  const updateFilterOptions = (options: Partial<typeof filterOptions>) => {
    setFilterOptions(prev => ({ ...prev, ...options }));
  };

  return {
    fiscalDocuments: filteredDocuments,
    documentStats,
    isLoading,
    error,
    filterOptions,
    updateFilterOptions,
    handleAddDocument,
    handleUpdateDocument,
    handleDeleteDocument
  };
}
