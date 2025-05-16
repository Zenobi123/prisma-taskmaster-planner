
import { supabase } from "@/integrations/supabase/client";
import { Client, ClientType, FormeJuridique, Sexe, EtatCivil, SituationImmobiliere } from "@/types/client";
import { ClientFiscalData, DeclarationObligationStatus } from "@/hooks/fiscal/types";

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

// Ajouter une fonction d'invalidation de cache global
if (typeof window !== 'undefined') {
  window.__invalidateFiscalCaches = window.__invalidateFiscalCaches || function() {
    console.log("Invalidation des caches DSF");
    dsfCache.timestamp = 0;
    dsfCache.data = null;
  };
}

// Version compatible avec React Query (pas de paramètre)
export const getClientsWithUnfiledDsf = async () => {
  return fetchClientsWithUnfiledDsf();
};

// Fonction interne qui peut accepter le forceRefresh
const fetchClientsWithUnfiledDsf = async (forceRefresh = false): Promise<Client[]> => {
  const now = Date.now();

  // Retourner les données en cache si valides et pas de forçage de rafraîchissement
  if (!forceRefresh && dsfCache.data && now - dsfCache.timestamp < CACHE_DURATION) {
    console.log("Utilisation des données DSF en cache");
    return dsfCache.data;
  }

  console.log("Service: Récupération des clients avec DSF non déposées...");

  try {
    const { data: allClients, error } = await supabase
      .from("clients")
      .select("*");

    if (error) {
      console.error("Erreur lors de la récupération des clients:", error);
      throw error;
    }

    const clientsWithUnfiledDsf = allClients.filter(client => {
      if (client.fiscal_data && typeof client.fiscal_data === 'object') {
        const fiscalData = client.fiscal_data as unknown as ClientFiscalData;

        if (fiscalData.hiddenFromDashboard === true) {
          return false;
        }

        const currentYear = new Date().getFullYear().toString();
        const yearToCheck = fiscalData.selectedYear || currentYear;

        if (fiscalData.obligations && fiscalData.obligations[yearToCheck] && 
            fiscalData.obligations[yearToCheck].dsf) {
          const dsfStatus = fiscalData.obligations[yearToCheck].dsf as DeclarationObligationStatus;
          return dsfStatus.assujetti === true && dsfStatus.depose === false;
        }
      }
      return false;
    });

    // Convertir au type client avec le bon casting de type
    const typedClients = clientsWithUnfiledDsf.map(client => {
      // S'assurer que la propriété situationimmobiliere est correctement traitée
      let situationimmobiliere: Client['situationimmobiliere'] = { type: 'locataire' };
      
      if (client.situationimmobiliere && typeof client.situationimmobiliere === 'object') {
        const si = client.situationimmobiliere as any;
        situationimmobiliere = {
          type: (si.type as SituationImmobiliere) || 'locataire',
          valeur: typeof si.valeur === 'number' ? si.valeur : undefined,
          loyer: typeof si.loyer === 'number' ? si.loyer : undefined
        };
      }

      // Utiliser type assertion pour éviter les erreurs de TypeScript
      return {
        ...client,
        type: client.type as ClientType,
        formejuridique: (client.formejuridique || 'autre') as FormeJuridique,
        sexe: client.sexe as Sexe,
        etatcivil: client.etatcivil as EtatCivil,
        adresse: client.adresse as Client['adresse'],
        contact: client.contact as Client['contact'],
        interactions: (client.interactions || []) as unknown as Client['interactions'],
        fiscal_data: client.fiscal_data,
        statut: client.statut as Client['statut'],
        situationimmobiliere
      } as Client;
    });

    // Mettre à jour le cache avec nouvel horodatage
    dsfCache = {
      data: typedClients,
      timestamp: now
    };

    return typedClients;
  } catch (error) {
    console.error("Erreur critique lors de la récupération des clients DSF:", error);
    // En cas d'erreur, essayer de retourner le cache même expiré
    if (dsfCache.data) {
      console.log("Utilisation du cache expiré en cas d'erreur");
      return dsfCache.data;
    }
    return [];
  }
};

// Fonction d'invalidation manuelle du cache
export const invalidateDsfCache = () => {
  if (typeof window !== 'undefined') {
    dsfCache.timestamp = 0;
    dsfCache.data = null;
    console.log("Cache DSF invalidé manuellement");
  }
};
