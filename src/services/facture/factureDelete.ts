
import { supabase } from "@/integrations/supabase/client";

/**
 * Supprime une facture de la base de données
 */
export const deleteFactureFromDB = async (factureId: string) => {
  try {
    console.log(`Starting deletion operation for facture ${factureId}`);
    
    // First check if the facture exists
    const { data: existingFacture, error: checkError } = await supabase
      .from('factures')
      .select('id')
      .eq('id', factureId)
      .maybeSingle();
    
    if (checkError) {
      console.error(`Error checking if facture ${factureId} exists:`, checkError);
      throw checkError;
    }
    
    if (!existingFacture) {
      console.error(`Facture ${factureId} not found`);
      throw new Error(`Facture ${factureId} not found`);
    }
    
    // Proceed with deletion
    const { data, error } = await supabase
      .from('factures')
      .delete()
      .eq('id', factureId)
      .select();
    
    if (error) {
      console.error(`Supabase error when deleting facture ${factureId}:`, error);
      throw error;
    }
    
    console.log(`Result of deletion for facture ${factureId}:`, data);
    return data;
  } catch (error) {
    console.error(`Exception in deleteFactureFromDB for facture ${factureId}:`, error);
    throw error;
  }
};
