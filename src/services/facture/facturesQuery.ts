
import { supabase } from "@/integrations/supabase/client";
import { Facture } from "@/types/facture";

interface FacturesQueryParams {
  status?: string;
  clientId?: string;
  dateDebut?: string;
  dateFin?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Fonction pour parser les champs JSON retournés par Supabase
const parseFactureData = (data: any): Facture => {
  return {
    ...data,
    prestations: JSON.parse(data.prestations || '[]'),
    paiements: JSON.parse(data.paiements || '[]')
  };
};

export const fetchFactures = async (params: FacturesQueryParams = {}): Promise<{ data: Facture[], count: number }> => {
  const {
    status,
    clientId,
    dateDebut,
    dateFin,
    page = 1,
    pageSize = 10,
    sortBy = "date",
    sortOrder = "desc"
  } = params;

  // Calcul de l'offset pour la pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Construction de la requête de base
  let query = supabase
    .from("factures")
    .select("*", { count: "exact" });

  // Application des filtres
  if (status) {
    query = query.eq("status", status);
  }
  
  if (clientId) {
    query = query.eq("client_id", clientId);
  }
  
  if (dateDebut) {
    query = query.gte("date", dateDebut);
  }
  
  if (dateFin) {
    query = query.lte("date", dateFin);
  }

  // Tri et pagination
  const { data, error, count } = await query
    .order(sortBy, { ascending: sortOrder === "asc" })
    .range(from, to);

  if (error) {
    console.error("Erreur lors de la récupération des factures:", error);
    throw new Error(error.message);
  }

  // Parser les champs JSON
  const parsedData = data ? data.map(parseFactureData) : [];

  return { 
    data: parsedData, 
    count: count || 0 
  };
};

export const fetchFactureById = async (id: string): Promise<Facture> => {
  const { data, error } = await supabase
    .from("factures")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Erreur lors de la récupération de la facture:", error);
    throw new Error(error.message);
  }

  // Parser les champs JSON
  return parseFactureData(data);
};
