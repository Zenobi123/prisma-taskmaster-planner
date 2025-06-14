
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
    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
      <span className="font-medium text-gray-800">{taxName}</span>
      <div className="flex flex-col sm:flex-row gap-4 mt-3 md:mt-0">
        <div className="flex items-center space-x-2">
          <Switch
            id={`${taxKey}-assujetti-switch`} // Unique ID
            checked={obligation.assujetti}
            onCheckedChange={onAssujettiChange}
          />
          <Label htmlFor={`${taxKey}-assujetti-switch`}>
            {obligation.assujetti ? "Assujetti" : "Non assujetti"}
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id={`${taxKey}-paye-switch`} // Unique ID
            checked={obligation.payee}
            onCheckedChange={onPayeeChange}
            disabled={!obligation.assujetti}
          />
          <Label htmlFor={`${taxKey}-paye-switch`}>
            {obligation.payee ? "Payé" : "Non payé"}
          </Label>
        </div>
        {obligation.assujetti && !obligation.payee && !isDetailsOpened && (
          <button
            type="button"
            className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            onClick={onToggleDetails}
          >
            <Plus className="h-4 w-4 mr-1" />
            Voir détails
          </button>
        )}
      </div>
    </div>
  );
};

