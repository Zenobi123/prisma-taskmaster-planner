
import { supabase } from "@/integrations/supabase/client";
import { validateAndMigrateObligationStatuses } from "@/hooks/fiscal/services/validationService";
import { ObligationStatuses } from "@/hooks/fiscal/types";

// Cache pour éviter les migrations répétées
const migrationCache = new Map<string, { data: ObligationStatuses; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Interface pour les erreurs de traitement
interface ProcessingError {
  clientId: string;
  error: string;
  context: string;
}

/**
 * Vérifie si les données du cache sont encore valides
 */
const isCacheValid = (timestamp: number): boolean => {
  return Date.now() - timestamp < CACHE_DURATION;
};

/**
 * Gère la migration progressive avec cache
 */
const getMigratedObligations = (
  clientId: string, 
  yearObligations: any, 
  errors: ProcessingError[]
): ObligationStatuses | null => {
  try {
    // Vérifier le cache d'abord
    const cacheKey = `${clientId}-obligations`;
    const cachedData = migrationCache.get(cacheKey);
    
    if (cachedData && isCacheValid(cachedData.timestamp)) {
      console.log(`Cache hit pour client ${clientId}`);
      return cachedData.data;
    }

    // Migration des données
    const migratedObligations = validateAndMigrateObligationStatuses(yearObligations);
    
    // Mettre en cache le résultat
    migrationCache.set(cacheKey, {
      data: migratedObligations,
      timestamp: Date.now()
    });

    console.log(`Migration et mise en cache réussies pour client ${clientId}`);
    return migratedObligations;
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    errors.push({
      clientId,
      error: errorMessage,
      context: 'Migration des obligations'
    });
    console.error(`Erreur lors de la migration pour client ${clientId}:`, errorMessage);
    return null;
  }
};

/**
 * Vérifie de manière sécurisée si une obligation est impayée
 */
const isUnpaidTaxObligation = (obligation: any): boolean => {
  try {
    return Boolean(
      obligation &&
      typeof obligation === 'object' &&
      'payee' in obligation &&
      'assujetti' in obligation &&
      obligation.assujetti === true &&
      obligation.payee === false
    );
  } catch {
    return false;
  }
};

/**
 * Vérifie de manière sécurisée si une déclaration n'est pas déposée
 */
const isUnfiledDeclaration = (obligation: any): boolean => {
  try {
    return Boolean(
      obligation &&
      typeof obligation === 'object' &&
      'depose' in obligation &&
      'assujetti' in obligation &&
      obligation.assujetti === true &&
      obligation.depose === false
    );
  } catch {
    return false;
  }
};

/**
 * Traite un client de manière sécurisée avec gestion améliorée des types
 */
const processClient = (
  client: any,
  currentYear: string,
  errors: ProcessingError[]
): {
  hasUnpaidPatente: boolean;
  hasUnpaidIgs: boolean;
  hasUnfiledDsf: boolean;
  hasUnfiledDarp: boolean;
} => {
  const result = {
    hasUnpaidPatente: false,
    hasUnpaidIgs: false,
    hasUnfiledDsf: false,
    hasUnfiledDarp: false
  };

  try {
    // Vérifications de base avec type guards
    if (!client?.fiscal_data || typeof client.fiscal_data !== 'object') {
      console.log(`Client ${client.id}: Pas de données fiscales`);
      return result;
    }

    const fiscalData = client.fiscal_data;
    
    // Vérification sécurisée de la structure des obligations
    if (!fiscalData.obligations || typeof fiscalData.obligations !== 'object' || fiscalData.obligations === null) {
      console.log(`Client ${client.id}: Pas d'obligations dans fiscal_data`);
      return result;
    }

    // Accès sécurisé aux obligations de l'année avec type guard
    const obligations = fiscalData.obligations;
    if (typeof obligations !== 'object' || obligations === null || Array.isArray(obligations)) {
      console.log(`Client ${client.id}: Structure d'obligations invalide`);
      return result;
    }

    const yearObligations = (obligations as Record<string, any>)[currentYear];
    if (!yearObligations) {
      console.log(`Client ${client.id}: Pas d'obligations pour l'année ${currentYear}`);
      return result;
    }

    // Migration progressive avec cache
    const validatedObligations = getMigratedObligations(client.id, yearObligations, errors);
    if (!validatedObligations) {
      return result;
    }

    // Vérifications sécurisées des obligations
    result.hasUnpaidPatente = isUnpaidTaxObligation(validatedObligations.patente);
    result.hasUnpaidIgs = isUnpaidTaxObligation(validatedObligations.igs);
    result.hasUnfiledDsf = isUnfiledDeclaration(validatedObligations.dsf);
    result.hasUnfiledDarp = isUnfiledDeclaration(validatedObligations.darp);

    // Logs de débogage pour les cas positifs
    if (result.hasUnpaidPatente) console.log(`Client ${client.id}: Patente impayée détectée`);
    if (result.hasUnpaidIgs) console.log(`Client ${client.id}: IGS impayé détecté`);
    if (result.hasUnfiledDsf) console.log(`Client ${client.id}: DSF non déposée détectée`);
    if (result.hasUnfiledDarp) console.log(`Client ${client.id}: DARP non déposée détectée`);

    return result;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    errors.push({
      clientId: client.id,
      error: errorMessage,
      context: 'Traitement du client'
    });
    console.error(`Erreur lors du traitement du client ${client.id}:`, errorMessage);
    return result;
  }
};

/**
 * Nettoie le cache périodiquement
 */
const cleanupCache = (): void => {
  const now = Date.now();
  for (const [key, value] of migrationCache.entries()) {
    if (!isCacheValid(value.timestamp)) {
      migrationCache.delete(key);
    }
  }
  console.log(`Cache nettoyé. Entrées restantes: ${migrationCache.size}`);
};

export const getClientStats = async () => {
  console.log("=== DÉBUT CALCUL STATISTIQUES CLIENTS ===");
  
  const errors: ProcessingError[] = [];
  const currentYear = new Date().getFullYear().toString();
  
  console.log(`Année fiscale courante: ${currentYear}`);

  try {
    // Récupération des clients
    const { data: allClients, error: clientsError } = await supabase
      .from("clients")
      .select("*");
    
    if (clientsError) {
      console.error("Erreur lors de la récupération des clients:", clientsError);
      throw clientsError;
    }

    if (!allClients || !Array.isArray(allClients)) {
      throw new Error("Données clients invalides");
    }

    console.log(`Nombre total de clients récupérés: ${allClients.length}`);

    // Nettoyage périodique du cache
    cleanupCache();

    // Nombre total de clients en gestion
    const managedClients = allClients.filter(client => {
      try {
        return client?.gestionexternalisee === true;
      } catch {
        return false;
      }
    }).length;

    console.log(`Clients en gestion externe: ${managedClients}`);
    
    // Initialisation des compteurs
    let unpaidPatenteClients = 0;
    let unpaidIgsClients = 0;
    let unfiledDsfClients = 0;
    let unfiledDarpClients = 0;

    // Compteurs de débogage
    let clientsWithFiscalData = 0;
    let clientsWithObligationsForCurrentYear = 0;
    let clientsProcessedSuccessfully = 0;

    // Traitement de chaque client
    for (const client of allClients) {
      try {
        if (!client?.fiscal_data) continue;
        
        clientsWithFiscalData++;
        
        // Vérifier la présence d'obligations pour l'année courante
        if (client.fiscal_data?.obligations?.[currentYear]) {
          clientsWithObligationsForCurrentYear++;
        }

        // Traitement sécurisé du client
        const result = processClient(client, currentYear, errors);
        
        // Accumulation des résultats
        if (result.hasUnpaidPatente) unpaidPatenteClients++;
        if (result.hasUnpaidIgs) unpaidIgsClients++;
        if (result.hasUnfiledDsf) unfiledDsfClients++;
        if (result.hasUnfiledDarp) unfiledDarpClients++;
        
        clientsProcessedSuccessfully++;

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        errors.push({
          clientId: client?.id || 'unknown',
          error: errorMessage,
          context: 'Boucle principale de traitement'
        });
        console.error(`Erreur dans la boucle principale pour client ${client?.id}:`, errorMessage);
      }
    }

    // Logs de débogage finaux
    console.log("=== STATISTIQUES DE TRAITEMENT ===");
    console.log(`Clients avec données fiscales: ${clientsWithFiscalData}`);
    console.log(`Clients avec obligations pour ${currentYear}: ${clientsWithObligationsForCurrentYear}`);
    console.log(`Clients traités avec succès: ${clientsProcessedSuccessfully}`);
    console.log(`Erreurs rencontrées: ${errors.length}`);
    console.log(`Entrées en cache: ${migrationCache.size}`);
    
    console.log("=== RÉSULTATS FINAUX ===");
    console.log(`Clients en gestion: ${managedClients}`);
    console.log(`Patentes impayées: ${unpaidPatenteClients}`);
    console.log(`IGS impayés: ${unpaidIgsClients}`);
    console.log(`DSF non déposées: ${unfiledDsfClients}`);
    console.log(`DARP non déposées: ${unfiledDarpClients}`);

    // Log des erreurs si présentes
    if (errors.length > 0) {
      console.warn("=== ERREURS DÉTECTÉES ===");
      errors.forEach(err => {
        console.warn(`Client ${err.clientId} - ${err.context}: ${err.error}`);
      });
    }
    
    return {
      managedClients,
      unpaidPatenteClients,
      unpaidIgsClients,
      unfiledDsfClients,
      unfiledDarpClients
    };

  } catch (error) {
    console.error("Erreur fatale dans getClientStats:", error);
    
    // En cas d'erreur fatale, retourner des valeurs par défaut
    return {
      managedClients: 0,
      unpaidPatenteClients: 0,
      unpaidIgsClients: 0,
      unfiledDsfClients: 0,
      unfiledDarpClients: 0
    };
  }
};

/**
 * Fonction utilitaire pour vider le cache manuellement
 */
export const clearStatsCache = (): void => {
  migrationCache.clear();
  console.log("Cache des statistiques vidé manuellement");
};

/**
 * Fonction utilitaire pour obtenir les métriques du cache
 */
export const getCacheMetrics = () => {
  return {
    size: migrationCache.size,
    entries: Array.from(migrationCache.keys())
  };
};
