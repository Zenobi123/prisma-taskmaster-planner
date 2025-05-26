
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getClients } from "@/services/clientService";
import { Client, ClientStatus, ClientType } from "@/types/client";
import { toast } from "@/components/ui/use-toast";

export interface ClientFilters {
  searchTerm?: string;
  type?: ClientType | "all";
  secteur?: string;
  statut?: ClientStatus | "all";
  showArchived?: boolean;
  createdAfter?: Date | null;
  createdBefore?: Date | null;
}

export function useClientsPageData() {
  const queryClient = useQueryClient();
  
  const { 
    data: clients = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      try {
        return await getClients();
      } catch (error) {
        console.error("Error fetching clients:", error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les clients",
          variant: "destructive",
        });
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    retryDelay: (attempt) => Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000) // Exponential backoff
  });

  /**
   * Filter clients based on multiple criteria
   * @param clients - List of clients to filter
   * @param filters - Object containing filter criteria
   * @returns Filtered list of clients
   */
  const filterClients = (
    clients: Client[],
    filters: ClientFilters
  ): Client[] => {
    const {
      searchTerm = "",
      type = "all",
      secteur = "all",
      showArchived = false,
      createdAfter = null,
      createdBefore = null
    } = filters;

    return clients.filter((client) => {
      // Search term filter
      const matchesSearch = !searchTerm ? true : (
        (client.type === "physique"
          ? client.nom?.toLowerCase()
          : client.raisonsociale?.toLowerCase()
        )?.includes(searchTerm.toLowerCase()) ||
        client.niu?.includes(searchTerm) ||
        client.contact?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.adresse?.ville?.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Type filter
      const matchesType = type === "all" || client.type === type;

      // Sector filter
      const matchesSecteur =
        secteur === "all" || client.secteuractivite === secteur;

      // Archive status filter
      const matchesArchiveStatus = showArchived || client.statut !== "archive";

      // Date filter - created after
      const matchesCreatedAfter = !createdAfter ? true : (
        client.created_at && new Date(client.created_at) >= createdAfter
      );

      // Date filter - created before
      const matchesCreatedBefore = !createdBefore ? true : (
        client.created_at && new Date(client.created_at) <= createdBefore
      );

      return (
        matchesSearch && 
        matchesType && 
        matchesSecteur && 
        matchesArchiveStatus && 
        matchesCreatedAfter && 
        matchesCreatedBefore
      );
    });
  };

  /**
   * Invalidate and refetch clients data
   */
  const refreshClients = () => {
    queryClient.invalidateQueries({ queryKey: ["clients"] });
  };

  /**
   * Get unique sectors from client data for filtering
   */
  const getAvailableSectors = (): string[] => {
    if (!clients?.length) return [];
    
    const sectors = new Set<string>();
    clients.forEach(client => {
      if (client.secteuractivite) {
        sectors.add(client.secteuractivite);
      }
    });
    
    return Array.from(sectors).sort();
  };

  return {
    clients,
    isLoading,
    error,
    filterClients,
    refreshClients,
    getAvailableSectors,
    queryClient,
    refetch
  };
}
