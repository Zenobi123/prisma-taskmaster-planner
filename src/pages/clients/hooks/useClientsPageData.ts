
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getClients } from "@/services/clientService";
import { Client } from "@/types/client";

export function useClientsPageData() {
  const queryClient = useQueryClient();
  
  const { data: clients = [], isLoading, error } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
    staleTime: 1000 * 60 * 5,
    retry: 2
  });

  const filterClients = (
    clients: Client[], 
    searchTerm: string, 
    selectedType: string, 
    selectedSecteur: string,
    showArchived: boolean
  ) => {
    return clients.filter((client) => {
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

      const matchesArchiveStatus = showArchived || client.statut !== "archive";

      return matchesSearch && matchesType && matchesSecteur && matchesArchiveStatus;
    });
  };

  return {
    clients,
    isLoading,
    error,
    filterClients,
    queryClient
  };
}
