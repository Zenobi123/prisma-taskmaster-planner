
import { Card, CardContent } from "@/components/ui/card";
import { Banknote, DollarSign, Building } from "lucide-react";
import { formatMontant } from "@/utils/formatUtils";

interface FactureSummaryCardsProps {
  montantTotal: number;
  montantPaye: number;
  montantRestant: number;
}

export const FactureSummaryCards = ({ 
  montantTotal, 
  montantPaye, 
  montantRestant 
}: FactureSummaryCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <Card className="bg-gray-50">
        <CardContent className="p-4 flex items-center">
          <Banknote className="h-8 w-8 mr-3 text-[#84A98C]" />
          <div>
            <p className="text-sm text-gray-500">Montant total</p>
            <p className="text-xl font-bold">{formatMontant(montantTotal)}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-50">
        <CardContent className="p-4 flex items-center">
          <DollarSign className="h-8 w-8 mr-3 text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Montant payé</p>
            <p className="text-xl font-bold">{formatMontant(montantPaye)}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-50">
        <CardContent className="p-4 flex items-center">
          <Building className="h-8 w-8 mr-3 text-red-500" />
          <div>
            <p className="text-sm text-gray-500">Reste à payer</p>
            <p className="text-xl font-bold">{formatMontant(montantRestant)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
