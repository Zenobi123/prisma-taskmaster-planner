
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";

export async function updateClient(id: string, updates: Partial<Client>) {
  console.log("Updating client:", id, updates);
  
  // Format the data properly for Supabase
  const { igs, ...otherUpdates } = updates;
  
  // Basic client data
  const clientData: any = {
    ...otherUpdates,
  };
  
  // Handle special fields like address, contact and custom objects
  if (updates.adresse) {
    clientData.adresse = updates.adresse;
  }
  
  if (updates.contact) {
    clientData.contact = updates.contact;
  }
  
  // Handle situation immobiliere specifically
  if (updates.situationimmobiliere) {
    clientData.situationimmobiliere = updates.situationimmobiliere;
  }
  
  // Handle IGS data by storing it in the fiscal_data JSON field
  if (igs) {
    clientData.fiscal_data = {
      ...(otherUpdates.fiscal_data || {}),
      igs: {
        soumisIGS: igs.soumisIGS !== undefined ? igs.soumisIGS : false,
        adherentCGA: igs.adherentCGA !== undefined ? igs.adherentCGA : false,
        classeIGS: igs.classeIGS,
        patente: igs.patente,
        acompteJanvier: igs.acompteJanvier,
        acompteFevrier: igs.acompteFevrier
      }
    };
  }
  
  // Update the client in Supabase
  const { data, error } = await supabase
    .from("clients")
    .update(clientData)
    .eq("id", id)
    .select()
    .single();
    
  if (error) {
    console.error("Error updating client:", error);
    throw new Error(`Failed to update client: ${error.message}`);
  }
  
  // Convert the returned data to match our Client interface
  const clientResult = data as unknown as Client;
  return clientResult;
}
