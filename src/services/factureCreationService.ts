
import { Facture } from "@/types/facture";
import { supabase } from "@/integrations/supabase/client";

// Add a new facture to the database
export const addFactureToDatabase = async (facture: Facture): Promise<boolean> => {
  try {
    console.log("Adding facture to database:", facture.id);
    
    // 1. Insert the facture into the database
    const { data: factureData, error: factureError } = await supabase
      .from("factures")
      .insert({
        id: facture.id, // Use the pre-generated ID (FP XXXX-YYYY format)
        client_id: facture.client_id,
        date: facture.date,
        echeance: facture.echeance,
        montant: facture.montant,
        montant_paye: facture.montant_paye,
        status: facture.status,
        mode_paiement: facture.mode_paiement,
        notes: facture.notes
      })
      .select()
      .single();
      
    if (factureError) {
      console.error("Error inserting facture:", factureError);
      throw new Error(`Failed to add invoice: ${factureError.message}`);
    }
    
    console.log("Facture inserted successfully:", factureData.id);
    
    // 2. Insert all the prestations for this facture
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
        throw new Error(`Failed to add invoice services: ${prestationsError.message}`);
      }
      
      console.log("Prestations inserted successfully");
    }
    
    return true;
  } catch (error) {
    console.error("Error in addFactureToDatabase:", error);
    throw error;
  }
};
