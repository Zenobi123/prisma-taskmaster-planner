
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { 
  getFactures, 
  createFacture, 
  updateFacture, 
  deleteFacture,
  addPaiement,
  deletePaiement
} from "@/services/factureService";
import { Facture, Paiement } from "@/types/facture";

export function useFactures() {
  const [selectedFacture, setSelectedFacture] = useState<Facture | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isAddPaymentDialogOpen, setIsAddPaymentDialogOpen] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Récupération des factures
  const { data: factures = [], isLoading, error } = useQuery({
    queryKey: ["factures"],
    queryFn: getFactures,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Mutation pour créer une facture
  const createMutation = useMutation({
    mutationFn: createFacture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["factures"] });
      toast({
        title: "Facture créée",
        description: "La facture a été créée avec succès."
      });
      setIsCreateDialogOpen(false);
    },
    onError: (error: any) => {
      console.error("Erreur lors de la création de la facture:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création de la facture.",
        variant: "destructive"
      });
    }
  });

  // Mutation pour mettre à jour une facture
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Facture> }) => 
      updateFacture(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["factures"] });
      toast({
        title: "Facture mise à jour",
        description: "La facture a été mise à jour avec succès."
      });
      setIsEditDialogOpen(false);
      setSelectedFacture(null);
    },
    onError: (error: any) => {
      console.error("Erreur lors de la mise à jour de la facture:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour de la facture.",
        variant: "destructive"
      });
    }
  });

  // Mutation pour supprimer une facture
  const deleteMutation = useMutation({
    mutationFn: deleteFacture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["factures"] });
      toast({
        title: "Facture supprimée",
        description: "La facture a été supprimée avec succès."
      });
    },
    onError: (error: any) => {
      console.error("Erreur lors de la suppression de la facture:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la suppression de la facture.",
        variant: "destructive"
      });
    }
  });

  // Mutation pour ajouter un paiement
  const addPaymentMutation = useMutation({
    mutationFn: addPaiement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["factures"] });
      toast({
        title: "Paiement ajouté",
        description: "Le paiement a été ajouté avec succès."
      });
      setIsAddPaymentDialogOpen(false);
    },
    onError: (error: any) => {
      console.error("Erreur lors de l'ajout du paiement:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'ajout du paiement.",
        variant: "destructive"
      });
    }
  });

  // Mutation pour supprimer un paiement
  const deletePaymentMutation = useMutation({
    mutationFn: deletePaiement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["factures"] });
      toast({
        title: "Paiement supprimé",
        description: "Le paiement a été supprimé avec succès."
      });
    },
    onError: (error: any) => {
      console.error("Erreur lors de la suppression du paiement:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la suppression du paiement.",
        variant: "destructive"
      });
    }
  });

  // Handlers
  const handleView = (facture: Facture) => {
    setSelectedFacture(facture);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (facture: Facture) => {
    setSelectedFacture(facture);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (facture: Facture) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette facture ?")) {
      await deleteMutation.mutateAsync(facture.id);
    }
  };

  const handleAddPayment = (facture: Facture) => {
    setSelectedFacture(facture);
    setIsAddPaymentDialogOpen(true);
  };

  const handleDeletePayment = async (paiementId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce paiement ?")) {
      await deletePaymentMutation.mutateAsync(paiementId);
    }
  };

  return {
    factures,
    isLoading,
    error,
    selectedFacture,
    isCreateDialogOpen,
    isEditDialogOpen,
    isViewDialogOpen,
    isAddPaymentDialogOpen,
    setSelectedFacture,
    setIsCreateDialogOpen,
    setIsEditDialogOpen,
    setIsViewDialogOpen,
    setIsAddPaymentDialogOpen,
    createMutation,
    updateMutation,
    deleteMutation,
    addPaymentMutation,
    deletePaymentMutation,
    handleView,
    handleEdit,
    handleDelete,
    handleAddPayment,
    handleDeletePayment
  };
}
