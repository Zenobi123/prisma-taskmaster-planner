
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
      
      // Fix the type error by using a properly typed parameter object
      // The RPC function expects a parameter called "p_facture_id"
      const { error: rpcError } = await supabase.rpc('force_delete_facture', {
        p_facture_id: factureId
      });
      
      if (rpcError) {
        console.error(`RPC deletion failed for facture ${factureId}:`, rpcError);
        throw rpcError;
      }
      
      console.log(`Successfully deleted facture ${factureId} through RPC call`);
      return { id: factureId };
    }
    
    console.log(`Result of deletion for facture ${factureId}:`, data);
    return data;
  } catch (error) {
    console.error(`Exception in deleteFactureFromDB for facture ${factureId}:`, error);
    throw error;
  }
};
