
import { Facture, Paiement, Prestation } from "@/types/facture";
import { supabase } from "@/integrations/supabase/client";

export const fetchFacturesFromDB = async () => {
  const { data, error } = await supabase
    .from('factures')
    .select('*');
  
  if (error) {
    throw error;
  }
  
  return mapFacturesFromDB(data);
};

export const updateFactureStatus = async (factureId: string, newStatus: 'payée' | 'en_attente' | 'envoyée' | 'partiellement_payée') => {
  const { error } = await supabase
    .from('factures')
    .update({ status: newStatus })
    .eq('id', factureId);
    
  if (error) {
    throw error;
  }
};

export const deleteFactureFromDB = async (factureId: string) => {
  const { error } = await supabase
    .from('factures')
    .delete()
    .eq('id', factureId);
    
  if (error) throw error;
};

export const createFactureInDB = async (newFacture: any) => {
  const { error } = await supabase
    .from('factures')
    .insert(newFacture);
    
  if (error) {
    throw error;
  }
};

export const getClientData = async (clientId: string) => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', clientId)
    .single();
    
  if (error) {
    throw new Error("Client non trouvé");
  }
  
  return data;
};

export const enregistrerPaiementPartiel = async (
  factureId: string, 
  paiement: Paiement, 
  prestationsPayees: string[],
  nouveauMontantPaye: number
) => {
  const { data: currentFacture, error: fetchError } = await supabase
    .from('factures')
    .select('paiements, montant, montant_paye')
    .eq('id', factureId)
    .single();
  
  if (fetchError) {
    throw fetchError;
  }
  
  // Récupérer les paiements existants et s'assurer qu'ils sont dans un format de tableau
  const paiementsExistants = currentFacture.paiements || [];
  
  // Conversion du paiement en format JSON pour Supabase
  const paiementJSON = {
    id: paiement.id,
    date: paiement.date,
    montant: paiement.montant,
    moyenPaiement: paiement.moyenPaiement,
    prestationIds: paiement.prestationIds || [],
    notes: paiement.notes
  };
  
  // Calculer le nouveau status
  let newStatus: 'payée' | 'partiellement_payée' | 'en_attente' | 'envoyée' = 'en_attente';
  
  if (nouveauMontantPaye >= currentFacture.montant) {
    newStatus = 'payée';
  } else if (nouveauMontantPaye > 0) {
    newStatus = 'partiellement_payée';
  }
  
  // Mettre à jour la facture en utilisant paiementsExistants directement
  const { error: updateError } = await supabase
    .from('factures')
    .update({ 
      paiements: [...paiementsExistants, paiementJSON],
      montant_paye: nouveauMontantPaye,
      status: newStatus
    })
    .eq('id', factureId);
    
  if (updateError) {
    throw updateError;
  }
};

const mapFacturesFromDB = (data: any[]): Facture[] => {
  return data.map((row: any) => ({
    id: row.id,
    client: {
      id: row.client_id,
      nom: row.client_nom,
      adresse: row.client_adresse,
      telephone: row.client_telephone,
      email: row.client_email
    },
    date: row.date,
    echeance: row.echeance,
    montant: Number(row.montant),
    status: row.status,
    prestations: Array.isArray(row.prestations) 
      ? row.prestations 
      : (typeof row.prestations === 'string' ? JSON.parse(row.prestations) : []),
    notes: row.notes,
    modeReglement: row.mode_reglement,
    moyenPaiement: row.moyen_paiement,
    paiements: row.paiements || [],
    montantPaye: row.montant_paye || 0
  }));
};
