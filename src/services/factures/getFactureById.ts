
import { supabase } from "@/integrations/supabase/client";
import { Facture, FactureDB, convertToFacture } from "@/types/facture";

export const getFactureById = async (id: string) => {
  const { data, error } = await supabase
    .from('factures')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Erreur lors de la récupération de la facture ${id}:`, error);
    throw error;
  }
  
  return convertToFacture(data as unknown as FactureDB);
};
