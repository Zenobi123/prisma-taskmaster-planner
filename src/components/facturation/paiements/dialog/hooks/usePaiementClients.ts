
import { useClientsCommon } from "@/hooks/useClientsCommon";

export const usePaiementClients = () => {
  const { clients, isLoading, error } = useClientsCommon();

  return { 
    clients, 
    isLoading, 
    error 
  };
};
