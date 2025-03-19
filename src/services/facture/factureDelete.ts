
import { supabase } from "@/integrations/supabase/client";

/**
 * Supprime une facture de la base de données
 */
export const deleteFactureFromDB = async (factureId: string) => {
  try {
    console.log(`Tentative de suppression de la facture ${factureId}`);
    
    // Première étape : vérifier si la facture existe
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
    
    // Deuxième étape : supprimer la facture
    const { error: deleteError } = await supabase
      .from('factures')
      .delete()
      .eq('id', factureId);
    
    if (deleteError) {
      console.error(`Erreur lors de la suppression de la facture ${factureId}:`, deleteError);
      throw deleteError;
    }
    
    console.log(`Facture ${factureId} supprimée avec succès`);
    return { id: factureId };
  } catch (error) {
    console.error(`Exception dans deleteFactureFromDB pour la facture ${factureId}:`, error);
    throw error;
  }
};
