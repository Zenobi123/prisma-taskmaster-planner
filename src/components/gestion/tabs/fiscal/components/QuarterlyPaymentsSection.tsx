
import React from 'react';
import { TaxObligationStatus } from '@/hooks/fiscal/types';
import { QuarterlyPayment } from './QuarterlyPayment';

interface QuarterlyPaymentsSectionProps {
  quarterlyAmount: number;
  status: TaxObligationStatus;
  onStatusChange: (field: string, value: any) => void;
}

export const QuarterlyPaymentsSection = ({ 
  quarterlyAmount, 
  status, 
  onStatusChange 
}: QuarterlyPaymentsSectionProps) => {
  // Handle quarterly payment status change
  const handleQuarterPaymentChange = (quarter: string, isPaid: boolean) => {
    onStatusChange(quarter, isPaid);
  };

  return (
    <div>
      <div className="text-sm font-medium mb-2">Paiements trimestriels:</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <QuarterlyPayment 
          quarter="q1Paye" 
          label="1er Trimestre" 
          amount={quarterlyAmount} 
          isPaid={status.q1Paye || false}
          onChange={handleQuarterPaymentChange}
        />
        <QuarterlyPayment 
          quarter="q2Paye" 
          label="2ème Trimestre" 
          amount={quarterlyAmount} 
          isPaid={status.q2Paye || false}
          onChange={handleQuarterPaymentChange}
        />
        <QuarterlyPayment 
          quarter="q3Paye" 
          label="3ème Trimestre" 
          amount={quarterlyAmount} 
          isPaid={status.q3Paye || false}
          onChange={handleQuarterPaymentChange}
        />
        <QuarterlyPayment 
          quarter="q4Paye" 
          label="4ème Trimestre" 
          amount={quarterlyAmount} 
          isPaid={status.q4Paye || false}
          onChange={handleQuarterPaymentChange}
        />
      </div>
    </div>
  );
};
