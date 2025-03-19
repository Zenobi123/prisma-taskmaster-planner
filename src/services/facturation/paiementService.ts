
import { supabase } from "@/integrations/supabase/client";
import { Paiement } from "@/types/facture";
import { updateMontantPayeEtStatut } from "./factureBaseService";

export const getPaiementsByFactureId = async (factureId: string): Promise<Paiement[]> => {
  const { data: paiements, error } = await supabase
    .from("paiements")
    .select("*")
    .eq("facture_id", factureId);

  if (error) {
    console.error("Erreur lors de la récupération des paiements:", error);
    throw error;
  }

  return paiements || [];
};

export const addPaiement = async (paiementData: Omit<Paiement, "id">): Promise<Paiement> => {
  const { data: paiement, error } = await supabase
    .from("paiements")
    .insert({
      facture_id: paiementData.facture_id,
      date: paiementData.date,
      montant: paiementData.montant,
      mode: paiementData.mode,
      notes: paiementData.notes
    })
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de l'ajout du paiement:", error);
    throw error;
  }

  // Mettre à jour le montant payé et le statut de la facture
  await updateMontantPayeEtStatut(paiementData.facture_id);

  return paiement;
};

export const deletePaiement = async (id: string): Promise<void> => {
  // Récupérer d'abord le paiement pour connaître la facture associée
  const { data: paiement, error: fetchError } = await supabase
    .from("paiements")
    .select("facture_id")
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error("Erreur lors de la récupération du paiement:", fetchError);
    throw fetchError;
  }

  // Supprimer le paiement
  const { error } = await supabase
    .from("paiements")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erreur lors de la suppression du paiement:", error);
    throw error;
  }

  // Mettre à jour le montant payé et le statut de la facture
  await updateMontantPayeEtStatut(paiement.facture_id);
};

export const updatePaiement = async (id: string, paiementData: Partial<Paiement>): Promise<Paiement> => {
  // Récupérer d'abord le paiement pour connaître la facture associée
  const { data: existingPaiement, error: fetchError } = await supabase
    .from("paiements")
    .select("facture_id")
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error("Erreur lors de la récupération du paiement:", fetchError);
    throw fetchError;
  }

  // Mettre à jour le paiement
  const { data: paiement, error } = await supabase
    .from("paiements")
    .update({
      date: paiementData.date,
      montant: paiementData.montant,
      mode: paiementData.mode,
      notes: paiementData.notes
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de la mise à jour du paiement:", error);
    throw error;
  }

  // Mettre à jour le montant payé et le statut de la facture
  await updateMontantPayeEtStatut(existingPaiement.facture_id);

  return paiement;
};
