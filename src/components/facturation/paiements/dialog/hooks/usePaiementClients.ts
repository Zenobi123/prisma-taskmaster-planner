
import { useClientsCommon } from "@/hooks/useClientsCommon";

export const usePaiementClients = () => {
  // Utilise le hook commun pour récupérer les clients
  const { clients, isLoading, error } = useClientsCommon();

  // Log pour déboguer
  
  return { 
    clients, 
    isLoading, 
    error 
  };
};
