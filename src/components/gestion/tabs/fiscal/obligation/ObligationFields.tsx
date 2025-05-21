
import React, { useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TaxObligationStatus } from "@/hooks/fiscal/types";
import { PaymentStatus } from "../components/PaymentStatus";

interface ObligationFieldsProps {
  keyName: string;
  status: TaxObligationStatus;
  onStatusChange: (obligation: string, field: string, value: string | number | boolean) => void;
}

export const ObligationFields: React.FC<ObligationFieldsProps> = ({
  keyName,
  status,
  onStatusChange
}) => {
  // Arrêter la propagation des événements
  const stopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const handlePayeeChange = useCallback((checked: boolean | "indeterminate") => {
    if (typeof checked === "boolean") {
      onStatusChange(keyName, "payee", checked);
    }
  }, [keyName, onStatusChange]);

  const handleDateEcheanceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onStatusChange(keyName, "dateEcheance", e.target.value);
  }, [keyName, onStatusChange]);

  const handleMontantChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and a single decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      onStatusChange(keyName, "montant", value);
    }
  }, [keyName, onStatusChange]);

  return (
    <div onClick={stopPropagation}>
      <PaymentStatus
        totalPaid={0}
        totalDue={Number(status?.montant) || 0}
        expectedPaid={0}
        isLate={false}
        isPayee={Boolean(status?.payee)}
        keyName={keyName}
        onPayeeChange={handlePayeeChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
        <div>
          <Label htmlFor={`${keyName}-dateEcheance`}>Date d'échéance</Label>
          <Input
            type="date"
            id={`${keyName}-dateEcheance`}
            value={status?.dateEcheance || ""}
            onChange={handleDateEcheanceChange}
            className="w-full"
            onClick={stopPropagation}
          />
        </div>
        <div>
          <Label htmlFor={`${keyName}-montant`}>Montant</Label>
          <Input
            type="text"
            id={`${keyName}-montant`}
            value={String(status?.montant || "")}
            onChange={handleMontantChange}
            className="w-full"
            onClick={stopPropagation}
          />
        </div>
      </div>
    </div>
  );
};
