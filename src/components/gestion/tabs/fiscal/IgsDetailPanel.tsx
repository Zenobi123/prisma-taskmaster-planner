
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

  return (
    <div className="border-t pt-3 mt-3 space-y-4">
      {/* IGS Calculation section */}
      {igsStatus.montantAnnuel !== undefined && (
        <IGSCalculation
          montantAnnuel={igsStatus.montantAnnuel || 0}
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
