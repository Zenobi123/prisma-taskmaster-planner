
import { Facture } from "@/types/facture";
import { Card, CardContent } from "@/components/ui/card";
import { Receipt, CreditCard } from "lucide-react";

interface HistoriquePaiementsProps {
  paiements: Array<{
    id?: string;
    date: string;
    montant: number;
    moyenPaiement: string;
    prestationIds?: string[];
    notes?: string;
  }>;
  formatMontant: (montant: number) => string;
}

export const HistoriquePaiements = ({ paiements, formatMontant }: HistoriquePaiementsProps) => {
  // Si la facture n'a pas de paiements, on n'affiche pas le composant
  if (!paiements || paiements.length === 0) {
    return null;
  }

  const getMoyenPaiementLabel = (moyen: string): string => {
    switch (moyen) {
      case 'especes': return 'Espèces';
      case 'orange_money': return 'Orange Money';
      case 'mtn_mobile': return 'MTN Mobile Money';
      case 'virement': return 'Virement bancaire';
      default: return moyen;
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-base">Historique des paiements</h3>
      <div className="space-y-2">
        {paiements.map((paiement, index) => (
          <Card key={paiement.id || index} className="overflow-hidden">
            <CardContent className="p-3">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-green-600" />
                  <span className="font-medium">{formatMontant(paiement.montant)}</span>
                </div>
                <span className="text-sm text-muted-foreground">{paiement.date}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {getMoyenPaiementLabel(paiement.moyenPaiement)}
                  </span>
                </div>
                {paiement.prestationIds && paiement.prestationIds.length > 0 && (
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                    {paiement.prestationIds.length} élément(s)
                  </span>
                )}
              </div>
              {paiement.notes && (
                <p className="text-xs text-muted-foreground mt-2 italic">
                  {paiement.notes}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
