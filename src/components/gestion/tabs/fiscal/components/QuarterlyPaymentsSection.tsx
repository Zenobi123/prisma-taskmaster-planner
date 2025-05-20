
import React from "react";
import { TaxObligationStatus } from "@/hooks/fiscal/types";
import { QuarterlyPayment } from "./QuarterlyPayment";

interface QuarterlyPaymentsSectionProps {
  status: TaxObligationStatus;
  keyName: string;
  onStatusChange: (obligation: string, field: string, value: boolean) => void;
}

export const QuarterlyPaymentsSection: React.FC<QuarterlyPaymentsSectionProps> = ({
  status,
  keyName,
  onStatusChange
}) => {
  const handleQ1PaymentChange = (checked: boolean) => {
    if (status.paiementsTrimestriels) {
      onStatusChange(keyName, "paiementsTrimestriels.Q1.payee", checked);
    }
  };
  
  const handleQ2PaymentChange = (checked: boolean) => {
    if (status.paiementsTrimestriels) {
      onStatusChange(keyName, "paiementsTrimestriels.Q2.payee", checked);
    }
  };
  
  const handleQ3PaymentChange = (checked: boolean) => {
    if (status.paiementsTrimestriels) {
      onStatusChange(keyName, "paiementsTrimestriels.Q3.payee", checked);
    }
  };
  
  const handleQ4PaymentChange = (checked: boolean) => {
    if (status.paiementsTrimestriels) {
      onStatusChange(keyName, "paiementsTrimestriels.Q4.payee", checked);
    }
  };
  
  return (
    <div className="mt-4 border-t pt-3">
      <h4 className="text-sm font-medium mb-2">Paiements trimestriels</h4>
      <div className="grid grid-cols-2 gap-3">
        <QuarterlyPayment
          quarter="1er Trimestre"
          isPaid={status.paiementsTrimestriels?.Q1.payee || false}
          onPaymentChange={handleQ1PaymentChange}
        />
        <QuarterlyPayment
          quarter="2e Trimestre"
          isPaid={status.paiementsTrimestriels?.Q2.payee || false}
          onPaymentChange={handleQ2PaymentChange}
        />
        <QuarterlyPayment
          quarter="3e Trimestre"
          isPaid={status.paiementsTrimestriels?.Q3.payee || false}
          onPaymentChange={handleQ3PaymentChange}
        />
        <QuarterlyPayment
          quarter="4e Trimestre"
          isPaid={status.paiementsTrimestriels?.Q4.payee || false}
          onPaymentChange={handleQ4PaymentChange}
        />
      </div>
    </div>
  );
};
