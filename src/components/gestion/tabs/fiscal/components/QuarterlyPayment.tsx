
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface QuarterlyPaymentProps {
  quarterName: string;
  label: string;
  amount: number;
  isPaid: boolean;
  onChange: (quarter: string, isPaid: boolean) => void;
}

export const QuarterlyPayment = ({
  quarterName,
  label,
  amount,
  isPaid,
  onChange
}: QuarterlyPaymentProps) => {
  const handleChange = (checked: boolean) => {
    onChange(quarterName, checked);
  };

  return (
    <div className="p-3 bg-background border rounded-md">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium">{label}</span>
        <Switch
          checked={isPaid}
          onCheckedChange={handleChange}
          size="sm"
        />
      </div>
      <div className="text-sm text-muted-foreground">
        {amount.toLocaleString()} FCFA
      </div>
    </div>
  );
};
