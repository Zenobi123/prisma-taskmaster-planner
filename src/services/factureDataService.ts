import { supabase } from "@/integrations/supabase/client";
import { Facture } from "@/types/facture";
import { Paiement } from "@/types/paiement";

export const factureDataService = {
  async getFactures(): Promise<Facture[]> {
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
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match Facture type
      return data?.map(facture => {
        const transformedClient = facture.client ? {
          id: facture.client.id,
          nom: facture.client.type === "physique" ? facture.client.nom || "" : facture.client.raisonsociale || "",
          adresse: typeof facture.client.adresse === 'object' && facture.client.adresse && 'ville' in facture.client.adresse ? 
            String(facture.client.adresse.ville) : "",
          telephone: typeof facture.client.contact === 'object' && facture.client.contact && 'telephone' in facture.client.contact ? 
            String(facture.client.contact.telephone) : "",
          email: typeof facture.client.contact === 'object' && facture.client.contact && 'email' in facture.client.contact ? 
            String(facture.client.contact.email) : ""
        } : undefined;

        return {
          id: facture.id,
          client_id: facture.client_id,
          date: facture.date,
          echeance: facture.echeance,
          montant: facture.montant || 0,
          montant_paye: facture.montant_paye || 0,
          status: facture.status as "brouillon" | "envoyée" | "annulée",
          status_paiement: facture.status_paiement as "non_payée" | "partiellement_payée" | "payée" | "en_retard",
          mode: facture.mode_paiement || "",
          notes: facture.notes || "",
          created_at: facture.created_at,
          updated_at: facture.updated_at,
          prestations: [], // Add empty prestations array as required by Facture type
          client: transformedClient
        };
      }) || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des factures:', error);
      throw error;
    }
  },

  async getFacture(id: string): Promise<Facture | null> {
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

      if (!data) {
        return null;
      }

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
        id: data.id,
        client_id: data.client_id,
        date: data.date,
        echeance: data.echeance,
        montant: data.montant || 0,
        montant_paye: data.montant_paye || 0,
        status: data.status as "brouillon" | "envoyée" | "annulée",
        status_paiement: data.status_paiement as "non_payée" | "partiellement_payée" | "payée" | "en_retard",
        mode: data.mode_paiement || "",
        notes: data.notes || "",
        created_at: data.created_at,
        updated_at: data.updated_at,
        prestations: [], // Add empty prestations array as required by Facture type
        client: transformedClient
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de la facture:', error);
      throw error;
    }
  },

  async updateFacture(id: string, updates: Partial<Facture>): Promise<Facture | null> {
    try {
      const { data, error } = await supabase
        .from('factures')
        .update(updates)
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

      return data ? {
        id: data.id,
        client_id: data.client_id,
        date: data.date,
        echeance: data.echeance,
        montant: data.montant || 0,
        montant_paye: data.montant_paye || 0,
        status: data.status as "brouillon" | "envoyée" | "annulée",
        status_paiement: data.status_paiement as "non_payée" | "partiellement_payée" | "payée" | "en_retard",
        mode: data.mode_paiement || "",
        notes: data.notes || "",
        created_at: data.created_at,
        updated_at: data.updated_at,
        prestations: [], // Add empty prestations array as required by Facture type
        client: transformedClient
      } : null;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la facture:', error);
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

  async getPaiementsForFacture(factureId: string): Promise<Paiement[]> {
    try {
      const { data, error } = await supabase
        .from('paiements')
        .select(`
          *,
          facture:factures(id, montant),
          client:clients(id, nom, raisonsociale, type)
        `)
        .eq('facture_id', factureId);

      if (error) throw error;

      return (data || []).map(paiement => ({
        ...paiement,
        facture: paiement.facture || { id: '', montant: 0 },
        client: paiement.client || { id: '', nom: '', raisonsociale: '', type: 'physique' }
      })) as unknown as Paiement[];
    } catch (error) {
      console.error('Erreur lors de la récupération des paiements pour la facture:', error);
      throw error;
    }
  },

  async addPaiementToFacture(factureId: string, paiement: Omit<Paiement, 'id' | 'created_at'>): Promise<Paiement> {
    try {
      const { data, error } = await supabase
        .from('paiements')
        .insert([{ ...paiement, facture_id: factureId }])
        .select(`
          *,
          facture:factures(id, montant),
          client:clients(id, nom, raisonsociale, type)
        `)
        .single();

      if (error) throw error;

      return {
        ...data,
        facture: data.facture || { id: '', montant: 0 },
        client: data.client || { id: '', nom: '', raisonsociale: '', type: 'physique' }
      } as unknown as Paiement;
    } catch (error) {
      console.error('Erreur lors de l\'ajout du paiement à la facture:', error);
      throw error;
    }
  },

  async deletePaiement(paiementId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('paiements')
        .delete()
        .eq('id', paiementId);

      if (error) throw error;
    } catch (error) {
      console.error('Erreur lors de la suppression du paiement:', error);
      throw error;
    }
  },
};

// Export for backward compatibility
export const getFacturesData = factureDataService.getFactures;
