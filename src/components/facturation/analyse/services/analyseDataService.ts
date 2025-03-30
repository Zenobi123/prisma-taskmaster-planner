
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
    console.log("Utilisation du cache pour les factures d'analyse");
    return facturesCache.data;
  }
  
  console.log("Récupération des factures pour analyse depuis la base de données");
  
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
  
  console.log("Factures récupérées pour analyse:", facturesData?.length || 0);
  console.log("Montant total des factures pour analyse:", facturesData?.reduce((sum, f) => sum + Number(f.montant), 0) || 0);
  
  return facturesData || [];
};

export const fetchPrestationsForAnalysis = async () => {
  const now = Date.now();
  
  // Vérifier si le cache est valide
  if (prestationsCache.data && now - prestationsCache.timestamp < CACHE_DURATION) {
    console.log("Utilisation du cache pour les prestations d'analyse");
    return prestationsCache.data;
  }
  
  console.log("Récupération des prestations pour analyse depuis la base de données");
  
  const { data: prestationsData, error: prestationsError } = await supabase
    .from("prestations")
    .select("*");
    
  if (prestationsError) throw prestationsError;
  
  // Mettre à jour le cache
  prestationsCache = {
    data: prestationsData || [],
    timestamp: now
  };
  
  console.log("Prestations récupérées pour analyse:", prestationsData?.length || 0);
  
  return prestationsData || [];
};
