
import React from 'react';
import { Input } from '@/components/ui/input';
import { TaxObligationStatus, ObligationType } from '@/hooks/fiscal/types';
import { formatNumberWithSpaces, parseFormattedNumber } from '@/utils/numberFormatting';

interface GenericTaxPaymentDetailsFormProps {
  obligation: TaxObligationStatus;
  obligationKey: ObligationType;
  onStatusChange: (taxType: ObligationType, field: string, value: string | number | boolean) => void;
}

export const GenericTaxPaymentDetailsForm: React.FC<GenericTaxPaymentDetailsFormProps> = ({
  obligation,
  obligationKey,
  onStatusChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <label htmlFor={`${obligationKey}-datePaiement`} className="block text-sm mb-2">Date de paiement</label>
        <Input
          id={`${obligationKey}-datePaiement`}
          type="date"
          className="w-full p-2 border border-gray-300 rounded bg-gray-50"
          value={obligation.datePaiement || ''}
          onChange={(e) => onStatusChange(obligationKey, 'datePaiement', e.target.value)}
        />
      </div>
      <div>
        <label htmlFor={`${obligationKey}-montant`} className="block text-sm mb-2">Montant payé</label>
        <Input
          id={`${obligationKey}-montant`}
          type="text"
          className="w-full p-2 border border-gray-300 rounded bg-gray-50"
          placeholder="0"
          value={formatNumberWithSpaces(String(obligation.montant || (obligationKey === 'patente' ? 75000 : 0)))}
          onChange={(e) => onStatusChange(obligationKey, 'montant', parseFormattedNumber(e.target.value))}
        />
      </div>
    </div>
  );
};

