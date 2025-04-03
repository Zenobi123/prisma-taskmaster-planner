
import { supabase } from "@/integrations/supabase/client";
import { ClientFiscalData, defaultClientFiscalData } from "../types";
import { fiscalDataCache } from "./fiscalDataCache";

// Récupérer les données fiscales d'un client
export const getFiscalData = async (clientId: string): Promise<ClientFiscalData> => {
  try {
    // Vérifier si les données sont en cache
    const cachedData = fiscalDataCache.get(clientId);
    if (cachedData) {
      return cachedData;
    }

    // Récupérer les données fiscales depuis la base de données
    const { data, error } = await supabase
      .from('fiscal_data')
      .select('*')
      .eq('client_id', clientId)
      .single();

    if (error) {
      console.error("Erreur lors de la récupération des données fiscales:", error);
      return defaultClientFiscalData;
    }

    // Convertir les données
    const fiscalData = data.data ? 
      (typeof data.data === 'string' 
        ? JSON.parse(data.data) 
        : data.data as unknown as ClientFiscalData) 
      : defaultClientFiscalData;

    // Mettre en cache les données
    fiscalDataCache.set(clientId, fiscalData);

    return fiscalData;
  } catch (error) {
    console.error("Erreur lors de la récupération des données fiscales:", error);
    return defaultClientFiscalData;
  }
};

// Mettre à jour les données fiscales d'un client
export const updateFiscalData = async (clientId: string, fiscalData: ClientFiscalData): Promise<boolean> => {
  try {
    // Mettre à jour les données fiscales dans la base de données
    const { error } = await supabase
      .from('fiscal_data')
      .upsert({ 
        client_id: clientId, 
        data: fiscalData
      });

    if (error) {
      console.error("Erreur lors de la mise à jour des données fiscales:", error);
      return false;
    }

    // Mettre à jour le cache
    fiscalDataCache.set(clientId, fiscalData);

    return true;
  } catch (error) {
    console.error("Erreur lors de la mise à jour des données fiscales:", error);
    return false;
  }
};
