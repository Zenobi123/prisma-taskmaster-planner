
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, Clock, CreditCard } from "lucide-react";
import { Facture } from "@/types/facture";

interface PaiementStatsCardsProps {
  factures: Facture[];
  formatMontant: (montant: number) => string;
}

export const PaiementStatsCards = ({ factures, formatMontant }: PaiementStatsCardsProps) => {
  const facturesForPayment = factures.filter(f => f.status !== 'payée');
  
  const pendingPayments = facturesForPayment
    .filter(f => f.status === 'en_attente' || f.status === 'envoyée' || f.status === 'partiellement_payée')
    .reduce((sum, f) => {
      const montantPaye = f.montantPaye || 0;
      return sum + (f.montant - montantPaye);
    }, 0);
  
  const confirmedPayments = factures
    .reduce((sum, f) => sum + (f.montantPaye || 0), 0);
  
  const paymentMethods = {
    especes: 0,
    orange_money: 0,
    mtn_mobile: 0,
    virement: 0
  };
  
  factures.forEach(facture => {
    if (facture.paiements && facture.paiements.length > 0) {
      facture.paiements.forEach(paiement => {
        if (paiement.moyenPaiement) {
          paymentMethods[paiement.moyenPaiement as keyof typeof paymentMethods]++;
        }
      });
    } else if (facture.status === 'payée' && facture.moyenPaiement) {
      paymentMethods[facture.moyenPaiement as keyof typeof paymentMethods]++;
    }
  });
  
  const totalPaidFactures = factures
    .flatMap(f => f.paiements || [])
    .length || factures.filter(f => f.status === 'payée' && f.moyenPaiement).length;
  
  const paymentMethodsPercentages = {
    especes: totalPaidFactures > 0 ? Math.round((paymentMethods.especes / totalPaidFactures) * 100) : 0,
    orange_money: totalPaidFactures > 0 ? Math.round((paymentMethods.orange_money / totalPaidFactures) * 100) : 0,
    mtn_mobile: totalPaidFactures > 0 ? Math.round((paymentMethods.mtn_mobile / totalPaidFactures) * 100) : 0,
    virement: totalPaidFactures > 0 ? Math.round((paymentMethods.virement / totalPaidFactures) * 100) : 0
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Receipt className="w-5 h-5 text-green-600" />
            Paiements confirmés
          </CardTitle>
          <CardDescription>Total des paiements confirmés</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {formatMontant(confirmedPayments)}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            Paiements en attente
          </CardTitle>
          <CardDescription>Total des paiements en attente</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {formatMontant(pendingPayments)}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            Méthodes de paiement
          </CardTitle>
          <CardDescription>Répartition par type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Espèces</span>
              <span className="font-medium">{paymentMethodsPercentages.especes}%</span>
            </div>
            <div className="flex justify-between">
              <span>Orange Money</span>
              <span className="font-medium">{paymentMethodsPercentages.orange_money}%</span>
            </div>
            <div className="flex justify-between">
              <span>MTN Mobile Money</span>
              <span className="font-medium">{paymentMethodsPercentages.mtn_mobile}%</span>
            </div>
            <div className="flex justify-between">
              <span>Virement bancaire</span>
              <span className="font-medium">{paymentMethodsPercentages.virement}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
