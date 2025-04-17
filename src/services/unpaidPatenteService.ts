
import { supabase } from "@/integrations/supabase/client";
import { Client, ClientType, FormeJuridique, Sexe, EtatCivil } from "@/types/client";
import { ClientFiscalData } from "@/hooks/fiscal/types";

// Cache pour les données Patente
let patenteCache: {
  data: Client[] | null;
  timestamp: number;
} = {
  data: null,
  timestamp: 0
};

// Durée du cache en millisecondes (augmenté à 2 minutes)
const CACHE_DURATION = 120000; // Augmenté de 30s à 2min pour réduire les rechargements fréquents

// Ajouter une référence globale au timestamp du cache patente pour invalidation
if (typeof window !== 'undefined') {
  window.__patenteCacheTimestamp = window.__patenteCacheTimestamp || 0;
  // Mettre à jour la référence chaque fois que le cache est mis à jour
  Object.defineProperty(patenteCache, 'timestamp', {
    get: function() { return window.__patenteCacheTimestamp || 0; },
    set: function(value) { window.__patenteCacheTimestamp = value; }
  });
  
  // S'assurer que la fonction d'invalidation existe
  window.__invalidateFiscalCaches = window.__invalidateFiscalCaches || function() {
    console.log("Invalidation des caches IGS et Patente");
    // Réinitialiser les timestamps du cache
    window.__patenteCacheTimestamp = 0;
    
    // Invalider également le cache IGS s'il existe
    if (window.__igsCache) {
      window.__igsCache.timestamp = 0;
      window.__igsCache.data = null;
    }
  };
}

export const getClientsWithUnpaidPatente = async (): Promise<Client[]> => {
  const now = Date.now();
  
  // Retourner les données en cache si valides
  if (patenteCache.data && now - patenteCache.timestamp < CACHE_DURATION) {
    console.log("Utilisation des données Patente en cache");
    return patenteCache.data;
  }
  
  console.log("Service: Récupération des clients avec patentes impayées...");
  
  const { data: allClients, error } = await supabase
    .from("clients")
    .select("*");
  
  if (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    throw error;
  }

  const clientsWithUnpaidPatente = allClients.filter(client => {
    if (client.fiscal_data && typeof client.fiscal_data === 'object') {
      const fiscalData = client.fiscal_data as unknown as ClientFiscalData;
      
      if (fiscalData.hiddenFromDashboard === true) {
        return false;
      }
      
      if (fiscalData.obligations?.patente) {
        return fiscalData.obligations.patente.assujetti === true && 
               fiscalData.obligations.patente.paye === false;
      }
    }
    return false;
  });
  
  // Convertir au type client avec le bon casting de type
  const typedClients = clientsWithUnpaidPatente.map(client => {
    return {
      ...client,
      type: client.type as ClientType,
      formejuridique: (client.formejuridique || 'autre') as FormeJuridique,
      sexe: client.sexe as Sexe,
      etatcivil: client.etatcivil as EtatCivil,
      adresse: client.adresse as Client['adresse'],
      contact: client.contact as Client['contact'],
      interactions: client.interactions as unknown as Client['interactions'],
      fiscal_data: client.fiscal_data as unknown as Client['fiscal_data'],
      statut: client.statut as Client['statut']
    } as Client;
  });

  // Mettre à jour le cache
  patenteCache = {
    data: typedClients,
    timestamp: now
  };
  
  return typedClients;
};
