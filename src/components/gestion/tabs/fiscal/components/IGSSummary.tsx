
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { formatNumberWithSeparator } from "@/utils/formatUtils";

interface IGSSummaryProps {
  totalRevenue: number;
  igsClass: number;
  igsAmount: number;
  cgaReduction: boolean;
  onCgaReductionChange: (checked: boolean) => void;
}

export function IGSSummary({
  totalRevenue,
  igsClass,
  igsAmount,
  cgaReduction,
  onCgaReductionChange
}: IGSSummaryProps) {
  return (
    <Card className="bg-gray-50 border-gray-200">
      <CardContent className="pt-6">
        <h4 className="font-medium mb-4">Récapitulatif IGS</h4>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Chiffre d'affaires total (année précédente):</span>
            <span className="font-medium">{formatNumberWithSeparator(totalRevenue)} FCFA</span>
          </div>
          
          <div className="flex justify-between">
            <span>Classe IGS:</span>
            <span className="font-medium">{igsClass}</span>
          </div>
          
          <div className="flex items-center space-x-2 py-2">
            <Switch
              id="cga-reduction"
              checked={cgaReduction}
              onCheckedChange={onCgaReductionChange}
            />
            <Label htmlFor="cga-reduction">
              Adhérent au Centre de Gestion Agréé (-50%)
            </Label>
          </div>
          
          <div className="flex justify-between pt-2 border-t border-gray-200">
            <span className="font-semibold">Montant IGS à payer:</span>
            <span className="font-semibold text-primary">
              {formatNumberWithSeparator(igsAmount)} FCFA
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
