
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useClientsCommon } from "@/hooks/useClientsCommon";

export const useClientData = () => {
  const { toast } = useToast();
  const { clients, isLoading, error } = useClientsCommon();
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const fetchClients = () => {
    // Trigger a refetch by incrementing the state
    setRefetchTrigger(prev => prev + 1);
  };

  return {
    clients,
    isLoading,
    error,
    fetchClients
  };
};
