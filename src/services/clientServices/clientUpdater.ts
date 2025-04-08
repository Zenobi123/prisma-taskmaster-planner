
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";

/**
 * Updates an existing client in the database
 */
export const updateClient = async (id: string, updates: Partial<Omit<Client, "id" | "interactions" | "created_at">>) => {
  console.log("Mise à jour du client:", { id, updates });
  
  // Prepare the update data
  const updateData: any = {
    ...updates,
    // Make sure to format fields correctly for database update
    situationimmobiliere: updates.situationimmobiliere || undefined,
    adresse: updates.adresse || undefined,
    contact: updates.contact || undefined,
  };
  
  // Remove fields that should not be directly updated
  delete updateData.id;
  delete updateData.created_at;
  delete updateData.interactions;
  
  // Handle IGS data by updating the fiscal_data object if IGS data is provided
  if (updates.igs) {
    // First, fetch the current fiscal_data
    const { data: currentClient, error: fetchError } = await supabase
      .from("clients")
      .select("fiscal_data")
      .eq("id", id)
      .single();
      
    if (fetchError) {
      console.error("Erreur lors de la récupération des données fiscales:", fetchError);
      throw fetchError;
    }
    
    // Prepare the updated fiscal_data object
    let updatedFiscalData = currentClient?.fiscal_data || {};
    if (typeof updatedFiscalData !== 'object') {
      updatedFiscalData = {};
    }
    
    // Update the igs field within fiscal_data
    updatedFiscalData = {
      ...updatedFiscalData,
      igs: updates.igs
    };
    
    // Add fiscal_data to update object and remove the standalone igs field
    updateData.fiscal_data = updatedFiscalData;
    delete updateData.igs;
  }

  console.log("Données formatées pour la mise à jour:", updateData);

  const { data, error } = await supabase
    .from("clients")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de la mise à jour du client:", error);
    throw error;
  }

  console.log("Client mis à jour avec succès:", data);
  return data;
};
