
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, ResponsiveContainer, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { FileText, DollarSign, BarChart2, PieChart } from "lucide-react";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { formatMontant } from "@/utils/formatUtils";
import { Skeleton } from "@/components/ui/skeleton";
import { useInvoiceData } from "@/hooks/facturation/clientFinancial/summary/useInvoiceData";
import { usePaymentData } from "@/hooks/facturation/clientFinancial/summary/usePaymentData";
import { supabase } from "@/integrations/supabase/client";

interface AnalyseGlobaleProps {
  period: "month" | "quarter" | "year";
  clientFilter: string | null;
  statusFilter: string | null;
}

type SummaryStats = {
  totalFactures: number;
  totalPaiements: number;
  totalImpots: number;
  totalHonoraires: number;
  impotsPendant: number;
  honorairesPendant: number;
  tauxRecouvrement: number;
  facturesParStatut: {
    payées: number;
    partiellementPayées: number;
    nonPayées: number;
    enRetard: number;
  };
};

const AnalyseGlobale = ({ period, clientFilter, statusFilter }: AnalyseGlobaleProps) => {
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
  const [chartData, setChartData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

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
        const { data: facturesData, error: facturesError } = await supabase
          .from("factures")
          .select(`
            id, date, montant, montant_paye, status_paiement, client_id
          `);
          
        if (facturesError) throw facturesError;
        
        // Fetch all prestations
        const { data: prestationsData, error: prestationsError } = await supabase
          .from("prestations")
          .select("*");
          
        if (prestationsError) throw prestationsError;
        
        // Filter factures by period
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center">
            <FileText className="h-10 w-10 mr-4 text-[#84A98C]" />
            <div>
              <p className="text-sm text-gray-500">Total facturé</p>
              <p className="text-xl font-bold">{formatMontant(stats.totalFactures)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center">
            <DollarSign className="h-10 w-10 mr-4 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Total encaissé</p>
              <p className="text-xl font-bold">{formatMontant(stats.totalPaiements)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center">
            <BarChart2 className="h-10 w-10 mr-4 text-orange-500" />
            <div>
              <p className="text-sm text-gray-500">Taux de recouvrement</p>
              <p className="text-xl font-bold">{stats.tauxRecouvrement.toFixed(1)}%</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center">
            <PieChart className="h-10 w-10 mr-4 text-purple-500" />
            <div>
              <p className="text-sm text-gray-500">Factures émises</p>
              <p className="text-xl font-bold">{stats.facturesParStatut.payées + stats.facturesParStatut.partiellementPayées + stats.facturesParStatut.nonPayées + stats.facturesParStatut.enRetard}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Répartition des factures par statut</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ChartContainer
              config={{
                payées: { label: "Payées", color: "#84A98C" },
                partiellementPayées: { label: "Partiellement payées", color: "#F59E0B" },
                nonPayées: { label: "Non payées", color: "#6B7280" },
                enRetard: { label: "En retard", color: "#EF4444" }
              }}
              className="h-72"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fontSize: 12 }}
                    width={150}
                  />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="value" 
                    fill="#84A98C" 
                    radius={[0, 4, 4, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Évolution sur les derniers mois</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ChartContainer
              config={{
                facturé: { label: "Montant facturé", color: "#84A98C" },
                encaissé: { label: "Montant encaissé", color: "#60A5FA" }
              }}
              className="h-72"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis 
                    tickFormatter={(value) => 
                      new Intl.NumberFormat('fr-FR', { 
                        notation: 'compact',
                        compactDisplay: 'short'
                      }).format(Number(value))
                    } 
                  />
                  <Tooltip content={<ChartTooltipContent formatter={(value) => formatMontant(Number(value))} />} />
                  <Legend />
                  <Bar dataKey="facturé" fill="#84A98C" />
                  <Bar dataKey="encaissé" fill="#60A5FA" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Répartition des impôts</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <h3 className="text-sm text-gray-500 mb-1">Total des impôts</h3>
                <p className="text-2xl font-bold text-[#84A98C]">{formatMontant(stats.totalImpots)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.totalFactures > 0 ? 
                    `${((stats.totalImpots / stats.totalFactures) * 100).toFixed(1)}% du montant total facturé` : 
                    'Aucune facture émise'}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <h3 className="text-sm text-gray-500 mb-1">Impôts en attente</h3>
                <p className="text-2xl font-bold text-red-500">{formatMontant(stats.impotsPendant)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.totalImpots > 0 ? 
                    `${((stats.impotsPendant / stats.totalImpots) * 100).toFixed(1)}% des impôts à collecter` : 
                    'Aucun impôt facturé'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Répartition des honoraires</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <h3 className="text-sm text-gray-500 mb-1">Total des honoraires</h3>
                <p className="text-2xl font-bold text-[#2F3E46]">{formatMontant(stats.totalHonoraires)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.totalFactures > 0 ? 
                    `${((stats.totalHonoraires / stats.totalFactures) * 100).toFixed(1)}% du montant total facturé` : 
                    'Aucune facture émise'}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <h3 className="text-sm text-gray-500 mb-1">Honoraires en attente</h3>
                <p className="text-2xl font-bold text-blue-500">{formatMontant(stats.honorairesPendant)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.totalHonoraires > 0 ? 
                    `${((stats.honorairesPendant / stats.totalHonoraires) * 100).toFixed(1)}% des honoraires à recevoir` : 
                    'Aucun honoraire facturé'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyseGlobale;
