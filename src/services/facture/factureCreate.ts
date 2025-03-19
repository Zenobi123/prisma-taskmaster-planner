
import { supabase } from "@/integrations/supabase/client";

/**
 * Crée une nouvelle facture dans la base de données
 */
export const createFactureInDB = async (newFacture: any) => {
  try {
    console.log("Creating new facture:", newFacture.id);
    const { data, error } = await supabase
      .from('factures')
      .insert(newFacture)
      .select();
      
    if (error) {
      console.error("Error creating facture:", error);
      throw error;
    }
    
    console.log("Successfully created facture:", data);
    return data;
  } catch (error) {
    console.error("Exception in createFactureInDB:", error);
    throw error;
  }
};
