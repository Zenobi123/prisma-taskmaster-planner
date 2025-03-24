
import { supabase } from "@/integrations/supabase/client";

export const fetchFacturesForAnalysis = async () => {
  const { data: facturesData, error: facturesError } = await supabase
    .from("factures")
    .select(`
      id, date, montant, montant_paye, status_paiement, client_id, status
    `)
    .eq("status", "envoyée");
    
  if (facturesError) throw facturesError;
  
  return facturesData || [];
};

export const fetchPrestationsForAnalysis = async () => {
  const { data: prestationsData, error: prestationsError } = await supabase
    .from("prestations")
    .select("*");
    
  if (prestationsError) throw prestationsError;
  
  return prestationsData || [];
};
