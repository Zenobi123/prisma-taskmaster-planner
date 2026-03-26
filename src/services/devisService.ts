
import { supabase } from "@/integrations/supabase/client";
import { Devis, DevisFormData, DevisPrestation } from "@/types/devis";

// Helper to get next devis number: DEV-0001/YYYY/MM
export async function getNextDevisNumber(): Promise<string> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  const { data, error } = await (supabase as any)
    .from("devis")
    .select("numero")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur lors de la récupération du numéro de devis:", error);
  }

  const count = data ? data.length + 1 : 1;
  const sequence = String(count).padStart(4, "0");

  return `DEV-${sequence}/${year}/${month}`;
}

// Fetch all devis with client info
export async function getDevis(): Promise<Devis[]> {
  const { data, error } = await (supabase as any)
    .from("devis")
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
    console.error("Erreur lors de la récupération des devis:", error);
    throw error;
  }

  if (!data) return [];

  // Fetch prestations for each devis
  const devisIds = data.map((d: any) => d.id);
  const { data: prestationsData, error: prestationsError } = await (supabase as any)
    .from("devis_prestations")
    .select("*")
    .in("devis_id", devisIds);

  if (prestationsError) {
    console.error("Erreur lors de la récupération des prestations:", prestationsError);
  }

  const prestationsMap: Record<string, DevisPrestation[]> = {};
  if (prestationsData) {
    for (const p of prestationsData) {
      if (!prestationsMap[p.devis_id]) {
        prestationsMap[p.devis_id] = [];
      }
      prestationsMap[p.devis_id].push({
        id: p.id,
        description: p.description,
        type: p.type,
        quantite: p.quantite,
        prix_unitaire: p.prix_unitaire,
        montant: p.montant,
      });
    }
  }

  return data.map((d: any) => {
    const prestations = prestationsMap[d.id] || [];
    const montant_impots = prestations
      .filter((p: DevisPrestation) => p.type === "impot")
      .reduce((sum: number, p: DevisPrestation) => sum + p.montant, 0);
    const montant_honoraires = prestations
      .filter((p: DevisPrestation) => p.type === "honoraire")
      .reduce((sum: number, p: DevisPrestation) => sum + p.montant, 0);

    // Transform client data to match Devis.client shape
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
      date_validite: d.date_validite,
      objet: d.objet,
      status: d.status,
      prestations,
      montant_total: d.montant_total,
      montant_impots,
      montant_honoraires,
      notes: d.notes,
      facture_id: d.facture_id,
      created_at: d.created_at,
      updated_at: d.updated_at,
    } as Devis;
  });
}

// Create a new devis
export async function createDevis(data: DevisFormData): Promise<Devis> {
  const devisId = `DEV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const numero = await getNextDevisNumber();

  const montant_total = data.prestations.reduce((sum, p) => sum + p.montant, 0);

  const { data: devisData, error } = await (supabase as any)
    .from("devis")
    .insert({
      id: devisId,
      numero,
      client_id: data.client_id,
      date: data.date,
      date_validite: data.date_validite,
      objet: data.objet,
      status: data.status,
      montant_total,
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
    console.error("Erreur lors de la création du devis:", error);
    throw error;
  }

  // Insert prestations
  if (data.prestations.length > 0) {
    const prestationsToInsert = data.prestations.map((p) => ({
      id: `DPRE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      devis_id: devisId,
      description: p.description,
      type: p.type,
      quantite: p.quantite,
      prix_unitaire: p.prix_unitaire,
      montant: p.montant,
    }));

    const { error: prestationsError } = await (supabase as any)
      .from("devis_prestations")
      .insert(prestationsToInsert);

    if (prestationsError) {
      console.error("Erreur lors de l'insertion des prestations:", prestationsError);
      throw prestationsError;
    }
  }

  const transformedClient = devisData.client
    ? {
        id: devisData.client.id,
        nom:
          devisData.client.type === "physique"
            ? devisData.client.nom || ""
            : devisData.client.raisonsociale || "",
        adresse:
          typeof devisData.client.adresse === "object" &&
          devisData.client.adresse &&
          "ville" in devisData.client.adresse
            ? String(devisData.client.adresse.ville)
            : "",
        telephone:
          typeof devisData.client.contact === "object" &&
          devisData.client.contact &&
          "telephone" in devisData.client.contact
            ? String(devisData.client.contact.telephone)
            : "",
        email:
          typeof devisData.client.contact === "object" &&
          devisData.client.contact &&
          "email" in devisData.client.contact
            ? String(devisData.client.contact.email)
            : "",
      }
    : undefined;

  const montant_impots = data.prestations
    .filter((p) => p.type === "impot")
    .reduce((sum, p) => sum + p.montant, 0);
  const montant_honoraires = data.prestations
    .filter((p) => p.type === "honoraire")
    .reduce((sum, p) => sum + p.montant, 0);

  return {
    ...devisData,
    client: transformedClient,
    prestations: data.prestations,
    montant_impots,
    montant_honoraires,
  } as Devis;
}

