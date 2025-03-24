
import { supabase } from "@/integrations/supabase/client";

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
