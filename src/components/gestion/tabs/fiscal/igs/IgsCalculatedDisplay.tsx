
import React from 'react';
import { IgsObligationStatus } from '@/hooks/fiscal/types';

interface IgsCalculatedDisplayProps {
  igsStatus: IgsObligationStatus | undefined;
}

export const IgsCalculatedDisplay: React.FC<IgsCalculatedDisplayProps> = ({ igsStatus }) => {
  if (!igsStatus || (igsStatus.montantAnnuel === undefined || (igsStatus.montantAnnuel === 0 && !igsStatus.outOfRange) )) {
    // Don't render if montantAnnuel is 0 unless it's explicitly outOfRange
    return null;
  }
  
  return (
    <div className="bg-gray-100 border-l-4 border-primary rounded p-3 mb-4 flex items-center min-h-10">
      <div className="flex flex-col md:flex-row md:gap-8 items-start md:items-center">
        <span className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-gray-800 font-medium">
          Classe : {igsStatus.classe !== undefined ? igsStatus.classe : '-'}
        </span>
        <span className={`mt-2 md:mt-0 px-4 py-1 rounded font-bold text-white ${igsStatus.outOfRange ? 'bg-red-500' : 'bg-primary'}`}>
          {igsStatus.outOfRange
            ? 'Montant : régime du réel'
            : `Montant : ${(igsStatus.montantAnnuel || 0).toLocaleString('fr-FR')} FCFA`}
        </span>
      </div>
    </div>
  );
};

