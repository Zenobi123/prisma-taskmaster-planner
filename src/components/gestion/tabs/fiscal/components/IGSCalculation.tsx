
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface IGSCalculationProps {
  revenue: number;
  reductionCGA: boolean;
  classNumber: number;
  finalAmount: number;
  remainingAmount: number;
  onRevenueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCGAChange: (checked: boolean) => void;
}

export const IGSCalculation = ({
  revenue,
  reductionCGA,
  classNumber,
  finalAmount,
  remainingAmount,
  onRevenueChange,
  onCGAChange,
}: IGSCalculationProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Chiffre d'affaires</Label>
        <Input
          type="number"
          value={revenue || ""}
          onChange={onRevenueChange}
          placeholder="Entrer le chiffre d'affaires"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={reductionCGA}
          onCheckedChange={onCGAChange}
          id="cga-switch"
        />
        <Label htmlFor="cga-switch" className="text-sm">
          Adhérant au Centre de Gestion Agréé (-50%)
        </Label>
      </div>

      <div className="text-sm text-muted-foreground">
        {reductionCGA ? "(avec réduction CGA)" : ""}
      </div>

      <div className="flex items-center space-x-2">
        <Badge variant="secondary" className="text-lg">
          Classe {classNumber}
        </Badge>
        <span className="text-sm text-muted-foreground">
          ({finalAmount.toLocaleString()} FCFA {reductionCGA ? "avec réduction CGA" : ""})
        </span>
      </div>

      {remainingAmount > 0 && (
        <div className="text-sm text-amber-600 font-medium">
          Reste à payer : {remainingAmount.toLocaleString()} FCFA
        </div>
      )}
    </div>
  );
};
