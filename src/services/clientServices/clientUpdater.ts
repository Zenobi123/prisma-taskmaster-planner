
import { supabase } from "@/integrations/supabase/client";
import { Client, RegimeFiscal, RegimeFiscalPhysique, RegimeFiscalMorale } from "@/types/client";

export async function updateClient(id: string, updates: Partial<Client>) {
  console.log("Updating client:", id);
  console.log("Full update data:", JSON.stringify(updates, null, 2));
  console.log("Updating regimefiscal to:", updates.regimefiscal);
  
  if (!updates.regimefiscal) {
    console.warn("WARNING: No regimefiscal found in updates. This might cause issues!");
    
    // Récupérer le client actuel pour connaître son type et définir une valeur par défaut
    const { data: currentClient, error: fetchError } = await supabase
      .from("clients")
      .select("type, regimefiscal")
      .eq("id", id)
      .single();
      
    if (!fetchError && currentClient) {
      // Ensure proper RegimeFiscal type with type assertion
      const defaultRegime: RegimeFiscal = currentClient.type === "physique" ? "reel" : "simplifie";
      updates.regimefiscal = (currentClient.regimefiscal as RegimeFiscal) || defaultRegime;
      console.log("Set regimefiscal fallback based on existing client:", updates.regimefiscal);
    }
  } else {
    // Ensure that the regimefiscal value is properly typed
    console.log("Validating regimefiscal type:", updates.regimefiscal);
    
    // Verify that the provided regime fiscal is one of the allowed values
    const validPhysiqueRegimes: RegimeFiscalPhysique[] = ["reel", "igs", "non_professionnel_salarie", "non_professionnel_autre"];
    const validMoraleRegimes: RegimeFiscalMorale[] = ["reel", "simplifie", "non_lucratif"];
    
    if (updates.type === "physique") {
      if (!validPhysiqueRegimes.includes(updates.regimefiscal as RegimeFiscalPhysique)) {
        console.warn(`Invalid regime fiscal for type physique: ${updates.regimefiscal}, defaulting to 'reel'`);
        updates.regimefiscal = "reel";
      }
    } else {
      if (!validMoraleRegimes.includes(updates.regimefiscal as RegimeFiscalMorale)) {
        console.warn(`Invalid regime fiscal for type morale: ${updates.regimefiscal}, defaulting to 'simplifie'`);
        updates.regimefiscal = "simplifie";
      }
    }
    
    console.log("Final regimefiscal after validation:", updates.regimefiscal);
  }
  
  // Données client de base avec gestion explicite des champs
  const clientData: any = {};
  
  // Copier tous les champs directs depuis updates
  Object.keys(updates).forEach(key => {
    if (key !== 'adresse' && key !== 'contact' && key !== 'situationimmobiliere' && 
        key !== 'fiscal_data' && key !== 'igs') {
      clientData[key] = (updates as any)[key];
    }
  });
  
  // S'assurer explicitement que regimefiscal est défini dans les données à enregistrer
  if (updates.regimefiscal !== undefined) {
    clientData.regimefiscal = updates.regimefiscal;
    console.log("Setting regimefiscal in database to:", updates.regimefiscal);
  }
  
  // Gérer les champs spéciaux comme adresse, contact et objets personnalisés
  if (updates.adresse) {
    clientData.adresse = updates.adresse;
  }
  
  if (updates.contact) {
    clientData.contact = updates.contact;
  }
  
  // Gérer la situation immobilière spécifiquement
  if (updates.situationimmobiliere) {
    clientData.situationimmobiliere = updates.situationimmobiliere;
  }
  
  // Extraire et traiter les données IGS et fiscal_data
  const { igs, fiscal_data } = updates;
  
  // S'assurer que fiscal_data existe
  if (fiscal_data) {
    console.log("Updating fiscal_data:", fiscal_data);
    clientData.fiscal_data = fiscal_data;
  }
  
  // Ajouter les données IGS si présentes
  if (igs) {
    console.log("Updating client IGS data:", igs);
    
    // Si fiscal_data n'existe pas, l'initialiser
    if (!clientData.fiscal_data) {
      clientData.fiscal_data = {};
    }
    
    // Stocker les données IGS à la fois dans l'objet igs du client (pour rétrocompatibilité)
    // et dans fiscal_data.igs pour la nouvelle structure
    clientData.igs = igs;
    clientData.fiscal_data.igs = {
      ...clientData.fiscal_data.igs,
      soumisIGS: igs.soumisIGS !== undefined ? igs.soumisIGS : false,
      adherentCGA: igs.adherentCGA !== undefined ? igs.adherentCGA : false,
      classeIGS: igs.classeIGS,
      patente: igs.patente,
      acompteJanvier: igs.acompteJanvier,
      acompteFevrier: igs.acompteFevrier,
      chiffreAffairesAnnuel: igs.chiffreAffairesAnnuel || 0,
      etablissements: Array.isArray(igs.etablissements) ? igs.etablissements : []
    };
  }
  
  console.log("Final client data to update:", JSON.stringify(clientData, null, 2));
  
  if (!clientData.regimefiscal) {
    console.error("ERROR: regimefiscal is still missing in final update data!");
  }
  
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
