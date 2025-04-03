
import { supabase } from "@/integrations/supabase/client";
import { ClientFiscalData, defaultClientFiscalData } from "../types";
import { getFromCache, updateCache } from "./fiscalDataCache";

// Récupérer les données fiscales d'un client
export const getFiscalData = async (clientId: string): Promise<ClientFiscalData> => {
  try {
    // Vérifier si les données sont dans le cache
    const cachedData = getFromCache(clientId);
    if (cachedData) {
      return cachedData;
    }

    // Récupérer les données fiscales de la base de données
    const { data, error } = await supabase
      .from('clients')
      .select('fiscal_data')
      .eq('id', clientId)
      .single();

    if (error) {
      console.error("Error retrieving fiscal data:", error);
      return defaultClientFiscalData;
    }

    // Analyser et convertir les données
    const fiscalData = data.fiscal_data ? 
      (typeof data.fiscal_data === 'string' 
        ? JSON.parse(data.fiscal_data) 
        : data.fiscal_data as unknown as ClientFiscalData) 
      : defaultClientFiscalData;

    // Mettre à jour le cache
    updateCache(clientId, fiscalData);

    return fiscalData;
  } catch (error) {
    console.error("Error retrieving fiscal data:", error);
    return defaultClientFiscalData;
  }
};

// Mettre à jour les données fiscales d'un client
export const updateFiscalData = async (clientId: string, fiscalData: ClientFiscalData): Promise<boolean> => {
  try {
    // Mettre à jour les données fiscales dans la base de données
    // Conversion pour satisfaire les types Supabase
    const { error } = await supabase
      .from('clients')
      .update({ 
        fiscal_data: fiscalData as any
      })
      .eq('id', clientId);

    if (error) {
      console.error("Error updating fiscal data:", error);
      return false;
    }

    // Mettre à jour le cache
    updateCache(clientId, fiscalData);

    return true;
  } catch (error) {
    console.error("Error updating fiscal data:", error);
    return false;
  }
};

// Alias pour getFiscalData pour maintenir la compatibilité
export const fetchFiscalData = getFiscalData;

// Alias pour updateFiscalData pour maintenir la compatibilité
export const saveFiscalData = updateFiscalData;
