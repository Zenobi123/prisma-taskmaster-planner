
import { useState } from "react";
import { Client, ClientType, ClientStatus } from "@/types/client";

export function useClientsPageState() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<ClientType | "all">("all");
  const [selectedSecteur, setSelectedSecteur] = useState("all");
  const [showArchived, setShowArchived] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [newClientType, setNewClientType] = useState<ClientType>("physique");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [createdAfterDate, setCreatedAfterDate] = useState<Date | null>(null);
  const [createdBeforeDate, setCreatedBeforeDate] = useState<Date | null>(null);
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);

  return {
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    selectedSecteur,
    setSelectedSecteur,
    showArchived,
    setShowArchived,
    isDialogOpen,
    setIsDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isViewDialogOpen,
    setIsViewDialogOpen,
    newClientType,
    setNewClientType,
    selectedClient,
    setSelectedClient,
    createdAfterDate,
    setCreatedAfterDate,
    createdBeforeDate, 
    setCreatedBeforeDate,
    isAdvancedFiltersOpen,
    setIsAdvancedFiltersOpen
  };
}
