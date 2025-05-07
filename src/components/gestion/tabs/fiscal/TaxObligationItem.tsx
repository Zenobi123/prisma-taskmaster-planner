
import React from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDate } from '@/utils/formatUtils';
import { formatMontant } from '@/utils/formatUtils';
import { TaxObligationStatus } from '@/hooks/fiscal/types';

interface TaxObligationItemProps {
  id: string;
  title: string;
  obligationStatus: TaxObligationStatus;
  onChange: (id: string, field: string, value: any) => void;
}

export const TaxObligationItem: React.FC<TaxObligationItemProps> = ({
  id,
  title,
  obligationStatus,
  onChange,
}) => {
  return (
    <Card className="p-4">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`${id}-assujetti`}
              checked={obligationStatus?.isAssujetti || false}
              onCheckedChange={(checked) => onChange(id, 'isAssujetti', Boolean(checked))}
            />
            <label htmlFor={`${id}-assujetti`} className="text-sm font-medium">
              {title}
            </label>
          </div>
          <div>
            {obligationStatus?.isAssujetti && (
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  obligationStatus?.status === 'paid'
                    ? 'bg-green-100 text-green-800'
                    : obligationStatus?.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {obligationStatus?.status === 'paid'
                  ? 'Payée'
                  : obligationStatus?.status === 'pending'
                  ? 'En attente'
                  : 'Non payée'}
              </span>
            )}
          </div>
        </div>

        {obligationStatus?.isAssujetti && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-xs text-gray-500">Dernier paiement</label>
              <div className="text-sm">
                {obligationStatus?.lastFiled
                  ? formatDate(new Date(obligationStatus.lastFiled))
                  : '-'}
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs text-gray-500">Prochain paiement</label>
              <div className="text-sm">
                {obligationStatus?.nextDue
                  ? formatDate(new Date(obligationStatus.nextDue))
                  : '-'}
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs text-gray-500">Montant</label>
              <div className="text-sm">{formatMontant(obligationStatus?.montant)}</div>
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs text-gray-500">Statut</label>
              <select
                value={obligationStatus?.status || 'unpaid'}
                onChange={(e) => onChange(id, 'status', e.target.value)}
                className="h-8 rounded-md border border-input px-3 py-1 text-sm bg-background"
              >
                <option value="unpaid">Non payée</option>
                <option value="pending">En attente</option>
                <option value="paid">Payée</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
