
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TaxObligationStatus } from "@/hooks/fiscal/types";
import { calculateIGSClass } from "./utils/igsCalculations";
import { IGSCalculation } from "./components/IGSCalculation";
import { QuarterlyPaymentsSection } from "./components/QuarterlyPaymentsSection";
import { ObservationsSection } from "./components/ObservationsSection";

interface IgsDetailPanelProps {
  igsStatus: TaxObligationStatus;
  onUpdate?: (field: string, value: any) => void;
}

export const IgsDetailPanel = ({ igsStatus, onUpdate }: IgsDetailPanelProps) => {
  if (!igsStatus || !igsStatus.assujetti) {
    return null;
  }

  const revenue = igsStatus.chiffreAffaires || 0;
  const { classNumber, amount } = calculateIGSClass(revenue);
  const finalAmount = igsStatus.reductionCGA ? amount / 2 : amount;
  const quarterlyAmount = Math.ceil(finalAmount / 4);

  // Calculate payment status
  const paiementsTrimestriels = igsStatus.paiementsTrimestriels || {};
  const totalPaidQuarters = Object.values(paiementsTrimestriels).filter(p => p?.isPaid).length;
  const totalDueQuarters = 4;
  const remainingAmount = finalAmount - (quarterlyAmount * totalPaidQuarters);
  
  // Determine if payments are late
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const expectedQuartersPaid = Math.ceil(currentMonth / 3);
  const isLate = totalPaidQuarters < expectedQuartersPaid;

  const handleRevenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onUpdate?.("chiffreAffaires", value);
  };

  const handleCGAChange = (checked: boolean) => {
    onUpdate?.("reductionCGA", checked);
  };

  const handleQuarterlyPaymentUpdate = (trimester: string, field: string, value: any) => {
    onUpdate?.(`paiementsTrimestriels.${trimester}.${field}`, value);
  };

  return (
    <Card className="mt-2 border-dashed">
      <CardContent className="pt-4 pb-3 space-y-4">
        <IGSCalculation
          revenue={revenue}
          reductionCGA={igsStatus.reductionCGA || false}
          classNumber={classNumber}
          finalAmount={finalAmount}
          remainingAmount={remainingAmount}
          onRevenueChange={handleRevenueChange}
          onCGAChange={handleCGAChange}
        />

        <QuarterlyPaymentsSection
          paiementsTrimestriels={paiementsTrimestriels}
          totalPaidQuarters={totalPaidQuarters}
          totalDueQuarters={totalDueQuarters}
          expectedQuartersPaid={expectedQuartersPaid}
          isLate={isLate}
          quarterlyAmount={quarterlyAmount}
          isAssujetti={igsStatus.assujetti}
          onQuarterlyPaymentUpdate={handleQuarterlyPaymentUpdate}
        />

        <ObservationsSection observations={igsStatus.observations} />
      </CardContent>
    </Card>
  );
};
