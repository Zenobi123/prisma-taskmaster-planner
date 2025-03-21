
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

    // Increment and pad with leading zeros
    const nextNumber = (highestNumber + 1).toString().padStart(4, '0');
    return nextNumber;
  } catch (error) {
    console.error("Error in getNextFactureNumber:", error);
    // Default to 1 if there's an error
    return "0001";
  }
};

// This file acts as a facade for the facture services and maintains
// backward compatibility with existing code that imports from factureService.ts