// Update a devis
export async function updateDevis(id: string, data: Partial<DevisFormData>): Promise<void> {
  const updatePayload: Record<string, any> = {};

  if (data.client_id !== undefined) updatePayload.client_id = data.client_id;
  if (data.date !== undefined) updatePayload.date = data.date;
  if (data.date_validite !== undefined) updatePayload.date_validite = data.date_validite;
  if (data.objet !== undefined) updatePayload.objet = data.objet;
  if (data.status !== undefined) updatePayload.status = data.status;
  if (data.notes !== undefined) updatePayload.notes = data.notes;

  if (data.prestations) {
    const montant_total = data.prestations.reduce((sum, p) => sum + p.montant, 0);
    updatePayload.montant_total = montant_total;
  }

  updatePayload.updated_at = new Date().toISOString();

  const { error } = await (supabase as any)
    .from("devis")
    .update(updatePayload)
    .eq("id", id);

  if (error) {
    console.error("Erreur lors de la mise à jour du devis:", error);
    throw error;
  }

  // If prestations provided, delete old and insert new
  if (data.prestations) {
    const { error: deleteError } = await (supabase as any)
      .from("devis_prestations")
      .delete()
      .eq("devis_id", id);

    if (deleteError) {
      console.error("Erreur lors de la suppression des prestations:", deleteError);
      throw deleteError;
    }

    if (data.prestations.length > 0) {
      const prestationsToInsert = data.prestations.map((p) => ({
        id: `DPRE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        devis_id: id,
        description: p.description,
        type: p.type,
        quantite: p.quantite,
        prix_unitaire: p.prix_unitaire,
        montant: p.montant,
      }));

      const { error: insertError } = await (supabase as any)
        .from("devis_prestations")
        .insert(prestationsToInsert);

      if (insertError) {
        console.error("Erreur lors de l'insertion des prestations:", insertError);
        throw insertError;
      }
    }
  }
}

// Delete a devis
export async function deleteDevis(id: string): Promise<void> {
  const { error } = await (supabase as any)
    .from("devis")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erreur lors de la suppression du devis:", error);
    throw error;
  }
}

// Convert devis to facture
export async function convertDevisToFacture(devisId: string): Promise<string> {
  // Get the devis with prestations
  const { data: devisData, error: devisError } = await (supabase as any)
    .from("devis")
    .select("*")
    .eq("id", devisId)
    .single();

  if (devisError || !devisData) {
    console.error("Erreur lors de la récupération du devis:", devisError);
    throw devisError || new Error("Devis introuvable");
  }

  // Get prestations
  const { data: prestationsData } = await (supabase as any)
    .from("devis_prestations")
    .select("*")
    .eq("devis_id", devisId);

  // Create a facture from the devis using factureCreationService pattern
  const factureId = `FAC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date();
  const echeance = new Date(now);
  echeance.setDate(echeance.getDate() + 30);

  const { error: factureError } = await supabase
    .from("factures")
    .insert({
      id: factureId,
      client_id: devisData.client_id,
      date: now.toISOString().split("T")[0],
      echeance: echeance.toISOString().split("T")[0],
      montant: devisData.montant_total,
      status: "brouillon",
      status_paiement: "non_payée",
      notes: devisData.notes || null,
    });

  if (factureError) {
    console.error("Erreur lors de la création de la facture:", factureError);
    throw factureError;
  }

  // Update devis status to "converti" and set facture_id
  const { error: updateError } = await (supabase as any)
    .from("devis")
    .update({
      status: "converti",
      facture_id: factureId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", devisId);

  if (updateError) {
    console.error("Erreur lors de la mise à jour du devis:", updateError);
    throw updateError;
  }

  return factureId;
}
