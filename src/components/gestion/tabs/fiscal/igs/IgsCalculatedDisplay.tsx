
import React, { memo } from 'react';
import { IgsObligationStatus } from '@/hooks/fiscal/types';

interface IgsCalculatedDisplayProps {
  igsStatus: IgsObligationStatus | undefined;
}

export const IgsCalculatedDisplay: React.FC<IgsCalculatedDisplayProps> = memo(({ igsStatus }) => {
  // Conditions de rendu stabilisées
  const shouldRender = igsStatus && 
    (typeof igsStatus.montantAnnuel === 'number') && 
    (igsStatus.montantAnnuel > 0 || igsStatus.outOfRange);

  if (!shouldRender) {
    return null;
  }

  // Valeurs stabilisées avec des valeurs par défaut
  const classe = igsStatus.classe !== undefined ? igsStatus.classe : '-';
  const montantAnnuel = igsStatus.montantAnnuel || 0;
  const outOfRange = Boolean(igsStatus.outOfRange);
  
  return (
    <div className="bg-gray-100 border-l-4 border-primary rounded p-3 mb-4 flex items-center min-h-10">
      <div className="flex flex-col md:flex-row md:gap-8 items-start md:items-center">
        <span className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-gray-800 font-medium">
          Classe : {classe}
        </span>
        <span className={`mt-2 md:mt-0 px-4 py-1 rounded font-bold text-white ${outOfRange ? 'bg-red-500' : 'bg-primary'}`}>
          {outOfRange
            ? 'Montant : régime du réel'
            : `Montant : ${montantAnnuel.toLocaleString('fr-FR')} FCFA`}
        </span>
      </div>
    </div>
  );
});

IgsCalculatedDisplay.displayName = 'IgsCalculatedDisplay';
