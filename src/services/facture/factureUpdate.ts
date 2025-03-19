
import { supabase } from "@/integrations/supabase/client";
import { Facture, FactureStatus, Paiement } from "@/types/facture";

// Mise à jour générale d'une facture
export const updateFacture = async (id: string, data: Partial<Facture>): Promise<Facture> => {
  // Vérifier si la facture existe
  const { data: existingFacture, error: fetchError } = await supabase
    .from("factures")
    .select()
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error("Erreur lors de la récupération de la facture:", fetchError);
    throw new Error(fetchError.message);
  }

  // Préparer les données pour la mise à jour
  const updateData: any = { ...data };

  // Convertir les objets en JSON pour Supabase
  if (updateData.prestations) {
    updateData.prestations = JSON.stringify(updateData.prestations);
  }
  
  if (updateData.paiements) {
    updateData.paiements = JSON.stringify(updateData.paiements);
  }

  // Effectuer la mise à jour
  const { data: updatedData, error: updateError } = await supabase
    .from("factures")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    console.error("Erreur lors de la mise à jour de la facture:", updateError);
    throw new Error(updateError.message);
  }

  // Reconvertir les champs JSON en objets
  return {
    ...updatedData,
    prestations: JSON.parse(updatedData.prestations || '[]'),
    paiements: JSON.parse(updatedData.paiements || '[]')
  } as Facture;
};

// Mise à jour du statut d'une facture
export const updateFactureStatus = async (id: string, status: FactureStatus): Promise<Facture> => {
  const { data, error } = await supabase
    .from("factures")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    throw new Error(error.message);
  }

  // Reconvertir les champs JSON en objets
  return {
    ...data,
    prestations: JSON.parse(data.prestations || '[]'),
    paiements: JSON.parse(data.paiements || '[]')
  } as Facture;
};

// Enregistrement d'un paiement
export const enregistrerPaiement = async (id: string, paiement: Paiement): Promise<Facture> => {
  // Récupérer la facture actuelle
  const { data: facture, error: fetchError } = await supabase
    .from("factures")
    .select()
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error("Erreur lors de la récupération de la facture:", fetchError);
    throw new Error(fetchError.message);
  }

  // Parser les paiements existants
  const paiements = JSON.parse(facture.paiements || '[]');
  
  // Ajouter le nouveau paiement
  paiements.push(paiement);
  
  // Calculer le montant total payé
  const montantPaye = paiements.reduce((sum: number, p: Paiement) => sum + p.montant, 0);
  
  // Déterminer le nouveau statut
  let status: FactureStatus = facture.status;
  if (montantPaye >= facture.montant) {
    status = "paye";
  } else if (montantPaye > 0) {
    status = "partiellement_paye";
  }

  // Mettre à jour la facture
  const { data: updatedFacture, error: updateError } = await supabase
    .from("factures")
    .update({
      paiements: JSON.stringify(paiements),
      montant_paye: montantPaye,
      status
    })
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    console.error("Erreur lors de l'enregistrement du paiement:", updateError);
    throw new Error(updateError.message);
  }

  // Reconvertir les champs JSON en objets
  return {
    ...updatedFacture,
    prestations: JSON.parse(updatedFacture.prestations || '[]'),
    paiements: JSON.parse(updatedFacture.paiements || '[]')
  } as Facture;
};
