
import React from 'react';

export const getStatutClient = (statut: string) => {
  switch (statut) {
    case "à jour":
      return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">À jour</span>;
    case "en_retard":
      return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">En retard</span>;
    case "impayé":
      return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Impayé</span>;
    default:
      return null;
  }
};

export const formatMontant = (montant: number): string => {
  return `${montant.toLocaleString()} F CFA`;
};

export const clientsData = [
  { id: "client-001", nom: "SARL TechPro", encours: 2500000, solde: 0, statut: "à jour", retard: 0 },
  { id: "client-002", nom: "SAS WebDev", encours: 3800000, solde: 1800000, statut: "en_retard", retard: 15 },
  { id: "client-003", nom: "EURL ConseilPlus", encours: 3200000, solde: 3200000, statut: "impayé", retard: 30 },
  { id: "client-004", nom: "SA Construct", encours: 1500000, solde: 500000, statut: "en_retard", retard: 5 },
  { id: "client-005", nom: "SARL MédiaGroup", encours: 4200000, solde: 0, statut: "à jour", retard: 0 },
];

export const calculateTotals = (clients: any[]) => {
  const totalEncours = clients.reduce((total, client) => total + client.encours, 0);
  const totalSolde = clients.reduce((total, client) => total + client.solde, 0);
  const tauxRecouvrement = ((totalEncours - totalSolde) / totalEncours) * 100;
  
  return { totalEncours, totalSolde, tauxRecouvrement };
};
