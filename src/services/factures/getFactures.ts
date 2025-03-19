
import { supabase } from "@/integrations/supabase/client";
import { Facture, FactureDB, convertToFacture } from "@/types/facture";

export interface FacturesFilters {
  status?: string;
  clientId?: string;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
  page?: number;
  limit?: number;
}

export const getFactures = async (filters?: FacturesFilters) => {
  let query = supabase.from('factures').select('*');

  // Appliquer les filtres
  if (filters) {
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    
    if (filters.clientId) {
      query = query.eq('client_id', filters.clientId);
    }
    
    if (filters.startDate) {
      query = query.gte('date', filters.startDate);
    }
    
    if (filters.endDate) {
      query = query.lte('date', filters.endDate);
    }
    
    if (filters.searchTerm) {
      query = query.or(`client_nom.ilike.%${filters.searchTerm}%,id.ilike.%${filters.searchTerm}%`);
    }
    
    // Pagination
    if (filters.page && filters.limit) {
      const start = (filters.page - 1) * filters.limit;
      query = query.range(start, start + filters.limit - 1);
    }
  }
  
  // Trier par date d'émission décroissante (plus récente d'abord)
  query = query.order('date', { ascending: false });
  
  const { data, error, count } = await query;
  
  if (error) {
    console.error("Erreur lors de la récupération des factures:", error);
    throw error;
  }

  const facturesConverties = data?.map(item => convertToFacture(item as unknown as FactureDB)) || [];
  
  return { factures: facturesConverties, count };
};
