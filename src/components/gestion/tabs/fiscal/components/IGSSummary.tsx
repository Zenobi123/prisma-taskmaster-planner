
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatMontant } from "@/utils/formatUtils";

interface IGSSummaryProps {
  totalRevenue: number;
  igsClass: number;
  igsAmount: number;
  cgaReduction: boolean;
  onCgaReductionChange: (value: boolean) => void;
}

export function IGSSummary({
  totalRevenue,
  igsClass,
  igsAmount,
  cgaReduction,
  onCgaReductionChange
}: IGSSummaryProps) {
  // Calculate quarterly amount
  const quarterlyAmount = igsAmount / 4;

  return (
    <Card className="bg-slate-50">
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-1">
          <h4 className="font-semibold">Récapitulatif IGS</h4>
          <p className="text-sm text-muted-foreground">
            Synthèse du calcul de l'IGS basé sur le chiffre d'affaires
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Chiffre d'affaires total</p>
            <p className="text-lg font-bold">{formatMontant(totalRevenue)}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium">Classe IGS</p>
            <p className="text-lg font-bold">Classe {igsClass}</p>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="cga-reduction"
              checked={cgaReduction}
              onCheckedChange={onCgaReductionChange}
            />
            <Label htmlFor="cga-reduction">
              Application réduction CGA (50%)
            </Label>
          </div>
          
          <div className="bg-white p-4 rounded-md border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Montant annuel IGS</p>
                <p className="text-xl font-bold text-primary">{formatMontant(igsAmount)}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Paiement trimestriel</p>
                <p className="text-xl font-bold text-primary">{formatMontant(quarterlyAmount)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  À payer aux échéances : 15 janvier, 15 avril, 15 juillet, 15 octobre
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
