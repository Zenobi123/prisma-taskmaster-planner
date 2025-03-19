
import { supabase } from "@/integrations/supabase/client";
import { Facture, FactureDB, convertToFacture, convertToFactureDB } from "@/types/facture";
import { Json } from "@/integrations/supabase/types";
import { prepareFactureForDb } from "./utils";

export const updateFacture = async (
  id: string, 
  updates: Partial<Facture>
) => {
  // Ne pas permettre la modification si la facture est déjà payée
  if (updates.status === 'payée') {
    throw new Error("Une facture payée ne peut pas être modifiée");
  }
  
  // Convertir les mises à jour au format DB
  const dbUpdates = convertToFactureDB(updates);
  
  // Préparer les données pour l'insertion en base
  const preparedUpdates = prepareFactureForDb(dbUpdates);
  
  const { data, error } = await supabase
    .from('factures')
    .update(preparedUpdates as any)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Erreur lors de la mise à jour de la facture ${id}:`, error);
    throw error;
  }
  
  return convertToFacture(data as unknown as FactureDB);
};
