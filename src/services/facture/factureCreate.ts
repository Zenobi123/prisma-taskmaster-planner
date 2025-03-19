
import { supabase } from "@/integrations/supabase/client";

/**
 * Crée une nouvelle facture dans la base de données
 */
export const createFactureInDB = async (newFacture: any) => {
  try {
    console.log("Creating new facture:", newFacture.id);
    
    // Vérifier si une facture avec cet ID existe déjà
    const { data: existingFacture, error: checkError } = await supabase
      .from('factures')
      .select('id')
      .eq('id', newFacture.id)
      .maybeSingle();
      
    if (checkError) {
      console.error("Error checking for existing facture:", checkError);
      throw checkError;
    }
    
    if (existingFacture) {
      throw new Error(`Une facture avec l'identifiant ${newFacture.id} existe déjà.`);
    }
    
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
