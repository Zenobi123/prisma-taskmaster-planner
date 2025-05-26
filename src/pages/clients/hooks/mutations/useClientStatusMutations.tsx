
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { archiveClient, deleteClient, updateClient } from "@/services/clientService";
import { useToast } from "@/components/ui/use-toast";
import { useConfirmation } from "../confirmation/ConfirmationDialogContext";

export function useArchiveClientMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { showConfirmation } = useConfirmation();

  return useMutation({
    mutationFn: async (id: string) => {
      const confirmed = await showConfirmation({
        title: "Archiver ce client ?",
        description: "Cette action déplacera le client vers les archives. Vous pourrez le restaurer ultérieurement si nécessaire.",
        confirmText: "Archiver",
        cancelText: "Annuler",
        variant: "destructive"
      });

      if (!confirmed) {
        throw new Error("Operation cancelled by user");
      }
      
      return await archiveClient(id);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      
      const clientName = data.type === "physique" 
        ? data.nom 
        : data.raisonsociale;
        
      toast({
        title: "Client archivé",
        description: `"${clientName}" a été archivé avec succès.`,
      });
    },
    onError: (error: any) => {
      if (error.message === "Operation cancelled by user") {
        return; // Silently handle user cancellation
      }
      
      console.error("Erreur lors de l'archivage du client:", error);
      toast({
        title: "Erreur lors de l'archivage",
        description: error.message || "Une erreur est survenue lors de l'archivage du client.",
        variant: "destructive",
      });
    },
  });
}

export function useRestoreClientMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { showConfirmation } = useConfirmation();

  return useMutation({
    mutationFn: async (id: string) => {
      const confirmed = await showConfirmation({
        title: "Restaurer ce client ?",
        description: "Cette action restaurera le client des archives vers les clients actifs.",
        confirmText: "Restaurer",
        cancelText: "Annuler"
      });

      if (!confirmed) {
        throw new Error("Operation cancelled by user");
      }
      
      console.log("Restauration du client:", id);
      const restoredClient = await updateClient(id, { statut: "actif" });
      return restoredClient;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      
      const clientName = data.type === "physique" 
        ? data.nom 
        : data.raisonsociale;
        
      toast({
        title: "Client restauré",
        description: `"${clientName}" a été restauré avec succès et est à nouveau actif.`,
      });
    },
    onError: (error: any) => {
      if (error.message === "Operation cancelled by user") {
        return; // Silently handle user cancellation
      }
      
      console.error("Erreur lors de la restauration du client:", error);
      toast({
        title: "Erreur lors de la restauration",
        description: error.message || "Une erreur est survenue lors de la restauration du client.",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteClientMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { showConfirmation } = useConfirmation();

  return useMutation({
    mutationFn: async (id: string) => {
      const confirmed = await showConfirmation({
        title: "Supprimer définitivement ce client ?",
        description: "Attention ! Cette action est irréversible et supprimera définitivement toutes les données associées à ce client.",
        confirmText: "Supprimer définitivement",
        cancelText: "Annuler",
        variant: "destructive"
      });

      if (!confirmed) {
        throw new Error("Operation cancelled by user");
      }
      
      return await deleteClient(id);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: "Client supprimé",
        description: "Le client a été définitivement supprimé de la base de données.",
      });
    },
    onError: (error: any) => {
      if (error.message === "Operation cancelled by user") {
        return; // Silently handle user cancellation
      }
      
      console.error("Erreur lors de la suppression du client:", error);
      toast({
        title: "Erreur lors de la suppression",
        description: error.message || "Une erreur est survenue lors de la suppression du client.",
        variant: "destructive",
      });
    },
  });
}
