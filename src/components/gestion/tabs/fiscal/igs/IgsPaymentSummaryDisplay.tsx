
import React, { memo } from 'react';
import { IgsObligationStatus } from '@/hooks/fiscal/types';

interface IgsPaymentSummaryDisplayProps {
  igsStatus: IgsObligationStatus | undefined;
}

export const IgsPaymentSummaryDisplay: React.FC<IgsPaymentSummaryDisplayProps> = memo(({ igsStatus }) => {
  // Conditions de rendu stabilisées
  const shouldRender = igsStatus && 
    typeof igsStatus.montantAnnuel === 'number' && 
    igsStatus.montantAnnuel > 0 && 
    !igsStatus.outOfRange;

  if (!shouldRender) {
    return null;
  }

  // Valeurs stabilisées avec des valeurs par défaut
  const montantTotalPaye = igsStatus.montantTotalPaye || 0;
  const soldeRestant = igsStatus.soldeRestant || 0;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-blue-800">IGS payé :</span>
          <span className="text-sm font-bold text-blue-900">
            {montantTotalPaye.toLocaleString('fr-FR')} FCFA
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-blue-800">Solde IGS à payer :</span>
          <span className="text-sm font-bold text-blue-900">
            {soldeRestant.toLocaleString('fr-FR')} FCFA
          </span>
        </div>
      </div>
    </div>
  );
});

IgsPaymentSummaryDisplay.displayName = 'IgsPaymentSummaryDisplay';
