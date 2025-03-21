
import { useQuery } from "@tanstack/react-query";
import { getClients } from "@/services/clientService";
import { Client } from "@/types/client";

export const useFactureClients = () => {
  // Fetch clients using the client service
  const { data: allClients = [], isLoading: isLoadingClients, error: clientsError } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2
  });

  const getSelectedClient = (clientId: string): Client | undefined => {
    return allClients.find(client => client.id === clientId);
  };
  
  return {
    allClients,
    isLoadingClients,
    clientsError,
    getSelectedClient
  };
};
