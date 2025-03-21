
import { Facture } from "@/types/facture";
import { supabase } from "@/integrations/supabase/client";

// Function to format date for PostgreSQL (from DD/MM/YYYY to YYYY-MM-DD)
const formatDateForDatabase = (dateStr: string): string => {
  // If the date is in DD/MM/YYYY format, convert it to YYYY-MM-DD
  if (dateStr && dateStr.includes('/')) {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  }
  return dateStr;
};

// Add a new facture to the database
export const addFactureToDatabase = async (facture: Facture): Promise<boolean> => {
  try {
    console.log("Adding facture to database:", facture.id);
    console.log("Date received:", facture.date);
    console.log("Echeance received:", facture.echeance);
    
    // Format dates for PostgreSQL
    const formattedDate = formatDateForDatabase(facture.date);
    const formattedEcheance = formatDateForDatabase(facture.echeance);
    
    console.log("Formatted date for DB:", formattedDate);
    console.log("Formatted echeance for DB:", formattedEcheance);
    
    // 1. Insert the facture into the database
    const { data: factureData, error: factureError } = await supabase
      .from("factures")
      .insert({
        id: facture.id, // Use the pre-generated ID (FP XXXX-YYYY format)
        client_id: facture.client_id,
        date: formattedDate,
        echeance: formattedEcheance,
        montant: facture.montant,
        montant_paye: facture.montant_paye,
        status: facture.status,
        status_paiement: facture.status_paiement,
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
