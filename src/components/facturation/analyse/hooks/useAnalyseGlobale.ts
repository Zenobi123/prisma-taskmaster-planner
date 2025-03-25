
import { useState, useEffect } from "react";
import { SummaryStats, ChartDataItem, MonthlyChartItem, PeriodFilter } from "../types/AnalyseTypes";
import { useInvoiceData } from "@/hooks/facturation/clientFinancial/summary/useInvoiceData";
import { usePaymentData } from "@/hooks/facturation/clientFinancial/summary/usePaymentData";
import { 
  fetchFacturesForAnalysis, 
  fetchPrestationsForAnalysis 
} from "../services/analyseDataService";
import { filterFacturesByPeriod } from "../utils/factureFilterUtils";
import { calculatePrestationTotals } from "../utils/prestationUtils";
import { prepareStatusChartData, prepareMonthlyChartData } from "../utils/chartDataUtils";

export const useAnalyseGlobale = (
  period: PeriodFilter,
  clientFilter: string | null,
  statusFilter: string | null
) => {
  const { sentInvoicesCount, totalInvoiceAmount } = useInvoiceData();
  const { payments } = usePaymentData();
  const [stats, setStats] = useState<SummaryStats>({
    totalFactures: 0,
    totalPaiements: 0,
    totalImpots: 0,
    totalHonoraires: 0,
    impotsPendant: 0,
    honorairesPendant: 0,
    tauxRecouvrement: 0,
    facturesParStatut: {
      payées: 0,
      partiellementPayées: 0,
      nonPayées: 0,
      enRetard: 0
    },
    totalFacturesEmises: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyChartItem[]>([]);

  useEffect(() => {
    const fetchAnalysisData = async () => {
      setIsLoading(true);
      try {
        // Récupérer les données depuis Supabase
        const [facturesData, prestationsData] = await Promise.all([
          fetchFacturesForAnalysis(),
          fetchPrestationsForAnalysis()
        ]);
        
        // Filtrer les factures selon la période, le client et le statut
        const filteredFactures = filterFacturesByPeriod(
          facturesData,
          period,
          clientFilter,
          statusFilter
        );
        
        // Créer une map pour une recherche plus rapide
        const facturesMap = new Map(filteredFactures.map(f => [f.id, f]));
        
        // Filtrer les prestations qui appartiennent aux factures filtrées
        const filteredFactureIds = filteredFactures.map(f => f.id);
        const relevantPrestations = prestationsData.filter(p => 
          filteredFactureIds.includes(p.facture_id)
        );
        
        // Calculer les totaux pour les prestations
        const prestationTotals = calculatePrestationTotals(relevantPrestations, facturesMap);
        
        // Compter les factures par statut
        const facturesParStatut = {
          payées: filteredFactures.filter(f => f.status_paiement === 'payée').length,
          partiellementPayées: filteredFactures.filter(f => f.status_paiement === 'partiellement_payée').length,
          nonPayées: filteredFactures.filter(f => f.status_paiement === 'non_payée').length,
          enRetard: filteredFactures.filter(f => f.status_paiement === 'en_retard').length
        };
        
        // Calculer les montants totaux
        const totalFacturesInPeriod = filteredFactures.reduce(
          (sum, f) => sum + parseFloat(f.montant.toString()), 0
        );
        
        const totalPaiements = filteredFactures.reduce(
          (sum, f) => sum + parseFloat((f.montant_paye || 0).toString()), 0
        );
        
        console.log("Montant total facturé (période):", totalFacturesInPeriod);
        console.log("Montant total payé (période):", totalPaiements);
        
        // Calculer le taux de recouvrement
        const tauxRecouvrement = totalFacturesInPeriod > 0 
          ? (totalPaiements / totalFacturesInPeriod) * 100 
          : 0;
        
        // Préparer les données pour les graphiques
        const statusChartData = prepareStatusChartData(facturesParStatut);
        const monthlyChartData = prepareMonthlyChartData(filteredFactures);
        
        // Mettre à jour l'état
        setStats({
          totalFactures: totalFacturesInPeriod,
          totalPaiements,
          totalImpots: prestationTotals.totalImpots,
          totalHonoraires: prestationTotals.totalHonoraires,
          impotsPendant: prestationTotals.impotsPendant,
          honorairesPendant: prestationTotals.honorairesPendant,
          tauxRecouvrement,
          facturesParStatut,
          totalFacturesEmises: sentInvoicesCount
        });
        
        setChartData(statusChartData);
        setMonthlyData(monthlyChartData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données d'analyse:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalysisData();
  }, [period, clientFilter, statusFilter, sentInvoicesCount]);

  return {
    stats,
    isLoading,
    chartData,
    monthlyData
  };
};
