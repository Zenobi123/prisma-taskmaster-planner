
import { Paiement } from "@/types/facture";
import { supabase } from "@/integrations/supabase/client";

/**
 * Met à jour le statut d'une facture
 */
export const updateFactureStatus = async (factureId: string, newStatus: 'payée' | 'en_attente' | 'envoyée' | 'partiellement_payée') => {
  try {
    console.log(`Updating facture ${factureId} status to ${newStatus}`);
    const { error } = await supabase
      .from('factures')
      .update({ status: newStatus })
      .eq('id', factureId);
      
    if (error) {
      console.error(`Error updating facture ${factureId} status:`, error);
      throw error;
    }
    
    console.log(`Successfully updated facture ${factureId} status to ${newStatus}`);
  } catch (error) {
    console.error(`Exception in updateFactureStatus for facture ${factureId}:`, error);
    throw error;
  }
};

/**
 * Enregistre un paiement partiel pour une facture
 */
export const enregistrerPaiementPartiel = async (
  factureId: string, 
  paiement: Paiement, 
  prestationsPayees: string[],
  nouveauMontantPaye: number
) => {
  try {
    console.log(`Recording partial payment for facture ${factureId}`);
    const { data: currentFacture, error: fetchError } = await supabase
      .from('factures')
      .select('paiements, montant, montant_paye')
      .eq('id', factureId)
      .single();
    
    if (fetchError) {
      console.error(`Error fetching facture ${factureId} for partial payment:`, fetchError);
      throw fetchError;
    }
    
    // Get existing payments and ensure they are in array format
    const paiementsExistants = currentFacture.paiements || [];
    
    // Convert payment to JSON format for Supabase
    const paiementJSON = {
      id: paiement.id,
      date: paiement.date,
      montant: paiement.montant,
      moyenPaiement: paiement.moyenPaiement,
      prestationIds: paiement.prestationIds || [],
      notes: paiement.notes
    };
    
    // Calculate new status
    let newStatus: 'payée' | 'partiellement_payée' | 'en_attente' | 'envoyée' = 'en_attente';
    
    if (nouveauMontantPaye >= currentFacture.montant) {
      newStatus = 'payée';
    } else if (nouveauMontantPaye > 0) {
      newStatus = 'partiellement_payée';
    }
    
    // Ensure paiementsExistants is an array before using spread operator
    const updatedPaiements = Array.isArray(paiementsExistants) 
      ? [...paiementsExistants, paiementJSON] 
      : [paiementJSON];
    
    // Update the facture
    const { error: updateError } = await supabase
      .from('factures')
      .update({ 
        paiements: updatedPaiements,
        montant_paye: nouveauMontantPaye,
        status: newStatus
      })
      .eq('id', factureId);
      
    if (updateError) {
      console.error(`Error updating facture ${factureId} with partial payment:`, updateError);
      throw updateError;
    }
    
    console.log(`Successfully recorded partial payment for facture ${factureId}`);
  } catch (error) {
    console.error(`Exception in enregistrerPaiementPartiel for facture ${factureId}:`, error);
    throw error;
  }
};
