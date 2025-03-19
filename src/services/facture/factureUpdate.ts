
import { supabase } from "@/integrations/supabase/client";
import { Facture, Prestation, Paiement, FactureStatus } from "@/types/facture";

export interface UpdateFactureData {
  client_nom?: string;
  client_email?: string;
  client_telephone?: string;
  client_adresse?: string;
  date?: string;
  echeance?: string;
  prestations?: Prestation[];
  notes?: string;
  mode_reglement?: string;
  moyen_paiement?: string;
}

export const updateFacture = async (id: string, data: UpdateFactureData): Promise<Facture> => {
  // Si les prestations sont modifiées, recalculer le montant total
  let updateData: any = { ...data };
  
  if (data.prestations) {
    const montant = data.prestations.reduce((sum, item) => sum + item.montant, 0);
    updateData.montant = montant;
  }

  const { data: updatedData, error } = await supabase
    .from("factures")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de la mise à jour de la facture:", error);
    throw new Error(error.message);
  }

  return updatedData as Facture;
};

export const updateFactureStatus = async (id: string, status: FactureStatus): Promise<Facture> => {
  const { data: updatedData, error } = await supabase
    .from("factures")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de la mise à jour du statut de la facture:", error);
    throw new Error(error.message);
  }

  return updatedData as Facture;
};

export const enregistrerPaiement = async (
  id: string, 
  paiement: Paiement
): Promise<Facture> => {
  // D'abord, récupérer la facture actuelle
  const { data: facture, error: fetchError } = await supabase
    .from("factures")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error("Erreur lors de la récupération de la facture:", fetchError);
    throw new Error(fetchError.message);
  }

  const currentFacture = facture as Facture;
  const paiements = currentFacture.paiements || [];
  const nouveauxPaiements = [...paiements, paiement];
  
  // Calculer le nouveau montant payé
  const montantPaye = nouveauxPaiements.reduce((sum, p) => sum + p.montant, 0);
  
  // Déterminer le nouveau statut
  let status: FactureStatus = "non_paye";
  if (montantPaye >= currentFacture.montant) {
    status = "paye";
  } else if (montantPaye > 0) {
    status = "partiellement_paye";
  }

  // Mettre à jour la facture
  const { data: updatedData, error: updateError } = await supabase
    .from("factures")
    .update({
      paiements: nouveauxPaiements,
      montant_paye: montantPaye,
      status,
      moyen_paiement: paiement.mode
    })
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    console.error("Erreur lors de l'enregistrement du paiement:", updateError);
    throw new Error(updateError.message);
  }

  return updatedData as Facture;
};
