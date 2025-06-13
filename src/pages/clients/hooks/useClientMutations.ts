
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Client } from "@/types/client";
import { addClient, archiveClient, updateClient, deleteClient, restoreClient, permanentDeleteClient } from "@/services/clientService";
import { useToast } from "@/components/ui/use-toast";

export function useClientMutations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Helper for staged query invalidation to prevent UI freezing
  const invalidateQueries = () => {
    // First invalidate the primary query
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["deleted-clients"] });
    }, 100);
    
    // Then invalidate related queries with delays
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ["expiring-fiscal-attestations"] });
    }, 500);
    
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ["clients-unpaid-patente"] });
      queryClient.invalidateQueries({ queryKey: ["clients-unpaid-igs"] });
      queryClient.invalidateQueries({ queryKey: ["clients-unfiled-dsf"] });
    }, 1000);
  };

  const addMutation = useMutation({
    mutationFn: addClient,
    onSuccess: () => {
      invalidateQueries();
      toast({
        title: "Client ajouté",
        description: "Le nouveau client a été ajouté avec succès.",
      });
    },
    onError: (error) => {
      console.error("Erreur lors de l'ajout du client:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du client.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Client> }) => {
      console.log("Mise à jour du client:", { id, updates });
      return await updateClient(id, updates);
    },
    onSuccess: () => {
      invalidateQueries();
      toast({
        title: "Client mis à jour",
        description: "Le client a été mis à jour avec succès.",
      });
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour du client:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du client.",
        variant: "destructive",
      });
    },
  });

  const archiveMutation = useMutation({
    mutationFn: archiveClient,
    onSuccess: () => {
      invalidateQueries();
      toast({
        title: "Client archivé",
        description: "Le client a été archivé avec succès.",
      });
    },
    onError: (error: any) => {
      console.error("Erreur lors de l'archivage du client:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'archivage du client.",
        variant: "destructive",
      });
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log("Restauration du client:", id);
      return await restoreClient(id);
    },
    onSuccess: () => {
      invalidateQueries();
      toast({
        title: "Client restauré",
        description: "Le client a été restauré avec succès.",
      });
    },
    onError: (error: any) => {
      console.error("Erreur lors de la restauration du client:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la restauration du client.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      invalidateQueries();
      toast({
        title: "Client supprimé",
        description: "Le client a été envoyé à la corbeille.",
      });
    },
    onError: (error: any) => {
      console.error("Erreur lors de la suppression du client:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la suppression du client.",
        variant: "destructive",
      });
    },
  });

  const permanentDeleteMutation = useMutation({
    mutationFn: permanentDeleteClient,
    onSuccess: () => {
      invalidateQueries();
      toast({
        title: "Client supprimé définitivement",
        description: "Le client a été définitivement supprimé.",
      });
    },
    onError: (error: any) => {
      console.error("Erreur lors de la suppression définitive du client:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la suppression définitive du client.",
        variant: "destructive",
      });
    },
  });

  return {
    addMutation,
    updateMutation,
    archiveMutation,
    restoreMutation,
    deleteMutation,
    permanentDeleteMutation,
  };
}
