
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
    
    // Proceed with deletion - force delete with RPC call if regular delete fails
    const { data, error } = await supabase
      .from('factures')
      .delete()
      .eq('id', factureId)
      .select();
    
    if (error) {
      console.error(`Supabase error when deleting facture ${factureId}:`, error);
      
      // The issue is likely that we're trying to use an RPC function that doesn't exist
      // or has different parameters than what we're sending.
      // Let's try a more direct approach without using RPC
      
      console.log(`Attempting alternative deletion method for facture ${factureId}`);
      
      // Try a direct delete without using .select() which might be causing issues
      const { error: directDeleteError } = await supabase
        .from('factures')
        .delete()
        .eq('id', factureId);
      
      if (directDeleteError) {
        console.error(`Direct deletion also failed for facture ${factureId}:`, directDeleteError);
        throw directDeleteError;
      }
      
      console.log(`Successfully deleted facture ${factureId} through direct delete`);
      return { id: factureId };
    }
    
    console.log(`Result of deletion for facture ${factureId}:`, data);
    return data;
  } catch (error) {
    console.error(`Exception in deleteFactureFromDB for facture ${factureId}:`, error);
    throw error;
  }
};
