
import React from "react";
import { TaxObligationStatus } from "@/hooks/fiscal/types";
import { QuarterlyPayment } from "./QuarterlyPayment";

interface QuarterlyPaymentsSectionProps {
  status: TaxObligationStatus;
  keyName: string;
  onStatusChange: (obligation: string, field: string, value: string | number | boolean) => void;
  obligation?: string; // Add obligation prop to match usage in TaxObligationItem
}

export const QuarterlyPaymentsSection: React.FC<QuarterlyPaymentsSectionProps> = ({
  status,
  keyName,
  onStatusChange,
  obligation
}) => {
  // Use obligation if provided, otherwise use keyName
  const obligationKey = obligation || keyName;
  
  // Calculate quarterly amount (25% of annual amount)
  const quarterlyAmount = Math.round((status.montantAnnuel || 0) * 0.25);
  
  const handlePaymentChange = (quarter: string, isPaid: boolean) => {
    if (quarter === "1er Trimestre") {
      onStatusChange(obligationKey, "q1Payee", isPaid);
    } else if (quarter === "2e Trimestre") {
      onStatusChange(obligationKey, "q2Payee", isPaid);
    } else if (quarter === "3e Trimestre") {
      onStatusChange(obligationKey, "q3Payee", isPaid);
    } else if (quarter === "4e Trimestre") {
      onStatusChange(obligationKey, "q4Payee", isPaid);
    }
  };
  
  return (
    <div className="mt-4 border-t pt-3">
      <h4 className="text-sm font-medium mb-2">Paiements trimestriels</h4>
      <div className="grid grid-cols-2 gap-3">
        <QuarterlyPayment
          quarter="1er Trimestre"
          label="1er Trimestre"
          amount={quarterlyAmount}
          isPaid={status.q1Payee || false}
          onChange={handlePaymentChange}
        />
        <QuarterlyPayment
          quarter="2e Trimestre"
          label="2e Trimestre"
          amount={quarterlyAmount}
          isPaid={status.q2Payee || false}
          onChange={handlePaymentChange}
        />
        <QuarterlyPayment
          quarter="3e Trimestre"
          label="3e Trimestre"
          amount={quarterlyAmount}
          isPaid={status.q3Payee || false}
          onChange={handlePaymentChange}
        />
        <QuarterlyPayment
          quarter="4e Trimestre"
          label="4e Trimestre"
          amount={quarterlyAmount}
          isPaid={status.q4Payee || false}
          onChange={handlePaymentChange}
        />
      </div>
    </div>
  );
};
