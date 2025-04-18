
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

  // Safe access to revenue with fallback to 0
  const revenue = igsStatus.chiffreAffaires ?? 0;
  const { classNumber, amount } = calculateIGSClass(revenue);
  
  // Apply CGA reduction if applicable
  const finalAmount = igsStatus.reductionCGA ? amount / 2 : amount;
  const quarterlyAmount = Math.ceil(finalAmount / 4);

  // Initialize payments object if it doesn't exist
  const paiementsTrimestriels = igsStatus.paiementsTrimestriels || {};
  
  // Log the current state for debugging
  console.log("Current IGS status:", JSON.stringify(igsStatus, null, 2));
  
  // Calculate payment status with strict boolean comparison
  const totalPaidQuarters = Object.values(paiementsTrimestriels).filter(p => p?.isPaid === true).length;
  const totalDueQuarters = 4; // There are always 4 quarters in a year
  
  // Calculate remaining amount to pay
  const remainingAmount = finalAmount - (quarterlyAmount * totalPaidQuarters);
  
  // Determine if payments are late based on current date
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const expectedQuartersPaid = Math.ceil(currentMonth / 3);
  const isLate = totalPaidQuarters < expectedQuartersPaid;

  // Handle quarterly payment updates
  const handleQuarterlyPaymentUpdate = (trimester: string, field: string, value: any) => {
    if (!onUpdate) return;
    
    // Create the nested path for the update
    const updatePath = `paiementsTrimestriels.${trimester}.${field}`;
    console.log(`Updating IGS: ${updatePath} = ${JSON.stringify(value)}`);
    
    // Initialize the payment object for this trimester if it doesn't exist
    if (!paiementsTrimestriels[trimester]) {
      // First initialize the object structure
      onUpdate(`paiementsTrimestriels.${trimester}`, { isPaid: false });
      
      // Short delay to ensure initialization completes
      setTimeout(() => {
        onUpdate(updatePath, value);
      }, 50);
    } else {
      // If object already exists, update directly
      onUpdate(updatePath, value);
    }
  };

  // Event handlers with null checks
  const handleRevenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onUpdate?.("chiffreAffaires", value);
  };

  const handleCGAChange = (checked: boolean) => {
    onUpdate?.("reductionCGA", checked);
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
