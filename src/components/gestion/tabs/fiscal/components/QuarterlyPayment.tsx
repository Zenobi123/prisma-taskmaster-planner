
import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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

  const handlePaymentToggle = () => {
    if (!isQuarterDue) return;

    const newPaidStatus = !payment?.isPaid;
    onPaymentUpdate("isPaid", newPaidStatus);
    
    if (newPaidStatus) {
      // Set today's date when marking as paid
      onPaymentUpdate("datePayment", new Date().toISOString().split('T')[0]);
      toast.success(`Échéance "${trimester} - ${dueDate}" marquée comme payée`);
    } else {
      // Clear the date when marking as unpaid
      onPaymentUpdate("datePayment", "");
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4 hover:border-primary/50 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="text-lg font-semibold mb-1">
            {trimester} - {dueDate}
          </div>
          <div className="text-sm text-muted-foreground">
            Montant dû : {quarterlyAmount.toLocaleString()} FCFA
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge 
            variant={payment?.isPaid ? "success" : isLate ? "destructive" : "secondary"}
            className="capitalize px-2.5 py-1"
          >
            {payment?.isPaid ? "À jour" : isLate ? "En retard" : "Non payé"}
          </Badge>
          <Button
            onClick={handlePaymentToggle}
            variant={payment?.isPaid ? "secondary" : "default"}
            disabled={!isQuarterDue}
            size="sm"
          >
            {payment?.isPaid ? "Annuler" : "Payé"}
          </Button>
        </div>
      </div>
    </div>
  );
};
