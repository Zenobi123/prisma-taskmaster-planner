
import { supabase } from "@/integrations/supabase/client";
import { ClientFinancialSummary } from "@/types/clientFinancial";

export const getClientsFinancialSummary = async (): Promise<ClientFinancialSummary[]> => {
  try {
    console.log("Fetching clients financial summary...");
    
    // Alternative approach - use direct queries instead of RPC function
    // Get all clients
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .select('id, nom, raisonsociale')
      .eq('statut', 'actif');
      
    if (clientsError) {
      console.error("Error fetching clients:", clientsError);
      throw new Error(`Failed to fetch clients: ${clientsError.message}`);
    }
    
    if (!clients || clients.length === 0) {
      return [];
    }
    
    // Get all invoices
    const { data: factures, error: facturesError } = await supabase
      .from('factures')
      .select('client_id, montant, montant_paye');
      
    if (facturesError) {
      console.error("Error fetching factures:", facturesError);
      throw new Error(`Failed to fetch invoices: ${facturesError.message}`);
    }
    
    // Get all payments
    const { data: paiements, error: paiementsError } = await supabase
      .from('paiements')
      .select('client_id, montant');
      
    if (paiementsError) {
      console.error("Error fetching paiements:", paiementsError);
      throw new Error(`Failed to fetch payments: ${paiementsError.message}`);
    }
    
    // Calculate financial data for each client
    const summaryData: ClientFinancialSummary[] = clients.map(client => {
      // Calculate total invoice amount for this client
      const clientFactures = factures?.filter(f => f.client_id === client.id) || [];
      const facturesMontant = clientFactures.reduce((sum, facture) => sum + Number(facture.montant), 0);
      
      // Calculate total payment amount for this client
      const clientPaiements = paiements?.filter(p => p.client_id === client.id) || [];
      const paiementsMontant = clientPaiements.reduce((sum, paiement) => sum + Number(paiement.montant), 0);
      
      // Calculate balance
      const solde = paiementsMontant - facturesMontant;
      
      // Determine status
      let status: 'àjour' | 'partiel' | 'retard' = 'àjour';
      if (facturesMontant > 0) {
        if (paiementsMontant === 0) {
          status = 'retard';
        } else if (paiementsMontant < facturesMontant) {
          status = 'partiel';
        }
      }
      
      return {
        id: client.id,
        nom: client.nom || client.raisonsociale || 'Client sans nom',
        facturesMontant,
        paiementsMontant,
        solde,
        status
      };
    });
    
    return summaryData;
  } catch (error) {
    console.error("Error in getClientsFinancialSummary:", error);
    throw error;
  }
};
