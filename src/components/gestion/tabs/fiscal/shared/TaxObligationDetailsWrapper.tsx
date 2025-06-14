
import React from 'react';
import { X } from 'lucide-react';

interface TaxObligationDetailsWrapperProps {
  isDetailsOpened: boolean;
  isPayed: boolean;
  onToggleDetails: () => void;
  children: React.ReactNode;
}

export const TaxObligationDetailsWrapper: React.FC<TaxObligationDetailsWrapperProps> = ({
  isDetailsOpened,
  isPayed,
  onToggleDetails,
  children,
}) => {
  // This wrapper is only for the content *inside* the "if details opened or paid" block
  // The parent component will decide whether to render this wrapper + children or not.

  return (
    <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
      <div className="flex justify-between mb-4">
        <h4 className="font-medium text-sm">Détails du paiement</h4>
        {isDetailsOpened && !isPayed && ( // Show close button only if details are opened AND item is not paid
          <button
            type="button"
            onClick={onToggleDetails}
            className="p-1 text-gray-500 hover:text-gray-700"
            aria-label="Fermer les détails"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {children}
    </div>
  );
};

