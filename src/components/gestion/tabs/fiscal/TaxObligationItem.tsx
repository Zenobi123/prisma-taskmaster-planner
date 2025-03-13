
import React from "react";
import { ObligationType, TaxObligationStatus } from "../ObligationsFiscales";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface TaxObligationItemProps {
  title: string;
  deadline: string;
  obligationType: Extract<ObligationType, "patente" | "bail" | "taxeFonciere">;
  status: TaxObligationStatus;
  onChange: (
    obligationType: ObligationType,
    statusType: "assujetti" | "paye" | "depose",
    value: boolean
  ) => void;
}

export function TaxObligationItem({
  title,
  deadline,
  obligationType,
  status,
  onChange
}: TaxObligationItemProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <h5 className="font-medium">{title}</h5>
              <p className="text-sm text-gray-500">
                Date limite de paiement : {deadline}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <div className="flex items-center space-x-2">
              <Switch
                id={`${obligationType}-assujetti`}
                checked={status.assujetti}
                onCheckedChange={(checked) => onChange(obligationType, "assujetti", checked)}
              />
              <Label htmlFor={`${obligationType}-assujetti`}>
                {status.assujetti ? "Assujetti" : "Non assujetti"}
              </Label>
            </div>
            
            {status.assujetti && (
              <div className="flex items-center space-x-2">
                <Switch
                  id={`${obligationType}-paye`}
                  checked={status.paye}
                  onCheckedChange={(checked) => onChange(obligationType, "paye", checked)}
                />
                <Label htmlFor={`${obligationType}-paye`}>
                  {status.paye ? "Payé" : "Non payé"}
                </Label>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
