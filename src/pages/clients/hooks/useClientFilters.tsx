
import { useState, useMemo } from "react";
import { Client, ClientType } from "@/types/client";

export function useClientFilters(clients: Client[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<ClientType | "all">("all");
  const [selectedSecteur, setSelectedSecteur] = useState("all");
  const [showArchived, setShowArchived] = useState(false);

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
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
  }, [clients, searchTerm, selectedType, selectedSecteur, showArchived]);

  return {
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    selectedSecteur,
    setSelectedSecteur,
    showArchived,
    setShowArchived,
    filteredClients
  };
}
