
import { supabase } from "@/integrations/supabase/client";
import { Facture } from "@/types/facture";

// Add a new facture to the database
export const addFactureToDatabase = async (facture: Facture) => {
  try {
    // Convert date strings to ISO format for database storage
    let dateISO: string;
    let echeanceISO: string;
    
    if (facture.date.includes('/')) {
      const [day, month, year] = facture.date.split('/');
      dateISO = `${year}-${month}-${day}`;
    } else {
      dateISO = facture.date;
    }
    
    if (facture.echeance.includes('/')) {
      const [day, month, year] = facture.echeance.split('/');
      echeanceISO = `${year}-${month}-${day}`;
    } else {
      echeanceISO = facture.echeance;
    }

    // Add to Supabase database
    const { data: factureData, error: factureError } = await supabase
      .from("factures")
      .insert({
        client_id: facture.client_id,
        date: dateISO,
        echeance: echeanceISO,
        montant: facture.montant,
        montant_paye: facture.montant_paye || 0,
        status: facture.status,
        notes: facture.notes,
        mode_paiement: facture.mode_paiement || "espèces"
      })
      .select()
      .single();
      
    if (factureError) {
      console.error("Error inserting facture:", factureError);
      throw new Error(`Failed to create invoice: ${factureError.message}`);
    }
    
    // Add prestations
    if (facture.prestations && facture.prestations.length > 0) {
      const prestationsToInsert = facture.prestations.map(prestation => ({
        facture_id: factureData.id,
        description: prestation.description,
        quantite: prestation.quantite || 1,
        montant: prestation.montant,
        taux: prestation.taux || 0
      }));
      
      const { error: prestationsError } = await supabase
        .from("prestations")
        .insert(prestationsToInsert);
        
      if (prestationsError) {
        console.error("Error inserting prestations:", prestationsError);
        throw new Error(`Failed to add services to invoice: ${prestationsError.message}`);
      }
    }
    
    return factureData;
  } catch (error) {
    console.error("Error in addFactureToDatabase:", error);
    // Provide more specific error messages based on the error type
    if (error instanceof Error) {
      if (error.message.includes("duplicate key")) {
        throw new Error("This invoice ID already exists. Please try again with a different ID.");
      } else if (error.message.includes("foreign key constraint")) {
        throw new Error("The client referenced in this invoice doesn't exist.");
      } else {
        throw new Error(`Failed to save invoice: ${error.message}`);
      }
    } else {
      throw new Error("An unexpected error occurred while saving the invoice");
    }
  }
};
