
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PaySlipSummaryCardsProps {
  totalSalairesBruts: number;
  totalChargesPatronales: number;
  totalChargesSalariales: number;
  totalNetAPayer: number;
  formatMontant: (montant?: number) => string;
}

export const PaySlipSummaryCards: React.FC<PaySlipSummaryCardsProps> = ({
  totalSalairesBruts,
  totalChargesPatronales,
  totalChargesSalariales,
  totalNetAPayer,
  formatMontant
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Salaires bruts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatMontant(totalSalairesBruts)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Charges patronales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatMontant(totalChargesPatronales)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Charges salariales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatMontant(totalChargesSalariales)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Net à payer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatMontant(totalNetAPayer)}</div>
        </CardContent>
      </Card>
    </div>
  );
};
