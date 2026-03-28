
import { Facture, Prestation } from "@/types/facture";
import { supabase } from "@/integrations/supabase/client";
import { getNextFactureNumber } from "./factureServices/factureNumberService";
import { transformClient } from "./factureTransformUtils";

export const factureCreationService = {
  async createFacture(factureData: Facture): Promise<Facture> {
    try {
      // Generate proper facture number: N° XXXX/YYYY/MM
      const numero = await getNextFactureNumber();
      const factureId = numero;

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

      // Persist prestations to facture_prestations table
      if (factureData.prestations && factureData.prestations.length > 0) {
        const prestationsToInsert = factureData.prestations.map((p) => ({
          id: `FPRE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          facture_id: factureId,
          description: p.description,
          type: p.type || "honoraire",
          quantite: p.quantite,
          prix_unitaire: p.prix_unitaire,
          montant: p.montant,
        }));

        const { error: prestationsError } = await (supabase as any)
          .from("facture_prestations")
          .insert(prestationsToInsert);

        if (prestationsError) {
          console.error("Erreur lors de l'insertion des prestations:", prestationsError);
          // Don't throw - facture was created, prestations insert is secondary
        }
      }

      // Calculate totals by type
      const montant_impots = (factureData.prestations || [])
        .filter(p => p.type === "impot")
        .reduce((sum, p) => sum + p.montant, 0);
      const montant_honoraires = (factureData.prestations || [])
        .filter(p => p.type === "honoraire")
        .reduce((sum, p) => sum + p.montant, 0);

      return {
        ...data,
        numero: factureId,
        mode: data.mode_paiement,
        status: data.status as "brouillon" | "envoyée" | "annulée",
        status_paiement: data.status_paiement as "non_payée" | "partiellement_payée" | "payée" | "en_retard",
        prestations: factureData.prestations || [],
        montant_impots,
        montant_honoraires,
        client: transformClient(data.client)
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

      // Fetch prestations
      const { data: prestationsData } = await (supabase as any)
        .from("facture_prestations")
        .select("*")
        .eq("facture_id", id);

      const prestations: Prestation[] = (prestationsData || []).map((p: any) => ({
        id: p.id,
        description: p.description,
        type: p.type || "honoraire",
        quantite: p.quantite,
        prix_unitaire: p.prix_unitaire,
        montant: p.montant,
      }));

      const montant_impots = prestations
        .filter(p => p.type === "impot")
        .reduce((sum, p) => sum + p.montant, 0);
      const montant_honoraires = prestations
        .filter(p => p.type === "honoraire")
        .reduce((sum, p) => sum + p.montant, 0);

      return {
        ...data,
        numero: data.id,
        mode: data.mode_paiement,
        status: data.status as "brouillon" | "envoyée" | "annulée",
        status_paiement: data.status_paiement as "non_payée" | "partiellement_payée" | "payée" | "en_retard",
        prestations,
        montant_impots,
        montant_honoraires,
        client: transformClient(data.client)
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de la facture:', error);
      throw error;
    }
  },

  async deleteFacture(id: string): Promise<void> {
    try {
      // Delete prestations first
      await (supabase as any)
        .from("facture_prestations")
        .delete()
        .eq("facture_id", id);

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
