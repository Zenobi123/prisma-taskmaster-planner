
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { ObligationType, TaxObligationStatus } from '@/hooks/fiscal/types';

interface TaxObligationItemHeaderProps {
  taxKey: ObligationType;
  taxName: string;
  obligation: TaxObligationStatus;
  isDetailsOpened: boolean;
  onAssujettiChange: (checked: boolean) => void;
  onPayeeChange: (checked: boolean) => void;
  onToggleDetails: () => void;
}

export const TaxObligationItemHeader: React.FC<TaxObligationItemHeaderProps> = ({
  taxKey,
  taxName,
  obligation,
  isDetailsOpened,
  onAssujettiChange,
  onPayeeChange,
  onToggleDetails,
}) => {
  return (
    <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row sm:justify-between sm:items-center">
      <span className="font-medium text-sm sm:text-base text-gray-800">{taxName}</span>
      <div className="flex flex-wrap gap-3 sm:gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id={`${taxKey}-assujetti-switch`}
            checked={obligation.assujetti}
            onCheckedChange={onAssujettiChange}
          />
          <Label htmlFor={`${taxKey}-assujetti-switch`} className="text-xs sm:text-sm">
            {obligation.assujetti ? "Assujetti" : "Non assujetti"}
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id={`${taxKey}-paye-switch`}
            checked={obligation.payee}
            onCheckedChange={onPayeeChange}
            disabled={!obligation.assujetti}
          />
          <Label htmlFor={`${taxKey}-paye-switch`} className="text-xs sm:text-sm">
            {obligation.payee ? "Payé" : "Non payé"}
          </Label>
        </div>
        {obligation.assujetti && !obligation.payee && !isDetailsOpened && (
          <button
            type="button"
            className="inline-flex items-center px-2 sm:px-3 py-1 text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            onClick={onToggleDetails}
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            Détails
          </button>
        )}
      </div>
    </div>
  );
};

