
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Facture } from "@/types/facture";
import { getClientsFromFactures, calculateTotals } from "./utils";

interface RecoveryRateCardProps {
  factures: Facture[];
  formatMontant: (montant: number) => string;
}

export const RecoveryRateCard = ({ factures, formatMontant }: RecoveryRateCardProps) => {
  const clients = getClientsFromFactures(factures);
  const { totalEncours, totalSolde, tauxRecouvrement } = calculateTotals(clients);
  
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Taux de recouvrement</h3>
          <p className="text-sm text-muted-foreground">Pourcentage des factures recouvrées</p>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Progression</span>
            <span className="text-sm font-medium">{tauxRecouvrement.toFixed(1)}%</span>
          </div>
          <Progress value={tauxRecouvrement} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div>
            <p className="text-sm text-muted-foreground">Total facturé</p>
            <p className="text-lg font-medium">{formatMontant(totalEncours)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Reste à payer</p>
            <p className="text-lg font-medium">{formatMontant(totalSolde)}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
