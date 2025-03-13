
import { useQuery } from "@tanstack/react-query";
import { FiscalDocument } from "./types";
import { getFiscalDocuments } from "@/services/fiscalDocumentService";
import { useDocumentMutations } from "./hooks/useDocumentMutations";
import { useDocumentFiltering } from "./hooks/useDocumentFiltering";
import { useDocumentNotifications } from "./hooks/useDocumentNotifications";

export function useFiscalDocuments(clientId?: string) {
  // Fetch documents with React Query
  const { data: fiscalDocuments = [], isLoading, error } = useQuery({
    queryKey: ["fiscal_documents", clientId],
    queryFn: () => clientId ? getFiscalDocuments(clientId) : Promise.resolve([]),
    enabled: !!clientId,
  });

  // Use our focused hooks
  const { filteredDocuments } = useDocumentFiltering(fiscalDocuments);
  const { addMutation, updateMutation, deleteMutation } = useDocumentMutations(clientId);
  
  // Set up notifications for document expiry
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

  return {
    fiscalDocuments: filteredDocuments,
    isLoading,
    error,
    handleAddDocument,
    handleUpdateDocument,
    handleDeleteDocument
  };
}
