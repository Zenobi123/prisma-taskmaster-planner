
import { supabase } from "@/integrations/supabase/client";
import { Facture } from "@/types/facture";
import { formatClientData, mapStatusToValidEnum } from "./factureBaseService";
import { getPrestationsByFactureId } from "./prestationService";
import { getPaiementsByFactureId } from "./paiementService";

export const getFactures = async (): Promise<Facture[]> => {
  const { data: factures, error } = await supabase
    .from("factures")
    .select(`
      *,
      client:client_id(
        id,
        nom,
        raisonsociale,
        type,
        contact,
        adresse
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur lors de la récupération des factures:", error);
    throw error;
  }

  // Récupérer les prestations et paiements pour chaque facture
  const facturesCompletes = await Promise.all(
    factures.map(async (facture) => {
      // Récupérer les prestations
      const prestations = await getPrestationsByFactureId(facture.id);

      // Récupérer les paiements
      const paiements = await getPaiementsByFactureId(facture.id);

      // Formater les données client avec validation des types
      const client = formatClientData(facture.client);

      // S'assurer que le statut correspond à un type valide
      const status = mapStatusToValidEnum(facture.status);

      return {
        ...facture,
        client,
        status,
        prestations: prestations || [],
        paiements: paiements || []
      } as Facture;
    })
  );

  return facturesCompletes;
};

export const getFactureById = async (id: string): Promise<Facture> => {
  const { data: facture, error } = await supabase
    .from("factures")
    .select(`
      *,
      client:client_id(
        id,
        nom,
        raisonsociale,
        type,
        contact,
        adresse
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Erreur lors de la récupération de la facture:", error);
    throw error;
  }

  // Récupérer les prestations
  const prestations = await getPrestationsByFactureId(facture.id);

  // Récupérer les paiements
  const paiements = await getPaiementsByFactureId(facture.id);

  // Formater les données client avec validation des types
  const client = formatClientData(facture.client);

  // S'assurer que le statut correspond à un type valide
  const status = mapStatusToValidEnum(facture.status);

  return {
    ...facture,
    client,
    status,
    prestations: prestations || [],
    paiements: paiements || []
  } as Facture;
};

export const createFacture = async (factureData: Omit<Facture, "id" | "client">): Promise<Facture> => {
  // 1. Créer la facture
  const { data: facture, error } = await supabase
    .from("factures")
    .insert({
      client_id: factureData.client_id,
      date: factureData.date,
      echeance: factureData.echeance,
      montant: factureData.montant,
      status: factureData.status,
      notes: factureData.notes
    })
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de la création de la facture:", error);
    throw error;
  }

  // 2. Ajouter les prestations
  if (factureData.prestations && factureData.prestations.length > 0) {
    const prestationsData = factureData.prestations.map(prestation => ({
      facture_id: facture.id,
      description: prestation.description,
      quantite: prestation.quantite,
      montant: prestation.montant,
      taux: prestation.taux || 0
    }));

    const { error: prestationsError } = await supabase
      .from("prestations")
      .insert(prestationsData);

    if (prestationsError) {
      console.error("Erreur lors de l'ajout des prestations:", prestationsError);
      throw prestationsError;
    }
  }

  // Récupérer la facture complète
  return getFactureById(facture.id);
};

export const updateFacture = async (id: string, factureData: Partial<Facture>): Promise<Facture> => {
  // 1. Mettre à jour la facture
  const { error } = await supabase
    .from("factures")
    .update({
      client_id: factureData.client_id,
      date: factureData.date,
      echeance: factureData.echeance,
      montant: factureData.montant,
      montant_paye: factureData.montant_paye,
      status: factureData.status,
      notes: factureData.notes
    })
    .eq("id", id);

  if (error) {
    console.error("Erreur lors de la mise à jour de la facture:", error);
    throw error;
  }

  // 2. Si des prestations sont fournies, supprimer les anciennes et ajouter les nouvelles
  if (factureData.prestations) {
    // Supprimer les anciennes prestations
    const { error: deleteError } = await supabase
      .from("prestations")
      .delete()
      .eq("facture_id", id);

    if (deleteError) {
      console.error("Erreur lors de la suppression des prestations:", deleteError);
      throw deleteError;
    }

    // Ajouter les nouvelles prestations
    if (factureData.prestations.length > 0) {
      const prestationsData = factureData.prestations.map(prestation => ({
        facture_id: id,
        description: prestation.description,
        quantite: prestation.quantite,
        montant: prestation.montant,
        taux: prestation.taux || 0
      }));

      const { error: prestationsError } = await supabase
        .from("prestations")
        .insert(prestationsData);

      if (prestationsError) {
        console.error("Erreur lors de l'ajout des prestations:", prestationsError);
        throw prestationsError;
      }
    }
  }

  // Récupérer la facture mise à jour
  return getFactureById(id);
};

export const deleteFacture = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("factures")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erreur lors de la suppression de la facture:", error);
    throw error;
  }
};
