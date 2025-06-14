
import React, { memo } from 'react';
import { Input } from '@/components/ui/input';

interface IgsQuarterlyPaymentsTableProps {
  quarterlyPayments: Record<string, string>;
  quarterlyDates: Record<string, string>;
  onPaymentChange: (quarter: string, value: string) => void;
  onDateChange: (quarter: string, value: string) => void;
}

export const IgsQuarterlyPaymentsTable: React.FC<IgsQuarterlyPaymentsTableProps> = memo(({
  quarterlyPayments,
  quarterlyDates,
  onPaymentChange,
  onDateChange,
}) => {
  const quarters = [
    { key: 'q1', label: '1er Trimestre' },
    { key: 'q2', label: '2e Trimestre' },
    { key: 'q3', label: '3e Trimestre' },
    { key: 'q4', label: '4e Trimestre' },
  ];

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium mb-3">Échéancier des paiements trimestriels</h4>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Période
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Montant (FCFA)
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Date de paiement
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {quarters.map((quarter) => (
              <tr key={quarter.key} className="hover:bg-gray-50">
                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  {quarter.label}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <Input
                    type="text"
                    placeholder="0"
                    value={quarterlyPayments[quarter.key] || ''}
                    onChange={(e) => onPaymentChange(quarter.key, e.target.value)}
                    className="w-full text-sm"
                  />
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <Input
                    type="date"
                    value={quarterlyDates[quarter.key] || ''}
                    onChange={(e) => onDateChange(quarter.key, e.target.value)}
                    className="w-full text-sm"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

IgsQuarterlyPaymentsTable.displayName = 'IgsQuarterlyPaymentsTable';
