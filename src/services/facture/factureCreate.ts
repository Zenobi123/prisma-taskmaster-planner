
import { supabase } from "@/integrations/supabase/client";
import { Facture, Prestation } from "@/types/facture";
import { v4 as uuidv4 } from "uuid";

export interface CreateFactureData {
  client_id: string;
  client_nom: string;
  client_email: string;
  client_telephone: string;
  client_adresse: string;
  date: string;
  echeance: string;
  prestations: Prestation[];
  notes?: string;
  mode_reglement?: string;
}

export const createFacture = async (data: CreateFactureData): Promise<Facture> => {
  // Calcul du montant total
  const montant = data.prestations.reduce((sum, item) => sum + item.montant, 0);
  
  // Création d'un ID unique au format "FAC-YYYYMMDD-XXXX"
  const today = new Date();
  const datePart = today.toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = uuidv4().substring(0, 4).toUpperCase();
  const id = `FAC-${datePart}-${randomPart}`;

  const newFacture: Facture = {
    id,
    ...data,
    montant,
    status: "non_paye",
    montant_paye: 0,
    paiements: []
  };

  // Préparer les données pour Supabase (conversion des objets en JSON)
  const supabaseData = {
    ...newFacture,
    prestations: JSON.stringify(newFacture.prestations),
    paiements: JSON.stringify(newFacture.paiements)
  };

  const { data: insertedData, error } = await supabase
    .from("factures")
    .insert(supabaseData)
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de la création de la facture:", error);
    throw new Error(error.message);
  }

  // Reconvertir les données JSON en objets
  return {
    ...insertedData,
    prestations: JSON.parse(insertedData.prestations || '[]'),
    paiements: JSON.parse(insertedData.paiements || '[]')
  } as Facture;
};
