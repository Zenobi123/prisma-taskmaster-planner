
import { supabase } from "@/integrations/supabase/client";
import { ClientFinancialSummary, ClientFinancialDetails, ClientInvoice, ClientPayment } from "@/types/clientFinancial";

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

export const getClientFinancialDetails = async (clientId: string): Promise<ClientFinancialDetails> => {
  try {
    console.log("Fetching client financial details for:", clientId);
    
    // Get client's invoices
    const { data: factures, error: facturesError } = await supabase
      .from('factures')
      .select('*')
      .eq('client_id', clientId);
      
    if (facturesError) {
      console.error("Error fetching client invoices:", facturesError);
      throw new Error(`Failed to fetch client invoices: ${facturesError.message}`);
    }
    
    // Get client's payments
    const { data: paiements, error: paiementsError } = await supabase
      .from('paiements')
      .select('*')
      .eq('client_id', clientId);
      
    if (paiementsError) {
      console.error("Error fetching client payments:", paiementsError);
      throw new Error(`Failed to fetch client payments: ${paiementsError.message}`);
    }
    
    // Map the data to our expected types
    const mappedFactures: ClientInvoice[] = (factures || []).map(f => ({
      id: f.id,
      date: f.date,
      montant: f.montant,
      montant_paye: f.montant_paye || 0,
      montant_restant: f.montant - (f.montant_paye || 0),
      status: f.status,
      status_paiement: f.status_paiement,
      echeance: f.echeance
    }));
    
    const mappedPaiements: ClientPayment[] = (paiements || []).map(p => ({
      id: p.id,
      date: p.date,
      montant: p.montant,
      mode: p.mode,
      reference: p.reference || '',
      facture_id: p.facture_id,
      est_credit: p.est_credit || false
    }));
    
    // Calculate available balance (total payments - total invoices)
    const totalFactures = mappedFactures.reduce((sum, f) => sum + Number(f.montant), 0);
    const totalPaiements = mappedPaiements.reduce((sum, p) => sum + Number(p.montant), 0);
    const soldeDisponible = totalPaiements - totalFactures;
    
    return {
      factures: mappedFactures,
      paiements: mappedPaiements,
      solde_disponible: soldeDisponible
    };
  } catch (error) {
    console.error("Error in getClientFinancialDetails:", error);
    throw error;
  }
};

// Apply a credit payment to a specific invoice
export const applyCreditToInvoice = async (
  clientId: string, 
  factureId: string, 
  paiementId: string, 
  montant: number
): Promise<boolean> => {
  try {
    console.log(`Applying credit payment ${paiementId} to invoice ${factureId}`);
    
    // Update the payment to link it to the invoice and no longer be a credit
    const { error: updateError } = await supabase
      .from('paiements')
      .update({ 
        facture_id: factureId,
        est_credit: false,
        notes: `Avance appliquée à la facture ${factureId}`
      })
      .eq('id', paiementId);
      
    if (updateError) {
      console.error("Error applying credit to invoice:", updateError);
      throw new Error(`Failed to apply credit to invoice: ${updateError.message}`);
    }
    
    return true;
  } catch (error) {
    console.error("Error in applyCreditToInvoice:", error);
    throw error;
  }
};

// Create a payment reminder
export const createPaymentReminder = async (
  clientId: string,
  factureId: string,
  method: 'email' | 'sms' | 'both'
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('payment_reminders')
      .insert({
        client_id: clientId,
        facture_id: factureId,
        method: method
      });
      
    if (error) {
      console.error("Error creating payment reminder:", error);
      throw new Error(`Failed to create payment reminder: ${error.message}`);
    }
    
    return true;
  } catch (error) {
    console.error("Error in createPaymentReminder:", error);
    throw error;
  }
};
