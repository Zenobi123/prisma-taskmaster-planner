
import { Card, CardContent } from "@/components/ui/card";
import { FileText, DollarSign, BarChart2, PieChart, Receipt, Calculator } from "lucide-react";
import { formatMontant } from "@/utils/formatUtils";
import { SummaryStats } from "../types/AnalyseTypes";
import { useInvoiceData } from "@/hooks/facturation/clientFinancial/summary/useInvoiceData";

interface StatsSummaryCardsProps {
  stats: SummaryStats;
}

export const StatsSummaryCards = ({ stats }: StatsSummaryCardsProps) => {
  const { sentInvoicesCount, totalInvoiceAmount } = useInvoiceData();
  
  return (
    <div className="space-y-6 mb-6">
      {/* Cartes principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center">
            <FileText className="h-10 w-10 mr-4 text-[#84A98C]" />
            <div>
              <p className="text-sm text-gray-500">Total facturé</p>
              <p className="text-xl font-bold">{formatMontant(totalInvoiceAmount)}</p>
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
              <p className="text-xl font-bold">{sentInvoicesCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Détail des montants facturés et encaissés */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Détail du montant facturé */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium text-lg mb-4 flex items-center">
              <Receipt className="h-5 w-5 mr-2 text-[#84A98C]" />
              Détail du montant facturé
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Impôts</p>
                <p className="text-lg font-bold text-[#84A98C]">{formatMontant(stats.totalImpots)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.totalFactures > 0 ? 
                    `${((stats.totalImpots / stats.totalFactures) * 100).toFixed(1)}% du total` : 
                    '0% du total'}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Honoraires</p>
                <p className="text-lg font-bold text-[#2F3E46]">{formatMontant(stats.totalHonoraires)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.totalFactures > 0 ? 
                    `${((stats.totalHonoraires / stats.totalFactures) * 100).toFixed(1)}% du total` : 
                    '0% du total'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Détail du montant encaissé */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium text-lg mb-4 flex items-center">
              <Calculator className="h-5 w-5 mr-2 text-blue-500" />
              Détail du montant encaissé
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Impôts encaissés</p>
                <p className="text-lg font-bold text-blue-500">{formatMontant(stats.totalImpots - stats.impotsPendant)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.totalImpots > 0 ? 
                    `${(((stats.totalImpots - stats.impotsPendant) / stats.totalImpots) * 100).toFixed(1)}% des impôts` : 
                    '0% des impôts'}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Honoraires encaissés</p>
                <p className="text-lg font-bold text-blue-500">{formatMontant(stats.totalHonoraires - stats.honorairesPendant)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.totalHonoraires > 0 ? 
                    `${(((stats.totalHonoraires - stats.honorairesPendant) / stats.totalHonoraires) * 100).toFixed(1)}% des honoraires` : 
                    '0% des honoraires'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
