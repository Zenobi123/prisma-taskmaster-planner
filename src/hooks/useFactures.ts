
import { useQuery } from "@tanstack/react-query";
import { fetchFactures } from "@/services/facture/facturesQuery";
import { useState } from "react";
import { Facture, Paiement } from "@/types/facture";
import { updateFacture } from "@/services/facture/factureUpdate";
import { deleteFacture } from "@/services/facture/factureDelete";
import { enregistrerPaiement } from "@/services/facture/factureUpdate";

export interface UseFacturesParams {
  page?: number;
  pageSize?: number;
  status?: string;
  clientId?: string;
  dateDebut?: string;
  dateFin?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  q?: string; // Paramètre de recherche
}

export const useFactures = (initialParams: Partial<UseFacturesParams> = {}) => {
  const [params, setParams] = useState<Partial<UseFacturesParams>>(initialParams);

  // Fonction pour mettre à jour les paramètres de filtrage
  const updateParams = (newParams: Partial<UseFacturesParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  // Récupération des factures avec les paramètres actuels
  const queryResult = useQuery({
    queryKey: ["factures", params],
    queryFn: () => fetchFactures(params),
  });

  // Fonctions d'actions sur les factures
  const handleUpdateInvoice = async (id: string, data: Partial<Facture>) => {
    const result = await updateFacture(id, data);
    queryResult.refetch();
    return result;
  };

  const handleDeleteInvoice = async (id: string) => {
    await deleteFacture(id);
    queryResult.refetch();
  };

  const handlePaiementPartiel = async (id: string, paiement: Paiement) => {
    const result = await enregistrerPaiement(id, paiement);
    queryResult.refetch();
    return result;
  };

  // Extrait les données pour plus de facilité d'accès
  const factures = queryResult.data?.data || [];
  const totalCount = queryResult.data?.count || 0;

  return {
    ...queryResult,
    factures,
    totalCount,
    updateParams,
    handleUpdateInvoice,
    handleDeleteInvoice,
    handlePaiementPartiel,
  };
};
