
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calendar, Info, AlertCircle, Check, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TaxObligationStatus } from "@/hooks/fiscal/types";
import { calculateIGSClass } from "./utils/igsCalculations";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Checkbox } from "@/components/ui/checkbox";

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

  // Calculate payment status
  const paiementsTrimestriels = igsStatus.paiementsTrimestriels || {};
  const totalPaidQuarters = Object.values(paiementsTrimestriels).filter(p => p?.isPaid).length;
  const totalDueQuarters = 4;
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

  const handlePaymentDateChange = (trimester: keyof typeof TRIMESTER_DATES, date: string) => {
    handleQuarterlyPaymentUpdate(trimester, "datePayment", date);
  };

  const getPaymentStatusBadge = () => {
    if (totalPaidQuarters === totalDueQuarters) {
      return (
        <Badge variant="success" className="gap-1">
          <Check className="h-3.5 w-3.5" />
          IGS entièrement payé
        </Badge>
      );
    }
    
    if (isLate) {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertCircle className="h-3.5 w-3.5" />
          {`Retard de paiement (${totalPaidQuarters}/${expectedQuartersPaid} trimestres)`}
        </Badge>
      );
    }
    
    return (
      <Badge variant="secondary" className="gap-1">
        <Clock className="h-3.5 w-3.5" />
        {`${totalPaidQuarters}/${totalDueQuarters} trimestres payés`}
      </Badge>
    );
  };

  const renderQuarterlyPayment = (trimester: keyof typeof TRIMESTER_DATES) => {
    const payment = igsStatus.paiementsTrimestriels?.[trimester];
    const dueDate = TRIMESTER_DATES[trimester];
    const isQuarterDue = igsStatus.assujetti;

    return (
      <div key={`trimester-${trimester}`} className="p-3 border rounded-md">
        <div className="flex justify-between items-center mb-2">
          <Label className="font-medium">
            {trimester} - {dueDate}
          </Label>
          <div className="flex items-center gap-2">
            <Checkbox 
              id={`trimester-check-${trimester}`}
              checked={payment?.isPaid || false}
              onCheckedChange={(checked) => {
                if (typeof checked === "boolean") {
                  handleQuarterlyPaymentUpdate(trimester, "isPaid", checked);
                  if (checked && !payment?.datePayment) {
                    handlePaymentDateChange(trimester, new Date().toISOString().split('T')[0]);
                  }
                }
              }}
              disabled={!isQuarterDue}
            />
            <Badge variant={payment?.isPaid ? "success" : "destructive"}>
              {payment?.isPaid ? "Payé" : "Non payé"}
            </Badge>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Montant dû : {quarterlyAmount.toLocaleString()} FCFA
        </div>
        
        {payment?.isPaid && (
          <div className="flex items-center gap-2 mt-2">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="date"
              value={payment.datePayment || ""}
              onChange={(e) => handlePaymentDateChange(trimester, e.target.value)}
              className="h-8 w-40"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="mt-2 border-dashed">
      <CardContent className="pt-4 pb-3 space-y-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Chiffre d'affaires</Label>
            <Input
              type="number"
              value={revenue}
              onChange={handleRevenueChange}
              placeholder="Entrer le chiffre d'affaires"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={igsStatus.reductionCGA || false}
              onCheckedChange={handleCGAChange}
              id="cga-switch"
            />
            <Label htmlFor="cga-switch" className="text-sm">
              Adhérant au Centre de Gestion Agréé (-50%)
            </Label>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Montant total IGS</Label>
            {getPaymentStatusBadge()}
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-lg">
              Classe {classNumber}
            </Badge>
            <span className="text-sm text-muted-foreground">
              ({finalAmount.toLocaleString()} FCFA {igsStatus.reductionCGA ? "avec réduction CGA" : ""})
            </span>
          </div>
          {remainingAmount > 0 && (
            <div className="text-sm text-amber-600">
              Reste à payer : {remainingAmount.toLocaleString()} FCFA
            </div>
          )}
        </div>

        <Separator className="my-4" />
        
        <div className="space-y-2">
          <Label className="text-sm font-medium">Échéancier de paiement</Label>
          <div className="grid gap-3">
            {(Object.keys(TRIMESTER_DATES) as Array<keyof typeof TRIMESTER_DATES>).map(trimester => 
              renderQuarterlyPayment(trimester)
            )}
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
