
import React, { useEffect } from "react";
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
  // Create a local payment object to prevent null reference errors
  const paymentData = payment || { isPaid: false };
  
  // Function to update payment date
  const handlePaymentDateChange = (date: string) => {
    console.log(`Setting payment date for ${trimester} to ${date}`);
    onPaymentUpdate("datePayment", date);
  };

  // Function to handle toggle change
  const handleSwitchChange = (checked: boolean) => {
    console.log(`Toggle changed for ${trimester}: ${checked}`);
    
    // Update isPaid state with explicit boolean value
    onPaymentUpdate("isPaid", checked);
    
    // When marking as paid, automatically set today's date
    if (checked) {
      const today = new Date().toISOString().split('T')[0];
      // Small delay to ensure the isPaid update is processed first
      setTimeout(() => {
        handlePaymentDateChange(today);
      }, 50);
    }
  };

  // Debug rendering
  useEffect(() => {
    console.log(`[${trimester}] Rendering with isPaid:`, paymentData.isPaid, 
      "Type:", typeof paymentData.isPaid, 
      "Value as boolean:", Boolean(paymentData.isPaid));
  }, [trimester, paymentData.isPaid]);

  return (
    <div className="p-3 border rounded-md">
      <div className="flex justify-between items-center mb-2">
        <Label className="font-medium">
          {trimester} - {dueDate}
        </Label>
        <div className="flex items-center gap-3">
          <Switch 
            id={`switch-${trimester}`} 
            checked={Boolean(paymentData.isPaid)}
            onCheckedChange={handleSwitchChange}
            disabled={!isQuarterDue}
            aria-label={`Marquer ${trimester} comme payé`}
          />
          <Badge variant={paymentData.isPaid === true ? "success" : "destructive"}>
            {paymentData.isPaid === true ? "Payé" : "Non payé"}
          </Badge>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground">
        Montant dû : {quarterlyAmount.toLocaleString()} FCFA
      </div>
      
      {paymentData.isPaid === true && (
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
