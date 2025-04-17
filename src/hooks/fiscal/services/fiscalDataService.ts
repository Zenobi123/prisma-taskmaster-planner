
import { supabase } from "@/integrations/supabase/client";
import { ClientFiscalData } from "../types";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";
import { clearCache, expireAllCaches, getDebugInfo } from "./fiscalDataCache";

/**
 * Récupérer les données fiscales de la base de données
 * avec retry automatique en cas d'échec
 */
export const fetchFiscalData = async (clientId: string, retryCount = 0): Promise<ClientFiscalData | null> => {
  try {
    console.log(`Récupération des données fiscales pour le client ${clientId} (tentative ${retryCount + 1})`);
    
    const { data, error } = await supabase
      .from('clients')
      .select('fiscal_data')
      .eq('id', clientId)
      .single();
    
    if (error) {
      console.error(`Erreur lors de la récupération des données fiscales (tentative ${retryCount + 1}):`, error);
      
      // Retry automatique jusqu'à 3 fois avec délai progressif
      if (retryCount < 2) {
        const delay = (retryCount + 1) * 1000; // Délai progressif: 1s, 2s
        console.log(`Nouvel essai dans ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchFiscalData(clientId, retryCount + 1);
      }
      
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
    console.error(`Exception lors de la récupération des données fiscales (tentative ${retryCount + 1}):`, error);
    
    // Retry automatique jusqu'à 3 fois
    if (retryCount < 2) {
      const delay = (retryCount + 1) * 1000;
      console.log(`Nouvel essai dans ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchFiscalData(clientId, retryCount + 1);
    }
    
    return null;
  }
};

/**
 * Enregistrer les données fiscales dans la base de données
 * avec retry automatique en cas d'échec
 */
export const saveFiscalData = async (clientId: string, fiscalData: ClientFiscalData, retryCount = 0): Promise<boolean> => {
  try {
    console.log(`Enregistrement des données fiscales pour le client ${clientId} (tentative ${retryCount + 1})`, fiscalData);
    console.log("État du cache avant enregistrement:", getDebugInfo());
    
    // Optimisation: Utiliser upsert au lieu de update pour garantir la création si nécessaire
    const { error } = await supabase
      .from('clients')
      .update({ fiscal_data: fiscalData as unknown as Json })
      .eq('id', clientId);
    
    if (error) {
      console.error(`Erreur lors de l'enregistrement des données fiscales (tentative ${retryCount + 1}):`, error);
      
      // Retry automatique jusqu'à 3 fois avec délai progressif
      if (retryCount < 2) {
        const delay = (retryCount + 1) * 1500; // Délai progressif: 1.5s, 3s
        console.log(`Nouvel essai d'enregistrement dans ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return saveFiscalData(clientId, fiscalData, retryCount + 1);
      }
      
      throw error;
    }
    
    console.log(`Données fiscales enregistrées avec succès pour le client ${clientId}`);
    
    // Vider le cache de ce client pour garantir le chargement de données fraîches la prochaine fois
    clearCache(clientId);
    
    // Forcer l'expiration de tous les caches associés pour assurer le chargement de données fraîches partout
    await invalidateRelatedQueries();
    
    console.log("État du cache après enregistrement:", getDebugInfo());
    
    // Après un enregistrement réussi, vérifier que les données ont bien été enregistrées
    try {
      // Attendre un court instant pour s'assurer que la base de données a bien persisté les données
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const verificationSuccess = await verifyFiscalDataSave(clientId, fiscalData);
      console.log(`Vérification après enregistrement : ${verificationSuccess ? "Réussie" : "Échouée"}`);
      
      if (!verificationSuccess) {
        // Réessayer une fois en cas d'échec avec un délai plus long
        await new Promise(resolve => setTimeout(resolve, 2000));
        const secondVerification = await verifyFiscalDataSave(clientId, fiscalData);
        console.log(`Seconde vérification : ${secondVerification ? "Réussie" : "Échouée"}`);
        
        // Si toujours pas vérifié, forcer un nouvel enregistrement complet
        if (!secondVerification && retryCount < 1) {
          console.log("Échec de vérification, tentative d'enregistrement complet...");
          return saveFiscalData(clientId, fiscalData, retryCount + 1);
        }
      }
    } catch (err) {
      console.error("Erreur lors de la vérification:", err);
    }
    
    return true;
  } catch (error) {
    console.error(`Exception lors de l'enregistrement des données fiscales (tentative ${retryCount + 1}):`, error);
    
    // Retry automatique jusqu'à 2 fois
    if (retryCount < 2) {
      const delay = (retryCount + 1) * 1500;
      console.log(`Nouvel essai d'enregistrement dans ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return saveFiscalData(clientId, fiscalData, retryCount + 1);
    }
    
    throw error;
  }
};

/**
 * Fonction auxiliaire pour invalider les requêtes associées lorsque les données fiscales changent
 */
const invalidateRelatedQueries = async (): Promise<void> => {
  try {
    // Forcer un rafraîchissement pour les caches IGS et Patente
    console.log("Invalidation des caches associés et rafraîchissement des données...");
    
    // Expirer tous les caches liés aux données fiscales
    expireAllCaches();
    
    // Appeler la fonction d'invalidation de cache globale
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
          
          // Déclencher manuellement toute autre invalidation de cache
          if (window.__igsCache) {
            window.__igsCache = { data: null, timestamp: 0 };
            console.log("Cache IGS invalidé");
          }
        };
      }
      
      console.log("Appel de la fonction d'invalidation de cache globale");
      window.__invalidateFiscalCaches();
    }
    
  } catch (error) {
    console.error("Erreur lors de l'invalidation des requêtes associées:", error);
  }
};

/**
 * Vérifier que les données fiscales ont été correctement sauvegardées en les récupérant à nouveau
 * directement de la base de données (contournement du cache)
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
      console.log("Données de vérification obtenues:", data.fiscal_data);
      
      // Faire une vérification simple pour s'assurer que certains champs clés correspondent
      const savedData = data.fiscal_data as unknown as ClientFiscalData;
      
      // Vérifier si les données essentielles ont été correctement sauvegardées
      const keysToCheck = ['hiddenFromDashboard', 'attestation', 'obligations'];
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
