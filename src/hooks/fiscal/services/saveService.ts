
import { supabase } from "@/integrations/supabase/client";
import { ClientFiscalData } from "../types";
import { Json } from "@/integrations/supabase/types";

/**
 * Sauvegarde des données fiscales avec fonction de retry
 */
export const saveFiscalData = async (
  clientId: string, 
  data: ClientFiscalData, 
  retryCount = 0
): Promise<boolean> => {
  try {
    console.log(`Sauvegarde des données fiscales pour le client ${clientId} (tentative ${retryCount + 1})`);
    
    // Préparation des données pour la sauvegarde
    // Clone et transformation pour respecter le type Json de Supabase
    const safeData = JSON.parse(JSON.stringify(data)) as Json;
    
    const { error } = await supabase
      .from('clients')
      .update({ fiscal_data: safeData })
      .eq('id', clientId);
    
    if (error) {
      console.error(`Erreur de sauvegarde des données fiscales (tentative ${retryCount + 1}):`, error);
      
      if (retryCount < 2) {
        const delay = (retryCount + 1) * 1000;
        console.log(`Nouvel essai dans ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return saveFiscalData(clientId, data, retryCount + 1);
      }
      
      return false;
    }
    
    console.log(`Données fiscales sauvegardées avec succès pour le client ${clientId}`);
    return true;
  } catch (error) {
    console.error(`Exception lors de la sauvegarde des données fiscales (tentative ${retryCount + 1}):`, error);
    return false;
  }
};
