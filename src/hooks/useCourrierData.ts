
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getClients } from "@/services/clientService";
import { getCollaborateurs } from "@/services/collaborateurService";

const templates = [
  {
    id: "rappel_obligations",
    title: "Rappel d'obligations fiscales",
    description: "Rappel des échéances fiscales à venir"
  },
  {
    id: "convocation_rdv",
    title: "Convocation rendez-vous",
    description: "Invitation à un rendez-vous professionnel"
  },
  {
    id: "nouvelle_reglementation",
    title: "Nouvelle réglementation",
    description: "Information sur les nouveautés réglementaires"
  },
  {
    id: "felicitations_creation",
    title: "Félicitations création",
    description: "Félicitations pour la création d'entreprise"
  }
];

export const useCourrierData = () => {
  const {
    data: clients,
    isLoading: isLoadingClients,
    error: clientsError,
  } = useQuery({
    queryKey: ["clients"],
    queryFn: () => getClients(false),
    retry: 2,
  });

  const {
    data: collaborateurs,
    isLoading: isLoadingCollaborateurs,
    error: collaborateursError,
  } = useQuery({
    queryKey: ["collaborateurs"],
    queryFn: getCollaborateurs,
    retry: 2,
  });

  // Filter clients based on criteria
  const [filteredClients, setFilteredClients] = useState(clients || []);

  const filterClients = (criteria: any) => {
    if (!clients) return [];
    
    return clients.filter(client => {
      if (criteria.type && client.type !== criteria.type) return false;
      if (criteria.regimeFiscal && client.regimefiscal !== criteria.regimeFiscal) return false;
      if (criteria.secteurActivite && client.secteuractivite !== criteria.secteurActivite) return false;
      if (criteria.centreRattachement && client.centrerattachement !== criteria.centreRattachement) return false;
      if (criteria.statut && client.statut !== criteria.statut) return false;
      return true;
    });
  };

  return {
    clients: clients || [],
    collaborateurs: collaborateurs || [],
    templates,
    filteredClients: filteredClients || [],
    isLoading: isLoadingClients || isLoadingCollaborateurs,
    error: clientsError || collaborateursError,
    filterClients
  };
};
