
import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";
import { IgsPaymentStatus } from "@/hooks/fiscal/types";

interface QuarterlyPaymentProps {
  trimester: string;
  dueDate: string;
  payment?: IgsPaymentStatus;
  quarterlyAmount: number;
  isQuarterDue: boolean;
  quarterNumber: number;
  expectedQuartersPaid: number;
  onPaymentUpdate: (field: string, value: any) => void;
}

export const QuarterlyPayment = ({
  trimester,
  dueDate,
  payment,
  quarterlyAmount,
  isQuarterDue,
  quarterNumber,
  expectedQuartersPaid,
  onPaymentUpdate,
}: QuarterlyPaymentProps) => {
  const isLate = !payment?.isPaid && quarterNumber <= expectedQuartersPaid;

  const handlePaymentDateChange = (date: string) => {
    onPaymentUpdate("datePayment", date);
    // Automatically mark as paid when a date is entered
    if (date) {
      onPaymentUpdate("isPaid", true);
    } else {
      // Mark as unpaid when date is removed
      onPaymentUpdate("isPaid", false);
    }
  };

  const handlePaymentStatusChange = (checked: boolean | "indeterminate") => {
    if (typeof checked === "boolean") {
      onPaymentUpdate("isPaid", checked);
      if (checked && !payment?.datePayment) {
        // If marking as paid and no date is set, set today's date
        handlePaymentDateChange(new Date().toISOString().split('T')[0]);
      } else if (!checked) {
        // If marking as unpaid, clear the date
        handlePaymentDateChange("");
      }
    }
  };

  // Use a simpler approach for the click handler
  const togglePaymentStatus = () => {
    if (isQuarterDue) {
      handlePaymentStatusChange(!payment?.isPaid);
    }
  };

  // Prevent event propagation for child elements
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="p-3 border rounded-md hover:border-primary/50 transition-colors cursor-pointer" 
      onClick={togglePaymentStatus}
      role="button"
      tabIndex={0}
      aria-label={`Paiement du ${trimester}`}
    >
      <div className="flex justify-between items-center mb-2">
        <Label className="font-medium">
          {trimester} - {dueDate}
        </Label>
        <div className="flex items-center gap-2" onClick={stopPropagation}>
          <Checkbox 
            id={`trimester-check-${trimester}`}
            checked={payment?.isPaid || false}
            onCheckedChange={handlePaymentStatusChange}
            disabled={!isQuarterDue}
          />
          <Badge variant={payment?.isPaid ? "success" : isLate ? "destructive" : "secondary"}>
            {payment?.isPaid ? "Payé" : isLate ? "En retard" : "Non payé"}
          </Badge>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground">
        Montant dû : {quarterlyAmount.toLocaleString()} FCFA
      </div>
      
      {payment?.isPaid && (
        <div className="flex items-center gap-2 mt-2" onClick={stopPropagation}>
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="date"
            value={payment.datePayment || ""}
            onChange={(e) => handlePaymentDateChange(e.target.value)}
            className="h-8 w-40"
          />
        </div>
      )}
    </div>
  );
};
