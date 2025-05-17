
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { QuarterlyPaymentsSection } from './components/QuarterlyPaymentsSection';
import { IGSCalculation } from './components/IGSCalculation';
import { TaxObligationStatus } from '@/hooks/fiscal/types';

interface IgsDetailPanelProps {
  igsStatus: TaxObligationStatus;
  onStatusChange: (field: string, value: any) => void;
}

export const IgsDetailPanel = ({ 
  igsStatus, 
  onStatusChange
}: IgsDetailPanelProps) => {
  // Local state for annual amount
  const [annualAmount, setAnnualAmount] = useState<number>(0);

  // Update annual amount when external state changes
  useEffect(() => {
    // Check if annual amount exists and convert to number
    const montantAnnuel = igsStatus?.montantAnnuel !== undefined ? Number(igsStatus.montantAnnuel) : 0;
    setAnnualAmount(montantAnnuel);
  }, [igsStatus]);

  // Handle annual amount change
  const handleAnnualAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Check if value is a valid number
    if (!isNaN(Number(value))) {
      const numValue = Number(value);
      setAnnualAmount(numValue);
      onStatusChange('montantAnnuel', numValue);
    }
  };

  // Calculate quarterly amount (25% of annual amount)
  const quarterlyAmount = annualAmount > 0 ? Math.round(annualAmount * 0.25 * 100) / 100 : 0;

  return (
    <Card className="mt-2 border-dashed">
      <CardContent className="pt-4 pb-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="annual-amount" className="text-sm mb-1 block">
              Montant annuel (FCFA)
            </Label>
            <Input
              id="annual-amount"
              type="number"
              value={annualAmount || ''}
              onChange={handleAnnualAmountChange}
              placeholder="Saisir le montant annuel"
              className="w-full"
            />
          </div>

          {annualAmount > 0 && (
            <>
              <IGSCalculation 
                amount={annualAmount} 
                quarterlyAmount={quarterlyAmount}
              />
              
              <QuarterlyPaymentsSection 
                quarterlyAmount={quarterlyAmount}
                status={igsStatus}
                onStatusChange={onStatusChange}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
