
import { Facture } from "@/types/facture";
import { supabase } from "@/integrations/supabase/client";

interface FactureFormData {
  client_id: string;
  date: Date;
  echeance: Date;
  montant: number;
  status: string;
  status_paiement: string;
  mode: string;
  prestations: any[];
  notes: string;
}

export const factureCreationService = {
  async createFacture(factureData: Facture): Promise<Facture> {
    try {
      const { data, error } = await supabase
        .from('factures')
        .insert([{
          client_id: factureData.client_id,
          date: factureData.date,
          echeance: factureData.echeance,
          montant: factureData.montant,
          status: factureData.status,
          status_paiement: factureData.status_paiement,
          mode_paiement: factureData.mode,
          notes: factureData.notes
        }])
        .select('*, client:clients(*)')
        .single();

      if (error) throw error;
      
      return {
        ...data,
        mode: data.mode_paiement,
        prestations: factureData.prestations || []
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
        .select('*, client:clients(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      return {
        ...data,
        mode: data.mode_paiement,
        prestations: data.prestations || []
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
