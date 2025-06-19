import { supabase } from "@/integrations/supabase/client";
import { Facture } from "@/types/facture";

export const updateFactureInDatabase = async (facture: Facture): Promise<Facture> => {
  try {
    const { data, error } = await supabase
      .from('factures')
      .update({
        client_id: facture.client_id,
        date: facture.date,
        echeance: facture.echeance,
        montant: facture.montant,
        status: facture.status,
        status_paiement: facture.status_paiement,
        mode_paiement: facture.mode,
        notes: facture.notes
      })
      .eq('id', facture.id)
      .select(`
        *,
        client:clients(
          id,
          nom,
          raisonsociale,
          contact,
          adresse,
          type
        )
      `)
      .single();

    if (error) throw error;
    
    // Transform the client data to match the expected format
    const transformedClient = data.client ? {
      id: data.client.id,
      nom: data.client.type === "physique" ? data.client.nom || "" : data.client.raisonsociale || "",
      adresse: typeof data.client.adresse === 'object' && data.client.adresse && 'ville' in data.client.adresse ? 
        String(data.client.adresse.ville) : "",
      telephone: typeof data.client.contact === 'object' && data.client.contact && 'telephone' in data.client.contact ? 
        String(data.client.contact.telephone) : "",
      email: typeof data.client.contact === 'object' && data.client.contact && 'email' in data.client.contact ? 
        String(data.client.contact.email) : ""
    } : undefined;
    
    return {
      ...data,
      mode: data.mode_paiement,
      status: data.status as "brouillon" | "envoyée" | "annulée",
      status_paiement: data.status_paiement as "non_payée" | "partiellement_payée" | "payée" | "en_retard",
      prestations: [],
      client: transformedClient
    };
  } catch (error) {
    console.error('Error updating facture:', error);
    throw error;
  }
};

// Keep the existing service structure for backward compatibility
export const updateFactureService = {
  updateFacture: updateFactureInDatabase
};
