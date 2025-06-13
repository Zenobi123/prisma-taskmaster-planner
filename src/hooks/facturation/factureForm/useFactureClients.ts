
import { useQuery } from "@tanstack/react-query";
import { getClients } from "@/services/clientService";

export function useFactureClients() {
  const { data: clients = [], isLoading, error } = useQuery({
    queryKey: ["clients"],
    queryFn: () => getClients(false),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    clients,
    isLoading,
    error,
  };
}
