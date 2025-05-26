
import React from "react";
import { TaxObligationStatus } from "@/hooks/fiscal/types";
import { QuarterlyPaymentsSection } from "./components/QuarterlyPaymentsSection";
import { IGSCalculation } from "./components/IGSCalculation";

interface IgsDetailPanelProps {
  igsStatus: TaxObligationStatus;
  onStatusChange: (obligation: string, field: string, value: string | number | boolean) => void;
}

export const IgsDetailPanel: React.FC<IgsDetailPanelProps> = ({
  igsStatus,
  onStatusChange,
}) => {
  // Handle montant change in IGS calculations
  const handleMontantChange = (amount: number) => {
    onStatusChange("igs", "montantAnnuel", amount);
  };

  // Calculate quarterly amount (25% of annual amount)
  const quarterlyAmount = Math.round((igsStatus.montantAnnuel || 0) * 0.25);

  return (
    <div className="border-t pt-3 mt-3 space-y-4">
      {/* IGS Calculation section */}
      {igsStatus.montantAnnuel !== undefined && (
        <IGSCalculation
          amount={igsStatus.montantAnnuel || 0}
          quarterlyAmount={quarterlyAmount}
          onMontantChange={handleMontantChange}
        />
      )}

      {/* Quarterly payments section */}
      <QuarterlyPaymentsSection
        status={igsStatus}
        keyName="igs"
        onStatusChange={onStatusChange}
      />
    </div>
  );
};
