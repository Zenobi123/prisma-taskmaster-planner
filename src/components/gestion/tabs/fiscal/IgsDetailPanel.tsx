import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calendar, Info, AlertCircle, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TaxObligationStatus } from "@/hooks/fiscal/types";
import { calculateIGSClass } from "./utils/igsCalculations";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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
  const observations = igsStatus.observations || "";

  const handleRevenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onUpdate?.("chiffreAffaires", value);
  };

  const handleCGAChange = (checked: boolean) => {
    onUpdate?.("reductionCGA", checked);
  };

  const handleQuarterlyPaymentUpdate = (trimester: string, field: string, value: any) => {
    onUpdate?.(`paiementsTrimestriels.${trimester}.${field}`, value);
  };

  const renderQuarterlyPayment = (trimester: keyof typeof TRIMESTER_DATES) => {
    const payment = igsStatus.paiementsTrimestriels?.[trimester];
    const dueDate = TRIMESTER_DATES[trimester];

    return (
      <div className="p-3 border rounded-md">
        <div className="flex justify-between items-center mb-2">
          <Label className="font-medium">
            {trimester} - {dueDate}
          </Label>
          <Badge variant={payment?.isPaid ? "success" : "destructive"}>
            {payment?.isPaid ? "Payé" : "Non payé"}
          </Badge>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Montant dû : {quarterlyAmount.toLocaleString()} FCFA
        </div>
        
        {payment?.isPaid && payment.datePayment && (
          <div className="flex items-center text-sm mt-2 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 mr-1.5" />
            <span>Payé le {payment.datePayment}</span>
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
          <Label className="text-sm font-medium">Montant total IGS</Label>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-lg">
              Classe {classNumber}
            </Badge>
            <span className="text-sm text-muted-foreground">
              ({finalAmount.toLocaleString()} FCFA {igsStatus.reductionCGA ? "avec réduction CGA" : ""})
            </span>
          </div>
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

        {observations && (
          <>
            <Separator className="my-2" />
            <div>
              <div className="flex items-center mb-1">
                <Info className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                <Label className="text-sm font-medium text-muted-foreground">Observations</Label>
              </div>
              <p className="text-sm whitespace-pre-line">{observations}</p>
            </div>
          </>
        )}
        
        {!igsStatus.paye && (
          <div className="flex items-start mt-2 bg-amber-50 p-2 rounded-md border border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              Ce client doit régulariser son IGS. Pensez à l'inclure dans votre prochain rapport de suivi.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
