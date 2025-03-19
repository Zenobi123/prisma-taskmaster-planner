
import { useState } from "react";

// Données d'exemple pour la situation des clients
const clientsExemple = [
  { 
    id: "C001", 
    nom: "Société ABC", 
    facturesMontant: 750000, 
    paiementsMontant: 450000, 
    solde: 300000,
    status: "partiel"
  },
  { 
    id: "C002", 
    nom: "Entreprise XYZ", 
    facturesMontant: 175000, 
    paiementsMontant: 175000, 
    solde: 0,
    status: "àjour"
  },
  { 
    id: "C003", 
    nom: "Cabinet DEF", 
    facturesMontant: 325000, 
    paiementsMontant: 150000, 
    solde: 175000,
    status: "partiel"
  },
  { 
    id: "C004", 
    nom: "M. Dupont", 
    facturesMontant: 85000, 
    paiementsMontant: 0, 
    solde: 85000,
    status: "retard"
  },
];

// Données pour le graphique
const chartData = [
  {
    name: "À jour",
    total: 1,
  },
  {
    name: "Partiellement payé",
    total: 2,
  },
  {
    name: "En retard",
    total: 1,
  },
];

export const useSituationClients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("nom");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
  
  const filteredClients = clientsExemple
    .filter(client => 
      client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortColumn as keyof typeof a];
      const bValue = b[sortColumn as keyof typeof b];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });

  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR').format(montant) + " XAF";
  };

  const statusItems = [
    { label: "À jour", count: 1, color: "bg-green-500" },
    { label: "Partiellement payé", count: 2, color: "bg-amber-500" },
    { label: "En retard", count: 1, color: "bg-red-500" }
  ];

  return {
    searchTerm,
    setSearchTerm,
    sortColumn,
    sortDirection,
    handleSort,
    filteredClients,
    formatMontant,
    chartData,
    statusItems
  };
};
