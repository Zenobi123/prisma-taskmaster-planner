
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

export interface PaymentStatusProps {
  totalPaid: number;
  totalDue: number;
  expectedPaid: number;
  isLate: boolean;
  keyName?: string;
  isPayee?: boolean;
  onPayeeChange?: (checked: boolean | "indeterminate") => void;
}

export const PaymentStatus = ({ 
  totalPaid, 
  totalDue, 
  expectedPaid, 
  isLate,
  keyName,
  isPayee,
  onPayeeChange
}: PaymentStatusProps) => {
  // Définir le statut et les classes en fonction des paiements
  let status: string;
  let variant: "outline" | "secondary" | "destructive" | "default" | "success" = "default";
  
  if (totalPaid === totalDue) {
    status = "Payé intégralement";
    variant = "success";
  } else if (totalPaid === 0) {
    status = isLate ? "En retard" : "Non payé";
    variant = isLate ? "destructive" : "outline";
  } else {
    status = isLate ? "Paiement partiel (en retard)" : "Paiement partiel";
    variant = isLate ? "destructive" : "secondary";
  }
  
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêcher la propagation du clic
  };

  const handleLabelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Inverse manuellement l'état si la fonction est disponible
    if (onPayeeChange) {
      onPayeeChange(!isPayee);
    }
  }
  
  return (
    <div className="flex items-center space-x-3" onClick={e => e.stopPropagation()}>
      {onPayeeChange && (
        <div className="flex items-center space-x-2">
          <Checkbox 
            id={`${keyName}-payee`}
            checked={isPayee}
            onCheckedChange={onPayeeChange}
            onClick={handleCheckboxClick}
            className="cursor-pointer"
          />
          <label 
            htmlFor={`${keyName}-payee`} 
            className="text-sm cursor-pointer"
            onClick={handleLabelClick}
          >
            Payée
          </label>
        </div>
      )}
      
      <Badge variant={variant}>
        {status} {totalDue > 0 && `(${totalPaid}/${totalDue})`}
      </Badge>
    </div>
  );
};
