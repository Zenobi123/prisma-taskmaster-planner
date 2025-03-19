
import { supabase } from "@/integrations/supabase/client";
import { Prestation } from "@/types/facture";

export const getPrestationsByFactureId = async (factureId: string): Promise<Prestation[]> => {
  const { data: prestations, error } = await supabase
    .from("prestations")
    .select("*")
    .eq("facture_id", factureId);

  if (error) {
    console.error("Erreur lors de la récupération des prestations:", error);
    throw error;
  }

  return prestations || [];
};

export const createPrestation = async (prestation: Omit<Prestation, "id">): Promise<Prestation> => {
  const { data, error } = await supabase
    .from("prestations")
    .insert({
      facture_id: prestation.facture_id,
      description: prestation.description,
      quantite: prestation.quantite,
      montant: prestation.montant,
      taux: prestation.taux || 0
    })
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de la création de la prestation:", error);
    throw error;
  }

  return data;
};

export const updatePrestation = async (id: string, prestation: Partial<Prestation>): Promise<Prestation> => {
  const { data, error } = await supabase
    .from("prestations")
    .update({
      description: prestation.description,
      quantite: prestation.quantite,
      montant: prestation.montant,
      taux: prestation.taux
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de la mise à jour de la prestation:", error);
    throw error;
  }

  return data;
};

export const deletePrestation = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("prestations")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erreur lors de la suppression de la prestation:", error);
    throw error;
  }
};
