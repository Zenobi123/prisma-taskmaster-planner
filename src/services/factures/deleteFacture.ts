
import { supabase } from "@/integrations/supabase/client";

export const deleteFacture = async (id: string) => {
  // Vérifier d'abord si la facture est payée
  const { data: facture } = await supabase
    .from('factures')
    .select('status')
    .eq('id', id)
    .single();
    
  if (facture && facture.status === 'payée') {
    throw new Error("Une facture payée ne peut pas être supprimée");
  }
  
  const { error } = await supabase
    .from('factures')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Erreur lors de la suppression de la facture ${id}:`, error);
    throw error;
  }
  
  return true;
};
