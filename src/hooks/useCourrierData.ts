
import { useQuery } from "@tanstack/react-query";
import { getClientsForCourrier } from "@/services/courrierService";
import { getCollaborateurs } from "@/services/collaborateurService";
import { Criteria } from "@/components/courrier/CriteriaSelection";

export const useCourrierData = (selectedCriteria?: Criteria) => {
  const {
    data: clients = [],
    isLoading: isLoadingClients,
    error: clientsError,
  } = useQuery({
    queryKey: ["clients-courrier"],
    queryFn: () => getClientsForCourrier(),
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
