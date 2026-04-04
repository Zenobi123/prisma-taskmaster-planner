
import { useState } from "react";
import { Client, ClientType, RegimeFiscal } from "@/types/client";

export function useClientFilters(clients: Client[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<ClientType | "all">("all");
  const [selectedSecteur, setSelectedSecteur] = useState("all");
  const [selectedRegimeFiscal, setSelectedRegimeFiscal] = useState<RegimeFiscal | "all">("all");
  const [selectedCDI, setSelectedCDI] = useState("all");
  const [showArchived, setShowArchived] = useState(false);

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      (client.type === "physique"
        ? client.nom?.toLowerCase()
        : client.raisonsociale?.toLowerCase()
      )?.includes(searchTerm.toLowerCase()) ||
      client.niu.includes(searchTerm) ||
      client.contact.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === "all" || client.type === selectedType;

    const matchesStatut =
      selectedSecteur === "all" || client.statut === selectedSecteur;

    const matchesRegimeFiscal =
      selectedRegimeFiscal === "all" || client.regimefiscal === selectedRegimeFiscal;

    const matchesCDI =
      selectedCDI === "all" || client.centrerattachement === selectedCDI;

    const matchesArchiveStatus = showArchived || client.statut !== "archive";

    return matchesSearch && matchesType && matchesStatut && matchesRegimeFiscal && matchesCDI && matchesArchiveStatus;
  });

  return {
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    selectedSecteur,
    setSelectedSecteur,
    selectedRegimeFiscal,
    setSelectedRegimeFiscal,
    selectedCDI,
    setSelectedCDI,
    showArchived,
    setShowArchived,
    filteredClients,
  };
}
