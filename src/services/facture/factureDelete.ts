
import { supabase } from "@/integrations/supabase/client";

/**
 * Supprime une facture de la base de données
 */
export const deleteFactureFromDB = async (factureId: string) => {
  try {
    console.log(`Tentative de suppression de la facture ${factureId}`);
    
    // Vérifions d'abord si la facture existe réellement
    const { data: existingFacture, error: checkError } = await supabase
      .from('factures')
      .select('id')
      .eq('id', factureId)
      .maybeSingle();
    
    if (checkError) {
      console.error(`Erreur lors de la vérification de l'existence de la facture ${factureId}:`, checkError);
      throw checkError;
    }
    
    if (!existingFacture) {
      console.error(`Facture ${factureId} introuvable`);
      throw new Error(`Facture ${factureId} introuvable`);
    }
    
    // Effectuer la suppression avec force
    console.log(`Suppression de la facture ${factureId} en cours...`);
    const { error: deleteError } = await supabase
      .from('factures')
      .delete()
      .eq('id', factureId);
    
    if (deleteError) {
      console.error(`Erreur lors de la suppression de la facture ${factureId}:`, deleteError);
      throw deleteError;
    }
    
    // Vérifier que la suppression a bien eu lieu
    const { data: checkAfterDelete, error: checkAfterError } = await supabase
      .from('factures')
      .select('id')
      .eq('id', factureId)
      .maybeSingle();
    
    if (checkAfterError) {
      console.error(`Erreur lors de la vérification après suppression:`, checkAfterError);
    } else if (checkAfterDelete) {
      console.error(`La facture ${factureId} existe toujours après tentative de suppression`);
      throw new Error(`Échec de la suppression de la facture ${factureId}`);
    } else {
      console.log(`Facture ${factureId} supprimée avec succès`);
    }
    
    return { id: factureId };
  } catch (error) {
    console.error(`Exception dans deleteFactureFromDB pour la facture ${factureId}:`, error);
    throw error;
  }
};
