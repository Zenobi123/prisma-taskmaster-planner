
import { useState } from "react";
import { Facture } from "@/types/facture";
import { generatePDF } from "@/utils/pdfUtils";

// Données d'exemple pour les factures
const facturesExemple: Facture[] = [
  { 
    id: "F-2023-001", 
    client_id: "client1",
    client: {
      id: "client1",
      nom: "Société ABC",
      adresse: "123 Rue Principale, Douala",
      telephone: "694123456",
      email: "contact@societeabc.com"
    }, 
    date: "15/05/2023",
    echeance: "15/06/2023", 
    montant: 450000, 
    montant_paye: 450000,
    status: "payée",
    prestations: [
      { description: "Prestation 1", quantite: 1, montant: 250000 },
      { description: "Prestation 2", quantite: 2, montant: 100000 }
    ]
  },
  { 
    id: "F-2023-002", 
    client_id: "client2",
    client: {
      id: "client2",
      nom: "Entreprise XYZ",
      adresse: "456 Avenue Centrale, Yaoundé",
      telephone: "677654321",
      email: "info@xyz.com"
    }, 
    date: "22/05/2023",
    echeance: "22/06/2023", 
    montant: 175000,
    montant_paye: 0, 
    status: "en_attente",
    prestations: [
      { description: "Consultation", quantite: 1, montant: 175000 }
    ]
  },
  { 
    id: "F-2023-003", 
    client_id: "client3",
    client: {
      id: "client3",
      nom: "Cabinet DEF",
      adresse: "789 Boulevard Ouest, Bafoussam",
      telephone: "698765432",
      email: "cabinet@def.com"
    }, 
    date: "01/06/2023",
    echeance: "01/07/2023", 
    montant: 325000,
    montant_paye: 150000, 
    status: "partiellement_payée",
    prestations: [
      { description: "Audit comptable", quantite: 1, montant: 325000 }
    ]
  },
  { 
    id: "F-2023-004", 
    client_id: "client4",
    client: {
      id: "client4",
      nom: "M. Dupont",
      adresse: "101 Rue des Jardins, Limbé",
      telephone: "651234567",
      email: "dupont@mail.com"
    }, 
    date: "12/06/2023",
    echeance: "12/07/2023", 
    montant: 85000,
    montant_paye: 0, 
    status: "envoyée",
    prestations: [
      { description: "Conseil fiscal", quantite: 1, montant: 85000 }
    ]
  },
];

export const useFactures = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredFactures = facturesExemple.filter(facture => 
    facture.client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facture.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVoirFacture = (facture: Facture) => {
    generatePDF(facture);
  };

  const handleTelechargerFacture = (facture: Facture) => {
    generatePDF(facture, true);
  };

  return {
    searchTerm,
    setSearchTerm,
    filteredFactures,
    handleVoirFacture,
    handleTelechargerFacture
  };
};
