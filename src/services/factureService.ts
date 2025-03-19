
import { Facture, Paiement, Prestation } from "@/types/facture";
import { supabase } from "@/integrations/supabase/client";

export const fetchFacturesFromDB = async () => {
  try {
    console.log("Fetching factures from database...");
    const { data, error } = await supabase
      .from('factures')
      .select('*');
    
    if (error) {
      console.error("Error fetching factures:", error);
      throw error;
    }
    
    console.log(`Successfully fetched ${data.length} factures`);
    return mapFacturesFromDB(data);
  } catch (error) {
    console.error("Exception in fetchFacturesFromDB:", error);
    throw error;
  }
};

export const updateFactureStatus = async (factureId: string, newStatus: 'payée' | 'en_attente' | 'envoyée' | 'partiellement_payée') => {
  try {
    console.log(`Updating facture ${factureId} status to ${newStatus}`);
    const { error } = await supabase
      .from('factures')
      .update({ status: newStatus })
      .eq('id', factureId);
      
    if (error) {
      console.error(`Error updating facture ${factureId} status:`, error);
      throw error;
    }
    
    console.log(`Successfully updated facture ${factureId} status to ${newStatus}`);
  } catch (error) {
    console.error(`Exception in updateFactureStatus for facture ${factureId}:`, error);
    throw error;
  }
};

export const deleteFactureFromDB = async (factureId: string) => {
  try {
    console.log(`Starting deletion operation for facture ${factureId}`);
    
    // First check if the facture exists
    const { data: existingFacture, error: checkError } = await supabase
      .from('factures')
      .select('id')
      .eq('id', factureId)
      .maybeSingle();
    
    if (checkError) {
      console.error(`Error checking if facture ${factureId} exists:`, checkError);
      throw checkError;
    }
    
    if (!existingFacture) {
      console.error(`Facture ${factureId} not found`);
      throw new Error(`Facture ${factureId} not found`);
    }
    
    // Proceed with deletion
    const { data, error } = await supabase
      .from('factures')
      .delete()
      .eq('id', factureId)
      .select();
    
    if (error) {
      console.error(`Supabase error when deleting facture ${factureId}:`, error);
      throw error;
    }
    
    console.log(`Result of deletion for facture ${factureId}:`, data);
    return data;
  } catch (error) {
    console.error(`Exception in deleteFactureFromDB for facture ${factureId}:`, error);
    throw error;
  }
};

export const createFactureInDB = async (newFacture: any) => {
  try {
    console.log("Creating new facture:", newFacture.id);
    const { data, error } = await supabase
      .from('factures')
      .insert(newFacture)
      .select();
      
    if (error) {
      console.error("Error creating facture:", error);
      throw error;
    }
    
    console.log("Successfully created facture:", data);
    return data;
  } catch (error) {
    console.error("Exception in createFactureInDB:", error);
    throw error;
  }
};

export const getClientData = async (clientId: string) => {
  try {
    console.log(`Fetching client data for client ${clientId}`);
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single();
      
    if (error) {
      console.error(`Error fetching client ${clientId}:`, error);
      throw new Error("Client non trouvé");
    }
    
    console.log(`Successfully fetched client ${clientId}`);
    return data;
  } catch (error) {
    console.error(`Exception in getClientData for client ${clientId}:`, error);
    throw error;
  }
};

export const enregistrerPaiementPartiel = async (
  factureId: string, 
  paiement: Paiement, 
  prestationsPayees: string[],
  nouveauMontantPaye: number
) => {
  try {
    console.log(`Recording partial payment for facture ${factureId}`);
    const { data: currentFacture, error: fetchError } = await supabase
      .from('factures')
      .select('paiements, montant, montant_paye')
      .eq('id', factureId)
      .single();
    
    if (fetchError) {
      console.error(`Error fetching facture ${factureId} for partial payment:`, fetchError);
      throw fetchError;
    }
    
    // Get existing payments and ensure they are in array format
    const paiementsExistants = currentFacture.paiements || [];
    
    // Convert payment to JSON format for Supabase
    const paiementJSON = {
      id: paiement.id,
      date: paiement.date,
      montant: paiement.montant,
      moyenPaiement: paiement.moyenPaiement,
      prestationIds: paiement.prestationIds || [],
      notes: paiement.notes
    };
    
    // Calculate new status
    let newStatus: 'payée' | 'partiellement_payée' | 'en_attente' | 'envoyée' = 'en_attente';
    
    if (nouveauMontantPaye >= currentFacture.montant) {
      newStatus = 'payée';
    } else if (nouveauMontantPaye > 0) {
      newStatus = 'partiellement_payée';
    }
    
    // Ensure paiementsExistants is an array before using spread operator
    const updatedPaiements = Array.isArray(paiementsExistants) 
      ? [...paiementsExistants, paiementJSON] 
      : [paiementJSON];
    
    // Update the facture
    const { error: updateError } = await supabase
      .from('factures')
      .update({ 
        paiements: updatedPaiements,
        montant_paye: nouveauMontantPaye,
        status: newStatus
      })
      .eq('id', factureId);
      
    if (updateError) {
      console.error(`Error updating facture ${factureId} with partial payment:`, updateError);
      throw updateError;
    }
    
    console.log(`Successfully recorded partial payment for facture ${factureId}`);
  } catch (error) {
    console.error(`Exception in enregistrerPaiementPartiel for facture ${factureId}:`, error);
    throw error;
  }
};

const mapFacturesFromDB = (data: any[]): Facture[] => {
  console.log("Mapping factures from DB format to app format");
  try {
    const mappedFactures = data.map((row: any) => ({
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
    console.log(`Successfully mapped ${mappedFactures.length} factures`);
    return mappedFactures;
  } catch (error) {
    console.error("Error in mapFacturesFromDB:", error);
    throw error;
  }
};
