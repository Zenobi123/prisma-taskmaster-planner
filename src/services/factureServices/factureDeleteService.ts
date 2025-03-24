
import { supabase } from "@/integrations/supabase/client";

// Delete a facture and its related prestations from the database
export const deleteFactureFromDatabase = async (factureId: string): Promise<boolean> => {
  try {
    console.log("Deleting facture:", factureId);
    
    // First delete associated prestations
    const { error: prestationsError } = await supabase
      .from("prestations")
      .delete()
      .eq("facture_id", factureId);
      
    if (prestationsError) {
      console.error("Error deleting prestations:", prestationsError);
      throw new Error(`Failed to delete invoice services: ${prestationsError.message}`);
    }
    
    // Then delete associated paiements if any
    const { error: paiementsError } = await supabase
      .from("paiements")
      .delete()
      .eq("facture_id", factureId);
      
    if (paiementsError) {
      console.error("Error deleting paiements:", paiementsError);
      throw new Error(`Failed to delete invoice payments: ${paiementsError.message}`);
    }
    
    // Finally delete the facture itself
    const { error: factureError } = await supabase
      .from("factures")
      .delete()
      .eq("id", factureId);
      
    if (factureError) {
      console.error("Error deleting facture:", factureError);
      throw new Error(`Failed to delete invoice: ${factureError.message}`);
    }
    
    console.log("Facture successfully deleted");
    return true;
  } catch (error) {
    console.error("Error in deleteFactureFromDatabase:", error);
    throw error;
  }
};
