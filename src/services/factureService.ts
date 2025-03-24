import { Facture } from "@/types/facture";
import { Client } from "@/types/client";
import { getFacturesData } from "./factureDataService";
import { formatClientsForSelector } from "./factureFormatService";
import { addFactureToDatabase } from "./factureCreationService";
import { supabase } from "@/integrations/supabase/client";

// Re-export functions for backward compatibility
export const getFactures = getFacturesData;
export { formatClientsForSelector };
export { addFactureToDatabase };

// Get the next facture number (XXXX format, padded with leading zeros)
export const getNextFactureNumber = async (): Promise<string> => {
  try {
    console.log("Generating next facture number");
    // Get all factures to check existing numbers
    const { data: factures, error } = await supabase
      .from('factures')
      .select('id')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching factures for numbering:", error);
      // Default to 1 if there's an error
      return "0001";
    }

    // If no factures exist yet, start with 1
    if (!factures || factures.length === 0) {
      console.log("No existing factures, starting with 0001");
      return "0001";
    }

    // Extract the highest number from existing facture ids (format: FP XXXX-YYYY)
    let highestNumber = 0;
    
    factures.forEach(facture => {
      // Check if id matches our format
      const match = facture.id.match(/FP (\d{4})-\d{4}/);
      if (match && match[1]) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > highestNumber) {
          highestNumber = num;
        }
      }
    });

    console.log("Current highest facture number:", highestNumber);
    
    // Increment and pad with leading zeros
    const nextNumber = (highestNumber + 1).toString().padStart(4, '0');
    console.log("Next facture number:", nextNumber);
    return nextNumber;
  } catch (error) {
    console.error("Error in getNextFactureNumber:", error);
    // Default to 1 if there's an error
    return "0001";
  }
};

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

// Add this utility function to check if a date is past due
const isOverdue = (dueDate: string): boolean => {
  const today = new Date();
  const dueDateParts = dueDate.split('/');
  const dueDateTime = new Date(
    parseInt(dueDateParts[2]), // year
    parseInt(dueDateParts[1]) - 1, // month (0-based)
    parseInt(dueDateParts[0]) // day
  );
  return today > dueDateTime;
};

// Update this function to handle overdue status
export const updateFactureInDatabase = async (facture: Facture): Promise<boolean> => {
  try {
    console.log("Updating facture:", facture.id);
    
    // Check if invoice is overdue
    const isPastDue = isOverdue(facture.echeance);
    const shouldBeOverdue = isPastDue && 
      facture.status === "envoyée" && 
      (facture.status_paiement === "non_payée" || facture.status_paiement === "partiellement_payée");
    
    // Update status_paiement if overdue
    const updatedStatusPaiement = shouldBeOverdue ? "en_retard" : facture.status_paiement;
    
    const formatDateForDatabase = (dateStr: string): string => {
      // If the date is in DD/MM/YYYY format, convert it to YYYY-MM-DD
      if (dateStr && dateStr.includes('/')) {
        const [day, month, year] = dateStr.split('/');
        return `${year}-${month}-${day}`;
      }
      return dateStr;
    };
    
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

// This file acts as a facade for the facture services and maintains
// backward compatibility with existing code that imports from factureService.ts
