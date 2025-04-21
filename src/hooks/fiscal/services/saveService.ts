
import { supabase } from "@/integrations/supabase/client";
import { ClientFiscalData, TaxObligationStatus, DeclarationObligationStatus, ObligationStatus } from "../types";
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
    
    // Assurer que les valeurs booléennes sont correctement typées
    if (completeData.obligations) {
      Object.keys(completeData.obligations).forEach(key => {
        const obligation = completeData.obligations![key];
        
        // Assurer que 'assujetti' est toujours un booléen
        if (obligation.hasOwnProperty('assujetti')) {
          obligation.assujetti = Boolean(obligation.assujetti);
        }
        
        // Vérifier le type de l'obligation avant d'accéder aux propriétés spécifiques
        if (isTaxObligation(obligation)) {
          // Propriétés spécifiques aux obligations fiscales (TaxObligationStatus)
          if (obligation.hasOwnProperty('paye')) {
            obligation.paye = Boolean(obligation.paye);
          }
          
          if (obligation.hasOwnProperty('reductionCGA')) {
            obligation.reductionCGA = Boolean(obligation.reductionCGA);
          }
          
          // Traiter les paiements trimestriels IGS
          if (key === 'igs' && obligation.paiementsTrimestriels) {
            Object.keys(obligation.paiementsTrimestriels).forEach(trimester => {
              const payment = obligation.paiementsTrimestriels![trimester];
              if (payment && payment.hasOwnProperty('isPaid')) {
                payment.isPaid = Boolean(payment.isPaid);
              }
            });
          }
        } else if (isDeclarationObligation(obligation)) {
          // Propriétés spécifiques aux obligations de déclaration (DeclarationObligationStatus)
          if (obligation.hasOwnProperty('depose')) {
            obligation.depose = Boolean(obligation.depose);
          }
        }
      });
    }
    
    // Log the data before saving to help debug
    console.log(`[FiscalService] Data to be saved:`, JSON.stringify(completeData, null, 2));
    
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
      if (typeof window !== 'undefined' && window.__invalidateAllCaches) {
        window.__invalidateAllCaches();
      } else {
        // Fallback: Mettre à zéro tous les horodatages de cache individuellement
        if (typeof window !== 'undefined') {
          if (window.__patenteCacheTimestamp !== undefined) window.__patenteCacheTimestamp = 0;
          if (window.__dsfCacheTimestamp) window.__dsfCacheTimestamp = 0;
          if (window.__darpCacheTimestamp) window.__darpCacheTimestamp = 0;
          if (window.__igsCache) window.__igsCache.timestamp = 0;
        }
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

// Type Guards pour vérifier le type d'obligation
function isTaxObligation(obligation: ObligationStatus): obligation is TaxObligationStatus {
  return 'paye' in obligation;
}

function isDeclarationObligation(obligation: ObligationStatus): obligation is DeclarationObligationStatus {
  return 'depose' in obligation;
}
