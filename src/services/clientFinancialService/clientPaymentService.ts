
import { supabase } from "@/integrations/supabase/client";
import { recalculerStatutPaiementFacture } from "@/services/factureServices/facturePaiementSyncService";

// Apply a credit payment to a specific invoice
export const applyCreditToInvoice = async (
  clientId: string,
  factureId: string,
  paiementId: string,
  montant: number
): Promise<boolean> => {

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
    throw new Error(`Failed to apply credit to invoice: ${updateError.message}`);
  }

  // L'avance appliquée fait évoluer l'état de la facture (partielle / payée).
  await recalculerStatutPaiementFacture(factureId);

  return true;
};

// Create a payment reminder
export const createPaymentReminder = async (
  clientId: string,
  factureId: string,
  method: 'email' | 'sms' | 'both'
): Promise<boolean> => {
  const { error } = await supabase
    .from('payment_reminders')
    .insert({
      client_id: clientId,
      facture_id: factureId,
      method: method
    });
    
  if (error) {
    throw new Error(`Failed to create payment reminder: ${error.message}`);
  }
  
  return true;
};
