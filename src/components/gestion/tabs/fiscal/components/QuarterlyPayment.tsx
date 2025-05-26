
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { formatCurrency } from '@/utils/formatUtils';

interface QuarterlyPaymentProps {
  quarter: string;
  label: string;
  amount: number;
  isPaid: boolean;
  onChange: (quarter: string, isPaid: boolean) => void;
}

export const QuarterlyPayment = ({ 
  quarter, 
  label, 
  amount, 
  isPaid, 
  onChange 
}: QuarterlyPaymentProps) => {
  // Handle payment status change
  const handlePaymentChange = (checked: boolean) => {
    onChange(quarter, checked);
  };

  return (
    <Card className={`border ${isPaid ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
      <CardContent className="p-3">
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium">{label}</div>
            <div className="text-sm text-muted-foreground">{formatCurrency(amount)}</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {isPaid ? 'Payé' : 'Non payé'}
            </span>
            <Switch 
              checked={isPaid} 
              onCheckedChange={handlePaymentChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
