
import React from "react";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Check, Clock } from "lucide-react";

interface PaymentStatusProps {
  totalPaidQuarters: number;
  totalDueQuarters: number;
  expectedQuartersPaid: number;
  isLate: boolean;
}

export const PaymentStatus = ({
  totalPaidQuarters,
  totalDueQuarters,
  expectedQuartersPaid,
  isLate,
}: PaymentStatusProps) => {
  if (totalPaidQuarters === totalDueQuarters) {
    return (
      <Badge variant="success" className="gap-1">
        <Check className="h-3.5 w-3.5" />
        IGS entièrement payé
      </Badge>
    );
  }
  
  if (isLate) {
    return (
      <Badge variant="destructive" className="gap-1">
        <AlertCircle className="h-3.5 w-3.5" />
        {`Retard de paiement (${totalPaidQuarters}/${expectedQuartersPaid} trimestres)`}
      </Badge>
    );
  }
  
  return (
    <Badge variant="secondary" className="gap-1">
      <Clock className="h-3.5 w-3.5" />
      {`${totalPaidQuarters}/${totalDueQuarters} trimestres payés`}
    </Badge>
  );
};
