
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { Client } from "@/types/client";
import { addClient, archiveClient, updateClient, deleteClient, restoreClient, permanentDeleteClient } from "@/services/clientService";
import { useToast } from "@/components/ui/use-toast";

export function useClientMutations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const secondaryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const invalidateQueries = () => {
    // Invalidate primary queries immediately so the list refreshes right away
    queryClient.invalidateQueries({ queryKey: ["clients"] });
    queryClient.invalidateQueries({ queryKey: ["deleted-clients"] });

    // Debounce secondary dashboard queries — cancel any pending batch and schedule
    // a new one so rapid successive mutations never stack up multiple rounds of
    // invalidations that would overwhelm React Query and freeze the UI.
    if (secondaryTimerRef.current) {
      clearTimeout(secondaryTimerRef.current);
    }
    secondaryTimerRef.current = setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ["expiring-fiscal-attestations"] });
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
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du client.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Client> }) => {
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
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'archivage du client.",
        variant: "destructive",
      });
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async (id: string) => {
      return await restoreClient(id);
    },
    onSuccess: () => {
      invalidateQueries();
      toast({
        title: "Client restauré",
        description: "Le client a été restauré avec succès.",
      });
    },
    onError: (error) => {
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
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la suppression du client.",
        variant: "destructive",
      });
    },
  });

  const importMutation = useMutation({
    mutationFn: async (clientsToImport: Partial<Client>[]) => {
      const results = await Promise.allSettled(
        clientsToImport.map((client) =>
          addClient(client as Omit<Client, "id" | "created_at">)
        )
      );
      const succeeded = results.filter((r) => r.status === "fulfilled").length;
      return { succeeded, failed: results.length - succeeded };
    },
    onSuccess: ({ succeeded, failed }) => {
      invalidateQueries();
      if (failed > 0) {
        toast({
          title: "Import partiel",
          description: `${succeeded} client(s) importé(s), ${failed} en échec.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Import réussi",
          description: `${succeeded} client(s) importé(s) avec succès.`,
        });
      }
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'import des clients.",
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
    onError: (error) => {
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
    importMutation,
  };
}
