
import { supabase } from "@/integrations/supabase/client";
import { Proposition, PropositionFormData, PropositionLigne } from "@/types/proposition";

// Helper to get next proposition number: PROP-0001/YYYY/MM
export async function getNextPropositionNumber(): Promise<string> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  const { data, error } = await (supabase as any)
    .from("propositions")
    .select("numero")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur lors de la récupération du numéro de proposition:", error);
  }

  const count = data ? data.length + 1 : 1;
  const sequence = String(count).padStart(4, "0");

  return `PROP-${sequence}/${year}/${month}`;
}

// Calculate totals from lignes array
function calculateTotals(lignes: PropositionLigne[]) {
  const total_impots = lignes
    .filter((l) => l.type === "impot")
    .reduce((sum, l) => sum + l.montant, 0);
  const total_honoraires = lignes
    .filter((l) => l.type === "honoraire")
    .reduce((sum, l) => sum + l.montant, 0);
  const total = total_impots + total_honoraires;

  return { total, total_impots, total_honoraires };
}

// Fetch all propositions with client info
export async function getPropositions(): Promise<Proposition[]> {
  const { data, error } = await (supabase as any)
    .from("propositions")
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
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur lors de la récupération des propositions:", error);
    throw error;
  }

  if (!data) return [];

  return data.map((d: any) => {
    const lignes: PropositionLigne[] = Array.isArray(d.lignes)
      ? d.lignes
      : typeof d.lignes === "string"
        ? JSON.parse(d.lignes)
        : [];

    const { total, total_impots, total_honoraires } = calculateTotals(lignes);

    // Transform client data to match Proposition.client shape
    const transformedClient = d.client
      ? {
          id: d.client.id,
          nom:
            d.client.type === "physique"
              ? d.client.nom || ""
              : d.client.raisonsociale || "",
          adresse:
            typeof d.client.adresse === "object" &&
            d.client.adresse &&
            "ville" in d.client.adresse
              ? String(d.client.adresse.ville)
              : "",
          telephone:
            typeof d.client.contact === "object" &&
            d.client.contact &&
            "telephone" in d.client.contact
              ? String(d.client.contact.telephone)
              : "",
          email:
            typeof d.client.contact === "object" &&
            d.client.contact &&
            "email" in d.client.contact
              ? String(d.client.contact.email)
              : "",
        }
      : undefined;

    return {
      id: d.id,
      numero: d.numero,
      client_id: d.client_id,
      client: transformedClient,
      date: d.date,
      date_manuelle: d.date_manuelle,
      source_type: d.source_type || null,
      source_id: d.source_id || null,
      source_numero: d.source_numero || null,
      lignes,
      total,
      total_impots,
      total_honoraires,
      status: d.status,
      notes: d.notes,
      created_at: d.created_at,
      updated_at: d.updated_at,
    } as Proposition;
  });
}

// Create a new proposition
export async function createProposition(data: PropositionFormData): Promise<Proposition> {
  const propositionId = `PROP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const numero = await getNextPropositionNumber();

  const { total, total_impots, total_honoraires } = calculateTotals(data.lignes);

  const { data: propositionData, error } = await (supabase as any)
    .from("propositions")
    .insert({
      id: propositionId,
      numero,
      client_id: data.client_id,
      date: data.date,
      date_manuelle: data.date_manuelle,
      source_type: data.source_type || null,
      source_id: data.source_id || null,
      source_numero: data.source_numero || null,
      lignes: data.lignes,
      total,
      total_impots,
      total_honoraires,
      status: data.status,
      notes: data.notes || null,
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

  if (error) {
    console.error("Erreur lors de la création de la proposition:", error);
    throw error;
  }

  const transformedClient = propositionData.client
    ? {
        id: propositionData.client.id,
        nom:
          propositionData.client.type === "physique"
            ? propositionData.client.nom || ""
            : propositionData.client.raisonsociale || "",
        adresse:
          typeof propositionData.client.adresse === "object" &&
          propositionData.client.adresse &&
          "ville" in propositionData.client.adresse
            ? String(propositionData.client.adresse.ville)
            : "",
        telephone:
          typeof propositionData.client.contact === "object" &&
          propositionData.client.contact &&
          "telephone" in propositionData.client.contact
            ? String(propositionData.client.contact.telephone)
            : "",
        email:
          typeof propositionData.client.contact === "object" &&
          propositionData.client.contact &&
          "email" in propositionData.client.contact
            ? String(propositionData.client.contact.email)
            : "",
      }
    : undefined;

  return {
    id: propositionData.id,
    numero: propositionData.numero,
    client_id: propositionData.client_id,
    client: transformedClient,
    date: propositionData.date,
    date_manuelle: propositionData.date_manuelle,
    source_type: propositionData.source_type || null,
    source_id: propositionData.source_id || null,
    source_numero: propositionData.source_numero || null,
    lignes: data.lignes,
    total,
    total_impots,
    total_honoraires,
    status: propositionData.status,
    notes: propositionData.notes,
    created_at: propositionData.created_at,
    updated_at: propositionData.updated_at,
  } as Proposition;
}

// Update a proposition
export async function updateProposition(id: string, data: Partial<PropositionFormData>): Promise<void> {
  const updatePayload: Record<string, any> = {};

  if (data.client_id !== undefined) updatePayload.client_id = data.client_id;
  if (data.date !== undefined) updatePayload.date = data.date;
  if (data.date_manuelle !== undefined) updatePayload.date_manuelle = data.date_manuelle;
  if (data.source_type !== undefined) updatePayload.source_type = data.source_type;
  if (data.source_id !== undefined) updatePayload.source_id = data.source_id;
  if (data.source_numero !== undefined) updatePayload.source_numero = data.source_numero;
  if (data.status !== undefined) updatePayload.status = data.status;
  if (data.notes !== undefined) updatePayload.notes = data.notes;

  if (data.lignes) {
    const { total, total_impots, total_honoraires } = calculateTotals(data.lignes);
    updatePayload.lignes = data.lignes;
    updatePayload.total = total;
    updatePayload.total_impots = total_impots;
    updatePayload.total_honoraires = total_honoraires;
  }

  updatePayload.updated_at = new Date().toISOString();

  const { error } = await (supabase as any)
    .from("propositions")
    .update(updatePayload)
    .eq("id", id);

  if (error) {
    console.error("Erreur lors de la mise à jour de la proposition:", error);
    throw error;
  }
}

// Delete a proposition
export async function deleteProposition(id: string): Promise<void> {
  const { error } = await (supabase as any)
    .from("propositions")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erreur lors de la suppression de la proposition:", error);
    throw error;
  }
}
