
import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";
import { IgsPaymentStatus } from "@/hooks/fiscal/types";

interface QuarterlyPaymentProps {
  trimester: string;
  dueDate: string;
  payment?: IgsPaymentStatus;
  quarterlyAmount: number;
  isQuarterDue: boolean;
  onPaymentUpdate: (field: string, value: any) => void;
}

export const QuarterlyPayment = ({
  trimester,
  dueDate,
  payment,
  quarterlyAmount,
  isQuarterDue,
  onPaymentUpdate,
}: QuarterlyPaymentProps) => {
  // Default payment object to prevent null reference errors
  const paymentData = payment || { isPaid: false };
  
  const handlePaymentDateChange = (date: string) => {
    onPaymentUpdate("datePayment", date);
  };

  const handleSwitchChange = (checked: boolean) => {
    console.log(`Toggle changed for ${trimester}: ${checked}`);
    
    // Update isPaid state
    onPaymentUpdate("isPaid", checked);
    
    // Automatically set today's date when marking as paid
    if (checked) {
      const today = new Date().toISOString().split('T')[0];
      setTimeout(() => {
        handlePaymentDateChange(today);
      }, 50);
    }
  };

  return (
    <div className="p-3 border rounded-md">
      <div className="flex justify-between items-center mb-2">
        <Label className="font-medium">
          {trimester} - {dueDate}
        </Label>
        <div className="flex items-center gap-3">
          <Switch 
            id={`switch-${trimester}`} 
            checked={paymentData.isPaid === true}
            onCheckedChange={handleSwitchChange}
            disabled={!isQuarterDue}
            aria-label={`Marquer ${trimester} comme payé`}
          />
          <Badge variant={paymentData.isPaid ? "success" : "destructive"}>
            {paymentData.isPaid ? "Payé" : "Non payé"}
          </Badge>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground">
        Montant dû : {quarterlyAmount.toLocaleString()} FCFA
      </div>
      
      {paymentData.isPaid && (
        <div className="flex items-center gap-2 mt-2">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="date"
            value={paymentData.datePayment || ""}
            onChange={(e) => handlePaymentDateChange(e.target.value)}
            className="h-8 w-40"
          />
        </div>
      )}
    </div>
  );
};
