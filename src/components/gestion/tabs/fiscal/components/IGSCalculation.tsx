
import React from 'react';

interface IGSCalculationProps {
  amount: number;
  quarterlyAmount: number;
}

export const IGSCalculation = ({ 
  amount, 
  quarterlyAmount 
}: IGSCalculationProps) => {
  return (
    <div className="bg-muted p-4 rounded-md text-sm">
      <div className="font-medium mb-2">Calcul IGS:</div>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Montant annuel:</span>
          <span className="font-medium">{amount.toLocaleString()} FCFA</span>
        </div>
        <div className="flex justify-between">
          <span>Paiement trimestriel (25%):</span>
          <span className="font-medium">{quarterlyAmount.toLocaleString()} FCFA</span>
        </div>
      </div>
    </div>
  );
};
