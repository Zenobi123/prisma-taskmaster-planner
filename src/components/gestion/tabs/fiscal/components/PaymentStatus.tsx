
import React from "react";
import { Badge } from "@/components/ui/badge";

export interface PaymentStatusProps {
  totalPaid: number;
  totalDue: number;
  expectedPaid: number;
  isLate: boolean;
  keyName?: string;  // Add keyName prop to match usage in TaxObligationItem
  isPayee?: boolean; // Add isPayee prop to match usage in TaxObligationItem
  onPayeeChange?: (checked: boolean | "indeterminate") => void; // Add onPayeeChange prop
}

export const PaymentStatus = ({ 
  totalPaid, 
  totalDue, 
  expectedPaid, 
  isLate,
  // The following props might be used elsewhere
  keyName,
  isPayee,
  onPayeeChange
}: PaymentStatusProps) => {
  // Définir le statut et les classes en fonction des paiements
  let status: string;
  let variant: "outline" | "secondary" | "destructive" | "default" = "default";
  
  if (totalPaid === totalDue) {
    status = "Payé intégralement";
    variant = "default";
  } else if (totalPaid === 0) {
    status = isLate ? "En retard" : "Non payé";
    variant = isLate ? "destructive" : "outline";
  } else {
    status = isLate ? "Paiement partiel (en retard)" : "Paiement partiel";
    variant = isLate ? "destructive" : "secondary";
  }
  
  return (
    <Badge variant={variant}>
      {status} ({totalPaid}/{totalDue})
    </Badge>
  );
};
