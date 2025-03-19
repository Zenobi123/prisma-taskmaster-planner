
import { useQuery } from "@tanstack/react-query";
import { fetchFactures } from "@/services/facture/facturesQuery";

export interface UseFacturesParams {
  page?: number;
  pageSize?: number;
  status?: string;
  clientId?: string;
  dateDebut?: string;
  dateFin?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  q?: string; // Ajout du paramètre de recherche
}

export const useFactures = (params: Partial<UseFacturesParams> = {}) => {
  return useQuery({
    queryKey: ["factures", params],
    queryFn: () => fetchFactures(params),
  });
};
