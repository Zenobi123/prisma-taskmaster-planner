
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Proposition, PropositionStatus } from "@/types/proposition";
import {
  getPropositions,
  createProposition,
  updateProposition,
  deleteProposition,
} from "@/services/propositionService";
import { toast } from "sonner";

export function usePropositions() {
  const queryClient = useQueryClient();

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PropositionStatus | "all">("all");
  const [clientFilter, setClientFilter] = useState("all");

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentProposition, setCurrentProposition] = useState<Proposition | null>(null);

  // Fetch all propositions
  const { data: allPropositions = [], isLoading } = useQuery({
    queryKey: ["propositions"],
    queryFn: getPropositions,
  });

  // Fetch clients for selector
  const { data: allClients = [] } = useQuery({
    queryKey: ["clients-for-propositions"],
    queryFn: async () => {
      const { getClients } = await import("@/services/clientService");
      return getClients();
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createProposition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["propositions"] });
      toast.success("Proposition de paiement créée avec succès");
      setCreateDialogOpen(false);
    },
    onError: (error: Error) => {
      toast.error("Erreur lors de la création de la proposition: " + error.message);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateProposition>[1] }) =>
      updateProposition(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["propositions"] });
      toast.success("Proposition de paiement mise à jour avec succès");
      setEditDialogOpen(false);
      setCurrentProposition(null);
    },
    onError: (error: Error) => {
      toast.error("Erreur lors de la mise à jour de la proposition: " + error.message);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteProposition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["propositions"] });
      toast.success("Proposition de paiement supprimée avec succès");
    },
    onError: (error: Error) => {
      toast.error("Erreur lors de la suppression de la proposition: " + error.message);
    },
  });

  // Filter logic
  const filteredPropositions = useMemo(() => {
    let filtered = [...allPropositions];

    // Search by numero or client name
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.numero.toLowerCase().includes(lowerSearch) ||
          (p.client?.nom && p.client.nom.toLowerCase().includes(lowerSearch))
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    // Client filter
    if (clientFilter !== "all") {
      filtered = filtered.filter((p) => p.client_id === clientFilter);
    }

    // Sort by date descending
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return filtered;
  }, [allPropositions, searchTerm, statusFilter, clientFilter]);

  // Actions
  const handleEdit = (proposition: Proposition) => {
    setCurrentProposition(proposition);
    setEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return {
    // Data
    propositions: filteredPropositions,
    allPropositions,
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
    currentProposition,
    setCurrentProposition,

    // Mutations
    createMutation,
    updateMutation,
    deleteMutation,

    // Actions
    handleEdit,
    handleDelete,
  };
}
