
import { supabase } from "@/integrations/supabase/client";

// Cache pour les données des factures
let facturesCache = {
  data: null as any[] | null,
  timestamp: 0
};

// Cache pour les données des prestations
let prestationsCache = {
  data: null as any[] | null,
  timestamp: 0
};

// Durée de validité du cache en ms (30 secondes)
const CACHE_DURATION = 30000;

export const fetchFacturesForAnalysis = async () => {
  const now = Date.now();
  
  // Vérifier si le cache est valide
  if (facturesCache.data && now - facturesCache.timestamp < CACHE_DURATION) {
    return facturesCache.data;
  }
  
  
  const { data: facturesData, error: facturesError } = await supabase
    .from("factures")
    .select(`
      id, date, montant, montant_paye, status_paiement, client_id, status
    `)
    .eq("status", "envoyée");
    
  if (facturesError) throw facturesError;
  
  // Mettre à jour le cache
  facturesCache = {
    data: facturesData || [],
    timestamp: now
  };
  
  
  return facturesData || [];
};

export const fetchPrestationsForAnalysis = async () => {
  const now = Date.now();
  
  // Vérifier si le cache est valide
  if (prestationsCache.data && now - prestationsCache.timestamp < CACHE_DURATION) {
    return prestationsCache.data;
  }
  
  
  const { data: prestationsData, error: prestationsError } = await supabase
    .from("facture_prestations")
    .select("*");
    
  if (prestationsError) throw prestationsError;
  
  // Mettre à jour le cache
  prestationsCache = {
    data: prestationsData || [],
    timestamp: now
  };
  
  
  return prestationsData || [];
};
