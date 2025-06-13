
import { useQuery } from "@tanstack/react-query";
import { getClients } from "@/services/clientService";
import { getCollaborateurs } from "@/services/collaborateurService";

export const useCourrierData = () => {
  const {
    data: clients = [],
    isLoading: isLoadingClients,
    error: clientsError,
  } = useQuery({
    queryKey: ["clients"],
    queryFn: () => getClients(false),
    retry: 2,
  });

  const {
    data: collaborateurs = [],
    isLoading: isLoadingCollaborateurs,
    error: collaborateursError,
  } = useQuery({
    queryKey: ["collaborateurs"],
    queryFn: getCollaborateurs,
    retry: 2,
  });

  return {
    clients,
    collaborateurs,
    isLoading: isLoadingClients || isLoadingCollaborateurs,
    error: clientsError || collaborateursError,
  };
};
