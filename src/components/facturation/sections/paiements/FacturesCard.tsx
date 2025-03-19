
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Facture } from "@/types/facture";
import { FacturesTable } from "./FacturesTable";

interface FacturesCardProps {
  factures: Facture[];
  formatMontant: (montant: number) => string;
  onOpenPaymentDialog: (facture: Facture) => void;
  onOpenPartialPaymentDialog: (facture: Facture) => void;
}

export const FacturesCard = ({
  factures,
  formatMontant,
  onOpenPaymentDialog,
  onOpenPartialPaymentDialog
}: FacturesCardProps) => {
  return (
    <Card className="shadow-sm hover:shadow transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Factures à encaisser</CardTitle>
        <CardDescription>
          {factures.length} facture(s) en attente de paiement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FacturesTable 
          factures={factures}
          formatMontant={formatMontant}
          onOpenPaymentDialog={onOpenPaymentDialog}
          onOpenPartialPaymentDialog={onOpenPartialPaymentDialog}
        />
      </CardContent>
    </Card>
  );
};
