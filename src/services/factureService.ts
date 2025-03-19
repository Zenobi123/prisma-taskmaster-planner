
import { supabase } from "@/integrations/supabase/client";
import { Facture, Prestation } from "@/types/facture";
import { v4 as uuidv4 } from 'uuid';

// Générer un numéro de facture unique
const generateFactureId = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `F${year}${month}-${random}`;
};

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
    prestations: data.prestations,
    montant: montantTotal,
    status: 'en_attente',
    notes: data.notes || null
  };

  const { data: result, error } = await supabase
    .from('factures')
    .insert(newFacture)
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de la création de la facture:", error);
    throw error;
  }

  return result;
};

export const getFactures = async (filters?: {
  status?: string;
  clientId?: string;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
  page?: number;
  limit?: number;
}) => {
  let query = supabase.from('factures').select('*');

  // Appliquer les filtres
  if (filters) {
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    
    if (filters.clientId) {
      query = query.eq('client_id', filters.clientId);
    }
    
    if (filters.startDate) {
      query = query.gte('date', filters.startDate);
    }
    
    if (filters.endDate) {
      query = query.lte('date', filters.endDate);
    }
    
    if (filters.searchTerm) {
      query = query.or(`client_nom.ilike.%${filters.searchTerm}%,id.ilike.%${filters.searchTerm}%`);
    }
    
    // Pagination
    if (filters.page && filters.limit) {
      const start = (filters.page - 1) * filters.limit;
      query = query.range(start, start + filters.limit - 1);
    }
  }
  
  // Trier par date d'émission décroissante (plus récente d'abord)
  query = query.order('date', { ascending: false });
  
  const { data, error, count } = await query;
  
  if (error) {
    console.error("Erreur lors de la récupération des factures:", error);
    throw error;
  }
  
  return { factures: data, count };
};

export const getFactureById = async (id: string) => {
  const { data, error } = await supabase
    .from('factures')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Erreur lors de la récupération de la facture ${id}:`, error);
    throw error;
  }
  
  return data;
};

export const updateFacture = async (
  id: string, 
  updates: Partial<Facture>
) => {
  // Ne pas permettre la modification si la facture est déjà payée
  if (updates.status === 'payée') {
    throw new Error("Une facture payée ne peut pas être modifiée");
  }
  
  const { data, error } = await supabase
    .from('factures')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Erreur lors de la mise à jour de la facture ${id}:`, error);
    throw error;
  }
  
  return data;
};

export const deleteFacture = async (id: string) => {
  // Vérifier d'abord si la facture est payée
  const { data: facture } = await supabase
    .from('factures')
    .select('status')
    .eq('id', id)
    .single();
    
  if (facture && facture.status === 'payée') {
    throw new Error("Une facture payée ne peut pas être supprimée");
  }
  
  const { error } = await supabase
    .from('factures')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Erreur lors de la suppression de la facture ${id}:`, error);
    throw error;
  }
  
  return true;
};

export const enregistrerPaiement = async (
  factureId: string,
  montant: number,
  modePaiement: string,
  datePaiement: string,
  notes?: string
) => {
  // Récupérer la facture actuelle
  const { data: facture } = await supabase
    .from('factures')
    .select('*')
    .eq('id', factureId)
    .single();
    
  if (!facture) {
    throw new Error("Facture non trouvée");
  }
  
  // Calculer le nouveau montant payé
  const nouveauMontantPaye = (facture.montant_paye || 0) + montant;
  
  // Déterminer le nouveau statut
  let nouveauStatut = facture.status;
  if (nouveauMontantPaye >= facture.montant) {
    nouveauStatut = 'payée';
  } else if (nouveauMontantPaye > 0) {
    nouveauStatut = 'partiellement_payée';
  }
  
  // Créer l'enregistrement de paiement
  const paiement = {
    id: uuidv4(),
    date: datePaiement,
    montant,
    mode: modePaiement,
    notes: notes || null
  };
  
  // Ajouter le paiement à la liste des paiements
  const paiements = [...(facture.paiements || []), paiement];
  
  // Mettre à jour la facture
  const { data, error } = await supabase
    .from('factures')
    .update({
      montant_paye: nouveauMontantPaye,
      status: nouveauStatut,
      paiements
    })
    .eq('id', factureId)
    .select()
    .single();
  
  if (error) {
    console.error(`Erreur lors de l'enregistrement du paiement:`, error);
    throw error;
  }
  
  return data;
};
