
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";

export async function updateClient(id: string, updates: Partial<Client>) {
  console.log("Updating client:", id, updates);
  console.log("Updating regimefiscal to:", updates.regimefiscal);
  
  if (!updates.regimefiscal) {
    console.warn("WARNING: No regimefiscal found in updates. This might cause issues!");
  }
  
  // Format the data properly for Supabase
  const { igs, ...otherUpdates } = updates;
  
  // Basic client data with explicit field handling
  const clientData: any = {};
  
  // Copy all direct fields from updates
  Object.keys(otherUpdates).forEach(key => {
    if (key !== 'adresse' && key !== 'contact' && key !== 'situationimmobiliere' && key !== 'fiscal_data') {
      clientData[key] = (otherUpdates as any)[key];
    }
  });
  
  // Ensure regimefiscal is properly captured
  if (updates.regimefiscal !== undefined) {
    clientData.regimefiscal = updates.regimefiscal;
    console.log("Setting regimefiscal in database to:", updates.regimefiscal);
  }
  
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
  
  console.log("Final client data to update:", clientData);
  console.log("Checking if regimefiscal is in final update data:", clientData.regimefiscal);
  
  if (!clientData.regimefiscal) {
    console.error("ERROR: regimefiscal is missing in final update data!");
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
  
  console.log("Client updated successfully, returned data:", data);
  console.log("Returned regimefiscal from database:", data.regimefiscal);
  
  // Convert the returned data to match our Client interface
  const clientResult = data as unknown as Client;
  return clientResult;
}
