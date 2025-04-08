
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";

/**
 * Adds a new client to the database
 */
export const addClient = async (client: Omit<Client, "id" | "interactions" | "created_at">) => {
  console.log("Données du client à ajouter:", client);
  
  // Initialize fiscal_data with IGS information if present
  const fiscal_data: any = {
    igs: client.igs || {
      soumisIGS: false,
      adherentCGA: false
    }
  };
  
  const { data, error } = await supabase
    .from("clients")
    .insert({
      type: client.type,
      nom: client.nom,
      raisonsociale: client.raisonsociale,
      sigle: client.sigle,
      datecreation: client.datecreation,
      lieucreation: client.lieucreation,
      nomdirigeant: client.nomdirigeant,
      formejuridique: client.formejuridique,
      niu: client.niu,
      centrerattachement: client.centrerattachement,
      adresse: client.adresse,
      contact: client.contact,
      secteuractivite: client.secteuractivite,
      numerocnps: client.numerocnps,
      sexe: client.sexe,
      etatcivil: client.etatcivil,
      regimefiscal: client.regimefiscal,
      situationimmobiliere: client.situationimmobiliere,
      interactions: [],
      statut: "actif",
      gestionexternalisee: client.gestionexternalisee || false,
      fiscal_data: fiscal_data
    })
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de l'ajout du client:", error);
    throw error;
  }

  console.log("Client ajouté avec succès:", data);
  return data;
};
