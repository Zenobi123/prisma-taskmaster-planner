
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { convertToJsonCompatible } from "./jsonConverter";

export const saveFiscalDataToDatabase = async (
  clientId: string, 
  fiscalData: any,
  maxRetries: number = 3
): Promise<boolean> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`=== TENTATIVE ${attempt}/${maxRetries} ===`);
      
      // Récupérer les données existantes
      const { data: existingClient, error: fetchError } = await supabase
        .from("clients")
        .select("fiscal_data")
        .eq("id", clientId)
        .single();

      if (fetchError) {
        console.error(`Erreur récupération (tentative ${attempt}):`, fetchError);
        if (attempt === maxRetries) return false;
        await delay(1000 * attempt);
        continue;
      }

      // Fusionner avec les données existantes
      const existingFiscalData = existingClient?.fiscal_data ? 
        (typeof existingClient.fiscal_data === 'object' ? existingClient.fiscal_data as any : {}) : {};
      
      const mergedData = {
        ...fiscalData,
        obligations: {
          ...existingFiscalData?.obligations,
          ...fiscalData.obligations
        }
      };

      // Convertir en format JSON compatible
      const jsonCompatibleData = convertToJsonCompatible(mergedData);

      // Sauvegarder
      const { error: saveError } = await supabase
        .from("clients")
        .update({ fiscal_data: jsonCompatibleData })
        .eq("id", clientId);

      if (saveError) {
        console.error(`Erreur sauvegarde (tentative ${attempt}):`, saveError);
        if (attempt === maxRetries) return false;
        await delay(1000 * attempt);
        continue;
      }

      // Vérifier la sauvegarde
      const verified = await verifyDataSaved(clientId, fiscalData.year);
      if (!verified && attempt === maxRetries) {
        console.error("Vérification échouée");
        return false;
      }

      if (verified) {
        console.log("Sauvegarde et vérification réussies");
        return true;
      }
    } catch (error) {
      console.error(`Exception (tentative ${attempt}):`, error);
      if (attempt === maxRetries) return false;
      await delay(1000 * attempt);
    }
  }
  
  return false;
};

const verifyDataSaved = async (clientId: string, fiscalYear: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from("clients")
      .select("fiscal_data")
      .eq("id", clientId)
      .single();

    if (error) {
      console.warn("Erreur lors de la vérification:", error);
      return false;
    }

    const savedFiscalData = data?.fiscal_data ? 
      (typeof data.fiscal_data === 'object' ? data.fiscal_data as any : {}) : {};
    
    return Boolean(savedFiscalData?.obligations?.[fiscalYear]);
  } catch (error) {
    console.warn("Exception lors de la vérification:", error);
    return false;
  }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
