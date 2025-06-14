
import React from 'react';
import { Input } from '@/components/ui/input';

interface IgsQuarterlyPaymentsTableProps {
  quarterlyPayments: Record<string, string>;
  quarterlyDates: Record<string, string>;
  onPaymentChange: (quarter: string, value: string) => void;
  onDateChange: (quarter: string, value: string) => void;
}

const echeancesData = [
  { label: '15 janvier', quarter: 'q1' },
  { label: '15 avril', quarter: 'q2' },
  { label: '15 juillet', quarter: 'q3' },
  { label: '15 octobre', quarter: 'q4' }
];

export const IgsQuarterlyPaymentsTable: React.FC<IgsQuarterlyPaymentsTableProps> = ({
  quarterlyPayments,
  quarterlyDates,
  onPaymentChange,
  onDateChange,
}) => {
  return (
    <>
      <div className="bg-gray-100 border-l-4 border-primary rounded p-2 text-sm inline-block mb-4">
        <strong className="text-primary mr-2">Échéances :</strong>
        <span>15 janvier, 15 avril, 15 juillet, 15 octobre</span>
      </div>
      <div className="overflow-x-auto mb-4">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-gray-200 bg-gray-100 p-2 text-center">Échéance</th>
              <th className="border border-gray-200 bg-gray-100 p-2 text-center">Date de paiement</th>
              <th className="border border-gray-200 bg-gray-100 p-2 text-center">Montant payé (FCFA)</th>
            </tr>
          </thead>
          <tbody>
            {echeancesData.map((echeance) => (
              <tr key={`echeance-${echeance.quarter}`}>
                <td className="border border-gray-200 p-2 text-center">{echeance.label}</td>
                <td className="border border-gray-200 p-2">
                  <Input
                    type="date"
                    className="w-[95%] p-1 border border-gray-200 rounded bg-gray-50 focus:border-primary focus:outline-none"
                    value={quarterlyDates[echeance.quarter] || ''}
                    onChange={(e) => onDateChange(echeance.quarter, e.target.value)}
                  />
                </td>
                <td className="border border-gray-200 p-2">
                  <Input
                    type="text"
                    className="w-[95%] p-1 border border-gray-200 rounded bg-gray-50 focus:border-primary focus:outline-none"
                    placeholder="0"
                    value={quarterlyPayments[echeance.quarter] || ''}
                    onChange={(e) => onPaymentChange(echeance.quarter, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

