
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getClients } from "@/services/clientService";
import { Client } from "@/types/client";

export const useFactureForm = () => {
  const [clients, setClients] = useState<Client[]>([]);

  // Fetch clients data
  const { 
    data: clientsData = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ["clients"],
    queryFn: () => getClients(false),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  useEffect(() => {
    setClients(clientsData);
  }, [clientsData]);

  return {
    clients,
    isLoading,
    error: error as Error | null
  };
};
