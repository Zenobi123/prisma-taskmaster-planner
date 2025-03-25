
import { supabase } from "@/integrations/supabase/client";

export const fetchFacturesForAnalysis = async () => {
  // Récupérer uniquement les factures avec le statut "envoyée"
  const { data: facturesData, error: facturesError } = await supabase
    .from("factures")
    .select(`
      id, date, montant, montant_paye, status_paiement, client_id, status, echeance
    `)
    .eq("status", "envoyée");
    
  if (facturesError) {
    console.error("Erreur lors de la récupération des factures:", facturesError);
    throw facturesError;
  }
  
  console.log("Factures récupérées pour l'analyse:", facturesData?.length || 0);
  console.log("Montant total facturé:", facturesData?.reduce((sum, f) => sum + Number(f.montant), 0) || 0);
  
  return facturesData || [];
};

export const fetchPrestationsForAnalysis = async () => {
  // Récupérer toutes les prestations
  const { data: prestationsData, error: prestationsError } = await supabase
    .from("prestations")
    .select("*");
    
  if (prestationsError) {
    console.error("Erreur lors de la récupération des prestations:", prestationsError);
    throw prestationsError;
  }
  
  return prestationsData || [];
};

// Nouveau: Fonction pour récupérer le nombre de factures émises
export const fetchSentInvoicesCount = async () => {
  const { count, error } = await supabase
    .from("factures")
    .select("id", { count: 'exact', head: true })
    .eq("status", "envoyée");
    
  if (error) {
    console.error("Erreur lors du comptage des factures émises:", error);
    throw error;
  }
  
  return count || 0;
};

// Nouveau: Fonction pour récupérer le montant total des factures émises
export const fetchTotalInvoicedAmount = async () => {
  const { data, error } = await supabase
    .from("factures")
    .select("montant")
    .eq("status", "envoyée");
    
  if (error) {
    console.error("Erreur lors de la récupération du montant total facturé:", error);
    throw error;
  }
  
  const totalAmount = data?.reduce((sum, facture) => sum + Number(facture.montant), 0) || 0;
  return totalAmount;
};
