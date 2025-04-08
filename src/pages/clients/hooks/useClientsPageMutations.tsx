
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Client } from "@/types/client";
import { addClient, archiveClient, updateClient, deleteClient } from "@/services/clientService";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useState } from "react";

export interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "default" | "destructive";
}

type ShowConfirmationProps = Omit<ConfirmationDialogProps, "isOpen" | "onCancel" | "onConfirm">;

export function useClientsPageMutations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [confirmDialog, setConfirmDialog] = useState<ConfirmationDialogProps | null>(null);

  // Helper to show confirmation dialog
  const showConfirmation = (props: ShowConfirmationProps) => {
    return new Promise<boolean>((resolve) => {
      setConfirmDialog({
        ...props,
        isOpen: true,
        onCancel: () => {
          setConfirmDialog(null);
          resolve(false);
        },
        onConfirm: () => {
          setConfirmDialog(null);
          resolve(true);
        }
      });
    });
  };

  const addMutation = useMutation({
    mutationFn: addClient,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      
      const clientName = data.type === "physique" 
        ? data.nom 
        : data.raisonsociale;
        
      toast({
        title: "Client ajouté avec succès",
        description: `Le client "${clientName}" a été ajouté à votre base de données.`,
      });
    },
    onError: (error: any) => {
      console.error("Erreur lors de l'ajout du client:", error);
      toast({
        title: "Erreur lors de l'ajout",
        description: error.message || "Une erreur est survenue lors de l'ajout du client. Veuillez réessayer.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Client> }) => {
      console.log("Mise à jour du client:", { id, updates });
      
      if (updates.igs) {
        console.log("Données IGS à mettre à jour:", updates.igs);
      }
      
      const updatedClient = await updateClient(id, updates);
      return updatedClient;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      
      const clientName = data.type === "physique" 
        ? data.nom 
        : data.raisonsociale;
        
      toast({
        title: "Client mis à jour avec succès",
        description: `Les informations de "${clientName}" ont été mises à jour.`,
      });
    },
    onError: (error: any) => {
      console.error("Erreur lors de la mise à jour du client:", error);
      toast({
        title: "Erreur lors de la mise à jour",
        description: error.message || "Une erreur est survenue lors de la mise à jour du client. Veuillez vérifier les données et réessayer.",
        variant: "destructive",
      });
    },
  });

  const archiveMutation = useMutation({
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

  const restoreMutation = useMutation({
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

  const deleteMutation = useMutation({
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

  // Confirmation dialog component
  const ConfirmationDialog = confirmDialog ? (
    <AlertDialog 
      open={confirmDialog.isOpen} 
      onOpenChange={(open) => {
        if (!open) confirmDialog.onCancel();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
          <AlertDialogDescription>{confirmDialog.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={confirmDialog.onCancel}>
            {confirmDialog.cancelText}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={confirmDialog.onConfirm}
            className={confirmDialog.variant === "destructive" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
          >
            {confirmDialog.confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ) : null;

  return {
    addMutation,
    updateMutation,
    archiveMutation,
    restoreMutation,
    deleteMutation,
    toast,
    confirmationDialog: ConfirmationDialog,
    showConfirmation
  };
}
