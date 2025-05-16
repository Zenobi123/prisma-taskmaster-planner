
import React from "react";
import { Badge } from "@/components/ui/badge";

export interface PaymentStatusProps {
  totalPaid: number;
  totalDue: number;
  expectedPaid: number;
  isLate: boolean;
}

export const PaymentStatus = ({ 
  totalPaid, 
  totalDue, 
  expectedPaid, 
  isLate 
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
