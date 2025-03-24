
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatMontant } from "@/utils/formatUtils";
import { SummaryStats } from "../types/AnalyseTypes";

interface TaxDistributionCardsProps {
  stats: SummaryStats;
}

export const TaxDistributionCards = ({ stats }: TaxDistributionCardsProps) => {
  return (
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
  );
};
