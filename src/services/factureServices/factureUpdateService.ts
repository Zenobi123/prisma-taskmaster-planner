
import { supabase } from "@/integrations/supabase/client";
import { Facture } from "@/types/facture";

export const updateFactureService = {
  async updateFacture(id: string, updates: Partial<Facture>): Promise<Facture> {
    try {
      const { data, error } = await supabase
        .from('factures')
        .update({
          client_id: updates.client_id,
          date: updates.date,
          echeance: updates.echeance,
          montant: updates.montant,
          status: updates.status,
          status_paiement: updates.status_paiement,
          mode_paiement: updates.mode,
          notes: updates.notes
        })
        .eq('id', id)
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
  }
};
