
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getClients } from "@/services/clientService";
import { Client } from "@/types/client";

interface Criteria {
  type: string;
  regimeFiscal: string;
  secteurActivite: string;
  centreRattachement: string;
  statut: string;
}

export const useCourrierData = (criteria: Criteria) => {
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients
  });

  useEffect(() => {
    if (!clients.length) {
      setFilteredClients([]);
      return;
    }

    const filtered = clients.filter((client: Client) => {
      // Statut filter (toujours actif par défaut)
      if (client.statut !== criteria.statut) return false;

      // Type filter
      if (criteria.type && client.type !== criteria.type) return false;

      // Régime fiscal filter
      if (criteria.regimeFiscal && client.regimefiscal !== criteria.regimeFiscal) return false;

      // Secteur d'activité filter
      if (criteria.secteurActivite && client.secteuractivite !== criteria.secteurActivite) return false;

      // Centre de rattachement filter
      if (criteria.centreRattachement && client.centrerattachement !== criteria.centreRattachement) return false;

      return true;
    });

    setFilteredClients(filtered);
  }, [clients, criteria]);

  return {
    filteredClients,
    isLoading
  };
};
