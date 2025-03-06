
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Client, ClientType } from "@/types/client";
import { getClients, addClient, deleteClient, updateClient } from "@/services/clientService";
import { useToast } from "@/components/ui/use-toast";

export function useClientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<ClientType | "all">("all");
  const [selectedSecteur, setSelectedSecteur] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [newClientType, setNewClientType] = useState<ClientType>("physique");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: clients = [], isLoading, error } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
    staleTime: 1000 * 60 * 5,
    retry: 2
  });

  const addMutation = useMutation({
    mutationFn: addClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: "Client ajouté",
        description: "Le nouveau client a été ajouté avec succès.",
      });
      setIsDialogOpen(false);
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
      const updatedClient = await updateClient(id, updates);
      return updatedClient;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: "Client mis à jour",
        description: "Le client a été mis à jour avec succès.",
      });
      setIsEditDialogOpen(false);
      setSelectedClient(null);
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

  const deleteMutation = useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: "Client supprimé",
        description: "Le client a été supprimé avec succès.",
      });
    },
    onError: (error: any) => {
      console.error("Erreur lors de la suppression du client:", error);
    },
  });

  const handleView = (client: Client) => {
    setSelectedClient(client);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (client: Client) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      try {
        await deleteMutation.mutateAsync(client.id);
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      (client.type === "physique"
        ? client.nom?.toLowerCase()
        : client.raisonsociale?.toLowerCase()
      )?.includes(searchTerm.toLowerCase()) ||
      client.niu.includes(searchTerm) ||
      client.contact.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === "all" || client.type === selectedType;

    const matchesSecteur =
      selectedSecteur === "all" || client.secteuractivite === selectedSecteur;

    return matchesSearch && matchesType && matchesSecteur;
  });

  return {
    clients: filteredClients,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    selectedSecteur,
    setSelectedSecteur,
    isDialogOpen,
    setIsDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isViewDialogOpen,
    setIsViewDialogOpen,
    newClientType,
    setNewClientType,
    selectedClient,
    setSelectedClient,
    addMutation,
    updateMutation,
    handleView,
    handleEdit,
    handleDelete,
    toast
  };
}
