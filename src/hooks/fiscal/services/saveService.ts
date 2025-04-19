
import { supabase } from "@/integrations/supabase/client";
import { ClientFiscalData } from "../types";
import { clearCache, updateCache } from "./cacheService";
import { verifyFiscalDataSave } from "./verifyService";
import { Json } from "@/integrations/supabase/types";

/**
 * Sauvegarder les données fiscales avec vérification améliorée
 */
export const saveFiscalData = async (clientId: string, fiscalData: ClientFiscalData, retryCount = 0): Promise<boolean> => {
  try {
    console.log(`[FiscalService] Saving fiscal data for client ${clientId} (attempt ${retryCount + 1})`);
    
    // S'assurer que toutes les propriétés requises sont présentes
    const completeData = {
      ...fiscalData,
      // Ajouter horodatage de mise à jour pour assurer la cohérence
      updatedAt: new Date().toISOString(),
      // Ajouter métadonnées pour la traçabilité
      _metadata: {
        lastSaved: new Date().toISOString(),
        saveVersion: (retryCount + 1).toString(),
        saveSource: 'Gestion'
      }
    };
    
    const { error } = await supabase
      .from('clients')
      .update({ fiscal_data: completeData as unknown as Json })
      .eq('id', clientId);
    
    if (error) {
      console.error(`[FiscalService] Error saving fiscal data (attempt ${retryCount + 1}):`, error);
      
      // Limiter les tentatives de réessai à 2 pour réduire le temps d'attente
      if (retryCount < 2) {
        // Délai fixe au lieu d'exponentiel pour plus de prévisibilité
        const delay = 1500;
        console.log(`[FiscalService] Retrying save in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return saveFiscalData(clientId, fiscalData, retryCount + 1);
      }
      
      return false;
    }
    
    // Pause courte pour permettre à la base de données de se mettre à jour
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Vérifier que les données ont été correctement sauvegardées
    const isVerified = await verifyFiscalDataSave(clientId, completeData);
    
    if (!isVerified && retryCount < 2) {
      console.warn(`[FiscalService] Verification failed, retrying save (attempt ${retryCount + 1})...`);
      const delay = 1500;
      await new Promise(resolve => setTimeout(resolve, delay));
      return saveFiscalData(clientId, fiscalData, retryCount + 1);
    }
    
    if (isVerified) {
      // Mettre à jour le cache local après vérification
      updateCache(clientId, completeData);
      console.log(`[FiscalService] Fiscal data saved and verified for client ${clientId}`);
      
      // Invalider tous les caches globaux avec une approche unifiée
      if (typeof window !== 'undefined') {
        // Mettre à zéro tous les horodatages de cache
        if (window.__patenteCacheTimestamp !== undefined) window.__patenteCacheTimestamp = 0;
        if (window.__dsfCacheTimestamp) window.__dsfCacheTimestamp = 0;
        if (window.__darpCacheTimestamp) window.__darpCacheTimestamp = 0;
        if (window.__igsCache) window.__igsCache.timestamp = 0;
      }
    } else {
      console.error(`[FiscalService] Final verification failed for client ${clientId} after ${retryCount + 1} attempts`);
      clearCache(clientId);
    }
    
    return isVerified;
  } catch (error) {
    console.error(`[FiscalService] Exception during fiscal data save (attempt ${retryCount + 1}):`, error);
    clearCache(clientId);
    
    if (retryCount < 2) {
      const delay = 1500;
      console.log(`[FiscalService] Retrying save after exception in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return saveFiscalData(clientId, fiscalData, retryCount + 1);
    }
    
    return false;
  }
};
