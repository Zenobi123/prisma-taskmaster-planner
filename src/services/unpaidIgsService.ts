import { supabase } from "@/integrations/supabase/client";
import { Client, ClientType, FormeJuridique, Sexe, EtatCivil } from "@/types/client";
import { ClientFiscalData } from "@/hooks/fiscal/types";

// Cache pour les données IGS
let igsCache: {
  data: Client[] | null;
  timestamp: number;
} = {
  data: null,
  timestamp: 0
};

// Durée du cache en millisecondes (10 minutes)
const CACHE_DURATION = 600000; // Augmenté de 2min à 10min pour équilibrer réactivité et performances

// Ajouter une fonction d'invalidation de cache global
if (typeof window !== 'undefined') {
  // Initialiser le cache global si nécessaire
  if (!window.__igsCache) {
    window.__igsCache = { data: null, timestamp: 0 };
  }
  
  // S'assurer que la fonction d'invalidation existe
  window.__invalidateFiscalCaches = window.__invalidateFiscalCaches || function() {
    console.log("Invalidation des caches IGS et Patente");
    // Réinitialiser les timestamps du cache
    igsCache.timestamp = 0;
    window.__igsCache.timestamp = 0;
    window.__igsCache.data = null;
    
    // Invalider également le cache patente s'il existe
    if (window.__patenteCacheTimestamp !== undefined) {
      window.__patenteCacheTimestamp = 0;
    }
  };
  
  // Synchroniser notre cache local avec le cache global
  Object.defineProperty(igsCache, 'timestamp', {
    get: function() { return window.__igsCache?.timestamp || 0; },
    set: function(value) { 
      if (window.__igsCache) {
        window.__igsCache.timestamp = value;
      }
    }
  });
  
  Object.defineProperty(igsCache, 'data', {
    get: function() { return window.__igsCache?.data || null; },
    set: function(value) {
      if (window.__igsCache) {
        window.__igsCache.data = value;
      }
    }
  });
}

// Version compatible avec React Query (pas de paramètre)
export const getClientsWithUnpaidIGS = async () => {
  return fetchClientsWithUnpaidIGS();
};

// Fonction interne qui peut accepter le forceRefresh
const fetchClientsWithUnpaidIGS = async (forceRefresh = false): Promise<Client[]> => {
  const now = Date.now();
  
  // Retourner les données en cache si valides et pas de forçage de rafraîchissement
  if (!forceRefresh && igsCache.data && now - igsCache.timestamp < CACHE_DURATION) {
    console.log("Utilisation des données IGS en cache");
    return igsCache.data;
  }
  
  console.log("Service: Récupération des clients avec IGS impayés...");
  
  try {
    const { data: allClients, error } = await supabase
      .from("clients")
      .select("*");
    
    if (error) {
      console.error("Erreur lors de la récupération des clients:", error);
      throw error;
    }

    const clientsWithUnpaidIGS = allClients.filter(client => {
      if (client.fiscal_data && typeof client.fiscal_data === 'object') {
        const fiscalData = client.fiscal_data as unknown as ClientFiscalData;
        
        if (fiscalData.hiddenFromDashboard === true) {
          return false;
        }
        
        if (fiscalData.obligations?.igs) {
          return fiscalData.obligations.igs.assujetti === true && 
                fiscalData.obligations.igs.paye === false;
        }
      }
      return false;
    });
    
    // Convertir au type client avec le bon casting de type
    const typedClients = clientsWithUnpaidIGS.map(client => {
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

    // Mettre à jour le cache avec horodatage
    igsCache = {
      data: typedClients,
      timestamp: now
    };
    
    return typedClients;
  } catch (error) {
    console.error("Erreur critique lors de la récupération des clients IGS:", error);
    // En cas d'erreur, essayer de retourner le cache même expiré
    if (igsCache.data) {
      console.log("Utilisation du cache expiré en cas d'erreur");
      return igsCache.data;
    }
    return [];
  }
};

// Fonction d'invalidation manuelle du cache
export const invalidateIgsCache = () => {
  if (typeof window !== 'undefined') {
    igsCache.timestamp = 0;
    igsCache.data = null;
    console.log("Cache IGS invalidé manuellement");
  }
};
