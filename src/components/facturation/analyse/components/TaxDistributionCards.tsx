
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatMontant } from "@/utils/formatUtils";
import { SummaryStats } from "../types/AnalyseTypes";
import { TrendingDown, TrendingUp } from "lucide-react";

interface TaxDistributionCardsProps {
  stats: SummaryStats;
}

export const TaxDistributionCards = ({ stats }: TaxDistributionCardsProps) => {
  // Calcul du pourcentage d'impôts non recouvrés
  const impotsPendantPercentage = stats.totalImpots > 0 
    ? (stats.impotsPendant / stats.totalImpots) * 100 
    : 0;
    
  // Calcul du pourcentage d'honoraires non recouvrés
  const honorairesPendantPercentage = stats.totalHonoraires > 0 
    ? (stats.honorairesPendant / stats.totalHonoraires) * 100 
    : 0;
    
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <TrendingDown className="h-5 w-5 mr-2 text-red-500" />
            Montants à recouvrer
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <h3 className="text-sm text-gray-500 mb-1">Impôts à collecter</h3>
              <p className="text-2xl font-bold text-red-500">{formatMontant(stats.impotsPendant)}</p>
              <p className="text-xs text-gray-500 mt-1">
                {impotsPendantPercentage > 0 ? 
                  `${impotsPendantPercentage.toFixed(1)}% des impôts facturés` : 
                  'Tous les impôts sont recouvrés'}
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <h3 className="text-sm text-gray-500 mb-1">Honoraires à percevoir</h3>
              <p className="text-2xl font-bold text-blue-500">{formatMontant(stats.honorairesPendant)}</p>
              <p className="text-xs text-gray-500 mt-1">
                {honorairesPendantPercentage > 0 ? 
                  `${honorairesPendantPercentage.toFixed(1)}% des honoraires facturés` : 
                  'Tous les honoraires sont perçus'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
            Répartition des paiements
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <h3 className="text-sm text-gray-500 mb-1">Taux recouvrement impôts</h3>
              <p className="text-2xl font-bold text-green-500">
                {stats.totalImpots > 0 ? 
                  `${(((stats.totalImpots - stats.impotsPendant) / stats.totalImpots) * 100).toFixed(1)}%` : 
                  '0%'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatMontant(stats.totalImpots - stats.impotsPendant)} / {formatMontant(stats.totalImpots)}
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <h3 className="text-sm text-gray-500 mb-1">Taux recouvrement honoraires</h3>
              <p className="text-2xl font-bold text-green-500">
                {stats.totalHonoraires > 0 ? 
                  `${(((stats.totalHonoraires - stats.honorairesPendant) / stats.totalHonoraires) * 100).toFixed(1)}%` : 
                  '0%'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatMontant(stats.totalHonoraires - stats.honorairesPendant)} / {formatMontant(stats.totalHonoraires)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
