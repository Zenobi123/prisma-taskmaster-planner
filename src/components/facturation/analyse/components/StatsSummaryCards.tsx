
import { Card, CardContent } from "@/components/ui/card";
import { FileText, DollarSign, BarChart2, PieChart } from "lucide-react";
import { formatMontant } from "@/utils/formatUtils";
import { SummaryStats } from "../types/AnalyseTypes";
import { useInvoiceData } from "@/hooks/facturation/clientFinancial/summary/useInvoiceData";

interface StatsSummaryCardsProps {
  stats: SummaryStats;
}

export const StatsSummaryCards = ({ stats }: StatsSummaryCardsProps) => {
  const { sentInvoicesCount, totalInvoiceAmount } = useInvoiceData();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
            <p className="text-xl font-bold">{Math.round(stats.tauxRecouvrement)}%</p>
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
  );
};
