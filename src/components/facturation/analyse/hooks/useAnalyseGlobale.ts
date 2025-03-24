
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SummaryStats, ChartDataItem, MonthlyChartItem, PeriodFilter } from "../types/AnalyseTypes";
import { useInvoiceData } from "@/hooks/facturation/clientFinancial/summary/useInvoiceData";
import { usePaymentData } from "@/hooks/facturation/clientFinancial/summary/usePaymentData";

export const useAnalyseGlobale = (
  period: PeriodFilter,
  clientFilter: string | null,
  statusFilter: string | null
) => {
  const { invoices } = useInvoiceData();
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
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyChartItem[]>([]);

  useEffect(() => {
    const fetchAnalysisData = async () => {
      setIsLoading(true);
      try {
        // Apply period filter
        const now = new Date();
        const startDate = new Date();
        
        if (period === "month") {
          startDate.setMonth(now.getMonth() - 1);
        } else if (period === "quarter") {
          startDate.setMonth(now.getMonth() - 3);
        } else if (period === "year") {
          startDate.setFullYear(now.getFullYear() - 1);
        }
        
        // Fetch all factures with prestations to calculate impots/honoraires
        // Only consider factures with status "envoyée"
        const { data: facturesData, error: facturesError } = await supabase
          .from("factures")
          .select(`
            id, date, montant, montant_paye, status_paiement, client_id, status
          `)
          .eq("status", "envoyée");
          
        if (facturesError) throw facturesError;
        
        // Fetch all prestations
        const { data: prestationsData, error: prestationsError } = await supabase
          .from("prestations")
          .select("*");
          
        if (prestationsError) throw prestationsError;
        
        // Filter factures by period - only include status "envoyée"
        const filteredFactures = facturesData.filter(facture => {
          // Convert YYYY-MM-DD to Date object
          const factureDate = new Date(facture.date);
          
          let includeFacture = factureDate >= startDate && factureDate <= now;
          
          // Apply client filter
          if (clientFilter) {
            includeFacture = includeFacture && facture.client_id === clientFilter;
          }
          
          // Apply status filter
          if (statusFilter) {
            includeFacture = includeFacture && facture.status_paiement === statusFilter;
          }
          
          return includeFacture;
        });
        
        // Count factures by status
        const facturesParStatut = {
          payées: filteredFactures.filter(f => f.status_paiement === 'payée').length,
          partiellementPayées: filteredFactures.filter(f => f.status_paiement === 'partiellement_payée').length,
          nonPayées: filteredFactures.filter(f => f.status_paiement === 'non_payée').length,
          enRetard: filteredFactures.filter(f => f.status_paiement === 'en_retard').length
        };
        
        // Calculate total amounts
        const totalFactures = filteredFactures.reduce((sum, f) => sum + parseFloat(f.montant.toString()), 0);
        const totalPaiements = filteredFactures.reduce((sum, f) => sum + parseFloat((f.montant_paye || 0).toString()), 0);
        
        // Calculate taux de recouvrement
        const tauxRecouvrement = totalFactures > 0 ? (totalPaiements / totalFactures) * 100 : 0;
        
        // Group prestations by facture_id and type
        let totalImpots = 0;
        let totalHonoraires = 0;
        let impotsPendant = 0;
        let honorairesPendant = 0;
        
        // Filter prestations that belong to filtered factures
        const filteredFactureIds = filteredFactures.map(f => f.id);
        const relevantPrestations = prestationsData.filter(p => filteredFactureIds.includes(p.facture_id));
        
        // Classify each prestation
        relevantPrestations.forEach(prestation => {
          const descLower = prestation.description.toLowerCase();
          const isImpot = 
            descLower.includes("patente") || 
            descLower.includes("bail") || 
            descLower.includes("taxe") || 
            descLower.includes("impôt") || 
            descLower.includes("précompte") || 
            descLower.includes("solde ir") || 
            descLower.includes("solde irpp") || 
            descLower.includes("timbre");
          
          // Find the corresponding facture
          const facture = filteredFactures.find(f => f.id === prestation.facture_id);
          if (facture) {
            const montant = parseFloat(prestation.montant.toString());
            
            if (isImpot) {
              totalImpots += montant;
              
              // If facture is not fully paid, add to pending
              if (facture.status_paiement !== 'payée') {
                const paymentRatio = facture.montant_paye ? facture.montant_paye / facture.montant : 0;
                impotsPendant += montant * (1 - paymentRatio);
              }
            } else {
              totalHonoraires += montant;
              
              // If facture is not fully paid, add to pending
              if (facture.status_paiement !== 'payée') {
                const paymentRatio = facture.montant_paye ? facture.montant_paye / facture.montant : 0;
                honorairesPendant += montant * (1 - paymentRatio);
              }
            }
          }
        });
        
        // Prepare chart data for factures by status
        const statusChartData = [
          { name: 'Payées', value: facturesParStatut.payées },
          { name: 'Partiellement payées', value: facturesParStatut.partiellementPayées },
          { name: 'Non payées', value: facturesParStatut.nonPayées },
          { name: 'En retard', value: facturesParStatut.enRetard }
        ];
        
        // Prepare monthly data
        const monthlyChartData = [];
        // Get last 6 months
        for (let i = 5; i >= 0; i--) {
          const monthDate = new Date();
          monthDate.setMonth(monthDate.getMonth() - i);
          
          const monthName = monthDate.toLocaleString('fr-FR', { month: 'short' });
          const year = monthDate.getFullYear();
          const month = monthDate.getMonth();
          
          // Filter factures for this month
          const monthFactures = filteredFactures.filter(f => {
            const factureDate = new Date(f.date);
            return factureDate.getMonth() === month && factureDate.getFullYear() === year;
          });
          
          const monthTotal = monthFactures.reduce((sum, f) => sum + parseFloat(f.montant.toString()), 0);
          const monthPaid = monthFactures.reduce((sum, f) => sum + parseFloat((f.montant_paye || 0).toString()), 0);
          
          monthlyChartData.push({
            name: monthName,
            facturé: monthTotal,
            encaissé: monthPaid
          });
        }
        
        setStats({
          totalFactures,
          totalPaiements,
          totalImpots,
          totalHonoraires,
          impotsPendant,
          honorairesPendant,
          tauxRecouvrement,
          facturesParStatut
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
  }, [period, clientFilter, statusFilter, invoices, payments]);

  return {
    stats,
    isLoading,
    chartData,
    monthlyData
  };
};
