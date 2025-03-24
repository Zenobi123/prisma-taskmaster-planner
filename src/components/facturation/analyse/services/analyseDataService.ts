
import { supabase } from "@/integrations/supabase/client";

export const fetchFacturesForAnalysis = async () => {
  const { data: facturesData, error: facturesError } = await supabase
    .from("factures")
    .select(`
      id, date, montant, montant_paye, status_paiement, client_id, status
    `)
    .eq("status", "envoyée");
    
  if (facturesError) throw facturesError;
  
  console.log("Analysis fetched invoices:", facturesData?.length || 0);
  console.log("Analysis total invoiced amount:", facturesData?.reduce((sum, f) => sum + Number(f.montant), 0) || 0);
  
  return facturesData || [];
};

export const fetchPrestationsForAnalysis = async () => {
  const { data: prestationsData, error: prestationsError } = await supabase
    .from("prestations")
    .select("*");
    
  if (prestationsError) throw prestationsError;
  
  return prestationsData || [];
};
