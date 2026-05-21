import { supabase } from "@/integrations/supabase/client";
import { Facture, Prestation } from "@/types/facture";
import { Paiement } from "@/types/paiement";
import { transformClient } from "./factureTransformUtils";

export const factureDataService = {
  async getFactures(): Promise<Facture[]> {
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
    if (!data || data.length === 0) return [];

    // Fetch all prestations for all factures (best-effort)
    const factureIds = data.map((f) => f.id);
    const { data: prestationsData } = await supabase
      .from("facture_prestations")
      .select("*")
      .in("facture_id", factureIds);

    // Group prestations by facture_id
    const prestationsMap: Record<string, Prestation[]> = {};
    if (prestationsData) {
      for (const p of prestationsData) {
        if (!prestationsMap[p.facture_id]) {
          prestationsMap[p.facture_id] = [];
        }
        prestationsMap[p.facture_id].push({
          id: p.id,
          description: p.description,
          type: (p.type || "honoraire") as Prestation["type"],
          quantite: p.quantite,
          prix_unitaire: p.prix_unitaire,
          montant: p.montant,
        });
      }
    }

    return data.map(facture => {
      const prestations = prestationsMap[facture.id] || [];
      const montant_impots = prestations
        .filter(p => p.type === "impot")
        .reduce((sum, p) => sum + p.montant, 0);
      const montant_honoraires = prestations
        .filter(p => p.type === "honoraire")
        .reduce((sum, p) => sum + p.montant, 0);

      return {
        id: facture.id,
        numero: facture.id,
        client_id: facture.client_id,
        date: facture.date,
        echeance: facture.echeance,
        montant: facture.montant || 0,
        montant_paye: facture.montant_paye || 0,
        montant_impots,
        montant_honoraires,
        status: facture.status as "brouillon" | "envoyée" | "annulée",
        status_paiement: facture.status_paiement as "non_payée" | "partiellement_payée" | "payée" | "en_retard",
        mode: facture.mode_paiement || "",
        notes: facture.notes || "",
        created_at: facture.created_at,
        updated_at: facture.updated_at,
        prestations,
        client: transformClient(facture.client)
      };
    });
  },

  async getFacture(id: string): Promise<Facture | null> {
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
    if (!data) return null;

    // Fetch prestations for this facture
    const { data: prestationsData } = await supabase
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
      id: data.id,
      numero: data.id,
      client_id: data.client_id,
      date: data.date,
      echeance: data.echeance,
      montant: data.montant || 0,
      montant_paye: data.montant_paye || 0,
      montant_impots,
      montant_honoraires,
      status: data.status as "brouillon" | "envoyée" | "annulée",
      status_paiement: data.status_paiement as "non_payée" | "partiellement_payée" | "payée" | "en_retard",
      mode: data.mode_paiement || "",
      notes: data.notes || "",
      created_at: data.created_at,
      updated_at: data.updated_at,
      prestations,
      client: transformClient(data.client)
    };
  },

  async updateFacture(id: string, updates: Partial<Facture>): Promise<Facture | null> {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.client_id !== undefined) dbUpdates.client_id = updates.client_id;
    if (updates.date !== undefined) dbUpdates.date = updates.date;
    if (updates.echeance !== undefined) dbUpdates.echeance = updates.echeance;
    if (updates.montant !== undefined) dbUpdates.montant = updates.montant;
    if (updates.montant_paye !== undefined) dbUpdates.montant_paye = updates.montant_paye;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.status_paiement !== undefined) dbUpdates.status_paiement = updates.status_paiement;
    if (updates.mode !== undefined) dbUpdates.mode_paiement = updates.mode;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
    dbUpdates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('factures')
      .update(dbUpdates)
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

    // If prestations provided, delete old and insert new
    if (updates.prestations) {
      await supabase
        .from("facture_prestations")
        .delete()
        .eq("facture_id", id);

      if (updates.prestations.length > 0) {
        const prestationsToInsert = updates.prestations.map((p) => ({
          id: `FPRE-${crypto.randomUUID()}`,
          facture_id: id,
          description: p.description,
          type: p.type || "honoraire",
          quantite: p.quantite,
          prix_unitaire: p.prix_unitaire,
          montant: p.montant,
        }));

        await supabase
          .from("facture_prestations")
          .insert(prestationsToInsert);
      }
    }

    // Fetch current prestations
    const { data: prestationsData } = await supabase
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

    return data ? {
      id: data.id,
      numero: data.id,
      client_id: data.client_id,
      date: data.date,
      echeance: data.echeance,
      montant: data.montant || 0,
      montant_paye: data.montant_paye || 0,
      montant_impots,
      montant_honoraires,
      status: data.status as "brouillon" | "envoyée" | "annulée",
      status_paiement: data.status_paiement as "non_payée" | "partiellement_payée" | "payée" | "en_retard",
      mode: data.mode_paiement || "",
      notes: data.notes || "",
      created_at: data.created_at,
      updated_at: data.updated_at,
      prestations,
      client: transformClient(data.client)
    } : null;
  },

  async deleteFacture(id: string): Promise<void> {
    // Delete prestations first
    await supabase
      .from("facture_prestations")
      .delete()
      .eq("facture_id", id);

    const { error } = await supabase
      .from('factures')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getPaiementsForFacture(factureId: string): Promise<Paiement[]> {
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
  },

  async addPaiementToFacture(factureId: string, paiement: Omit<Paiement, 'id' | 'created_at'>): Promise<Paiement> {
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
  },

  async deletePaiement(paiementId: string): Promise<void> {
    const { error } = await supabase
      .from('paiements')
      .delete()
      .eq('id', paiementId);

    if (error) throw error;
  },
};

// Export for backward compatibility
export const getFacturesData = factureDataService.getFactures;
