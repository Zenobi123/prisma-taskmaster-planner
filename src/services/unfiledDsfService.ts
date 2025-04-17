
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";
import { ClientFiscalData } from "@/hooks/fiscal/types";

// Cache pour les données DSF
let dsfCache: {
  data: Client[] | null;
  timestamp: number;
} = {
  data: null,
  timestamp: 0
};

// Durée du cache en millisecondes (10 minutes)
const CACHE_DURATION = 600000;

// Initialiser le cache global si on est côté client
if (typeof window !== 'undefined') {
  window.__dsfCacheTimestamp = window.__dsfCacheTimestamp || 0;
  window.__dsfCacheData = window.__dsfCacheData || null;
  
  // Synchroniser notre cache local avec le cache global
  Object.defineProperty(dsfCache, 'timestamp', {
    get: function() { return window.__dsfCacheTimestamp || 0; },
    set: function(value) { window.__dsfCacheTimestamp = value; }
  });
  
  Object.defineProperty(dsfCache, 'data', {
    get: function() { return window.__dsfCacheData || null; },
    set: function(value) { window.__dsfCacheData = value; }
  });
}

// Fonction adaptée pour React Query (sans paramètre)
export const getClientsWithUnfiledDsf = async () => {
  return fetchClientsWithUnfiledDsf();
};

// Fonction interne avec paramètre forceRefresh
const fetchClientsWithUnfiledDsf = async (forceRefresh = false): Promise<Client[]> => {
  const now = Date.now();
  
  // Utiliser le cache si valide et pas de forçage
  if (!forceRefresh && dsfCache.data && now - dsfCache.timestamp < CACHE_DURATION) {
    console.log("Utilisation des données DSF en cache");
    return dsfCache.data;
  }
  
  console.log("Service: Récupération des clients avec DSF non déposées...");
  
  // Récupérer tous les clients
  const { data: allClients, error } = await supabase
    .from("clients")
    .select("*");
  
  if (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    throw error;
  }

  console.log("Service: Nombre total de clients récupérés:", allClients.length);
  
  // Filtrer les clients avec DSF non déposée
  const clientsWithUnfiledDsf = allClients.filter(client => {
    // On vérifie si le client a des données fiscales
    if (client.fiscal_data && 
        typeof client.fiscal_data === 'object' && 
        client.fiscal_data !== null) {
      
      // Cast fiscal_data to the correct type
      const fiscalData = client.fiscal_data as unknown as ClientFiscalData;
      
      // Ne pas inclure si explicitement marqué comme caché du tableau de bord
      if (fiscalData.hiddenFromDashboard === true) {
        return false;
      }
      
      // Vérifier si obligations existe dans les données fiscales
      if (fiscalData.obligations) {
        // Vérifier que dsf existe dans les obligations
        if (!fiscalData.obligations.dsf) {
          return false;
        }
        
        // On cherche une obligation de type dsf qui est assujetti mais non déposée
        return fiscalData.obligations.dsf.assujetti === true && 
              fiscalData.obligations.dsf.depose === false;
      }
    }
    return false;
  });
  
  console.log("Service: Clients avec DSF non déposées:", clientsWithUnfiledDsf.length);
  
  // Convertir les données au format Client[]
  const typedClients = clientsWithUnfiledDsf.map(client => ({
    ...client,
    adresse: client.adresse as Client['adresse'],
    contact: client.contact as Client['contact'],
    interactions: client.interactions as unknown as Client['interactions'],
    fiscal_data: client.fiscal_data as unknown as Client['fiscal_data'],
  })) as Client[];
  
  // Mettre à jour le cache
  dsfCache = {
    data: typedClients,
    timestamp: now
  };
  
  return typedClients;
};

// Fonction d'invalidation du cache
export const invalidateDsfCache = () => {
  if (typeof window !== 'undefined') {
    window.__dsfCacheTimestamp = 0;
    window.__dsfCacheData = null;
    console.log("Cache DSF invalidé manuellement");
  }
};
