
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Devis, DevisStatus } from "@/types/devis";
import {
  getDevis,
  createDevis,
  updateDevis,
  deleteDevis,
  convertDevisToFacture,
} from "@/services/devisService";
import { toast } from "sonner";

export function useDevis() {
  const queryClient = useQueryClient();

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<DevisStatus | "all">("all");
  const [clientFilter, setClientFilter] = useState("all");

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentDevis, setCurrentDevis] = useState<Devis | null>(null);

  // Fetch all devis
  const { data: allDevis = [], isLoading } = useQuery({
    queryKey: ["devis"],
    queryFn: getDevis,
  });

  // Fetch clients for selector
  const { data: allClients = [] } = useQuery({
    queryKey: ["clients-for-devis"],
    queryFn: async () => {
      const { getClients } = await import("@/services/clientService");
      return getClients();
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createDevis,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devis"] });
      toast.success("Devis créé avec succès");
      setCreateDialogOpen(false);
    },
    onError: (error: Error) => {
      toast.error("Erreur lors de la création du devis: " + error.message);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateDevis>[1] }) =>
      updateDevis(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devis"] });
      toast.success("Devis mis à jour avec succès");
      setEditDialogOpen(false);
      setCurrentDevis(null);
    },
    onError: (error: Error) => {
      toast.error("Erreur lors de la mise à jour du devis: " + error.message);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteDevis,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devis"] });
      toast.success("Devis supprimé avec succès");
    },
    onError: (error: Error) => {
      toast.error("Erreur lors de la suppression du devis: " + error.message);
    },
  });

  // Convert mutation
  const convertMutation = useMutation({
    mutationFn: convertDevisToFacture,
    onSuccess: (factureId: string) => {
      queryClient.invalidateQueries({ queryKey: ["devis"] });
      queryClient.invalidateQueries({ queryKey: ["factures"] });
      toast.success("Devis converti en facture avec succès");
    },
    onError: (error: Error) => {
      toast.error("Erreur lors de la conversion du devis: " + error.message);
    },
  });

  // Filter logic
  const filteredDevis = useMemo(() => {
    let filtered = [...allDevis];

    // Search by numero, objet, or client name
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.numero.toLowerCase().includes(lowerSearch) ||
          d.objet.toLowerCase().includes(lowerSearch) ||
          (d.client?.nom && d.client.nom.toLowerCase().includes(lowerSearch))
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((d) => d.status === statusFilter);
    }

    // Client filter
    if (clientFilter !== "all") {
      filtered = filtered.filter((d) => d.client_id === clientFilter);
    }

    // Sort by date descending
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return filtered;
  }, [allDevis, searchTerm, statusFilter, clientFilter]);

  // Actions
  const handleEdit = (devis: Devis) => {
    setCurrentDevis(devis);
    setEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleConvert = (id: string) => {
    convertMutation.mutate(id);
  };

  return {
    // Data
    devis: filteredDevis,
    allDevis,
    allClients,
    isLoading,

    // Filters
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    clientFilter,
    setClientFilter,

    // Dialogs
    createDialogOpen,
    setCreateDialogOpen,
    editDialogOpen,
    setEditDialogOpen,
    currentDevis,
    setCurrentDevis,

    // Mutations
    createMutation,
    updateMutation,
    deleteMutation,
    convertMutation,

    // Actions
    handleEdit,
    handleDelete,
    handleConvert,
  };
}
