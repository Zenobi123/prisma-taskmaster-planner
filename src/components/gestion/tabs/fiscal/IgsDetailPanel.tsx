
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Info, AlertCircle } from "lucide-react";
import { TaxObligationStatus } from "@/hooks/fiscal/types";
import { calculateIGSClass } from "./utils/igsCalculations";
import { QuarterlyPayment } from "./components/QuarterlyPayment";
import { IGSCalculation } from "./components/IGSCalculation";

interface IgsDetailPanelProps {
  igsStatus: TaxObligationStatus;
  onUpdate?: (field: string, value: any) => void;
}

const TRIMESTER_DATES = {
  T1: "15 janvier",
  T2: "15 avril",
  T3: "15 juillet",
  T4: "15 octobre"
};

export const IgsDetailPanel = ({ igsStatus, onUpdate }: IgsDetailPanelProps) => {
  if (!igsStatus || !igsStatus.assujetti) {
    return null;
  }

  const revenue = igsStatus.chiffreAffaires || 0;
  const { classNumber, amount } = calculateIGSClass(revenue);
  const finalAmount = igsStatus.reductionCGA ? amount / 2 : amount;
  const quarterlyAmount = Math.ceil(finalAmount / 4);

  // Calculate payment status for late detection
  const paiementsTrimestriels = igsStatus.paiementsTrimestriels || {};
  const totalPaidQuarters = Object.values(paiementsTrimestriels).filter(p => p?.isPaid).length;
  const remainingAmount = finalAmount - (quarterlyAmount * totalPaidQuarters);
  
  // Determine if payments are late
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const expectedQuartersPaid = Math.ceil(currentMonth / 3);
  const isLate = totalPaidQuarters < expectedQuartersPaid;

  const handleRevenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onUpdate?.("chiffreAffaires", value);
  };

  const handleCGAChange = (checked: boolean) => {
    onUpdate?.("reductionCGA", checked);
  };

  const handleQuarterlyPaymentUpdate = (trimester: keyof typeof TRIMESTER_DATES, field: string, value: any) => {
    onUpdate?.(`paiementsTrimestriels.${trimester}.${field}`, value);
  };

  return (
    <Card className="mt-2 border-dashed">
      <CardContent className="pt-4 pb-3 space-y-4">
        <IGSCalculation
          revenue={revenue}
          reductionCGA={igsStatus.reductionCGA || false}
          classNumber={classNumber}
          finalAmount={finalAmount}
          remainingAmount={remainingAmount}
          onRevenueChange={handleRevenueChange}
          onCGAChange={handleCGAChange}
        />

        <Separator className="my-4" />
        
        <div className="space-y-2">
          <Label className="text-sm font-medium">Échéancier de paiement</Label>
          <div className="grid gap-3">
            {(Object.keys(TRIMESTER_DATES) as Array<keyof typeof TRIMESTER_DATES>).map((trimester, index) => (
              <QuarterlyPayment
                key={trimester}
                trimester={trimester}
                dueDate={TRIMESTER_DATES[trimester]}
                payment={igsStatus.paiementsTrimestriels?.[trimester]}
                quarterlyAmount={quarterlyAmount}
                isQuarterDue={igsStatus.assujetti}
                quarterNumber={index + 1}
                expectedQuartersPaid={expectedQuartersPaid}
                onPaymentUpdate={(field, value) => handleQuarterlyPaymentUpdate(trimester, field, value)}
              />
            ))}
          </div>
        </div>

        {igsStatus.observations && (
          <>
            <Separator className="my-2" />
            <div>
              <div className="flex items-center mb-1">
                <Info className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                <Label className="text-sm font-medium text-muted-foreground">Observations</Label>
              </div>
              <p className="text-sm whitespace-pre-line">{igsStatus.observations}</p>
            </div>
          </>
        )}
        
        {isLate && !igsStatus.paye && (
          <div className="flex items-start mt-2 bg-amber-50 p-2 rounded-md border border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              Ce client est en retard dans ses paiements IGS. Pensez à régulariser la situation.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
