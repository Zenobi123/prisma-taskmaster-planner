
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
  // État local pour le montant annuel
  const [annualAmount, setAnnualAmount] = useState<number>(
    igsStatus.montantAnnuel ? Number(igsStatus.montantAnnuel) : 0
  );

  // Mettre à jour le montant annuel lorsque l'état externe change
  useEffect(() => {
    if (igsStatus.montantAnnuel !== undefined) {
      setAnnualAmount(Number(igsStatus.montantAnnuel));
    }
  }, [igsStatus.montantAnnuel]);

  // Gère le changement du montant annuel
  const handleAnnualAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Vérifier si la valeur est un nombre valide
    if (!isNaN(Number(value))) {
      const numValue = Number(value);
      setAnnualAmount(numValue);
      onStatusChange('montantAnnuel', numValue);
    }
  };

  // Calcul du montant trimestriel (25% du montant annuel)
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
                annualAmount={annualAmount} 
                quarterlyAmount={quarterlyAmount}
              />
              
              <QuarterlyPaymentsSection 
                quarterlyAmount={quarterlyAmount}
                igsStatus={igsStatus}
                onStatusChange={onStatusChange}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
