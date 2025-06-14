
import React, { memo } from 'react';
import { IgsObligationStatus } from '@/hooks/fiscal/types';

interface IgsPaymentSummaryDisplayProps {
  igsStatus: IgsObligationStatus | undefined;
}

const arePropsEqual = (prevProps: IgsPaymentSummaryDisplayProps, nextProps: IgsPaymentSummaryDisplayProps) => {
  const prev = prevProps.igsStatus;
  const next = nextProps.igsStatus;
  
  if (!prev && !next) return true;
  if (!prev || !next) return false;
  
  return (
    prev.montantAnnuel === next.montantAnnuel &&
    prev.outOfRange === next.outOfRange &&
    prev.montantTotalPaye === next.montantTotalPaye &&
    prev.soldeRestant === next.soldeRestant
  );
};

export const IgsPaymentSummaryDisplay: React.FC<IgsPaymentSummaryDisplayProps> = memo(({ igsStatus }) => {
  // Conditions de rendu stabilisées
  const shouldRender = Boolean(
    igsStatus && 
    typeof igsStatus.montantAnnuel === 'number' && 
    igsStatus.montantAnnuel > 0 && 
    !igsStatus.outOfRange
  );

  if (!shouldRender) {
    return null;
  }

  // Valeurs pré-calculées et stabilisées
  const displayValues = {
    montantTotalPaye: igsStatus!.montantTotalPaye || 0,
    soldeRestant: igsStatus!.soldeRestant || 0
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-blue-800">IGS payé :</span>
          <span className="text-sm font-bold text-blue-900">
            {displayValues.montantTotalPaye.toLocaleString('fr-FR')} FCFA
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-blue-800">Solde IGS à payer :</span>
          <span className="text-sm font-bold text-blue-900">
            {displayValues.soldeRestant.toLocaleString('fr-FR')} FCFA
          </span>
        </div>
      </div>
    </div>
  );
}, arePropsEqual);

IgsPaymentSummaryDisplay.displayName = 'IgsPaymentSummaryDisplay';
