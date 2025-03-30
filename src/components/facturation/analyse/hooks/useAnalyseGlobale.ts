
import { useState, useEffect, useRef, useMemo } from "react";
import { SummaryStats, ChartDataItem, MonthlyChartItem, PeriodFilter } from "../types/AnalyseTypes";
import { useInvoiceData } from "@/hooks/facturation/clientFinancial/summary/useInvoiceData";
import { usePaymentData } from "@/hooks/facturation/clientFinancial/summary/usePaymentData";
import { fetchFacturesForAnalysis, fetchPrestationsForAnalysis } from "../services/analyseDataService";
import { filterFacturesByPeriod } from "../utils/factureFilterUtils";
import { calculatePrestationTotals } from "../utils/prestationUtils";
import { prepareStatusChartData, prepareMonthlyChartData } from "../utils/chartDataUtils";

export const useAnalyseGlobale = (
  period: PeriodFilter,
  clientFilter: string | null,
  statusFilter: string | null
) => {
  const { invoices, sentInvoicesCount, totalInvoiceAmount } = useInvoiceData();
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
  
  // Pour éviter de refaire des calculs inutiles
  const lastParams = useRef({period, clientFilter, statusFilter});
  const cachedData = useRef<{
    facturesData: any[];
    prestationsData: any[];
    timestamp: number;
  }>({
    facturesData: [],
    prestationsData: [],
    timestamp: 0
  });
  
  // Durée de validité du cache en ms (30 secondes)
  const CACHE_DURATION = 30000;

  // Création d'un memoized key pour déterminer si on doit recalculer
  const paramKey = useMemo(() => {
    return `${period}-${clientFilter || 'null'}-${statusFilter || 'null'}`;
  }, [period, clientFilter, statusFilter]);

  useEffect(() => {
    const fetchAnalysisData = async () => {
      setIsLoading(true);
      try {
        // Vérifier si les paramètres ont changé ou si le cache est périmé
        const now = Date.now();
        const shouldRefetch = 
          paramKey !== `${lastParams.current.period}-${lastParams.current.clientFilter || 'null'}-${lastParams.current.statusFilter || 'null'}` ||
          now - cachedData.current.timestamp > CACHE_DURATION;
        
        // Si on n'a pas besoin de refetcher, on utilise les données en cache
        let facturesData = cachedData.current.facturesData;
        let prestationsData = cachedData.current.prestationsData;
        
        if (shouldRefetch) {
          console.log("Récupération des données d'analyse depuis la base de données");
          // Fetch data from Supabase
          [facturesData, prestationsData] = await Promise.all([
            fetchFacturesForAnalysis(),
            fetchPrestationsForAnalysis()
          ]);
          
          // Mettre à jour le cache
          cachedData.current = {
            facturesData,
            prestationsData,
            timestamp: now
          };
          
          // Mettre à jour les derniers paramètres
          lastParams.current = {period, clientFilter, statusFilter};
        } else {
          console.log("Utilisation des données d'analyse en cache");
        }
        
        // Filter factures by period, client, and status
        const filteredFactures = filterFacturesByPeriod(
          facturesData,
          period,
          clientFilter,
          statusFilter
        );
        
        // Create a map for faster lookup
        const facturesMap = new Map(filteredFactures.map(f => [f.id, f]));
        
        // Filter prestations that belong to filtered factures
        const filteredFactureIds = filteredFactures.map(f => f.id);
        const relevantPrestations = prestationsData.filter(p => 
          filteredFactureIds.includes(p.facture_id)
        );
        
        // Calculate totals for prestations
        const prestationTotals = calculatePrestationTotals(relevantPrestations, facturesMap);
        
        // Count factures by status
        const facturesParStatut = {
          payées: filteredFactures.filter(f => f.status_paiement === 'payée').length,
          partiellementPayées: filteredFactures.filter(f => f.status_paiement === 'partiellement_payée').length,
          nonPayées: filteredFactures.filter(f => f.status_paiement === 'non_payée').length,
          enRetard: filteredFactures.filter(f => f.status_paiement === 'en_retard').length
        };
        
        // Calculate total amounts - make sure these are accurate
        const totalFacturesInPeriod = filteredFactures.reduce(
          (sum, f) => sum + parseFloat(f.montant.toString()), 0
        );
        
        const totalPaiements = filteredFactures.reduce(
          (sum, f) => sum + parseFloat((f.montant_paye || 0).toString()), 0
        );
        
        // Calculate taux de recouvrement
        const tauxRecouvrement = totalFacturesInPeriod > 0 
          ? (totalPaiements / totalFacturesInPeriod) * 100 
          : 0;
        
        // Prepare chart data
        const statusChartData = prepareStatusChartData(facturesParStatut);
        const monthlyChartData = prepareMonthlyChartData(filteredFactures);
        
        // Update state
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
        console.error("Error fetching analysis data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalysisData();
  }, [paramKey, period, clientFilter, statusFilter, invoices, payments, sentInvoicesCount]);

  return {
    stats,
    isLoading,
    chartData,
    monthlyData
  };
};
