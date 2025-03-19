
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getClientsAvecFactures } from "@/services/clientFacturationService";

export const useSituationClients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("montantTotal");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Requête pour récupérer les clients avec leurs factures
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clientsAvecFactures"],
    queryFn: getClientsAvecFactures,
  });

  // Filtrer les clients en fonction du terme de recherche
  const filteredClients = Array.isArray(clients) ? clients.filter((client) =>
    client.nom.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  // Trier les clients
  const sortedClients = [...filteredClients].sort((a, b) => {
    const factor = sortDirection === "asc" ? 1 : -1;
    
    if (sortColumn === "nom") {
      return factor * a.nom.localeCompare(b.nom);
    } else {
      const aValue = a[sortColumn] || 0;
      const bValue = b[sortColumn] || 0;
      return factor * (aValue - bValue);
    }
  });

  // Gérer le changement de colonne de tri
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  // Formater le montant
  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR').format(montant) + " XAF";
  };

  // Calculer les totaux globaux
  const montantTotalGlobal = sortedClients.reduce((sum, client) => sum + client.montantTotal, 0);
  const montantPayeGlobal = sortedClients.reduce((sum, client) => sum + client.montantPaye, 0);
  const montantDuGlobal = sortedClients.reduce((sum, client) => sum + client.montantDu, 0);
  const pourcentagePayeGlobal = montantTotalGlobal > 0 
    ? (montantPayeGlobal / montantTotalGlobal) * 100 
    : 0;

  // Préparer les données pour le graphique
  const statusItems = [
    { name: "Payées", value: montantPayeGlobal, total: montantTotalGlobal, color: "#16a34a" },
    { name: "En attente", value: montantDuGlobal, total: montantTotalGlobal, color: "#f59e0b" }
  ];

  const chartData = statusItems.filter(item => item.value > 0);

  const totalClients = sortedClients.length;

  return {
    clients: sortedClients,
    isLoading,
    searchTerm,
    setSearchTerm,
    sortColumn,
    sortDirection,
    handleSort,
    filteredClients: sortedClients,
    formatMontant,
    montantTotalGlobal,
    montantPayeGlobal,
    montantDuGlobal,
    pourcentagePayeGlobal,
    statusItems,
    chartData,
    totalClients,
  };
};
