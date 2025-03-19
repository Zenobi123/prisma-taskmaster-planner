
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
    
    // Proceed with deletion as a separate operation
    const { error } = await supabase
      .from('factures')
      .delete()
      .eq('id', factureId);
    
    if (error) {
      console.error(`Error deleting facture ${factureId}:`, error);
      throw error;
    }
    
    console.log(`Successfully deleted facture ${factureId}`);
    return { id: factureId };
  } catch (error) {
    console.error(`Exception in deleteFactureFromDB for facture ${factureId}:`, error);
    throw error;
  }
};
