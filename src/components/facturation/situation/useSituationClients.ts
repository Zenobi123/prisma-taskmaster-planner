
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getClientStats } from "@/services/clientStatsService";
import { Facture } from "@/types/facture";

export function useSituationClients() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Récupérer les statistiques des clients
  const { data: clientsStats = [], isLoading } = useQuery({
    queryKey: ["clients-stats"],
    queryFn: getClientStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Filtrer les clients en fonction du terme de recherche
  const filteredClients = clientsStats.filter(client => 
    client.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Déterminer le statut de chaque client
  const clientsWithStatus = filteredClients.map(client => {
    let status: Facture["status"] = "en_attente";
    
    if (client.montantDu === 0 && client.montantTotal > 0) {
      status = "payée";
    } else if (client.montantDu > 0 && client.montantPaye > 0) {
      status = "partiellement_payée";
    } else if (client.montantDu > 0 && client.montantPaye === 0) {
      status = "en_attente";
    }
    
    return {
      ...client,
      status
    };
  });
  
  // Calculer les statistiques globales
  const montantTotalGlobal = filteredClients.reduce((sum, client) => sum + client.montantTotal, 0);
  const montantPayeGlobal = filteredClients.reduce((sum, client) => sum + client.montantPaye, 0);
  const montantDuGlobal = filteredClients.reduce((sum, client) => sum + client.montantDu, 0);
  const pourcentagePayeGlobal = montantTotalGlobal > 0 
    ? (montantPayeGlobal / montantTotalGlobal) * 100 
    : 0;
  
  // Statistiques par statut
  const countByStatus = {
    payée: clientsWithStatus.filter(c => c.status === "payée").length,
    partiellement_payée: clientsWithStatus.filter(c => c.status === "partiellement_payée").length,
    en_attente: clientsWithStatus.filter(c => c.status === "en_attente").length
  };
  
  const totalClients = clientsWithStatus.length;
  const statusItems = [
    { 
      label: "Payées", 
      count: countByStatus.payée, 
      color: "bg-green-500" 
    },
    { 
      label: "Partiellement payées", 
      count: countByStatus.partiellement_payée, 
      color: "bg-amber-500" 
    },
    { 
      label: "En attente", 
      count: countByStatus.en_attente, 
      color: "bg-gray-300" 
    }
  ];
  
  // Données pour le graphique
  const chartData = [
    { name: "Payé", value: montantPayeGlobal },
    { name: "Dû", value: montantDuGlobal }
  ];
  
  return {
    clients: clientsWithStatus,
    isLoading,
    searchTerm,
    setSearchTerm,
    montantTotalGlobal,
    montantPayeGlobal,
    montantDuGlobal,
    pourcentagePayeGlobal,
    statusItems,
    chartData,
    totalClients
  };
}
