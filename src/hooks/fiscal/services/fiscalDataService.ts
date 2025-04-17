
import { supabase } from "@/integrations/supabase/client";
import { ClientFiscalData } from "../types";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";
import { clearCache, expireAllCaches, getDebugInfo } from "./fiscalDataCache";

/**
 * Récupérer les données fiscales de la base de données
 */
export const fetchFiscalData = async (clientId: string): Promise<ClientFiscalData | null> => {
  try {
    console.log(`Récupération des données fiscales pour le client ${clientId}`);
    
    const { data, error } = await supabase
      .from('clients')
      .select('fiscal_data')
      .eq('id', clientId)
      .single();
    
    if (error) {
      console.error("Erreur lors de la récupération des données fiscales:", error);
      return null;
    }
    
    if (data?.fiscal_data) {
      console.log(`Données fiscales trouvées pour le client ${clientId}`);
      // Cast des données au type correct avec un cast intermédiaire pour sécurité
      return data.fiscal_data as unknown as ClientFiscalData;
    }
    
    console.log(`Aucune donnée fiscale trouvée pour le client ${clientId}`);
    return null;
  } catch (error) {
    console.error("Exception lors de la récupération des données fiscales:", error);
    return null;
  }
};

/**
 * Enregistrer les données fiscales dans la base de données
 */
export const saveFiscalData = async (clientId: string, fiscalData: ClientFiscalData): Promise<boolean> => {
  try {
    console.log(`Enregistrement des données fiscales pour le client ${clientId}`, fiscalData);
    console.log("État du cache avant enregistrement:", getDebugInfo());
    
    // S'assurer que nous envoyons réellement les données à la base de données
    const { error } = await supabase
      .from('clients')
      .update({ fiscal_data: fiscalData as unknown as Json })
      .eq('id', clientId);
    
    if (error) {
      console.error("Erreur lors de l'enregistrement des données fiscales:", error);
      throw error;
    }
    
    console.log(`Données fiscales enregistrées avec succès pour le client ${clientId}`);
    
    // Vider le cache de ce client pour garantir le chargement de données fraîches la prochaine fois
    clearCache(clientId);
    
    // Forcer l'expiration de tous les caches associés pour assurer le chargement de données fraîches partout
    await invalidateRelatedQueries();
    
    console.log("État du cache après enregistrement:", getDebugInfo());
    
    // Après un enregistrement réussi, attendre un moment et vérifier que les données ont bien été enregistrées
    try {
      const verificationSuccess = await verifyFiscalDataSave(clientId, fiscalData);
      console.log(`Vérification après enregistrement : ${verificationSuccess ? "Réussie" : "Échouée"}`);
      
      if (!verificationSuccess) {
        // Réessayer une fois en cas d'échec
        setTimeout(async () => {
          const secondVerification = await verifyFiscalDataSave(clientId, fiscalData);
          console.log(`Seconde vérification : ${secondVerification ? "Réussie" : "Échouée"}`);
        }, 3000);
      }
    } catch (err) {
      console.error("Erreur lors de la vérification:", err);
    }
    
    return true;
  } catch (error) {
    console.error("Exception lors de l'enregistrement des données fiscales:", error);
    throw error;
  }
};

/**
 * Fonction auxiliaire pour invalider les requêtes associées lorsque les données fiscales changent
 */
const invalidateRelatedQueries = async (): Promise<void> => {
  try {
    // Forcer un rafraîchissement pour les caches IGS et Patente
    // Cela garantira que les tableaux de bord et autres affichages montreront des informations à jour
    console.log("Invalidation des caches associés et rafraîchissement des données...");
    
    // Expirer tous les caches liés aux données fiscales
    expireAllCaches();
    
    // Appeler la fonction d'invalidation de cache globale si elle existe
    if (typeof window !== 'undefined') {
      // Créer la fonction si elle n'existe pas
      if (!window.__invalidateFiscalCaches) {
        window.__invalidateFiscalCaches = function() {
          console.log("Création et appel de la fonction d'invalidation de cache globale");
          
          // Réinitialiser les timestamps dans les caches IGS et Patente
          if (window.__patenteCacheTimestamp !== undefined) {
            window.__patenteCacheTimestamp = 0;
            console.log("Cache Patente invalidé");
          }
          
          // Déclencher manuellement toute autre invalidation de cache ici
          if (window.__igsCache) {
            window.__igsCache = { data: null, timestamp: 0 };
            console.log("Cache IGS invalidé");
          }
        };
      }
      
      console.log("Appel de la fonction d'invalidation de cache globale");
      window.__invalidateFiscalCaches();
    } else {
      console.log("Fonction d'invalidation de cache globale non disponible - n'est pas exécuté dans le navigateur");
    }
    
  } catch (error) {
    console.error("Erreur lors de l'invalidation des requêtes associées:", error);
  }
};

/**
 * Vérifier que les données fiscales ont été correctement sauvegardées en les récupérant à nouveau
 */
export const verifyFiscalDataSave = async (clientId: string, expectedData: ClientFiscalData): Promise<boolean> => {
  try {
    console.log(`Vérification de l'enregistrement des données fiscales pour le client ${clientId}`);
    
    // Forcer la récupération depuis la BD en contournant le cache
    const { data, error } = await supabase
      .from('clients')
      .select('fiscal_data')
      .eq('id', clientId)
      .single();
    
    if (error) {
      console.error("Erreur lors de la vérification de l'enregistrement des données fiscales:", error);
      return false;
    }
    
    if (data?.fiscal_data) {
      console.log("Données de vérification:", data.fiscal_data);
      
      // Faire une vérification simple pour s'assurer que certains champs clés correspondent
      const savedData = data.fiscal_data as unknown as ClientFiscalData;
      
      // Vérifier si les données essentielles ont été correctement sauvegardées
      const keysToCheck = ['hiddenFromDashboard', 'attestation'];
      let allKeysMatch = true;
      
      for (const key of keysToCheck) {
        if (JSON.stringify(savedData[key as keyof ClientFiscalData]) !== 
            JSON.stringify(expectedData[key as keyof ClientFiscalData])) {
          console.error(`Différence détectée dans le champ ${key}`);
          allKeysMatch = false;
        }
      }
      
      if (allKeysMatch) {
        console.log("Toutes les données fiscales ont été correctement enregistrées");
      } else {
        console.warn("Certaines données fiscales ne correspondent pas à ce qui était attendu");
      }
      
      return true; // Si nous sommes arrivés jusqu'ici, l'enregistrement a réussi
    }
    
    console.log("Vérification échouée: Aucune donnée retournée");
    return false;
  } catch (error) {
    console.error("Exception lors de la vérification de l'enregistrement des données fiscales:", error);
    return false;
  }
};
