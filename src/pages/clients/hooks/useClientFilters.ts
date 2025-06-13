
import { useState } from "react";
import { Client, ClientType } from "@/types/client";

export function useClientFilters(clients: Client[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<ClientType | "all">("all");
  const [selectedSecteur, setSelectedSecteur] = useState("all");
  const [showArchived, setShowArchived] = useState(false);
  const [multiCriteriaFiltered, setMultiCriteriaFiltered] = useState<Client[]>([]);
  const [isMultiCriteriaActive, setIsMultiCriteriaActive] = useState(false);

  // Use multicriteria filtered clients if active, otherwise use all clients
  const baseClients = isMultiCriteriaActive ? multiCriteriaFiltered : clients;

  const filteredClients = baseClients.filter((client) => {
    const matchesSearch =
      (client.type === "physique"
        ? client.nom?.toLowerCase()
        : client.raisonsociale?.toLowerCase()
      )?.includes(searchTerm.toLowerCase()) ||
      client.niu.includes(searchTerm) ||
      client.contact.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === "all" || client.type === selectedType;

    const matchesSecteur =
      selectedSecteur === "all" || client.secteuractivite === selectedSecteur;

    const matchesArchiveStatus = showArchived || client.statut !== "archive";

    return matchesSearch && matchesType && matchesSecteur && matchesArchiveStatus;
  });

  const handleMultiCriteriaChange = (filtered: Client[]) => {
    setMultiCriteriaFiltered(filtered);
    setIsMultiCriteriaActive(filtered.length !== clients.length);
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    selectedSecteur,
    setSelectedSecteur,
    showArchived,
    setShowArchived,
    filteredClients,
    handleMultiCriteriaChange,
    isMultiCriteriaActive,
  };
}
