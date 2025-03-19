
import React from 'react';
import { Facture } from "@/types/facture";

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

// Fonction pour générer des clients depuis les factures
export const getClientsFromFactures = (factures: Facture[]) => {
  // Map pour stocker les clients uniques par ID
  const clientsMap = new Map();
  
  // Parcourir toutes les factures pour extraire les informations des clients
  factures.forEach(facture => {
    const client = facture.client;
    
    if (!clientsMap.has(client.id)) {
      // Initialiser un nouveau client
      clientsMap.set(client.id, {
        id: client.id,
        nom: client.nom,
        encours: 0,
        solde: 0,
        statut: "à jour",
        retard: 0
      });
    }
    
    // Référence au client dans la map
    const clientData = clientsMap.get(client.id);
    
    // Ajouter le montant de la facture au total encours
    clientData.encours += facture.montant;
    
    // Calculer le solde (montant non payé)
    const montantPaye = facture.montantPaye || 0;
    const soldeFacture = facture.montant - montantPaye;
    clientData.solde += soldeFacture;
    
    // Déterminer le statut et le retard
    const aujourd'hui = new Date();
    const dateEcheance = new Date(facture.echeance);
    
    if (soldeFacture > 0) {
      if (dateEcheance < aujourd'hui) {
        // Si la date d'échéance est passée et qu'il reste un solde, le client est en retard
        clientData.statut = "en_retard";
        
        // Calculer le retard en jours
        const differenceEnJours = Math.floor((aujourd'hui.getTime() - dateEcheance.getTime()) / (1000 * 3600 * 24));
        clientData.retard = Math.max(clientData.retard, differenceEnJours);
        
        // Si le retard est supérieur à 30 jours, le client est considéré comme ayant des impayés
        if (differenceEnJours > 30) {
          clientData.statut = "impayé";
        }
      }
    }
  });
  
  // Convertir la map en array pour le retour
  return Array.from(clientsMap.values());
};

export const calculateTotals = (clients: any[]) => {
  const totalEncours = clients.reduce((total, client) => total + (client.encours || 0), 0);
  const totalSolde = clients.reduce((total, client) => total + (client.solde || 0), 0);
  const tauxRecouvrement = totalEncours > 0 ? ((totalEncours - totalSolde) / totalEncours) * 100 : 0;
  
  return { totalEncours, totalSolde, tauxRecouvrement };
};
