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
      
      if (retryCount < 2) {
        const delay = (retryCount + 1) * 1000;
        console.log(`Nouvel essai dans ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchFiscalData(clientId, retryCount + 1);
      }
      
      return null;
    }
    
    if (data?.fiscal_data) {
      console.log(`Données fiscales trouvées pour le client ${clientId}`);
      return data.fiscal_data as unknown as ClientFiscalData;
    }
    
    console.log(`Aucune donnée fiscale trouvée pour le client ${clientId}`);
    return null;
  } catch (error) {
    console.error(`Exception lors de la récupération des données fiscales (tentative ${retryCount + 1}):`, error);
    
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
    
    const { error } = await supabase
      .from('clients')
      .update({ fiscal_data: fiscalData as unknown as Json })
      .eq('id', clientId);
    
    if (error) {
      console.error(`Erreur lors de l'enregistrement des données fiscales (tentative ${retryCount + 1}):`, error);
      
      if (retryCount < 2) {
        const delay = (retryCount + 1) * 1500;
        console.log(`Nouvel essai d'enregistrement dans ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return saveFiscalData(clientId, fiscalData, retryCount + 1);
      }
      
      throw error;
    }
    
    console.log(`Données fiscales enregistrées avec succès pour le client ${clientId}`);
    
    clearCache(clientId);
    await invalidateRelatedQueries();
    
    console.log("État du cache après enregistrement:", getDebugInfo());
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const verificationSuccess = await verifyFiscalDataSave(clientId, fiscalData);
      console.log(`Vérification après enregistrement : ${verificationSuccess ? "Réussie" : "Échouée"}`);
      
      if (!verificationSuccess && retryCount < 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const secondVerification = await verifyFiscalDataSave(clientId, fiscalData);
        console.log(`Seconde vérification : ${secondVerification ? "Réussie" : "Échouée"}`);
        
        if (!secondVerification) {
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
    console.log("Invalidation des caches associés et rafraîchissement des données...");
    
    expireAllCaches();
    
    if (typeof window !== 'undefined') {
      if (!window.__invalidateFiscalCaches) {
        window.__invalidateFiscalCaches = function() {
          console.log("Création et appel de la fonction d'invalidation de cache globale");
          
          if (window.__patenteCacheTimestamp !== undefined) {
            window.__patenteCacheTimestamp = 0;
            console.log("Cache Patente invalidé");
          }
          
          if (window.__igsCache) {
            window.__igsCache = { data: null, timestamp: 0 };
            console.log("Cache IGS invalidé");
          }
          
          if (typeof window.__dsfCacheTimestamp !== 'undefined') {
            window.__dsfCacheTimestamp = 0;
            window.__dsfCacheData = null;
            console.log("Cache DSF invalidé");
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
      
      const savedData = data.fiscal_data as unknown as ClientFiscalData;
      
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
      
      return true;
    }
    
    console.log("Vérification échouée: Aucune donnée retournée");
    return false;
  } catch (error) {
    console.error("Exception lors de la vérification de l'enregistrement des données fiscales:", error);
    return false;
  }
};
