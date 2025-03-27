
import { useClientsCommon } from "@/hooks/useClientsCommon";

export const usePaiementClients = () => {
  // Utilise le hook commun pour récupérer les clients
  const { clients, isLoading, error } = useClientsCommon();

  // Log pour déboguer
  console.log(`usePaiementClients: ${clients.length} clients chargés`);
  
  return { 
    clients, 
    isLoading, 
    error 
  };
};
