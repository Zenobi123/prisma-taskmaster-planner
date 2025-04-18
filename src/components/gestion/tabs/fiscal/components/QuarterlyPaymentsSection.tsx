
import React from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { QuarterlyPayment } from "./QuarterlyPayment";
import { PaymentStatus } from "./PaymentStatus";
import { IgsPaymentStatus } from "@/hooks/fiscal/types";

interface QuarterlyPaymentsSectionProps {
  paiementsTrimestriels: { [key: string]: IgsPaymentStatus | undefined };
  totalPaidQuarters: number;
  totalDueQuarters: number;
  expectedQuartersPaid: number;
  isLate: boolean;
  quarterlyAmount: number;
  isAssujetti: boolean;
  onQuarterlyPaymentUpdate: (trimester: string, field: string, value: any) => void;
}

// Define trimester dates with due dates for each quarter
const TRIMESTER_DATES = {
  T1: "15 janvier",
  T2: "15 avril",
  T3: "15 juillet",
  T4: "15 octobre"
};

export const QuarterlyPaymentsSection = ({
  paiementsTrimestriels,
  totalPaidQuarters,
  totalDueQuarters,
  expectedQuartersPaid,
  isLate,
  quarterlyAmount,
  isAssujetti,
  onQuarterlyPaymentUpdate,
}: QuarterlyPaymentsSectionProps) => {
  // Ensure paiementsTrimestriels is always an object
  const safePayments = paiementsTrimestriels || {};
  
  // Debug payments object
  console.log("Current payments state:", JSON.stringify(safePayments, null, 2));
  
  // Handle quarterly payment updates with structured approach
  const handlePaymentUpdate = (trimester: string, field: string, value: any) => {
    console.log(`Updating ${trimester} - ${field}: ${value}`);
    onQuarterlyPaymentUpdate(trimester, field, value);
  };
  
  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Montant total IGS</Label>
          <PaymentStatus
            totalPaidQuarters={totalPaidQuarters}
            totalDueQuarters={totalDueQuarters}
            expectedQuartersPaid={expectedQuartersPaid}
            isLate={isLate}
          />
        </div>
      </div>

      <Separator className="my-4" />
      
      <div className="space-y-2">
        <Label className="text-sm font-medium">Échéancier de paiement</Label>
        <div className="grid gap-3">
          {(Object.keys(TRIMESTER_DATES) as Array<keyof typeof TRIMESTER_DATES>).map(trimester => (
            <QuarterlyPayment
              key={trimester}
              trimester={trimester}
              dueDate={TRIMESTER_DATES[trimester]}
              payment={safePayments[trimester]}
              quarterlyAmount={quarterlyAmount}
              isQuarterDue={isAssujetti}
              onPaymentUpdate={(field, value) => handlePaymentUpdate(trimester, field, value)}
            />
          ))}
        </div>
      </div>
    </>
  );
};
