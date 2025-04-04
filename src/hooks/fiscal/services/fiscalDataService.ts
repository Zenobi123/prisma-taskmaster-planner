
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";
import { ClientFiscalData } from "../types";
import { Json } from "@/integrations/supabase/types";
import { getFromCache, updateCache } from "./fiscalDataCache";
import { toast } from "sonner";

/**
 * Load fiscal data for a client
 */
export const loadFiscalData = async (client: Client): Promise<ClientFiscalData | null> => {
  if (!client || !client.id) return null;
  
  try {
    // Check cache first
    const cachedData = getFromCache(client.id);
    if (cachedData) return cachedData;
    
    console.log(`Loading fiscal data for client ID: ${client.id}`);
    
    const { data: clientData, error } = await supabase
      .from("clients")
      .select("fiscal_data")
      .eq("id", client.id)
      .single();

    if (error) {
      console.error("Error loading fiscal data:", error);
      return null;
    }

    if (clientData && clientData.fiscal_data) {
      console.log("Fiscal data loaded:", clientData.fiscal_data);
      // Cast the JSON data to our ClientFiscalData type
      const fiscalData = clientData.fiscal_data as Json as unknown as ClientFiscalData;
      
      // Update cache
      updateCache(client.id, fiscalData);
      
      return fiscalData;
    } else {
      console.log("No fiscal data found for client");
      return null;
    }
  } catch (error) {
    console.error("Error loading fiscal data:", error);
    return null;
  }
};

/**
 * Save fiscal data for a client
 */
export const saveFiscalData = async (
  client: Client, 
  fiscalData: ClientFiscalData
): Promise<boolean> => {
  if (!client || !client.id) {
    toast.error("Impossible d'enregistrer les données: client non sélectionné");
    return false;
  }

  try {
    console.log(`Saving fiscal data for client ID: ${client.id}`);
    console.log("Fiscal data to save:", fiscalData);

    // Update cache immediately for more responsive UX
    updateCache(client.id, fiscalData);

    // Convert to Json type for database storage
    const { error } = await supabase
      .from("clients")
      .update({ fiscal_data: fiscalData as unknown as Json })
      .eq("id", client.id);

    if (error) {
      console.error("Error saving fiscal data:", error);
      toast.error("Erreur lors de l'enregistrement des données fiscales");
      return false;
    }
    
    toast.success("Les informations fiscales ont été mises à jour.");
    return true;
  } catch (error) {
    console.error("Error saving fiscal data:", error);
    toast.error("Erreur lors de l'enregistrement des données fiscales");
    return false;
  }
};
