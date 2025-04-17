
import { supabase } from "@/integrations/supabase/client";
import { Client, RegimeFiscal, RegimeFiscalPhysique, RegimeFiscalMorale } from "@/types/client";

export async function updateClient(id: string, updates: Partial<Client>) {
  console.log("Updating client:", id);
  console.log("Full update data:", JSON.stringify(updates, null, 2));
  console.log("Updating regimefiscal to:", updates.regimefiscal);
  
  // Récupérer le client actuel pour conserver les données existantes non modifiées
  const { data: currentClient, error: fetchError } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();
    
  if (fetchError) {
    console.error("Error fetching current client data:", fetchError);
    throw new Error(`Failed to fetch current client data: ${fetchError.message}`);
  }
  
  // S'assurer que regimefiscal est correctement défini et préservé
  if (!updates.regimefiscal) {
    console.warn("WARNING: No regimefiscal found in updates. Using existing value.");
    updates.regimefiscal = currentClient.regimefiscal;
    console.log("Using existing regimefiscal:", updates.regimefiscal);
  } else {
    console.log("Using provided regimefiscal:", updates.regimefiscal);
  }
  
  // Préparer les données à mettre à jour
  const clientData = { ...currentClient };
  
  // Mettre à jour avec les nouvelles valeurs, en préservant explicitement le regime fiscal
  Object.keys(updates).forEach(key => {
    if (updates[key as keyof Partial<Client>] !== undefined) {
      clientData[key] = updates[key as keyof Partial<Client>];
    }
  });
  
  // S'assurer explicitement que regimefiscal est défini
  clientData.regimefiscal = updates.regimefiscal || currentClient.regimefiscal;
  console.log("Final regimefiscal to save:", clientData.regimefiscal);
  
  // Gérer les objets IGS correctement
  if (updates.igs) {
    console.log("Updating IGS data:", updates.igs);
    clientData.igs = updates.igs;
    
    // S'assurer que fiscal_data existe
    if (!clientData.fiscal_data) {
      clientData.fiscal_data = {};
    }
    
    // Mettre à jour les données IGS dans fiscal_data.igs aussi
    clientData.fiscal_data.igs = {
      ...clientData.fiscal_data.igs,
      soumisIGS: updates.igs.soumisIGS !== undefined ? updates.igs.soumisIGS : false,
      adherentCGA: updates.igs.adherentCGA !== undefined ? updates.igs.adherentCGA : false,
      classeIGS: updates.igs.classeIGS
    };
  }
  
  // Gérer fiscal_data séparément si fourni
  if (updates.fiscal_data && typeof updates.fiscal_data === 'object') {
    console.log("Updating fiscal_data:", updates.fiscal_data);
    
    // Fusionner avec les données existantes plutôt que de remplacer
    clientData.fiscal_data = {
      ...clientData.fiscal_data,
      ...updates.fiscal_data
    };
  }
  
  console.log("Final client data to update:", JSON.stringify(clientData, null, 2));
  
  // Mettre à jour le client dans Supabase
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
  
  return data as unknown as Client;
}
