
import { Facture } from "@/types/facture";
import { supabase } from "@/integrations/supabase/client";

export const factureCreationService = {
  async createFacture(factureData: Facture): Promise<Facture> {
    try {
      // Generate a unique ID for the facture
      const factureId = `FAC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const { data, error } = await supabase
        .from('factures')
        .insert({
          id: factureId,
          client_id: factureData.client_id,
          date: factureData.date,
          echeance: factureData.echeance,
          montant: factureData.montant,
          status: factureData.status,
          status_paiement: factureData.status_paiement,
          mode_paiement: factureData.mode,
          notes: factureData.notes
        })
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
        prestations: factureData.prestations || [],
        client: transformedClient
      };
    } catch (error) {
      console.error('Erreur lors de la création de la facture:', error);
      throw error;
    }
  },

  async getFactureById(id: string): Promise<Facture | null> {
    try {
      const { data, error } = await supabase
        .from('factures')
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
        .eq('id', id)
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
      console.error('Erreur lors de la récupération de la facture:', error);
      throw error;
    }
  },

  async deleteFacture(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('factures')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erreur lors de la suppression de la facture:', error);
      throw error;
    }
  },
};
