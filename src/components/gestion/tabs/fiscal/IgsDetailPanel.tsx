
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

  const paiementsTrimestriels = igsStatus.paiementsTrimestriels || {};
  const totalPaidQuarters = Object.values(paiementsTrimestriels).filter(p => p?.isPaid).length;

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
        <div className="space-y-4">
          <IGSCalculation
            revenue={revenue}
            reductionCGA={igsStatus.reductionCGA || false}
            classNumber={classNumber}
            finalAmount={finalAmount}
            remainingAmount={finalAmount - (quarterlyAmount * totalPaidQuarters)}
            onRevenueChange={handleRevenueChange}
            onCGAChange={handleCGAChange}
          />

          <div className="grid gap-3">
            {(Object.keys(TRIMESTER_DATES) as Array<keyof typeof TRIMESTER_DATES>).map(trimester => (
              <QuarterlyPayment
                key={trimester}
                trimester={trimester}
                dueDate={TRIMESTER_DATES[trimester]}
                payment={igsStatus.paiementsTrimestriels?.[trimester]}
                quarterlyAmount={quarterlyAmount}
                isQuarterDue={igsStatus.assujetti}
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
      </CardContent>
    </Card>
  );
};
