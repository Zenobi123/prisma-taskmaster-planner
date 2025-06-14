
import React, { memo } from 'react';
import { IgsObligationStatus } from '@/hooks/fiscal/types';

interface IgsCalculatedDisplayProps {
  igsStatus: IgsObligationStatus | undefined;
}

const arePropsEqual = (prevProps: IgsCalculatedDisplayProps, nextProps: IgsCalculatedDisplayProps) => {
  const prev = prevProps.igsStatus;
  const next = nextProps.igsStatus;
  
  if (!prev && !next) return true;
  if (!prev || !next) return false;
  
  return (
    prev.classe === next.classe &&
    prev.montantAnnuel === next.montantAnnuel &&
    prev.outOfRange === next.outOfRange
  );
};

export const IgsCalculatedDisplay: React.FC<IgsCalculatedDisplayProps> = memo(({ igsStatus }) => {
  // Conditions de rendu stabilisées avec valeurs pré-calculées
  const shouldRender = Boolean(
    igsStatus && 
    typeof igsStatus.montantAnnuel === 'number' && 
    (igsStatus.montantAnnuel > 0 || igsStatus.outOfRange)
  );

  if (!shouldRender) {
    return null;
  }

  // Valeurs pré-calculées et stabilisées
  const displayValues = {
    classe: igsStatus!.classe !== undefined ? String(igsStatus!.classe) : '-',
    montantAnnuel: igsStatus!.montantAnnuel || 0,
    outOfRange: Boolean(igsStatus!.outOfRange)
  };
  
  return (
    <div className="bg-gray-100 border-l-4 border-primary rounded p-3 mb-4 flex items-center min-h-10">
      <div className="flex flex-col md:flex-row md:gap-8 items-start md:items-center">
        <span className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-gray-800 font-medium">
          Classe : {displayValues.classe}
        </span>
        <span className={`mt-2 md:mt-0 px-4 py-1 rounded font-bold text-white ${displayValues.outOfRange ? 'bg-red-500' : 'bg-primary'}`}>
          {displayValues.outOfRange
            ? 'Montant : régime du réel'
            : `Montant : ${displayValues.montantAnnuel.toLocaleString('fr-FR')} FCFA`}
        </span>
      </div>
    </div>
  );
}, arePropsEqual);

IgsCalculatedDisplay.displayName = 'IgsCalculatedDisplay';
