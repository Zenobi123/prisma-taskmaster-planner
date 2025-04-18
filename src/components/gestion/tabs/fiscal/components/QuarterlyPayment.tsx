
import React, { useEffect } from "react";
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
  const isPaid = payment?.isPaid || false;

  const handlePaymentToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isQuarterDue) return;

    const newPaidStatus = !isPaid;
    
    // Mettre à jour le statut de paiement
    onPaymentUpdate("isPaid", newPaidStatus);
    
    // Si marqué comme payé, ajouter la date de paiement
    if (newPaidStatus) {
      onPaymentUpdate("datePayment", new Date().toISOString().split('T')[0]);
      toast.success(`Échéance "${trimester} - ${dueDate}" marquée comme payée`);
    } else {
      onPaymentUpdate("datePayment", "");
      toast.success(`Échéance "${trimester} - ${dueDate}" marquée comme non payée`);
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4 hover:border-primary/50 transition-colors">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="text-lg font-semibold mb-2">
            {trimester} - {dueDate}
          </div>
          {isPaid ? (
            <div className="space-y-1">
              <div className="text-sm text-green-600 font-medium">
                Montant payé : {quarterlyAmount.toLocaleString()} FCFA
              </div>
              <div className="text-sm text-muted-foreground">
                Reste à payer : 0 FCFA
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">
                Montant payé : 0 FCFA
              </div>
              <div className="text-sm font-medium">
                Reste à payer : {quarterlyAmount.toLocaleString()} FCFA
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge 
            variant={isPaid ? "success" : isLate ? "destructive" : "secondary"}
            className="capitalize px-2.5 py-1"
          >
            {isPaid ? "À jour" : isLate ? "En retard" : "Non payé"}
          </Badge>
          <Button
            onClick={handlePaymentToggle}
            variant="outline"
            disabled={!isQuarterDue}
            size="sm"
            className={isPaid ? 
              "bg-green-500 text-white hover:bg-green-600" : 
              "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"}
          >
            {isPaid ? "Payé" : "Marquer comme payé"}
          </Button>
        </div>
      </div>
    </div>
  );
};
