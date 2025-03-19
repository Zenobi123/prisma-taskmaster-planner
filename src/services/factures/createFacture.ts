
import { supabase } from "@/integrations/supabase/client";
import { Facture, Prestation, FactureDB, convertToFacture } from "@/types/facture";
import { Json } from "@/integrations/supabase/types";
import { generateFactureId, prepareFactureForDb } from "./utils";

export const createFacture = async (data: {
  clientId: string;
  clientNom: string;
  clientAdresse: string;
  clientTelephone: string;
  clientEmail: string;
  dateEmission: string;
  dateEcheance: string;
  prestations: Prestation[];
  notes?: string;
}) => {
  const factureId = generateFactureId();
  
  // Calculer le montant total
  const montantTotal = data.prestations.reduce((sum, item) => {
    return sum + (item.montant || 0);
  }, 0);

  const newFacture = {
    id: factureId,
    client_id: data.clientId,
    client_nom: data.clientNom,
    client_adresse: data.clientAdresse,
    client_telephone: data.clientTelephone,
    client_email: data.clientEmail,
    date: data.dateEmission,
    echeance: data.dateEcheance,
    prestations: data.prestations as unknown as Json,
    montant: montantTotal,
    status: 'en_attente',
    notes: data.notes || null
  };

  const { data: result, error } = await supabase
    .from('factures')
    .insert(prepareFactureForDb(newFacture))
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de la création de la facture:", error);
    throw error;
  }

  return convertToFacture(result as unknown as FactureDB);
};
