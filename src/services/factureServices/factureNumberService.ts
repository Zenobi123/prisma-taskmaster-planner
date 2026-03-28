
import { supabase } from "@/integrations/supabase/client";

// Generate next facture number: N° XXXX/YYYY/MM (matching original project format)
export const getNextFactureNumber = async (): Promise<string> => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");

    const { data: factures, error } = await supabase
      .from('factures')
      .select('id')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching factures for numbering:", error);
      return `N° 0001/${year}/${month}`;
    }

    if (!factures || factures.length === 0) {
      return `N° 0001/${year}/${month}`;
    }

    // Extract the highest sequence number from existing facture ids
    let highestNumber = 0;

    factures.forEach(facture => {
      // Match format: N° XXXX/YYYY/MM
      const match = facture.id.match(/N°\s*(\d{4})/);
      if (match && match[1]) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > highestNumber) {
          highestNumber = num;
        }
      }
    });

    const nextNumber = (highestNumber + 1).toString().padStart(4, '0');
    return `N° ${nextNumber}/${year}/${month}`;
  } catch (error) {
    console.error("Error in getNextFactureNumber:", error);
    const now = new Date();
    return `N° 0001/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}`;
  }
};
