
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useClientFinancialStats = () => {
  const { data: facturesData, isLoading: isFacturesLoading } = useQuery({
    queryKey: ["client-financial-stats"],
    queryFn: async () => {
      // Récupérer les factures des clients en gestion qui ne sont pas entièrement soldées
      const { data: factures, error } = await supabase
        .from('factures')
        .select(`
          id,
          montant,
          montant_paye,
          client_id,
          clients!inner(gestionexternalisee)
        `)
        .neq('status', 'annulée');

      if (error) throw error;

      return factures || [];
    },
    refetchInterval: 10000,
    refetchOnWindowFocus: true
  });

  return useMemo(() => {
    if (isFacturesLoading || !facturesData) {
      return {
        unpaidInvoicesCount: 0,
        totalOutstandingAmount: 0,
        isLoading: true
      };
    }

    // Filtrer les factures des clients en gestion
    const managedClientInvoices = facturesData.filter((facture: any) => 
      facture.clients?.gestionexternalisee === true
    );

    // Compter les factures non entièrement soldées
    const unpaidInvoices = managedClientInvoices.filter((facture: any) => {
      const montant = Number(facture.montant) || 0;
      const montantPaye = Number(facture.montant_paye) || 0;
      return montantPaye < montant;
    });

    const unpaidInvoicesCount = unpaidInvoices.length;

    // Calculer le montant total des créances
    const totalOutstandingAmount = unpaidInvoices.reduce((total: number, facture: any) => {
      const montant = Number(facture.montant) || 0;
      const montantPaye = Number(facture.montant_paye) || 0;
      return total + (montant - montantPaye);
    }, 0);

    console.log("Client financial stats:", {
      totalInvoices: managedClientInvoices.length,
      unpaidInvoicesCount,
      totalOutstandingAmount
    });

    return {
      unpaidInvoicesCount,
      totalOutstandingAmount,
      isLoading: false
    };
  }, [facturesData, isFacturesLoading]);
};
