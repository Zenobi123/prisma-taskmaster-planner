
import { supabase } from "@/integrations/supabase/client";
import { ClientFinancialDetails, ClientInvoice, ClientPayment } from "@/types/clientFinancial";

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
