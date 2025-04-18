
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

interface IgsDetailPanelProps {
  igsStatus: TaxObligationStatus;
  onUpdate?: (field: string, value: any) => void;
}

export const IgsDetailPanel = ({ igsStatus, onUpdate }: IgsDetailPanelProps) => {
  if (!igsStatus || !igsStatus.assujetti) {
    return null;
  }

  const isPaid = igsStatus.paye;
  const lastPaymentDate = igsStatus.datePaiement;
  const revenue = igsStatus.chiffreAffaires || 0;
  const { classNumber, amount } = calculateIGSClass(revenue);
  const finalAmount = igsStatus.reductionCGA ? amount / 2 : amount;
  const observations = igsStatus.observations || "";

  const handleRevenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onUpdate?.("chiffreAffaires", value);
  };

  const handleCGAChange = (checked: boolean) => {
    onUpdate?.("reductionCGA", checked);
    onUpdate?.("montant", checked ? amount / 2 : amount);
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

          <div className="space-y-2">
            <Label className="text-sm font-medium">Classe IGS</Label>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-lg">
                Classe {classNumber}
              </Badge>
              <span className="text-sm text-muted-foreground">
                ({finalAmount.toLocaleString()} FCFA)
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium text-muted-foreground">Statut de paiement</Label>
                <div className="flex items-center space-x-2">
                  <Badge variant={isPaid ? "success" : "destructive"} className="mt-1">
                    {isPaid ? "Payé" : "Non payé"}
                  </Badge>
                </div>
              </div>
              
              {isPaid && lastPaymentDate && (
                <div className="text-right space-y-1">
                  <Label className="text-sm font-medium text-muted-foreground">Date de paiement</Label>
                  <div className="flex items-center text-sm mt-1">
                    <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                    <span>{lastPaymentDate}</span>
                  </div>
                </div>
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
          
          {!isPaid && (
            <div className="flex items-start mt-2 bg-amber-50 p-2 rounded-md border border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                Ce client doit régulariser son IGS. Pensez à l'inclure dans votre prochain rapport de suivi.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
