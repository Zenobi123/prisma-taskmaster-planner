
import { Facture } from "@/types/facture";
import { supabase } from "@/integrations/supabase/client";
import { isOverdue, formatDateForDatabase } from "./factureStatusService";

// Update a facture in the database
export const updateFactureInDatabase = async (facture: Facture): Promise<boolean> => {
  try {
    console.log("Updating facture:", facture.id);
    
    // Vérifier si la facture est déjà payée et si on essaie de l'annuler
    if (facture.status === "annulée" && facture.status_paiement === "payée") {
      throw new Error("Impossible d'annuler une facture qui est déjà payée.");
    }
    
    // Check if invoice is overdue using our rule:
    // Une facture est considérée en retard uniquement lorsqu'elle n'est pas complètement payée après sa date d'échéance
    const isPastDue = isOverdue(
      facture.echeance, 
      facture.montant_paye || 0, 
      facture.montant
    );
    
    const shouldBeOverdue = isPastDue && 
      facture.status === "envoyée" && 
      (facture.status_paiement === "non_payée" || facture.status_paiement === "partiellement_payée");
    
    // Update status_paiement if overdue
    const updatedStatusPaiement = shouldBeOverdue ? "en_retard" : facture.status_paiement;
    
    const formattedDate = formatDateForDatabase(facture.date);
    const formattedEcheance = formatDateForDatabase(facture.echeance);
    
    // 1. Update the facture in the database
    const { error: factureError } = await supabase
      .from("factures")
      .update({
        date: formattedDate,
        echeance: formattedEcheance,
        montant: facture.montant,
        montant_paye: facture.montant_paye || 0,
        status: facture.status,
        status_paiement: updatedStatusPaiement,
        mode_paiement: facture.mode_paiement,
        notes: facture.notes,
        updated_at: new Date().toISOString()
      })
      .eq("id", facture.id);
      
    if (factureError) {
      console.error("Error updating facture:", factureError);
      throw new Error(`Failed to update invoice: ${factureError.message}`);
    }
    
    // 2. Delete existing prestations for this facture
    const { error: deleteError } = await supabase
      .from("prestations")
      .delete()
      .eq("facture_id", facture.id);
      
    if (deleteError) {
      console.error("Error deleting existing prestations:", deleteError);
      throw new Error(`Failed to update invoice services: ${deleteError.message}`);
    }
    
    // 3. Insert new prestations for this facture
    if (facture.prestations && facture.prestations.length > 0) {
      const prestationsToInsert = facture.prestations.map(prestation => ({
        id: prestation.id,
        facture_id: facture.id,
        description: prestation.description,
        quantite: prestation.quantite,
        montant: prestation.montant
      }));
      
      const { error: prestationsError } = await supabase
        .from("prestations")
        .insert(prestationsToInsert);
        
      if (prestationsError) {
        console.error("Error inserting prestations:", prestationsError);
        throw new Error(`Failed to update invoice services: ${prestationsError.message}`);
      }
    }
    
    console.log("Facture successfully updated");
    return true;
  } catch (error) {
    console.error("Error in updateFactureInDatabase:", error);
    throw error;
  }
};
