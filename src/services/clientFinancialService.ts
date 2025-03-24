
import { supabase } from "@/integrations/supabase/client";
import { ClientFinancialSummary, ClientFinancialDetails, ClientInvoice, ClientPayment } from "@/types/clientFinancial";

export const getClientsFinancialSummary = async (): Promise<ClientFinancialSummary[]> => {
  try {
    console.log("Fetching clients financial summary...");
    const { data, error } = await supabase.rpc('get_clients_with_financial_status');
    
    if (error) {
      console.error("Error fetching clients financial summary:", error);
      throw new Error(`Failed to fetch clients financial data: ${error.message}`);
    }
    
    // Map the data to match our type definition
    const mappedData: ClientFinancialSummary[] = (data || []).map((item: any) => ({
      id: item.id,
      nom: item.nom,
      facturesMontant: item.facturesmontant,
      paiementsMontant: item.paiementsmontant,
      solde: item.solde,
      status: item.status
    }));
    
    return mappedData;
  } catch (error) {
    console.error("Error in getClientsFinancialSummary:", error);
    throw error;
  }
};

export const getClientFinancialDetails = async (clientId: string): Promise<ClientFinancialDetails> => {
  try {
    console.log("Fetching client financial details for:", clientId);
    const { data, error } = await supabase.rpc('get_client_financial_details', {
      client_id: clientId
    });
    
    if (error) {
      console.error("Error fetching client financial details:", error);
      throw new Error(`Failed to fetch client financial details: ${error.message}`);
    }
    
    // Convert JSON data to our expected types
    if (!data || !data[0]) {
      return { factures: [], paiements: [], solde_disponible: 0 };
    }
    
    const details = data[0];
    return {
      factures: Array.isArray(details.factures) ? details.factures as ClientInvoice[] : [],
      paiements: Array.isArray(details.paiements) ? details.paiements as ClientPayment[] : [],
      solde_disponible: details.solde_disponible || 0
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
