
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

// Tableau vide pour les données clients
export const clientsData = [];

export const calculateTotals = (clients: any[]) => {
  const totalEncours = clients.reduce((total, client) => total + (client.encours || 0), 0);
  const totalSolde = clients.reduce((total, client) => total + (client.solde || 0), 0);
  const tauxRecouvrement = totalEncours > 0 ? ((totalEncours - totalSolde) / totalEncours) * 100 : 0;
  
  return { totalEncours, totalSolde, tauxRecouvrement };
};
