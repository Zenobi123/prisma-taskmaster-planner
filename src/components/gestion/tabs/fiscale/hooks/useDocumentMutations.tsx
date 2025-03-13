
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { FiscalDocument } from "../types";
import { addFiscalDocument, updateFiscalDocument, deleteFiscalDocument } from "@/services/fiscalDocumentService";

export function useDocumentMutations(clientId?: string) {
  const queryClient = useQueryClient();
  
  // Mutation for adding a document
  const addMutation = useMutation({
    mutationFn: (newDoc: Omit<FiscalDocument, "id" | "createdAt">) => {
      if (!clientId) throw new Error("Aucun client sélectionné");
      
      return addFiscalDocument({
        name: newDoc.name,
        description: newDoc.description,
        client_id: clientId,
        valid_until: newDoc.validUntil,
      });
    },
    onSuccess: () => {
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

  // Mutation for updating a document
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

  // Mutation for deleting a document
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

  return {
    addMutation,
    updateMutation,
    deleteMutation
  };
}
