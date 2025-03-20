
import { useState } from "react";
import { Paiement } from "@/types/paiement";

// Données d'exemple pour les paiements
const paiementsExemple: Paiement[] = [
  { 
    id: "P-2023-001", 
    facture: "F-2023-001",
    client: "Société ABC", 
    date: "20/05/2023", 
    montant: 450000, 
    mode: "virement" 
  },
  { 
    id: "P-2023-002", 
    facture: "F-2023-003",
    client: "Cabinet DEF", 
    date: "10/06/2023", 
    montant: 150000, 
    mode: "espèces" 
  },
  { 
    id: "P-2023-003", 
    facture: "F-2023-002",
    client: "Entreprise XYZ", 
    date: "15/06/2023", 
    montant: 175000, 
    mode: "chèque" 
  },
];

export const usePaiements = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredPaiements = paiementsExemple.filter(paiement => 
    paiement.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paiement.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paiement.facture.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    searchTerm,
    setSearchTerm,
    filteredPaiements
  };
};
